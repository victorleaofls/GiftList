"use client"

import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { buildListPayload, ListForm } from "@/components/forms/ListForm"
import { useToast } from "@/hooks/useToast"
import { createList } from "@/services/listsService"

type CreateListModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateListModal({ open, onOpenChange }: CreateListModalProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const handleSubmit = async (values: Parameters<typeof buildListPayload>[0]) => {
    const payload = buildListPayload(values, "Ana Silva")
    await createList(payload)
    showToast("Lista criada com sucesso!", "success")
    onOpenChange(false)
    router.push("/my-lists")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-scroll rounded-sm">
        <DialogHeader>
          <DialogTitle>Criar lista de presentes</DialogTitle>
          <DialogDescription>
            Monte sua lista para compartilhar com amigos e familiares.
          </DialogDescription>
        </DialogHeader>
        <ListForm
          submitLabel="Criar lista"
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
