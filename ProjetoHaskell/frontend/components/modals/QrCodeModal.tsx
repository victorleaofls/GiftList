"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type QrCodeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  link: string
}

export function QrCodeModal({
  open,
  onOpenChange,
  title,
  description,
  link,
}: QrCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const isloading = !link
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    link
  )}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-border bg-muted p-6 text-center">
          {isloading ? (
            <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
          ) : (
          <img
            src={qrSrc}
            alt="QR Code da lista"
            className="mx-auto h-40 w-40 rounded-xl border border-border bg-background"
          />
          )}
          <p className="mt-4 break-all text-xs text-muted-foreground">{link}</p>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button type="button" onClick={handleCopy}>
            {copied ? "Copiado" : "Copiar link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
