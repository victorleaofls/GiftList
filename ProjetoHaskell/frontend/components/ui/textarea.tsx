import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[110px] w-full rounded-[var(--radius-sm)] border border-input bg-background px-4 py-2 text-base font-medium transition-colors placeholder:text-[var(--meta)] focus-visible:outline-none focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
      className
    )}
    {...props}
  />
))
Textarea.displayName = "Textarea"

export { Textarea }
