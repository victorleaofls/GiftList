import { useCallback, useEffect, useState } from "react"

import { getStoredUser } from "@/services/authService"
import type { AuthUser } from "@/types/auth"

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredUser()
    setUser(stored)
    setIsLoading(false)
  }, [])

  const refreshUser = useCallback(() => {
    const stored = getStoredUser()
    setUser(stored)
  }, [])

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("giftlist_user")
      window.localStorage.removeItem("giftlist_token")
      setUser(null)
      window.location.href = "/login"
    }
  }, [])

  return { user, isLoading, refreshUser, logout }
}
