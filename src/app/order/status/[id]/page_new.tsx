"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Check, QrCode, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

export default function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  const [order, setOrder] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Fetch Order and Subscribe to Realtime Updates
  React.useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
        // Fallback for mock environment if supabase is missing
        if (!supabase) {
            // Simulate finding an order for demo purposes
            setOrder({
                id: id,
                status: 'preparing',
                student_id: 'DEMO',
                predicted_pickup: '12:00',
                order_items: [{ menu_items: { name: 'Mock Item' }, quantity: 1 }]
            })
            setLoading(false)
            return
        }

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    menu_items (
                        name
                    )
                )
            `)
            .eq('id', id)
            .single()
        
        if (data) setOrder(data)
        else console.error("Order not found or error:", error)
        
        setLoading(false)
    }

    fetchOrder()

    if (!supabase) return

    // Realtime Subscription
    const channel = supabase
        .channel(`order-${id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, (payload) => {
            console.log("Order update:", payload)
             setOrder((prev: any) => ({ ...prev, ...payload.new }))
        })
        .subscribe()
    
    return () => { supabase.removeChannel(channel) }
  }, [id])

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Status...</div>
  if (!order) return <div className="h-screen flex items-center justify-center">Order not found.</div>

  const status = order.status

  // Determine steps state
  const steps = [
    { id: "ordered", label: "Order Placed" },
    { id: "preparing", label: "Preparing" },
    { id: "ready", label: "Ready for Pickup" },
    { id: "completed", label: "Picked Up" }
  ]

  const statusMap: Record<string, number> = {
      'ordered': 0,
      'preparing': 1,
      'ready': 2,
      'completed': 3,
      'cancelled': -1
  }

  const currentStepIndex = statusMap[status] ?? 0

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/order">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </Link>
        <span className="font-bold text-lg">Order Status</span>
        <div className="w-10" /> 
      </header>

      <main className="w-full max-w-md space-y-6">
        
        {/* Token Card */}
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary">
               {/* Animated Progress Bar */}
                <div 
                    className={`h-full bg-primary transition-all duration-1000 ease-in-out ${status === 'preparing' ? 'animate-pulse w-1/2' : status === 'ready' ? 'w-full' : 'w-5'}`} 
                    style={{width: status === 'ordered' ? '10%' : undefined}}
                />
            </div>
            
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <div className="mb-2 text-sm text-muted-foreground uppercase font-bold tracking-widest">
                    Token Number
                </div>
                <div className="text-3xl font-mono font-bold tracking-tighter text-foreground mb-6 break-all px-4">
                    {order.id.split('-')[0].toUpperCase()}
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
                    <QrCode className="h-32 w-32 text-zinc-900" />
                </div>

                {status === "ready" ? (
                    <div className="animate-pulse flex items-center gap-2 text-success font-bold text-xl">
                        <Check className="h-6 w-6" />
                        Order Ready!
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-muted-foreground text-sm">Status</span>
                        <Badge className="text-lg px-4 py-1 uppercase">{status}</Badge>
                        {order.predicted_pickup && (
                            <span className="text-xs text-muted-foreground mt-2">
                                Est. Pickup: <span className="font-mono font-bold">{order.predicted_pickup}</span>
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
            
            <div className="bg-secondary/30 p-4 border-t border-dashed border-border transition-all">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-bold">Canteen A</span>
                </div>
                <div className="mt-2 space-y-1">
                    <span className="text-muted-foreground text-xs block mb-1">Items:</span>
                    {order.order_items?.map((item: any, i: number) => (
                        <div key={i} className="text-sm font-medium">
                           • {item.quantity ? `${item.quantity}x ` : ''}{item.menu_items?.name || "Unknown Item"}
                        </div>
                    ))}
                </div>
            </div>
        </Card>

        {/* Timeline */}
        <div className="px-4">
            <div className="relative border-l-2 border-secondary space-y-8 pl-8 py-2">
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex
                    const isCurrent = index === currentStepIndex
                    
                    return (
                        <div key={step.id} className="relative">
                            <div className={`
                                absolute -left-[39px] top-1 h-5 w-5 rounded-full border-2 
                                ${isCompleted ? "bg-primary border-primary" : "bg-background border-muted-foreground"}
                                ${isCurrent && "ring-4 ring-primary/20"}
                                flex items-center justify-center
                            `}>
                                {isCompleted && <Check className="h-3 w-3 text-white" />}
                            </div>
                            
                            <div className="flex flex-col">
                                <span className={`font-bold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                                    {step.label}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        {/* Warning / Notifications */}
        {status === "ready" && (
            <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-r-lg flex gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                <div className="text-sm">
                    <p className="font-bold text-warning-foreground">Pickup warning</p>
                    <p className="text-muted-foreground">Please collect within 5 minutes to keep food fresh.</p>
                </div>
            </div>
        )}

      </main>
    </div>
  )
}
