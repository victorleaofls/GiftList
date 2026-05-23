import { useCallback, useEffect, useState } from "react"

export type ToastVariant = "default" | "success" | "danger"

export type ToastState = {
  message: string
  variant?: ToastVariant
}

export function useToast(timeout = 2400) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, variant?: ToastVariant) => {
    setToast({ message, variant })
  }, [])

  const clearToast = useCallback(() => {
    setToast(null)
  }, [])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      setToast(null)
    }, timeout)

    return () => clearTimeout(timer)
  }, [toast, timeout])

  return { toast, showToast, clearToast }
}
