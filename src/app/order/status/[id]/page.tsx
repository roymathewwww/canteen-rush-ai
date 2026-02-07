"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock, MapPin, QrCode, AlertTriangle, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator" // Assuming I might need to create this or use hr

<<<<<<< HEAD
import { supabase } from "@/lib/supabase"

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  // Unwrap params safely using React.use() or just treating it as a promise if using Next 15,
  // but for standard Next 14 assume it's an object. 
  // However, Next.js 15 breaking changes make params a Promise. 
  // To be safe with the current setup and potential version mismatch:
  const { id } = React.use(params as any) || params // Fallback for older Next.js versions handling

  const [order, setOrder] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Fetch Order Realtime
  React.useEffect(() => {
    // Await params if necessary (Next.js 15+ needs this, doing it safely here for 14/15 compat)
    const orderId = params.id
    
    const fetchOrder = async () => {
        if (!supabase) return

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    menu_items (
                        name
                    )
                )
            `)
            .eq('id', orderId)
            .single()
        
        if (data) setOrder(data)
        setLoading(false)
    }

    fetchOrder()

    if (!supabase) return

    // Realtime Sub
    const channel = supabase
        .channel(`order-${orderId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => {
            console.log("Order update:", payload)
            // Ideally refetch or update local state
             setOrder((prev: any) => ({ ...prev, ...payload.new }))
        })
        .subscribe()
    
    return () => { supabase.removeChannel(channel) }
  }, [params.id])

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Status...</div>
  if (!order) return <div className="h-screen flex items-center justify-center">Order not found.</div>

  const status = order.status
  const timeLeft = 5 // Mock time left logic or calc from timestamp
=======
// Mock Separator since it might not exist
const SeparatorMock = ({ className }: { className?: string }) => (
  <div className={`h-[1px] w-full bg-border ${className}`} />
)

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  // Mock State - In a real app, fetch by ID
  const [status, setStatus] = React.useState<"ordered" | "preparing" | "ready">("preparing")
  const [timeLeft, setTimeLeft] = React.useState(180) // seconds

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
            setStatus("ready")
            return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    { id: "ordered", label: "Order Placed", time: "10:30" },
    { id: "preparing", label: "Preparing", time: "10:32" },
    { id: "ready", label: "Ready for Pickup", time: "10:35" },
  ]

  const currentStepIndex = steps.findIndex(s => s.id === status)
>>>>>>> 07f012ae898f6a716bf9f6c2ced5daff6392518d

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 font-sans">
      <header className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/order">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </Link>
        <span className="font-bold text-lg">Order Status</span>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <main className="w-full max-w-md space-y-6">
        
        {/* Token Card */}
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary">
<<<<<<< HEAD
               {/* Progress Bar Logic can go here */}
                <div className="h-full bg-primary w-full animate-pulse" />
=======
                <div 
                    className="h-full bg-primary transition-all duration-1000 ease-linear" 
                    style={{ width: `${((3 - timeLeft/180 * 3) / 3) * 100}%` }}
                />
>>>>>>> 07f012ae898f6a716bf9f6c2ced5daff6392518d
            </div>
            
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <div className="mb-2 text-sm text-muted-foreground uppercase font-bold tracking-widest">
                    Token Number
                </div>
<<<<<<< HEAD
                <div className="text-4xl font-mono font-bold tracking-tighter text-foreground mb-6 break-all">
                    {order.id.slice(0, 8)}
=======
                <div className="text-6xl font-mono font-bold tracking-tighter text-foreground mb-6">
                    A-52
>>>>>>> 07f012ae898f6a716bf9f6c2ced5daff6392518d
                </div>

                <div className="bg-white p-4 rounded-xl border shadow-sm mb-6">
                    <QrCode className="h-32 w-32 text-zinc-900" />
                </div>

<<<<<<< HEAD
                {status === "ready" || status === "completed" ? (
=======
                {status === "ready" ? (
>>>>>>> 07f012ae898f6a716bf9f6c2ced5daff6392518d
                    <div className="animate-pulse flex items-center gap-2 text-success font-bold text-xl">
                        <Check className="h-6 w-6" />
                        Order Ready!
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-1">
<<<<<<< HEAD
                        <span className="text-muted-foreground text-sm">Status</span>
                        <Badge className="text-lg px-4 py-1 uppercase">{status}</Badge>
=======
                        <span className="text-muted-foreground text-sm">Estimated Pickup</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold font-mono">
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </span>
                            <span className="text-sm text-muted-foreground">min</span>
                        </div>
>>>>>>> 07f012ae898f6a716bf9f6c2ced5daff6392518d
                    </div>
                )}
            </CardContent>
            
<<<<<<< HEAD
            <div className="bg-secondary/30 p-4 border-t border-dashed border-border transition-all">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-bold">Canteen A</span>
                </div>
                <div className="mt-2 space-y-1">
                    {order.order_items?.map((item: any, i: number) => (
                        <div key={i} className="text-xs font-mono text-muted-foreground">
                           • {item.menu_items?.name}
                        </div>
                    ))}
                </div>
=======
            <div className="bg-secondary/30 p-4 border-t border-dashed border-border">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-bold">Canteen A (Main)</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
>>>>>>> 07f012ae898f6a716bf9f6c2ced5daff6392518d
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-bold">Chicken Wrap, Coke</span>
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
                                <span className="text-xs text-muted-foreground font-mono">
                                    {step.time}
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