import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "urgency" | "warning" | "success" | "neutral"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
    urgency: "border-transparent bg-urgency text-white hover:bg-urgency/80",
    warning: "border-transparent bg-warning text-white hover:bg-warning/80",
    success: "border-transparent bg-success text-white hover:bg-success/80",
    neutral: "border-transparent bg-muted text-muted-foreground",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
