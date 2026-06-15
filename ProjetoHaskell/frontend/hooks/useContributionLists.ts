import { useEffect, useState } from "react"

import { ContributionListResponse, getContributions } from "@/services/listsService"
import { getApiErrorMessage } from "@/lib/errors"
import type { GiftList } from "@/types/list"
import { RegistryFetchError } from "shadcn/registry"

export function useContributionLists(query: string) {
  const [data, setData] = useState<ContributionListResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const loadLists = async () => {
      setIsLoading(true)

      try {
        const response = await getContributions(query)
        if (!active) return
        setData(response)
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

  return { data, isLoading, error, refetch: () => void getContributions(query).then(setData).catch((err) => setError(getApiErrorMessage(err))) }
}
