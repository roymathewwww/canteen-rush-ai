"use client"

import Link from "next/link"
import * as React from "react"
import { Check, Clock, AlertTriangle, Coffee, MoreHorizontal, Moon, Sun, Home, Utensils } from "lucide-react" // Added Sun, Moon 
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimeDisplay } from "@/components/ui/time-display"
import { cn } from "@/lib/utils"

// Mock Vendor Orders
const ORDERS = [
  { id: "A-52", items: ["Chicken Wrap", "Coke"], time: "10:45", state: "preparing", urgency: "high", complexity: "low" },
  { id: "A-53", items: ["Veg Burger", "Fries"], time: "10:46", state: "preparing", urgency: "med", complexity: "med" },
  { id: "A-54", items: ["Pasta White", "Garlic Bread"], time: "10:48", state: "ordered", urgency: "low", complexity: "high" },
  { id: "A-55", items: ["Cheese Toast", "Coffee"], time: "10:50", state: "ordered", urgency: "low", complexity: "low" },
  { id: "B-12", items: ["Coffee"], time: "10:42", state: "ready", urgency: "none", complexity: "low" },
  { id: "B-10", items: ["Sandwich"], time: "10:40", state: "ready", urgency: "none", complexity: "med" },
]

export default function VendorDashboard() {
  const [orders, setOrders] = React.useState(ORDERS)

  const moveOrder = (id: string, newState: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, state: newState } : o))
  }

  const newOrders = orders.filter(o => o.state === "ordered")
  const prepOrders = orders.filter(o => o.state === "preparing")
  const readyOrders = orders.filter(o => o.state === "ready")

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
                <span className="font-mono text-xl text-foreground font-bold">10:43:05</span>
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
                            <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full hover:bg-green-100 hover:text-green-700" onClick={() => moveOrder(order.id, "collected")}>
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
