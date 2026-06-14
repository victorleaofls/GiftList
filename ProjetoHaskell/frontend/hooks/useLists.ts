import { useEffect, useState } from "react"

import { getPublicLists } from "@/services/listsService"
import { getApiErrorMessage } from "@/lib/errors"
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

    const loadLists = async () => {
      setIsLoading(true)

      try {
        const lists = await getPublicLists(query)
        if (!active) return
        setData(lists.map(toSummary))
        setError(null)
      } catch (err) {
        if (!active) return
        setError(getApiErrorMessage(err))
      } finally {
        if (!active) return
        setIsLoading(false)
      }
    }

    void loadLists()

    return () => {
      active = false
    }
  }, [query])

  return { data, isLoading, error }
}
