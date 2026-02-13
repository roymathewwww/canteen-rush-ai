"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, AlertCircle, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
        if (!supabase) {
             setOrder({
                id: id,
                status: "preparing",
                predicted_pickup: "12:00"
             })
             setLoading(false)
             return
        }

        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .single()
        
        if (data) setOrder(data)
        setLoading(false)
    }
    fetchOrder()

    if (!supabase) return
    
    // Realtime
    const channel = supabase
        .channel(`token-${id}`)
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, (payload) => {
             setOrder((prev: any) => ({ ...prev, ...payload.new }))
        })
        .subscribe()
    
    return () => { supabase.removeChannel(channel) }

  }, [id])

  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">Loading Token...</div>
  if (!order) return <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">Token Invalid</div>

  const status = order.status
  const isReady = status === "ready" || status === "completed"

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col max-w-md mx-auto relative overflow-hidden font-sans">
      {/* Background Pulse for Ready State */}
      {isReady && (
        <div className="absolute inset-0 bg-green-500/20 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10">
        <span className="font-mono text-xs text-zinc-400">ORDER #{order.id.slice(0, 8).toUpperCase()}</span>
        <Badge variant={isReady ? "success" : "warning"}>
            {isReady ? "READY" : status.toUpperCase()}
        </Badge>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="mb-8 items-center flex flex-col">
            <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4">Your Token</span>
            <div className="bg-white text-black p-8 rounded-lg mb-4 shadow-[0_0_50px_-12px_rgba(255,255,255,0.5)]">
                <span className="font-mono text-7xl font-bold tracking-tighter">
                    {order.id.split("-")[0].toUpperCase().slice(0, 4)}
                </span>
            </div>
            
            {!isReady && order.predicted_pickup && (
                <div className="space-y-2">
                     <span className="text-zinc-500 text-xs uppercase tracking-widest">Estimated Pickup</span>
                     <div className="font-mono text-5xl font-bold tabular-nums">
                        {order.predicted_pickup}
                     </div>
                </div>
            )}

            {isReady && (
                <div className="animate-bounce mt-4">
                     <span className="text-green-400 text-xl font-bold uppercase tracking-widest">
                        Counter 1
                     </span>
                </div>
            )}
        </div>

        {/* Pickup Time Anchor */}
        <Card className="w-full bg-zinc-800 border-zinc-700">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col text-left">
                        <span className="text-xs text-zinc-400">Status</span>
                        <span className="text-xl font-mono font-bold capitalize">{status}</span>
                    </div>
                    <div className="h-8 w-px bg-zinc-700" />
                    <div className="flex flex-col text-right">
                        <span className="text-xs text-zinc-400">Vendor</span>
                        <div className="flex items-center gap-1 justify-end">
                            <MapPin className="h-3 w-3 text-zinc-400" />
                            <span className="font-bold">Main Canteen</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>

      </main>
    </div>
  )
}
