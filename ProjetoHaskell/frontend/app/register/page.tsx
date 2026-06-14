import Link from "next/link"

import { RegisterForm } from "@/components/forms/RegisterForm"
import { Gift } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="grid min-h-[calc(100vh-80px)] grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Presentea
              </p>
              <h1 className="text-3xl font-semibold">Criar conta</h1>
              <p className="text-sm text-muted-foreground">
                Cadastre-se para criar listas e acompanhar contribuicoes.
              </p>
            </div>
            <RegisterForm />
            <p className="text-center text-sm text-muted-foreground">
              Ja tem conta?{" "}
              <Link href="/login" className="font-semibold text-foreground">
                Entrar
              </Link>
            </p>
          </div>
        </section>
        <section className="relative hidden items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#ff385db2,#ff385c)] text-white lg:flex">
          <div className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-white/15 blur-3xl" />
          <div className="flex flex-col relative z-10 max-w-sm space-y-4 text-center items-center">
            <Gift className="h-30 w-30"/>
            <h2 className="text-4xl font-semibold">Seu evento, sua historia</h2>
            <p className="text-sm text-white">
              Compartilhe o link da lista e receba apoio de quem voce ama.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
