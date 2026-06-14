import { useEffect, useState } from "react"

import { getListById } from "@/services/listsService"
import type { GiftList } from "@/types/list"

export function useList(id?: string | null) {
  const [data, setData] = useState<GiftList | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadList = async () => {
      if (!id) {
        setData(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const list = await getListById(id)
        if (!active) return
        setData(list)
        setError(list ? null : "Lista nao encontrada.")
      } catch {
        if (!active) return
        setError("Nao foi possivel carregar esta lista.")
      } finally {
        if (!active) return
        setIsLoading(false)
      }
    }

    void loadList()

    return () => {
      active = false
    }
  }, [id])

  return { data, isLoading, error }
}
