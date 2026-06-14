"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { PublicListCard } from "@/components/cards/PublicListCard"
import { Toast } from "@/components/feedback/Toast"
import { QrCodeModal } from "@/components/modals/QrCodeModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { useLists, type PublicListSummary } from "@/hooks/useLists"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/hooks/useAuth"

const buildLink = (id: string) => {
  if (typeof window === "undefined") {
    return `/view-list?id=${id}`
  }
  return `${window.location.origin}/view-list?id=${id}`
}

export default function SearchPage() {
  const { user, logout } = useAuth()
  const [query, setQuery] = useState("")
  const debounced = useDebouncedValue(query, 300)
  const { data, isLoading, error } = useLists(debounced)
  const { toast, showToast } = useToast()
  const [qrTarget, setQrTarget] = useState<PublicListSummary | null>(null)

  const qrLink = useMemo(() => (qrTarget ? buildLink(qrTarget.id) : ""), [qrTarget])

  const handleCopyLink = async (list: PublicListSummary) => {
    const link = buildLink(list.id)

    try {
      await navigator.clipboard.writeText(link)
      showToast("Link copiado!", "success")
    } catch {
      showToast("Nao foi possivel copiar o link.", "danger")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-warm)]">
      <main className="mx-auto max-w-[var(--container-max)] space-y-8 px-4 py-10 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Buscar listas de presentes</h1>
          <p className="text-sm text-muted-foreground">
            Encontre listas publicas por nome, ID ou organizador.
          </p>
        </header>
        <div className="flex justify-between items-center gap-3 rounded-full border border-border pl-4 bg-background  shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome da lista ou ID"
            className="h-1 border-none shadow-none focus-visible:ring-0"
          />
          <Button size="sm" className="rounded-r-full cursor-pointer">
            Buscar
          </Button>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando listas...</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {!isLoading && !error && data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background p-10 text-center">
            <p className="text-base font-semibold">Nenhuma lista encontrada</p>
            <p className="text-sm text-muted-foreground">
              Tente outro termo de busca.
            </p>
          </div>
        ) : null}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((list) => (
            <PublicListCard
              key={list.id}
              list={list}
              onCopyLink={handleCopyLink}
              onShowQr={setQrTarget}
            />
          ))}
        </div>
      </main>
      <QrCodeModal
        open={!!qrTarget}
        onOpenChange={(open) => {
          if (!open) setQrTarget(null)
        }}
        title={qrTarget ? `QR Code - ${qrTarget.name}` : "QR Code"}
        description="Aponte a camera para compartilhar a lista."
        link={qrLink}
      />
      <Toast toast={toast} />
    </div>
  )
}
