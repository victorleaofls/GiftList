"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { register } from "@/services/authService"

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Informe seu nome."),
    lastName: z.string().min(2, "Informe seu sobrenome."),
    email: z.string().email("Informe um email valido."),
    password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres."),
    confirmPassword: z
      .string()
      .min(6, "Senha precisa ter pelo menos 6 caracteres."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "As senhas nao conferem.",
    path: ["confirmPassword"],
  })

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: RegisterValues) => {
    setError(null)
    setSuccess(null)

    try {
      await register(values)
      setSuccess("Conta criada. Redirecionando para o login...")
      setTimeout(() => router.push("/login"), 800)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Nao foi possivel criar sua conta."
      setError(message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu sobrenome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Seu email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Crie uma senha" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar senha</FormLabel>
              <FormControl>
                <Input placeholder="Repita a senha" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {success ? (
          <p className="text-sm text-emerald-600">{success}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Criar conta
        </Button>
      </form>
    </Form>
  )
}
