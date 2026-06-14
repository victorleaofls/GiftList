import { useCallback, useEffect, useState } from "react"

import { getStoredUser } from "@/services/authService"
import type { AuthUser } from "@/types/auth"

function isValidUser(user: unknown): user is AuthUser {
  if (!user || typeof user !== "object") return false
  const u = user as Record<string, unknown>
  return typeof u.name === "string" && u.name.length > 0 && typeof u.email === "string"
}

function sanitizeUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null
  const u = raw as Record<string, unknown>
  const email = typeof u.email === "string" ? u.email : ""
  const name = typeof u.name === "string" && u.name.length > 0
    ? u.name
    : email.split("@")[0] || "Usuario"
  const id = typeof u.id === "number" ? u.id : 0
  return { id, name, email }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getStoredUser()
    if (isValidUser(stored)) {
      setUser(stored)
    } else if (stored) {
      const fixed = sanitizeUser(stored)
      if (fixed) {
        setUser(fixed)
        if (typeof window !== "undefined") {
          window.localStorage.setItem("giftlist_user", JSON.stringify(fixed))
        }
      }
    }
    setIsLoading(false)
  }, [])

  const refreshUser = useCallback(() => {
    const stored = getStoredUser()
    if (isValidUser(stored)) {
      setUser(stored)
    } else if (stored) {
      const fixed = sanitizeUser(stored)
      if (fixed) {
        setUser(fixed)
        if (typeof window !== "undefined") {
          window.localStorage.setItem("giftlist_user", JSON.stringify(fixed))
        }
      }
    } else {
      setUser(null)
    }
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
