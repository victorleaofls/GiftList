import { useEffect, useState } from "react"

import { getMyLists } from "@/services/listsService"
import { getApiErrorMessage } from "@/lib/errors"
import type { GiftList } from "@/types/list"

export type MyListSummary = {
  id: string
  name: string
  desc: string
  createdAt: string
  itemsCount: number
  raised: number
  total: number
}

const toSummary = (list: GiftList): MyListSummary => {
  const total = list.items.reduce((sum, item) => sum + item.price, 0)
  const raised = list.items.reduce((sum, item) => sum + item.raised, 0)

  return {
    id: list.id,
    name: list.name,
    desc: list.desc,
    createdAt: list.createdAt ?? "",
    itemsCount: list.items.length,
    raised,
    total,
  }
}

export function useMyLists() {
  const [data, setData] = useState<MyListSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadLists = async () => {
      setIsLoading(true)

      try {
        const lists = await getMyLists()
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
  }, [])

  return { data, isLoading, error }
}
