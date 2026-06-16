const API_BASE_URL = "https://giftlist-qvac.onrender.com"

const TOKEN_KEY = "giftlist_token"

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

class ApiError extends Error {
  status: number
  body?: string

  constructor(message: string, status: number, body?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

const normalizeBearer = (token: string) =>
  token.startsWith("Bearer ") ? token : `Bearer ${token}`

export const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, normalizeBearer(token))
}

export const clearAuthToken = () => {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

const parseJsonSafely = (text: string) => {
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers ?? {})

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  const data = parseJsonSafely(text) as T | undefined

  if (!response.ok) {
    const message =
      (typeof data === "object" && data && "message" in data
        ? String((data as { message?: string }).message)
        : text) || "Erro inesperado ao chamar a API."
    throw new ApiError(message, response.status, text)
  }

  return (data ?? (undefined as T))
}

export function buildAuthHeaders(): HeadersInit | undefined {
  const token = getAuthToken()
  if (!token) return undefined
  return { Authorization: normalizeBearer(token) }
}

export type { ApiError }
