"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock, MapPin, QrCode, AlertTriangle, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator" // Assuming I might need to create this or use hr

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
                <div 
                    className="h-full bg-primary transition-all duration-1000 ease-linear" 
                    style={{ width: `${((3 - timeLeft/180 * 3) / 3) * 100}%` }}
                />
            </div>
            
            <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <div className="mb-2 text-sm text-muted-foreground uppercase font-bold tracking-widest">
                    Token Number
                </div>
                <div className="text-6xl font-mono font-bold tracking-tighter text-foreground mb-6">
                    A-52
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
                        <span className="text-muted-foreground text-sm">Estimated Pickup</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold font-mono">
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </span>
                            <span className="text-sm text-muted-foreground">min</span>
                        </div>
                    </div>
                )}
            </CardContent>
            
            <div className="bg-secondary/30 p-4 border-t border-dashed border-border">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-bold">Canteen A (Main)</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
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