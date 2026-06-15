"use client"

import { useEffect, useMemo, useState } from "react"
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
import { useContributionLists } from "@/hooks/useContributionLists"

type ContributionsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  listId: string
}
export function ContributionsModal({ open, onOpenChange, listId }: ContributionsModalProps) {
  const { data, isLoading, error } = useContributionLists(listId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lista de Contribuições</DialogTitle>
          <DialogDescription>
            Essas são as contribuições feitas para a lista. Em breve será possível visualizar detalhes de cada contribuição e agradecer os colaboradores!
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-xl bg-muted p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {
              data.map((contribution) => (
                <div key={contribution.id} className="flex items-center gap-2 border-b border-border py-2">
                  <img src={contribution.image} alt={contribution.nomeCompleto} className="w-6 h-6 rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-base text-left font-bold text-muted-foreground">{contribution.itemName}</span>
                    <span>Contribuidor: {contribution.nomeCompleto}</span>
                  </div>
                  <span className="text-green-800 ml-auto font-semibold">{contribution.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              ))
            }
            {isLoading && "Carregando contribuições..."}
            {error && "Não foi possível carregar as contribuições."}
          </p>
        </div>
            {data.length === 0 && !isLoading && "Nenhuma contribuição registrada ainda."}
      </DialogContent>
    </Dialog>
  )
}
