"use client"

import { useEffect, useState } from "react"

import Link from "next/link"

import { MyListCard } from "@/components/cards/MyListCard"
import { Toast } from "@/components/feedback/Toast"
import { ConfirmDeleteModal } from "@/components/modals/ConfirmDeleteModal"
import { Button } from "@/components/ui/button"
import { useMyLists, type MyListSummary } from "@/hooks/useMyLists"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"
import { deleteList } from "@/services/listsService"
import { getApiErrorMessage } from "@/lib/errors"

export default function MyListsPage() {
  const { user, logout } = useAuth()
  const { data, isLoading, error } = useMyLists()
  const [lists, setLists] = useState<MyListSummary[]>([])
  const [deleteTarget, setDeleteTarget] = useState<MyListSummary | null>(null)
  const { toast, showToast } = useToast()

  useEffect(() => {
    let active = true

    void Promise.resolve().then(() => {
      if (active) {
        setLists(data)
      }
    })

    return () => {
      active = false
    }
  }, [data])

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteList(deleteTarget.id)
      setLists((prev) => prev.filter((list) => list.id !== deleteTarget.id))
      showToast("Lista excluida.", "success")
      setDeleteTarget(null)
    } catch (err) {
      showToast(getApiErrorMessage(err), "danger")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-warm)]">
      <main className="mx-auto max-w-[var(--container-max)] space-y-8 px-4 py-10 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Minhas listas</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie suas listas de presentes criadas.
            </p>
          </div>
          <Button asChild>
            <Link href="/create-list">+ Nova lista</Link>
          </Button>
        </header>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando listas...</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {!isLoading && !error && lists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
            <p className="text-base font-semibold">Voce ainda nao criou nenhuma lista</p>
            <p className="text-sm text-muted-foreground">
              Crie sua primeira lista de presentes.
            </p>
            <Button asChild className="mt-4">
              <Link href="/create-list">Criar primeira lista</Link>
            </Button>
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <MyListCard key={list.id} list={list} onDelete={setDeleteTarget} />
          ))}
        </div>
      </main>
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Excluir lista"
        description={
          deleteTarget
            ? `Tem certeza que deseja excluir \"${deleteTarget.name}\"? Esta acao nao pode ser desfeita.`
            : "Tem certeza que deseja excluir esta lista?"
        }
        onConfirm={handleDelete}
      />
      <Toast toast={toast} />
    </div>
  )
}
