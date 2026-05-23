import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-11 w-full rounded-[var(--radius-sm)] border border-input bg-background px-4 py-2 text-base font-medium transition-colors placeholder:text-[var(--meta)] focus-visible:outline-none focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
