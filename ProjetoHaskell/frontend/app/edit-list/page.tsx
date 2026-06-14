"use client"

import { Suspense, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { ListForm, buildListPayload } from "@/components/forms/ListForm"
import { Toast } from "@/components/feedback/Toast"
import { TopNav } from "@/components/layout/TopNav"
import type { ListFormValues } from "@/components/forms/ListForm"
import { useList } from "@/hooks/useList"
import { useToast } from "@/hooks/useToast"
import { updateList } from "@/services/listsService"
import { getApiErrorMessage } from "@/lib/errors"

export default function EditListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--surface-warm)]"><p className="p-10 text-sm text-muted-foreground">Carregando...</p></div>}>
      <EditListContent />
    </Suspense>
  )
}

function EditListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listId = searchParams.get("id") ?? "PRE-001"
  const { data, isLoading, error } = useList(listId)
  const { toast, showToast } = useToast()

  const defaultValues = useMemo<ListFormValues | undefined>(() => {
    if (!data) return undefined

    return {
      name: data.name,
      desc: data.desc,
      date: data.date ?? "",
      items: data.items.map((item) => ({
        name: item.name,
        image: item.image ?? "",
        price: item.price,
      })),
    }
  }, [data])

  const handleSubmit = async (values: ListFormValues) => {
    if (!data) return

    try {
      const payload = buildListPayload(values, data.owner)
      await updateList({ ...payload, id: data.id })
      showToast("Lista atualizada.", "success")
      router.push("/my-lists")
    } catch (err) {
      showToast(getApiErrorMessage(err), "danger")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--surface-warm)]">
        <TopNav backLink={{ href: "/my-lists", label: "Voltar para minhas listas" }} />
        <main className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">
          Carregando lista...
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--surface-warm)]">
        <TopNav backLink={{ href: "/my-lists", label: "Voltar para minhas listas" }} />
        <main className="mx-auto max-w-3xl px-4 py-10 text-sm text-destructive">
          {error ?? "Lista nao encontrada."}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--surface-warm)]">
      <TopNav backLink={{ href: "/my-lists", label: "Voltar para minhas listas" }} />
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Editar lista</h1>
          <p className="text-sm text-muted-foreground">
            Atualize as informacoes e presentes da sua lista.
          </p>
        </header>
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <ListForm
            submitLabel="Salvar alteracoes"
            cancelLabel="Cancelar"
            onCancel={() => router.push("/my-lists")}
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
          />
        </div>
      </main>
      <Toast toast={toast} />
    </div>
  )
}


