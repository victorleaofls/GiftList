"use client"

import { useRouter } from "next/navigation"

import { ListForm, buildListPayload } from "@/components/forms/ListForm"
import { Toast } from "@/components/feedback/Toast"
import { TopNav } from "@/components/layout/TopNav"
import { useToast } from "@/hooks/useToast"
import { createList } from "@/services/listsService"
import { getStoredUser } from "@/services/authService"
import { getApiErrorMessage } from "@/lib/errors"

export default function CreateListPage() {
  const router = useRouter()
  const { toast, showToast } = useToast()
  const currentUser = getStoredUser()

  const handleSubmit = async (values: Parameters<typeof buildListPayload>[0]) => {
    try {
      const payload = buildListPayload(values, currentUser?.name ?? "Usuario")
      await createList(payload)
      showToast("Lista criada com sucesso!", "success")
      router.push("/my-lists")
    } catch (err) {
      showToast(getApiErrorMessage(err), "danger")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-warm)]">
      <TopNav backLink={{ href: "/my-lists", label: "Voltar para minhas listas" }} />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Criar lista de presentes</h1>
          <p className="text-sm text-muted-foreground">
            Monte sua lista para compartilhar com amigos e familiares.
          </p>
        </header>
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <ListForm submitLabel="Criar lista" onSubmit={handleSubmit} />
        </div>
      </main>
      <Toast toast={toast} />
    </div>
  )
}
