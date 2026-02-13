"use client"

import * as React from "react"
import { TimeDisplay } from "@/components/ui/time-display"

export function CurrentTime({ className, fixed = true }: { className?: string, fixed?: boolean }) {
  const [time, setTime] = React.useState<string>("")

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) return null

  if (fixed) {
    return (
        <div className="fixed top-4 right-4 z-50 pointer-events-none">
            <div className="bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-1 shadow-sm pointer-events-auto">
                <span className="font-mono text-sm font-medium">{time}</span>
            </div>
        </div>
      )
  }

  return <span className={className}>{time}</span>
}
