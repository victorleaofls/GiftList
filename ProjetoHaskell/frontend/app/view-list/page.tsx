"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Copy, QrCode } from "lucide-react"

import { ProductCard } from "@/components/cards/ProductCard"
import { Toast } from "@/components/feedback/Toast"
import { TopNav } from "@/components/layout/TopNav"
import { PixModal } from "@/components/modals/PixModal"
import { QrCodeModal } from "@/components/modals/QrCodeModal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useList } from "@/hooks/useList"
import { useToast } from "@/hooks/useToast"
import type { GiftItem } from "@/types/list"

const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

const buildLink = (id: string) => {
  if (typeof window === "undefined") {
    return `/view-list?id=${id}`
  }
  return `${window.location.origin}/view-list?id=${id}`
}

export default function ViewListPage() {
  const searchParams = useSearchParams()
  const listId = searchParams.get("id") ?? "PRE-001"
  const { data, isLoading, error } = useList(listId)
  const { toast, showToast } = useToast()
  const [pixItem, setPixItem] = useState<GiftItem | null>(null)
  const [pixOpen, setPixOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  const stats = useMemo(() => {
    if (!data) {
      return { total: 0, raised: 0, progress: 0 }
    }

    const total = data.items.reduce((sum, item) => sum + item.price, 0)
    const raised = data.items.reduce((sum, item) => sum + item.raised, 0)
    const progress = total > 0 ? Math.round((raised / total) * 100) : 0

    return { total, raised, progress }
  }, [data])

  const handleCopyLink = async () => {
    if (!data) return

    const link = buildLink(data.id)

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

  const handleConfirmPix = (amount: number) => {
    showToast(`Pix de ${formatMoney(amount)} pronto para pagamento.`, "success")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav links={[{ href: "/search", label: "Buscar listas" }]} />
        <main className="mx-auto max-w-[var(--container-max)] px-4 py-10 text-sm text-muted-foreground">
          Carregando lista...
        </main>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav links={[{ href: "/search", label: "Buscar listas" }]} />
        <main className="mx-auto max-w-[var(--container-max)] px-4 py-10 text-sm text-destructive">
          {error ?? "Lista nao encontrada."}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav
        links={[
          { href: "/search", label: "Buscar listas" },
          { href: "/my-lists", label: "Minhas listas" },
        ]}
        action={{ href: "/login", label: "Entrar", variant: "secondary" }}
      />
      <main className="mx-auto max-w-[var(--container-max)] space-y-8 px-4 py-10 sm:px-6">
        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{data.id}</Badge>
              {data.pixEligible ? <Badge variant="success">Pix</Badge> : null}
            </div>
            <h1 className="text-3xl font-semibold">{data.name}</h1>
            <p className="text-sm text-muted-foreground">por {data.owner}</p>
            <p className="text-sm text-muted-foreground">{data.desc}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{data.items.length} presentes</span>
              {data.date ? <span>Data: {data.date}</span> : null}
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
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Arrecadacao
            </p>
            <p className="mt-2 text-3xl font-semibold">{formatMoney(stats.raised)}</p>
            <p className="text-sm text-muted-foreground">
              de {formatMoney(stats.total)} ({stats.progress}%)
            </p>
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
          {data.items.map((item) => (
            <ProductCard key={item.id} item={item} onContribute={handleContribute} />
          ))}
        </section>
      </main>
      <PixModal
        open={pixOpen}
        onOpenChange={setPixOpen}
        item={pixItem}
        onConfirm={handleConfirmPix}
      />
      <QrCodeModal
        open={qrOpen}
        onOpenChange={setQrOpen}
        title={`QR Code - ${data.name}`}
        description="Compartilhe esta lista com amigos."
        link={buildLink(data.id)}
      />
      <Toast toast={toast} />
    </div>
  )
}
