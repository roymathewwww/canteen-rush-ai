"use client"

import Link from "next/link"
import * as React from "react"
import { Check, Clock, AlertTriangle, Coffee, MoreHorizontal, Moon, Sun, Home, Utensils } from "lucide-react" // Added Sun, Moon 
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimeDisplay } from "@/components/ui/time-display"
import { cn } from "@/lib/utils"
// Import Supabase
import { supabase } from "@/lib/supabase"
import { Order, OrderItem } from "@/types/database"

interface DashboardOrder {
    id: string
    items: string[]
    time: string
    state: string
    urgency: string
    complexity: string
    rawDate: string
}

// Constants for Mock Fallback
const MOCK_DASHBOARD_ORDERS: DashboardOrder[] = [
  { id: "A-52", items: ["Chicken Wrap", "Coke"], time: "10:45", state: "preparing", urgency: "high", complexity: "low", rawDate: new Date().toISOString() },
  { id: "A-53", items: ["Veg Burger", "Fries"], time: "10:46", state: "preparing", urgency: "med", complexity: "med", rawDate: new Date().toISOString() },
  { id: "A-54", items: ["Pasta White", "Garlic Bread"], time: "10:48", state: "ordered", urgency: "low", complexity: "high", rawDate: new Date().toISOString() },
  { id: "A-55", items: ["Cheese Toast", "Coffee"], time: "10:50", state: "ordered", urgency: "low", complexity: "low", rawDate: new Date().toISOString() },
  { id: "B-12", items: ["Coffee"], time: "10:42", state: "ready", urgency: "none", complexity: "low", rawDate: new Date().toISOString() },
  { id: "B-10", items: ["Sandwich"], time: "10:40", state: "ready", urgency: "none", complexity: "med", rawDate: new Date().toISOString() },
]

