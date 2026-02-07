"use client"

import Link from "next/link"
import { ArrowLeft, Zap, TrendingUp, Users, Clock, Info, BrainCircuit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background font-sans p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex items-center gap-4 mb-8">
        <Link href="/">
            <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Prediction Engine</h1>
            <p className="text-muted-foreground text-sm">Transparent analysis of queue logic</p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto grid gap-6">
        
        {/* How it works */}
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <BrainCircuit className="h-6 w-6" />
                    Live Calculation
                </CardTitle>
                <CardDescription>
                    Why is my dosa taking 13 minutes?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-background rounded-lg border shadow-sm">
                        <div className="text-sm text-muted-foreground uppercase font-bold mb-1">Base Prep</div>
                        <div className="text-2xl font-mono font-bold">4m</div>
                    </div>
                    
                    <div className="flex items-center justify-center text-muted-foreground font-bold">+</div>
                    
                    <div className="p-4 bg-background rounded-lg border shadow-sm">
                        <div className="text-sm text-muted-foreground uppercase font-bold mb-1">Queue Load</div>
                        <div className="text-2xl font-mono font-bold">6 orders</div>
                        <div className="text-xs text-muted-foreground mt-1">/ 2 chefs</div>
                    </div>

                    <div className="flex items-center justify-center text-muted-foreground font-bold">×</div>

                    <div className="p-4 bg-background rounded-lg border shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1">
                             <TrendingUp className="h-3 w-3 text-warning" />
                        </div>
                        <div className="text-sm text-muted-foreground uppercase font-bold mb-1">Rush Factor</div>
                        <div className="text-2xl font-mono font-bold text-warning">1.3x</div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4 p-4 bg-background/50 rounded-full border border-dashed">
                    <span className="font-bold text-lg">=</span>
                    <div className="text-center">
                        <span className="text-sm text-muted-foreground uppercase font-bold">Predicted Ready</span>
                        <div className="text-3xl font-mono font-bold text-primary">11:43 AM</div>
                    </div>
                    <Badge variant="outline" className="ml-2">±2 min confidence</Badge>
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
             {/* Graph Mock */}
             <Card>
                <CardHeader>
                    <CardTitle>Predicted vs Actual</CardTitle>
                    <CardDescription>Accuracy over last 24h</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-48 flex items-end justify-between gap-2 px-2">
                        {[4, 6, 5, 8, 12, 10, 6, 4].map((h, i) => (
                           <div key={i} className="flex-1 flex flex-col justify-end gap-1 group">
                                <div className="w-full bg-primary/20 rounded-t-sm relative transition-all group-hover:bg-primary/30" style={{ height: `${h * 10}%` }}>
                                    {/* Actual Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm opacity-80" style={{ height: `${h * 9}%` }} />
                                </div>
                                <span className="text-[10px] text-center text-muted-foreground font-mono">{10 + i}:00</span>
                           </div> 
                        ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-xs font-bold text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary/30 rounded-sm" /> Predicted
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-sm" /> Actual
                        </div>
                    </div>
                </CardContent>
             </Card>

             {/* Stats */}
             <Card>
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-success/10 text-success rounded-full">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-bold">System Latency</div>
                                <div className="text-xs text-muted-foreground">Order to Kitchen Display</div>
                            </div>
                        </div>
                        <div className="text-xl font-mono font-bold">240ms</div>
                    </div>
                    
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-full">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-bold">Active Users</div>
                                <div className="text-xs text-muted-foreground">Currently browsing</div>
                            </div>
                        </div>
                        <div className="text-xl font-mono font-bold">142</div>
                    </div>

                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 text-orange-500 rounded-full">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-bold">Avg Wait Time</div>
                                <div className="text-xs text-muted-foreground">Today's average</div>
                            </div>
                        </div>
                        <div className="text-xl font-mono font-bold">4m 12s</div>
                    </div>
                </CardContent>
             </Card>
        </div>
      </main>
    </div>
  )
}