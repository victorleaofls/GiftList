import { useEffect, useState } from "react"

import { getPublicLists } from "@/services/listsService"
import type { GiftList } from "@/types/list"

export type PublicListSummary = {
  id: string
  name: string
  owner: string
  desc: string
  itemsCount: number
  pixEligible: boolean
}

const toSummary = (list: GiftList): PublicListSummary => ({
  id: list.id,
  name: list.name,
  owner: list.owner,
  desc: list.desc,
  itemsCount: list.items.length,
  pixEligible: list.pixEligible ?? false,
})

export function useLists(query: string) {
  const [data, setData] = useState<PublicListSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)

    getPublicLists(query)
      .then((lists) => {
        if (!active) return
        setData(lists.map(toSummary))
        setError(null)
      })
      .catch(() => {
        if (!active) return
        setError("Nao foi possivel carregar as listas.")
      })
      .finally(() => {
        if (!active) return
        setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [query])

  return { data, isLoading, error }
}
