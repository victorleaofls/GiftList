"use client"

import Link from "next/link"

import { FeatureCard } from "@/components/cards/FeatureCard"
import { ScreenCard, type ScreenCardProps } from "@/components/cards/ScreenCard"
import { TopNav } from "@/components/layout/TopNav"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const features = [
  {
    icon: "QR",
    title: "QR Code",
    description: "Cada lista tem QR Code unico para compartilhar em convites.",
  },
  {
    icon: "Link",
    title: "Link compartilhavel",
    description: "Copie o link e envie por WhatsApp, email ou Instagram.",
  },
  {
    icon: "Pix",
    title: "Pix",
    description: "Convidados contribuem via Pix sem taxas extras.",
  },
]

const screens: ScreenCardProps[] = [
  {
    href: "/login",
    title: "Login",
    description: "Autenticacao com email e senha para acessar sua conta.",
    tags: ["Autenticacao"],
    tone: "sun",
  },
  {
    href: "/register",
    title: "Cadastro",
    description: "Crie sua conta com nome, email e senha.",
    tags: ["Autenticacao"],
    tone: "rose",
  },
  {
    href: "/search",
    title: "Buscar listas",
    description: "Encontre listas publicas por nome ou ID.",
    tags: ["Busca", "QR Code"],
    tone: "sand",
  },
  {
    href: "/create-list",
    title: "Criar lista",
    description: "Monte sua lista com nome, descricao e presentes.",
    tags: ["CRUD", "Presentes"],
    tone: "sun",
  },
  {
    href: "/view-list",
    title: "Ver lista",
    description: "Visualize presentes e contribua via Pix.",
    tags: ["Pix", "Contribuicao"],
    tone: "rose",
  },
  {
    href: "/my-lists",
    title: "Minhas listas",
    description: "Gerencie suas listas criadas com facilidade.",
    tags: ["Dashboard"],
    tone: "sand",
  },
  {
    href: "/edit-list",
    title: "Editar lista",
    description: "Atualize nome, descricao e presentes da lista.",
    tags: ["CRUD"],
    tone: "sun",
  },
]

export default function Home() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <TopNav
        links={[
          { href: "/search", label: "Buscar listas" },
          { href: "/my-lists", label: "Minhas listas" },
        ]}
        user={user}
        onLogout={user ? logout : undefined}
        action={user ? undefined : { href: "/login", label: "Entrar" }}
      />
      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,#fff4d8,#ffffff_55%)]">
          <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Presentea
              </p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Presenteie com significado e organize tudo em um so lugar.
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Crie listas de presentes para casamentos, cha de bebe e festas.
                Convidados contribuem via Pix e acompanham o progresso em tempo real.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/create-list">Criar lista gratis</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/search">Buscar listas</Link>
                </Button>
              </div>
            </div>
            <div className="relative w-full max-w-md">
              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative rounded-3xl border border-border/70 bg-card p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <p className="text-sm text-muted-foreground">Lista em destaque</p>
                    <p className="text-lg font-semibold">Casamento Ana & Lucas</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Arrecadado</span>
                      <span className="font-semibold">R$ 2.800</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-2/3 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <p className="text-xs text-muted-foreground">Proximo presente</p>
                    <p className="text-base font-semibold">Batedeira KitchenAid</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--container-max)] px-4 py-12 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[var(--container-max)] px-4 pb-16 sm:px-6">
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Todas as funcionalidades
            </p>
            <h2 className="text-2xl font-semibold">Explore cada experiencia</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {screens.map((screen) => (
              <ScreenCard key={screen.href} {...screen} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
