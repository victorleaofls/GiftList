"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { GiftList } from "@/types/list"

const listFormSchema = z.object({
  name: z.string().min(3, "Informe o nome da lista."),
  desc: z.string().min(10, "Descreva sua lista com mais detalhes."),
  date: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(2, "Informe o nome do presente."),
        image: z.string().url().optional().or(z.literal("")),
        price: z.coerce.number().min(1, "Informe um valor maior que zero."),
      })
    )
    .min(1, "Adicione pelo menos um presente."),
})

export type ListFormValues = z.infer<typeof listFormSchema>

type ListFormProps = {
  defaultValues?: Partial<ListFormValues>
  onSubmit: (values: ListFormValues) => Promise<void> | void
  submitLabel: string
  onCancel?: () => void
  cancelLabel?: string
}

const baseDefaults: ListFormValues = {
  name: "",
  desc: "",
  date: "",
  items: [{ name: "", image: "", price: 0 }],
}

const toDefaults = (values?: Partial<ListFormValues>): ListFormValues => {
  if (!values) return baseDefaults

  return {
    name: values.name ?? "",
    desc: values.desc ?? "",
    date: values.date ?? "",
    items:
      values.items && values.items.length
        ? values.items.map((item) => ({
            name: item.name ?? "",
            image: item.image ?? "",
            price: item.price ?? 0,
          }))
        : baseDefaults.items,
  }
}

export function ListForm({
  defaultValues,
  onSubmit,
  submitLabel,
  onCancel,
  cancelLabel = "Cancelar",
}: ListFormProps) {
  const form = useForm<ListFormValues>({
    resolver: zodResolver(listFormSchema),
    defaultValues: toDefaults(defaultValues),
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  useEffect(() => {
    form.reset(toDefaults(defaultValues))
  }, [defaultValues, form])

  const handleSubmit = async (values: ListFormValues) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da lista</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Casamento, Cha de Bebe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descricao</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva o evento, data, local e o que os convidados precisam saber."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do evento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold">Presentes</p>
              <p className="text-sm text-muted-foreground">
                Adicione itens e valores para sua lista.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ name: "", image: "", price: 0 })}
            >
              + Adicionar presente
            </Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-border bg-muted/40 p-4"
              >
                <div className="grid gap-4 md:grid-cols-[2fr,1.5fr,1fr,auto] md:items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do presente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Jogo de panelas" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.image`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link da imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="URL da foto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preco (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button type="button" variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const buildListPayload = (
  values: ListFormValues,
  owner = "Usuario"
): GiftList => ({
  id: "",
  name: values.name,
  owner,
  desc: values.desc,
  date: values.date,
  items: values.items.map((item, index) => ({
    id: `ITEM-${index + 1}`,
    name: item.name,
    price: item.price,
    raised: 0,
    image: item.image || null,
  })),
})
