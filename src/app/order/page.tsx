"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Minus, Plus, ShoppingBag, Info, Utensils, Clock, LayoutDashboard, Search, Filter, ChefHat, X, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { TimeDisplay } from "@/components/ui/time-display"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { MenuItem } from "@/types/database"

// Categories
const CATEGORIES = ["All", "Special", "Wraps", "Burgers", "Sandwiches", "Drinks"]

// Constants for Mock Fallback
const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: 1, name: "Chicken Wrap", price: 120, prep_time: 3, complexity: "low", category: "Wraps", description: "Grilled chicken with fresh veggies." },
  { id: 2, name: "Veg Burger", price: 90, prep_time: 5, complexity: "med", category: "Burgers", description: "Crispy patty with cheese slice." },
  { id: 3, name: "Spicy Paneer Wrap", price: 110, prep_time: 4, complexity: "med", category: "Wraps", description: "Cottage cheese in spicy marinade." },
  { id: 4, name: "Cold Coffee", price: 60, prep_time: 2, complexity: "low", category: "Drinks", description: "Chilled brewed coffee with milk." },
  { id: 5, name: "Grilled Sandwich", price: 80, prep_time: 6, complexity: "high", category: "Sandwiches", description: "Bombay style vegetable grill." },
  { id: 6, name: "Cheese Omelette", price: 50, prep_time: 4, complexity: "low", category: "Special", description: "Three egg omelette with cheddar." },
  { id: 7, name: "Masala Chai", price: 20, prep_time: 2, complexity: "low", category: "Drinks", description: "Hot spiced tea." },
]

