"use client"

import { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { GiftItem } from "@/types/list"

const pixSchema = z.object({
  amount: z.coerce.number().min(1, "Informe um valor maior que zero."),
})

type PixValues = z.infer<typeof pixSchema>

type PixModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: GiftItem | null
  onConfirm: (value: number) => void
}

const formatMoney = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function PixModal({ open, onOpenChange, item, onConfirm }: PixModalProps) {
  const remaining = useMemo(() => {
    if (!item) return 0
    return Math.max(0, item.price - item.raised)
  }, [item])

  const form = useForm<PixValues>({
    resolver: zodResolver(pixSchema),
    defaultValues: { amount: remaining || 1 },
  })

  useEffect(() => {
    form.reset({ amount: remaining || 1 })
  }, [form, remaining])

  const handleSubmit = (values: PixValues) => {
    onConfirm(values.amount)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contribuir via Pix</DialogTitle>
          <DialogDescription>
            {item
              ? `Escolha o valor para contribuir com ${item.name}.`
              : "Escolha o valor da sua contribuicao."}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl bg-muted p-4 text-center">
          <p className="text-xs uppercase text-muted-foreground">Meta</p>
          <p className="text-2xl font-semibold">
            {item ? formatMoney(item.price) : "-"}
          </p>
          <p className="text-xs text-muted-foreground">
            Faltam {formatMoney(remaining)}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da contribuicao</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground">
              Chave Pix: presentea@pix.com
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Copiar chave Pix</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
