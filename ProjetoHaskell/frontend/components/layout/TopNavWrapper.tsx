"use client"

import { TopNav } from "@/components/layout/TopNav"
import { useAuth } from "@/hooks/useAuth"

export function TopNavWrapper() {
  const { user, logout } = useAuth()

  return (
    <TopNav
      links={[
        { href: "/search", label: "Buscar listas" },
        { href: "/create-list", label: "Criar lista" },
        { href: "/my-lists", label: "Minhas listas" },
      ]}
      user={user}
      onLogout={user ? logout : undefined}
      action={user ? undefined : { href: "/login", label: "Entrar", variant: "secondary" }}
    />
  )
}
