const DEFAULT_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

const TOKEN_STORAGE_KEY = "giftlist.authToken"

let cachedToken: string | null = null

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

const isBodyInit = (body: unknown): body is BodyInit =>
  typeof body === "string" ||
  body instanceof Blob ||
  body instanceof ArrayBuffer ||
  body instanceof FormData ||
  body instanceof URLSearchParams

const getBaseUrl = () => DEFAULT_API_BASE_URL.replace(/\/+$/, "")

const buildUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${getBaseUrl()}${normalized}`
}

const readStoredToken = (): string | null => {
  if (cachedToken) return cachedToken
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem(TOKEN_STORAGE_KEY)
  if (stored) {
    cachedToken = stored
  }
  return stored
}

const formatAuthToken = (token: string) =>
  token.startsWith("Bearer ") ? token : `Bearer ${token}`

export const setAuthToken = (token: string | null): void => {
  cachedToken = token
  if (typeof window === "undefined") return
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

export const buildAuthHeaders = (): HeadersInit => {
  const token = readStoredToken()
  return token ? { Authorization: formatAuthToken(token) } : {}
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, headers, ...init } = options
  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json")
  }

  let resolvedBody: BodyInit | undefined
  if (body !== undefined) {
    if (isBodyInit(body)) {
      resolvedBody = body
    } else {
      if (!requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json")
      }
      resolvedBody = JSON.stringify(body)
    }
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers: requestHeaders,
    body: resolvedBody,
  })

  const contentType = response.headers.get("content-type") ?? ""
  const hasJson = contentType.includes("application/json")

  let payload: unknown = null
  if (response.status !== 204) {
    payload = hasJson ? await response.json() : await response.text()
  }

  if (!response.ok) {
    const message =
      typeof payload === "string" && payload.trim()
        ? payload
        : response.statusText || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload as T
}