export default function VendorDashboard() {
  const [orders, setOrders] = React.useState<DashboardOrder[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchOrders = React.useCallback(async () => {
    // Mock Fallback
    if (!supabase) {
        setOrders(MOCK_DASHBOARD_ORDERS)
        setLoading(false)
        return
    }

      try {
          const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    menu_items (
                        name,
                        complexity
                    )
                )
            `)
            .neq('status', 'completed')
            .neq('status', 'cancelled')
            .order('created_at', { ascending: true })

          if (error) throw error

          if (data) {
              const formattedOrders: DashboardOrder[] = data.map((order: any) => {
                  const items = order.order_items.map((oi: any) => {
                      return oi.menu_items?.name || "Unknown Item"
                  })

                  // Calculate complexity/urgency based on logic
                  const hasComplexItem = order.order_items.some((oi: any) => oi.menu_items?.complexity === "high")
                  const complexity = hasComplexItem ? "high" : "low"
                  
                  // Urgency logic (if waiting > 10 mins)
                  const waitTime = (new Date().getTime() - new Date(order.created_at).getTime()) / 60000
                  const urgency = waitTime > 10 ? "high" : waitTime > 5 ? "med" : "low"
                  
                  return {
                      id: order.id.slice(0, 8), // Show short ID
                      fullId: order.id,
                      items: items,
                      time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      state: order.status,
                      urgency,
                      complexity,
                      rawDate: order.created_at
                  }
              })
              setOrders(formattedOrders)
          }
      } catch (error) {
          console.error("Error fetching orders:", error)
          setOrders(MOCK_DASHBOARD_ORDERS) // Fallback on error
      } finally {
          setLoading(false)
      }
  }, [])

  React.useEffect(() => {
      fetchOrders()

      if (!supabase) return

      // Realtime subscription
      const channel = supabase
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            console.log('Change received!', payload)
            fetchOrders() // Refresh full list for simplicity
        })
        .subscribe()

      return () => {
          supabase.removeChannel(channel)
      }
  }, [fetchOrders])

  const moveOrder = async (id: string, newState: string) => {
    // Optimistic Update
    const orderToUpdate = orders.find(o => o.id === id)
    if (!orderToUpdate) return

    // Calculate updated list for UI immediately
    if (newState === 'collected') {
         setOrders(prev => prev.filter(o => o.id !== id))
    } else {
         setOrders(prev => prev.map(o => o.id === id ? { ...o, state: newState } : o))
    }

    if (!supabase) {
        console.log("Mock Status Update:", id, newState)
        return
    }

    try {
        // Use full UUID if possible, but we sliced it. 
        // We need to store full ID in the mapped object to be safe.
        // *Correction*: I added fullId to the interface.
        
        const { error } = await supabase
            .from('orders')
            .update({ status: newState === 'collected' ? 'completed' : newState })
            .eq('id', (orderToUpdate as any).fullId) 

        if (error) throw error
    } catch (err) {
        console.error("Failed to update order:", err)
        fetchOrders() // Revert on error
    }
  }

  const newOrders = orders.filter(o => o.state === "ordered")
  const prepOrders = orders.filter(o => o.state === "preparing")
  const readyOrders = orders.filter(o => o.state === "ready")

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Kitchen Display...</div>

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Sidebar Control */}
      <aside className="w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-4 sticky top-0 h-screen">
        <Link href="/">
           <div className="bg-primary text-primary-foreground p-1.5 rounded-sm cursor-pointer hover:bg-primary/90 transition">
               <Utensils className="h-5 w-5" />
           </div>
        </Link>
        
        <Link href="/">
            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Home className="h-5 w-5" />
            </Button>
        </Link>
      </aside>

      {/* Main Board */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
            <h1 className="text-xl font-bold tracking-tight">Kitchen Display System (KDS)</h1>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase font-bold">Live Status</span>
                    <Badge variant="warning">HIGH RUSH</Badge>
                </div>
                <div className="h-8 w-px bg-border" />
                <span className="font-mono text-xl text-foreground font-bold">
                    <TimeDisplay />
                </span>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden lg:grid lg:grid-cols-3 divide-x divide-border">
             
             {/* 1. New / Ordered Column */}
             <section className="flex flex-col flex-1 bg-secondary/5 h-full overflow-hidden">
                <div className="p-4 border-b bg-card z-10 sticky top-0 flex justify-between items-center">
                    <h2 className="font-bold text-muted-foreground uppercase tracking-widest text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" /> New Orders ({newOrders.length})
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {newOrders.map(order => (
                        <div key={order.id} className="bg-card p-4 rounded-xl border border-dashed hover:border-solid hover:border-primary/50 transition-all shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-2xl font-mono font-bold text-foreground">{order.id}</span>
                                <Badge variant="outline">NEW</Badge>
                            </div>
                            <div className="space-y-1 mb-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm font-medium">{item}</div>
                                ))}
                            </div>
                            <Button className="w-full font-bold" onClick={() => moveOrder(order.id, "preparing")}>
                                Start Cooking
                            </Button>
                        </div>
                    ))}
                    {newOrders.length === 0 && <div className="text-center p-8 text-muted-foreground opacity-50">No new orders</div>}
                </div>
             </section>

             {/* 2. Preparing Column */}
             <section className="flex flex-col flex-1 bg-background h-full overflow-hidden relative">
                <div className="p-4 border-b bg-card z-10 sticky top-0 flex justify-between items-center bg-primary/5">
                    <h2 className="font-bold text-primary uppercase tracking-widest text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Preparing ({prepOrders.length})
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {prepOrders.map(order => (
                        <div key={order.id} className={cn(
                             "bg-card p-4 rounded-xl border-l-4 shadow-sm transition-all",
                             order.urgency === "high" ? "border-l-urgency" : "border-l-primary"
                        )}>
                            <div className="flex justify-between items-start mb-2">
                                <span className={cn("text-2xl font-mono font-bold", order.urgency === "high" && "text-urgency")}>{order.id}</span>
                                <span className="font-mono text-sm font-bold text-muted-foreground">{order.time}</span>
                            </div>
                             <div className="space-y-1 mb-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="text-sm font-medium flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-dashed">
                                <span className="text-xs font-bold text-muted-foreground uppercase">{order.items.length} Items</span>
                                <Button size="sm" variant={order.urgency === "high" ? "default" : "secondary"} onClick={() => moveOrder(order.id, "ready")}>
                                    Mark Ready
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
             </section>

             {/* 3. Ready Column */}
             <section className="flex flex-col flex-1 bg-green-50/50 dark:bg-green-950/10 h-full overflow-hidden">
                <div className="p-4 border-b bg-card z-10 sticky top-0 flex justify-between items-center">
                    <h2 className="font-bold text-green-600 uppercase tracking-widest text-sm flex items-center gap-2">
                        <Check className="h-4 w-4" /> Ready for Pickup ({readyOrders.length})
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {readyOrders.map(order => (
                        <div key={order.id} className="bg-card p-4 rounded-xl border border-green-200 dark:border-green-900 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-mono font-bold text-green-600 mb-1">{order.id}</div>
                                <div className="text-xs text-muted-foreground">{order.items.join(", ")}</div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 hover:text-green-700" onClick={() => moveOrder(order.id, "collected")}>
                                <Check className="h-6 w-6" />
                            </Button>
                        </div>
                    ))}
                    {readyOrders.length === 0 && <div className="text-center p-8 text-muted-foreground opacity-50">No orders ready</div>}
                </div>
             </section>
        </div>
      </main>
    </div>
  )
}
