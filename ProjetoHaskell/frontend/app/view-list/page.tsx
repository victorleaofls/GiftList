"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Copy, QrCode } from "lucide-react"

import { ProductCard } from "@/components/cards/ProductCard"
import { Toast } from "@/components/feedback/Toast"
import { PixModal } from "@/components/modals/PixModal"
import { QrCodeModal } from "@/components/modals/QrCodeModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useList } from "@/hooks/useList"
import { useToast } from "@/hooks/useToast"
import type { GiftItem } from "@/types/list"
import { contributeToItem } from "@/services/listsService"
import { useAuth } from "@/hooks/useAuth"
import { ContributionsModal } from "@/components/modals/ContributionsModal"
import { useContributionLists } from "@/hooks/useContributionLists"

const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const buildLink = (id: string) => {
  if (typeof window === "undefined") {
    return `/view-list?id=${id}`
  }
  return `${window.location.origin}/view-list?id=${id}`
}

export default function ViewListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background"><p className="p-10 text-sm text-muted-foreground">Carregando...</p></div>}>
      <ViewListContent />
    </Suspense>
  )
}

function ViewListContent() {
  const searchParams = useSearchParams()
  const listId = searchParams.get("id") ?? "PRE-001"
  const { data, isLoading, error } = useList(listId)
  const { toast, showToast } = useToast()
  const [currentList, setCurrentList] = useState(data)
  const [pixItem, setPixItem] = useState<GiftItem | null>(null)
  const [pixOpen, setPixOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [contributionsOpen, setContributionsOpen] = useState(false)
  const { user } = useAuth()
  const { refetch } = useContributionLists(listId)

  useEffect(() => {
    let active = true

    void Promise.resolve().then(() => {
      if (active) {
        setCurrentList(data)
      }
    })

    return () => {
      active = false
    }
  }, [data])

  const stats = useMemo(() => {
    if (!currentList) {
      return { total: 0, raised: 0, progress: 0 }
    }

    const total = currentList.items.reduce((sum, item) => sum + item.price, 0)
    const raised = currentList.items.reduce((sum, item) => sum + item.raised, 0)
    const progress = total > 0 ? Math.round((raised / total) * 100) : 0

    return { total, raised, progress }
  }, [currentList])

  const handleCopyLink = async () => {
    if (!currentList) return

    const link = buildLink(currentList.id)

    try {
      await navigator.clipboard.writeText(link)
      showToast("Link da lista copiado!", "success")
    } catch {
      showToast("Nao foi possivel copiar o link.", "danger")
    }
  }

  const handleContribute = (item: GiftItem) => {
    setPixItem(item)
    setPixOpen(true)
  }

  const handleConfirmPix = async (amount: number) => {
    if (!currentList || !pixItem) return

    try {
      const response = await contributeToItem(currentList.id, pixItem.id, amount)

      setCurrentList((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.id === pixItem.id
                  ? { ...item, raised: Math.min(item.price, item.raised + amount) }
                  : item
              ),
            }
          : prev
      )

      await navigator.clipboard.writeText(response.paymentLink)
      showToast("Contribuicao registrada e link copiado.", "success")
    } catch {
      showToast("Nao foi possivel registrar a contribuicao.", "danger")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[var(--container-max)] px-4 py-10 text-sm text-muted-foreground">
          Carregando lista...
        </main>
      </div>
    )
  }

  if (error || !currentList) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-[var(--container-max)] px-4 py-10 text-sm text-destructive">
          {error ?? "Lista nao encontrada."}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-[var(--container-max)] space-y-8 px-4 py-10 sm:px-6">
        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{currentList.id}</Badge>
              {currentList.pixEligible ? <Badge variant="success">Pix</Badge> : null}
            </div>
            <h1 className="text-3xl font-semibold">{currentList.name}</h1>
            <p className="text-sm text-muted-foreground">por {currentList.owner}</p>
            <p className="text-sm text-muted-foreground">{currentList.desc}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{currentList.items.length} presentes</span>
              {currentList.date ? <span>Data: {currentList.date}</span> : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={() => setQrOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </Button>
              <Button size="sm" variant="secondary" onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar link
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="flex flex-wrap justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Arrecadacao
                </p>
                <p className="mt-2 text-3xl font-semibold">{formatMoney(stats.raised)}</p>
                <p className="text-sm text-muted-foreground">
                  de {formatMoney(stats.total)} ({stats.progress}%)
                </p>
              </div>
              {!!user &&(
                <Button className="rounded-full w-full lg:w-fit mt-4 lg:mt-0"
                  onClick={() => setContributionsOpen(true)}
                >
                  Ver lista de contribuições
                </Button>
              )}
            </div>
            <div className="mt-4 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="mt-6 rounded-xl bg-muted px-4 py-3">
              <p className="text-sm font-semibold">Pix disponivel</p>
              <p className="text-xs text-muted-foreground">
                Contribua com qualquer valor para o presente escolhido.
              </p>
            </div>
          </div>
        </section>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentList.items.map((item) => (
            <ProductCard key={item.id} item={item} onContribute={handleContribute} />
          ))}
        </section>
      </main>
      <ContributionsModal
        open={contributionsOpen}
        onOpenChange={setContributionsOpen}
        listId={currentList.id}
      />
      <PixModal
        open={pixOpen}
        onOpenChange={setPixOpen}
        item={pixItem}
        onConfirm={handleConfirmPix}
      />
      <QrCodeModal
        open={qrOpen}
        onOpenChange={setQrOpen}
        title={`QR Code - ${currentList.name}`}
        description="Compartilhe esta lista com amigos."
        link={buildLink(currentList.id)}
      />
      <Toast toast={toast} />
    </div>
  )
}



