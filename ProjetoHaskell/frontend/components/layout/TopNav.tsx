"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AuthUser } from "@/types/auth"

type NavLink = {
  href: string
  label: string
}

type NavAction = {
  href: string
  label: string
  variant?: "default" | "secondary" | "outline"
  onClick?: () => void
}

type TopNavProps = {
  links?: NavLink[]
  action?: NavAction
  backLink?: NavLink
  className?: string
  user?: AuthUser | null
  onLogout?: () => void
}

export function TopNav({ links = [], action, backLink, className, user, onLogout }: TopNavProps) {
  return (
    <nav
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background",
        className
      )}
    >
      <div className="mx-auto flex h-20 max-w-[var(--container-max)] items-center justify-between gap-6 px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-semibold tracking-[-0.02em]">
            <span className="text-primary">Presentea</span>
          </Link>
          {backLink ? (
            <Link href={backLink.href} className="text-sm text-muted-foreground">
              {backLink.label}
            </Link>
          ) : null}
          {links.length ? (
            <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Ola, <span className="font-medium text-foreground">{user.name.split(" ")[0]}</span>
              </span>
              {onLogout ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full px-5"
                  onClick={onLogout}
                >
                  Sair
                </Button>
              ) : null}
            </div>
          ) : (
            action ? (
              action.onClick ? (
                <Button
                  variant={action.variant ?? "default"}
                  size="sm"
                  className="rounded-full px-5"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ) : (
                <Button
                  asChild
                  variant={action.variant ?? "default"}
                  size="sm"
                  className="rounded-full px-5"
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              )
            ) : null
          )}
        </div>
      </div>
    </nav>
  )
}
