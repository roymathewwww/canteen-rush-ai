import * as React from "react"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface TimeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  time: string // Format: "10:45 AM" or "05:00"
  label?: string
  variant?: "default" | "urgent" | "warning" | "success"
  size?: "sm" | "md" | "lg" | "xl"
}

export function TimeDisplay({ 
  time, 
  label, 
  variant = "default", 
  size = "md",
  className,
  ...props 
}: TimeDisplayProps) {
  
  const textColors = {
    default: "text-foreground",
    urgent: "text-urgency",
    warning: "text-warning",
    success: "text-success"
  }

  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl tracking-tighter"
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {label && (
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {label}
        </span>
      )}
      <div className={cn(
        "font-mono font-bold leading-none tabular-nums", 
        textColors[variant], 
        sizes[size]
      )}>
        {time}
      </div>
    </div>
  )
}
