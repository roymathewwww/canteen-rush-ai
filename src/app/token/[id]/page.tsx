"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link" // Added missing import
import { CheckCircle2, AlertCircle, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimeDisplay } from "@/components/ui/time-display"

export default function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [status, setStatus] = useState<"preparing" | "ready" | "collected">("preparing")
  const [countdown, setCountdown] = useState(480) // seconds (8 mins)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) return 0
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Toggle state for demo
  const toggleStatus = () => {
    if (status === "preparing") setStatus("ready")
    else if (status === "ready") setStatus("collected")
    else setStatus("preparing")
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Background Pulse for Ready State */}
      {status === "ready" && (
        <div className="absolute inset-0 bg-success/20 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10">
        <span className="font-mono text-xs text-zinc-400">ORDER #{unwrappedParams.id.slice(0, 6).toUpperCase()}</span>
        <Badge variant={status === "ready" ? "success" : "warning"}>
            {status === "ready" ? "READY FOR PICKUP" : "COOKING"}
        </Badge>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="mb-8 items-center flex flex-col">
            <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest mb-4">Your Token</span>
            <div className="bg-white text-black p-8 rounded-lg mb-4 shadow-[0_0_50px_-12px_rgba(255,255,255,0.5)]">
                <span className="font-mono text-7xl font-bold tracking-tighter">A-42</span>
            </div>
            
            {status === "preparing" && (
                <div className="space-y-2">
                     <span className="text-zinc-500 text-xs uppercase tracking-widest">Estimated Ready In</span>
                     <div className="font-mono text-5xl font-bold tabular-nums">
                        {formatCountdown(countdown)}
                     </div>
                </div>
            )}

            {status === "ready" && (
                <div className="animate-bounce mt-4">
                     <span className="text-success text-xl font-bold uppercase tracking-widest">
                        Counter 3
                     </span>
                </div>
            )}
        </div>

        {/* Pickup Time Anchor */}
        <Card className="w-full bg-zinc-800 border-zinc-700">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col text-left">
                        <span className="text-xs text-zinc-400">Pickup At</span>
                        <span className="text-xl font-mono font-bold">10:45 AM</span>
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

        {/* Behavior Nudge */}
        {status === "preparing" && (
            <div className="mt-8 flex gap-2 items-start opacity-70">
                <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
                <p className="text-xs text-left max-w-[250px] leading-relaxed">
                    Arriving early increases congestion at the counter. 
                    We'll notify you exactly when it's ready.
                </p>
            </div>
        )}
        
        {/* Button to simulate state change for Demo */}
        <Button variant="ghost" className="mt-12 text-zinc-600 text-xs" onClick={toggleStatus}>
             Dev: Toggle State
        </Button>

      </main>
      
      <footer className="p-4 z-10">
        <Link href="/">
            <Button variant="secondary" className="w-full">
                Close
            </Button>
        </Link>
      </footer>
    </div>
  )
}
