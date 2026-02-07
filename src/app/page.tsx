"use client"

import Link from "next/link"
import { ArrowRight, Utensils, AlertTriangle, CheckCircle2, LayoutDashboard, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TimeDisplay } from "@/components/ui/time-display"

export default function StudentHome() {
  // Mock data for context awareness
  const nextBreak = "10:45 AM"
  const timeRemaining = "15 min"
  const crowdLevel = "moderate" // low, moderate, high
  const canEat = true

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-sm">
                    <Utensils className="h-5 w-5" />
                </div>
                <span className="font-bold tracking-tight text-lg">CANTEEN.AI</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
                <Link href="/order" className="text-muted-foreground hover:text-primary transition-colors">Order</Link>
                <Link href="/vendor/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Vendor View</Link>
            </nav>

            <div className="flex items-center gap-3 bg-secondary/50 px-3 py-1.5 rounded-full border border-secondary">
                <span className="text-sm font-mono text-foreground font-semibold">10:30 AM</span>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-10">
        
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Context & Main Action */}
            <div className="lg:col-span-7 flex flex-col gap-8">
                {/* Hero Section */}
                <section className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-foreground">
                        Can I eat during <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-zinc-500">the next break?</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-lg">
                        Real-time queue prediction and pre-ordering for campus breaks. Skip the line, not the meal.
                    </p>
                </section>

                {/* Status Card */}
                <Card className="border-l-4 border-l-success shadow-lg bg-card/60 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-2">
                             <Badge variant="success" className="px-3 py-1 text-sm">YES, HIGH CONFIDENCE</Badge>
                             <div className="flex items-center gap-2 text-muted-foreground">
                                <span className="text-xs uppercase font-bold tracking-wider">Queue Time</span>
                                <span className="font-mono font-bold text-foreground"> &lt; 5m</span>
                             </div>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl">You have plenty of time.</CardTitle>
                        <CardDescription className="text-base">
                            Queue prediction for {nextBreak} is remarkably low. 
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="w-full bg-secondary/50 rounded-full h-2 mt-2 overflow-hidden">
                           <div className="bg-success h-full w-[25%]" />
                       </div>
                       <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono uppercase tracking-widest">
                           <span>Current Load: 25%</span>
                           <span>Capacity: 400</span>
                       </div>
                    </CardContent>
                </Card>

                {/* Primary Actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                     <Link href="/order" className="block group">
                        <Button size="lg" className="w-full h-20 text-xl gap-3 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl" variant="default">
                            <ShoppingBag className="h-6 w-6" />
                            Order Now
                            <ArrowRight className="h-6 w-6 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Button>
                     </Link>
                     
                     <div className="flex flex-col justify-center p-4 border border-dashed border-zinc-300 rounded-lg bg-zinc-50/50">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                            <span>Next Break</span>
                            <span className="font-mono text-foreground font-bold">{nextBreak}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Break Duration</span>
                            <span className="font-mono text-foreground font-bold">20 min</span>
                        </div>
                     </div>
                </div>
            </div>

            {/* Right Column: Vendor Grid */}
            <div className="lg:col-span-5 space-y-6">
                 <div className="flex items-center justify-between">
                     <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Nearby Vendors
                     </h2>
                     <Button variant="link" className="text-xs h-auto p-0 text-muted-foreground">View all</Button>
                 </div>

                 <div className="grid gap-4">
                     {/* Vendor 1 */}
                    <div className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center text-xl font-bold text-zinc-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                M
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg group-hover:text-primary transition-colors">Main Canteen</span>
                                <span className="text-sm text-muted-foreground">Burgers, Wraps, Snacks</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="success">FAST</Badge>
                            <span className="text-xs font-mono text-muted-foreground">~3m prep</span>
                        </div>
                    </div>

                    {/* Vendor 2 */}
                    <div className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center text-xl font-bold text-zinc-400 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                J
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg group-hover:text-primary transition-colors">Juice Bar</span>
                                <span className="text-sm text-muted-foreground">Fresh Juices, Shakes</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="warning">BUSY</Badge>
                            <span className="text-xs font-mono text-muted-foreground">~8m prep</span>
                        </div>
                    </div>

                    {/* Vendor 3 */}
                    <div className="group flex items-center justify-between p-4 border rounded-xl bg-card hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer opacity-70">
                         <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-zinc-100 flex items-center justify-center text-xl font-bold text-zinc-400">
                                S
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">Subway Station</span>
                                <span className="text-sm text-muted-foreground">Sandwiches, Salads</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant="neutral">CLOSED</Badge>
                            <span className="text-xs font-mono text-muted-foreground">Opens 11:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-auto bg-zinc-50/50">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 Canteen Rush AI. Campus Infrastructure.</p>
            <div className="flex gap-6">
                <Link href="/vendor/dashboard" className="hover:text-foreground transition-colors">Vendor Dashboard</Link>
                <Link href="#" className="hover:text-foreground transition-colors">System Status</Link>
                <Link href="#" className="hover:text-foreground transition-colors">Support</Link>
            </div>
        </div>
      </footer>
    </div>
  )
}
