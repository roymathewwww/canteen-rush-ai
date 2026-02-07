"use client"

import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Edit2, Save, Settings, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const VENDORS = [
    { id: 1, name: "Canteen A (Main)", capacity: 50, status: "Active" },
    { id: 2, name: "Juice Bar", capacity: 20, status: "Active" },
    { id: 3, name: "Coffee Stand", capacity: 15, status: "Busy" },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background font-sans p-4 md:p-8">
       <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
            <Link href="/">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">System Configuration</h1>
                <p className="text-muted-foreground text-sm">Manage vendors, menus, and capacities</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm">
                <Database className="w-4 h-4 mr-2" />
                Export Logs
            </Button>
            <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
            </Button>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto space-y-6">
          {/* Vendors */}
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                      <CardTitle>Vendor Management</CardTitle>
                      <CardDescription>Configure kitchen throughput</CardDescription>
                  </div>
                  <Button size="sm" variant="secondary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Vendor
                  </Button>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {VENDORS.map(v => (
                          <div key={v.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-secondary/10 transition-colors">
                              <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold">
                                      {v.name[0]}
                                  </div>
                                  <div>
                                      <div className="font-bold">{v.name}</div>
                                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                                          Capacity: {v.capacity} orders/hr
                                          <span className="w-1 h-1 rounded-full bg-zinc-300" />
                                          ID: {v.id}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Badge variant={v.status === "Active" ? "outline" : "warning"}>{v.status}</Badge>
                                  <Button size="icon" variant="ghost">
                                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="hover:text-destructive">
                                      <Trash2 className="w-4 h-4" />
                                  </Button>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>

          {/* Global Parameters */}
           <Card>
              <CardHeader>
                  <CardTitle>Global Logic Parameters</CardTitle>
                  <CardDescription>Tweak the AI prediction weights</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Rush Multiplier (Peak)</label>
                      <div className="flex gap-2">
                          <Input className="font-mono" defaultValue="1.3" />
                          <span className="flex items-center text-sm text-muted-foreground">x</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Applied when queue {'>'} 10 orders</p>
                  </div>
                   <div className="space-y-2">
                      <label className="text-sm font-medium">Standard Prep Buffer</label>
                       <div className="flex gap-2">
                          <Input className="font-mono" defaultValue="120" />
                          <span className="flex items-center text-sm text-muted-foreground">sec</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Minimum time added to every order</p>
                  </div>
              </CardContent>
           </Card>
      </main>
    </div>
  )
}