export default function OrderPage() {
  const router = useRouter()
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [cart, setCart] = React.useState<Record<number, number>>({})
  const [pickupTime, setPickupTime] = React.useState("10:45")
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Checkout State
  const [showCheckout, setShowCheckout] = React.useState(false)
  const [studentId, setStudentId] = React.useState("")
  const [breakSlot, setBreakSlot] = React.useState("10:45-11:05")

  // Fetch Menu from Supabase
  React.useEffect(() => {
    const fetchMenu = async () => {
      // Mock Data Fallback
      if (!supabase) {
        setMenuItems(MOCK_MENU_ITEMS)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
        
        if (error) {
            console.error('Error fetching menu:', error)
            setMenuItems(MOCK_MENU_ITEMS) // Fallback on error
        } else if (data) {
            setMenuItems(data)
        }
      } catch (err) {
          console.error('Unexpected error:', err)
          setMenuItems(MOCK_MENU_ITEMS)
      } finally {
          setLoading(false)
      }
    }
    
    fetchMenu()
  }, [])

  // Calculate items in cart
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menuItems.find(i => i.id === Number(id))
      return total + (item ? item.price * qty : 0)
  }, 0)
  
  // Submit Handler
  const handlePlaceOrder = async () => {
    if (!studentId) {
        alert("Please enter a Student ID")
        return
    }

    // Mock Order placement
    if (!supabase) {
        const mockOrderId = "MOCK-" + Math.floor(Math.random() * 1000)
        console.log("Mock Order placed:", mockOrderId)
        router.push(`/order/status/${mockOrderId}`)
        return
    }

    try {
        // 1. Create Order
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                student_id: studentId,
                vendor_id: "canteen_1", // Hardcoded for now
                break_slot: breakSlot,
                order_time: new Date().toISOString(),
                status: 'ordered', // Default status
                predicted_pickup: pickupTime
            })
            .select()
            .single()

        if (orderError) throw orderError
        if (!orderData) throw new Error("No order data returned")

        // 2. Create Order Items
        const orderItems = Object.entries(cart).map(([id, qty]) => {
            const item = menuItems.find(i => i.id === Number(id))
            return {
                order_id: orderData.id,
                menu_item_id: Number(id),
                quantity: qty,
                price_at_time: item?.price || 0
            }
        })

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) throw itemsError
        
        console.log("Order placed successfully:", orderData.id)
        router.push(`/order/status/${orderData.id}`) // Use actual ID from DB

    } catch (error) {
        console.error("Error placing order:", error)
        alert("Failed to place order. Please try again.")
    }
  }

  // Filter Items
  const filteredItems = menuItems.filter(item => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
  })

  // Recalculation Effect
  React.useEffect(() => {
    let baseTime = 0
    let complexityPenalty = 0

    Object.entries(cart).forEach(([id, quantity]) => {
      const item = menuItems.find(i => i.id === Number(id))
      if (item && quantity > 0) {
        baseTime += item.prep_time * quantity
        if (item.complexity === "high") complexityPenalty += 2
      }
    })

    // Parallel processing simulation (dividing by 2 chefs)
    const actualPrep = Math.ceil(baseTime / 2) + complexityPenalty
    
    // Update predicted time (Current time + actualPrep)
    const d = new Date()
    d.setMinutes(d.getMinutes() + actualPrep) // Add prep time to current time
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    setPickupTime(`${hours}:${minutes}`)

  }, [cart, menuItems])

  const updateCart = (id: number, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading Menu...</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Link href="/">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-sm cursor-pointer hover:bg-primary/90 transition">
                        <Utensils className="h-5 w-5" />
                    </div>
                </Link>
                <Link href="/" className="font-bold tracking-tight text-lg hover:text-primary transition-colors">CANTEEN.AI</Link>
                <div className="mx-2 h-4 w-px bg-zinc-300 hidden md:block" />
                <span className="text-sm font-medium text-muted-foreground hidden md:block">Smart Order System</span>
            </div>
            
             <div className="flex-1 max-w-md mx-8 hidden md:block">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search menu..." 
                        className="pl-9 bg-background/50" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
             </div>

            <div className="flex items-center gap-3">
                <Link href="/vendor/dashboard">
                    <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground pb-2">
                         <ChefHat className="w-4 h-4 mr-2" />
                         Kitchen View
                    </Button>
                </Link>
                <div className="flex items-center gap-3 bg-secondary/50 px-3 py-1.5 rounded-full border border-secondary">
                    <span className="text-sm font-mono text-foreground font-semibold">10:30 AM</span>
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
            </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start h-[calc(100vh-6rem)]">
            
            {/* Left Sidebar: Categories */}
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-2 sticky top-24">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2 px-2">Categories</h3>
                <nav className="space-y-1">
                    {CATEGORIES.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", activeCategory === cat && "font-bold shadow-sm bg-secondary")}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </nav>

                <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <h4 className="font-bold text-primary text-sm mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Quick Tip
                    </h4>
                    <p className="text-xs text-muted-foreground">Ordering generally takes less than 30s. Pre-book your meal to skip the queue entirely.</p>
                </div>
            </div>

            {/* Middle: Data Grid */}
            <div className="lg:col-span-7 overflow-y-auto h-full pr-2 pb-20 no-scrollbar">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">{activeCategory} Menu</h1>
                     <div className="text-sm text-green-600 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 font-medium">
                        <Clock className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
                        Kitchen Load: Low (5m)
                     </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                    <Card key={item.id} className="group hover:border-primary/50 transition-all border-border shadow-sm hover:shadow-md flex flex-col">
                        <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base">{item.name}</CardTitle>
                                        {item.complexity === "high" && <Badge variant="warning" className="text-[9px] px-1 h-4">SLOW</Badge>}
                                    </div>
                                    <CardDescription className="text-xs mt-1">{item.description}</CardDescription>
                                </div>
                                <span className="font-mono font-bold text-lg">₹{item.price}</span>
                            </div>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                                <Clock className="w-3 h-3" />
                                {item.prep_time}m
                            </div>
                            
                            <div className="flex items-center gap-1">
                                {(cart[item.id] || 0) > 0 && (
                                    <>
                                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateCart(item.id, -1)}>
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="font-mono w-8 text-center text-sm font-bold">{cart[item.id]}</span>
                                    </>
                                )}
                                <Button 
                                    size="icon" 
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-all", 
                                        !cart[item.id] ? "bg-primary text-primary-foreground shadow-sm hover:shadow" : "bg-primary text-primary-foreground"
                                    )}
                                    onClick={() => updateCart(item.id, 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                    ))}
                    
                    {filteredItems.length === 0 && (
                         <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                             No items found in this category.
                         </div>
                    )}
                </div>
            </div>

            {/* Right: Cart (Sticky) */}
            <div className="lg:col-span-3 h-full relative">
                <div className="sticky top-0 h-full flex flex-col">
                    <Card className="h-full border-none shadow-none bg-secondary/10 lg:bg-card lg:border lg:shadow-xl flex flex-col overflow-hidden">
                        <CardHeader className="pb-3 border-b bg-card z-10">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShoppingBag className="h-5 w-5 text-primary" />
                                Current Order
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="flex-1 overflow-y-auto p-0">
                            {cartItemCount === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center opacity-60">
                                    <ShoppingBag className="h-12 w-12 mb-4 stroke-1" />
                                    <p className="text-sm">Your tray is empty.</p>
                                    <p className="text-xs mt-1">Select items from the menu to start.</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {Object.entries(cart).map(([id, qty]) => {
                                        const item = menuItems.find(i => i.id === Number(id))
                                        if (!item || qty === 0) return null
                                        return (
                                            <div key={id} className="p-4 flex flex-col gap-2 hover:bg-secondary/20 transition-colors">
                                                <div className="flex justify-between items-start text-sm">
                                                    <span className="font-medium line-clamp-1">{item.name}</span>
                                                    <span className="font-mono font-bold">₹{item.price * qty}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">₹{item.price} x {qty}</span>
                                                    <div className="flex items-center gap-2 scale-90 origin-right">
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateCart(item.id, -1)}>
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-xs font-mono w-4 text-center">{qty}</span>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateCart(item.id, 1)}>
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>

                        <div className="p-4 bg-secondary/10 border-t space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Item Total</span>
                                    <span className="font-mono">₹{cartTotal}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Taxes</span>
                                    <span className="font-mono">₹{Math.floor(cartTotal * 0.05)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Payable</span>
                                    <span className="font-mono text-primary">₹{cartTotal + Math.floor(cartTotal * 0.05)}</span>
                                </div>
                            </div>

                            <div className="bg-background rounded-lg p-3 border shadow-sm flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Pickup</span>
                                    <span className="font-mono font-bold text-lg leading-none">{pickupTime}</span>
                                </div>
                                <Badge variant="outline" className="text-[10px]">PREDICTED</Badge>
                            </div>

                            <Button 
                                className="w-full font-bold shadow-lg shadow-primary/20" 
                                size="lg" 
                                disabled={cartItemCount === 0}
                                onClick={() => setShowCheckout(true)}
                            >
                                Confirm Order
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

        </div>
      </main>

      {/* Checkout Modal Overlay */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg shadow-2xl border-2 border-primary/20 animate-in zoom-in-95 duration-200">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                        <CardTitle>Finalize Pre-Order</CardTitle>
                        <CardDescription>Reserve your meal for the break</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowCheckout(false)}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" /> Student Roll No / Name
                            </label>
                            <Input 
                                placeholder="e.g. 21BCE1045" 
                                autoFocus 
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                             <label className="text-sm font-medium leading-none flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" /> Select Break Slot
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {["10:45-11:05", "11:30-11:50", "12:15-12:35", "13:00-13:20"].map((slot) => (
                                    <div 
                                        key={slot}
                                        onClick={() => setBreakSlot(slot)}
                                        className={cn(
                                            "cursor-pointer rounded-lg border p-3 flex items-center justify-center text-sm font-mono transition-all hover:border-primary/50",
                                            breakSlot === slot ? "bg-primary/10 border-primary font-bold text-primary" : "bg-background"
                                        )}
                                    >
                                        {slot}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-secondary/20 p-4 rounded-lg border border-secondary space-y-2">
                             <div className="flex justify-between text-sm">
                                 <span className="text-muted-foreground">Order Total</span>
                                 <span className="font-bold">₹{cartTotal + Math.floor(cartTotal * 0.05)}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                 <span className="text-muted-foreground">Est. Pickup</span>
                                 <span className="font-bold text-primary">{pickupTime}</span>
                             </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex gap-2 border-t pt-4 bg-secondary/5">
                    <Button variant="outline" className="w-full" onClick={() => setShowCheckout(false)}>Cancel</Button>
                    <Button className="w-full font-bold" onClick={handlePlaceOrder}>
                        Confirm & Pay
                    </Button>
                </CardFooter>
            </Card>
        </div>
      )}
    </div>
  )
}