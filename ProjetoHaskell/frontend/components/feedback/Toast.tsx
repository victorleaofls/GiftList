import { cn } from "@/lib/utils"
import type { ToastState } from "@/hooks/useToast"

const variantClasses: Record<string, string> = {
  default: "bg-foreground text-background",
  success: "bg-[var(--success)] text-white",
  danger: "bg-[var(--danger)] text-white",
}

type ToastProps = {
  toast: ToastState | null
}

export function Toast({ toast }: ToastProps) {
  if (!toast) return null

  const variant = toast.variant ?? "default"

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2">
      <div
        className={cn(
          "rounded-full px-4 py-2 text-center text-sm font-medium shadow-lg",
          variantClasses[variant] ?? variantClasses.default
        )}
      >
        {toast.message}
      </div>
    </div>
  )
}
