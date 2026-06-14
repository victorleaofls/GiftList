import type { AuthUser, LoginPayload, RegisterPayload } from "@/types/auth"
import { apiRequest, buildAuthHeaders, setAuthToken } from "@/lib/api"

type LoginResponse = {
  token: string
}

type CadastroResponse = {
  usuarioId: number
}

type UsuarioResponse = {
  usuarioId: number
  usuarioNome: string
}

const USER_KEY = "giftlist_user"

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

const setStoredUser = (user: AuthUser) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const decodeJwtSub = (token: string): number | null => {
  const raw = token.startsWith("Bearer ") ? token.slice(7) : token
  const parts = raw.split(".")
  if (parts.length < 2) return null

  const payload = parts[1]
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")

  try {
    const json =
      typeof window !== "undefined"
        ? window.atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8")
    const data = JSON.parse(json) as { sub?: string }
    if (!data.sub) return null
    const parsed = Number(data.sub)
    return Number.isNaN(parsed) ? null : parsed
  } catch {
    return null
  }
}

async function fetchUsuario(userId: number): Promise<UsuarioResponse> {
  return apiRequest<UsuarioResponse>(`/usuario/${userId}`, {
    method: "GET",
    headers: buildAuthHeaders(),
  })
}

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const response = await apiRequest<LoginResponse>("/login", {
    method: "POST",
    body: { email: payload.email, senha: payload.password },
  })

  setAuthToken(response.token)

  const userId = decodeJwtSub(response.token)
  if (!userId) {
    throw new Error("Nao foi possivel ler o usuario do token.")
  }

  const usuario = await fetchUsuario(userId)

  let userName = usuario.usuarioNome
  if (!userName || userName.trim().length === 0) {
    userName = payload.email.split("@")[0]
  }

  const user = {
    id: usuario.usuarioId,
    name: userName,
    email: payload.email,
  }

  setStoredUser(user)
  return user
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const nomeCompleto = `${payload.firstName} ${payload.lastName}`.trim()

  const response = await apiRequest<CadastroResponse>("/cadastro", {
    method: "POST",
    body: {
      nomeCompleto,
      email: payload.email,
      senha: payload.password,
      confirmarSenha: payload.confirmPassword,
    },
  })

  const user = {
    id: response.usuarioId,
    name: nomeCompleto,
    email: payload.email,
  }

  setStoredUser(user)

  try {
    await login({ email: payload.email, password: payload.password })
  } catch {
    // silencioso - usuario pode logar manualmente depois
  }

  return user
}
