import Link from "next/link"

import { LoginForm } from "@/components/forms/LoginForm"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Presentea
              </p>
              <h1 className="text-3xl font-semibold">Entrar</h1>
              <p className="text-sm text-muted-foreground">
                Acesse sua conta para gerenciar suas listas.
              </p>
            </div>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground">
              Ainda nao tem conta?{" "}
              <Link href="/register" className="font-semibold text-foreground">
                Criar conta
              </Link>
            </p>
          </div>
        </section>
        <section className="relative hidden items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#ff385db2,#ff385c)] text-white lg:flex">
          <div className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-white/15 blur-3xl" />
          <div className="relative z-10 max-w-sm space-y-4 text-center">
            <h2 className="text-4xl font-semibold">Presenteie com significado</h2>
            <p className="text-sm text-white/80">
              Crie listas de presentes e receba contribuicoes via Pix com
              praticidade.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
