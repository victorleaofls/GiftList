import type { ApiError } from "./api"

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message
  }
  return "Erro inesperado. Tente novamente."
}

export function getApiErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "status" in err) {
    const apiErr = err as ApiError
    switch (apiErr.status) {
      case 400:
        return apiErr.message || "Dados invalidos. Verifique os campos."
      case 401:
        return "Sessao expirada. Faca login novamente."
      case 403:
        return "Acesso negado."
      case 404:
        return "Recurso nao encontrado."
      case 409:
        return apiErr.message || "Conflito. Este recurso ja existe."
      case 500:
        return "Erro no servidor. Tente novamente mais tarde."
      default:
        return apiErr.message || "Erro inesperado."
    }
  }
  return getErrorMessage(err)
}
