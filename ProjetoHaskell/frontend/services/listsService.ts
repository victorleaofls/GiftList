import type { GiftList } from "@/types/list"
import { apiRequest, buildAuthHeaders } from "@/lib/api"

type GiftItemInput = {
  name: string
  image?: string | null
  price: number
}

type GiftListInput = {
  name: string
  desc: string
  date?: string | null
  pixEligible?: boolean
  items: GiftItemInput[]
}

type ContributionResponse = {
  id: number
  paymentLink: string
  qrCode: string
  amount: number
}

export type ContributionListResponse = {
  id: number
  nomeCompleto: string
  image: string
  itemName: string
  amount: number
  date: string
}

const toPayload = (payload: GiftList): GiftListInput => ({
  name: payload.name,
  desc: payload.desc,
  date: payload.date && payload.date.length ? payload.date : null,
  pixEligible: payload.pixEligible ?? true,
  items: payload.items.map((item) => ({
    name: item.name,
    image: item.image ?? null,
    price: item.price,
  })),
})

export async function getPublicLists(query?: string): Promise<GiftList[]> {
  const suffix = query ? `?query=${encodeURIComponent(query)}` : ""
  return apiRequest<GiftList[]>(`/listas${suffix}`)
}

export async function getMyLists(): Promise<GiftList[]> {
  return apiRequest<GiftList[]>("/listas/minhas", {
    headers: buildAuthHeaders(),
  })
}

export async function getListById(id: string): Promise<GiftList | null> {
  try {
    return await apiRequest<GiftList>(`/listas/${id}`)
  } catch {
    return null
  }
}

export async function createList(payload: GiftList): Promise<GiftList> {
  return apiRequest<GiftList>("/listas", {
    method: "POST",
    headers: buildAuthHeaders(),
    body: toPayload(payload),
  })
}

export async function updateList(payload: GiftList): Promise<GiftList> {
  return apiRequest<GiftList>(`/listas/${payload.id}`, {
    method: "PUT",
    headers: buildAuthHeaders(),
    body: toPayload(payload),
  })
}

export async function deleteList(id: string): Promise<void> {
  await apiRequest<void>(`/listas/${id}`, {
    method: "DELETE",
    headers: buildAuthHeaders(),
  })
}

export async function contributeToItem(
  listId: string,
  itemId: string,
  amount: number
): Promise<ContributionResponse> {
  return apiRequest<ContributionResponse>(`/listas/${listId}/itens/${itemId}/contribuir`, {
    method: "POST",
    headers: buildAuthHeaders(),
    body: { amount },
  })
}

export async function getContributions(listId: string): Promise<ContributionListResponse[]> {
  return apiRequest<ContributionListResponse[]>(`/listas/${listId}/contribuicoes`, {
    headers: buildAuthHeaders(),
  })
}
