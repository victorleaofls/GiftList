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
import { Minus, Plus } from "lucide-react"

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
    return Number(Math.max(0, item.price - item.raised).toFixed(2))
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
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label="Diminuir valor"
                        onClick={() => {
                          const current = Number(field.value) || 0
                          field.onChange(Math.max(1, current - 1))
                        }}
                      >
                        <Minus />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        step="0.01"
                        className="text-center rounded-full"
                        {...field}
                      />
                      <Button
                        type="button"
                        size="icon-sm"
                        aria-label="Aumentar valor"
                        onClick={() => {
                          const current = Number(field.value) || 0
                          field.onChange(Math.max(1, current + 1))
                        }}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </FormControl>
                  <div className="flex justify-center flex-wrap gap-2">
                    {[5, 10, 25, 50].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => field.onChange(value)}
                      >
                        {formatMoney(value)}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Presentear!</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
