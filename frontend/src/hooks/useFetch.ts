import type { FetchOptions, FetchRequest } from 'ofetch'
import { useCallback } from 'react'
import { api } from '@/utils'
import { FetchError } from '@/utils/error'

export function useFetch() {
  const $fetch = useCallback(async <TData = any>(url: FetchRequest, options?: FetchOptions<'json', TData>) => {
    return await api<TData, 'json'>(url, options)
  }, [])

  return { $fetch }
}
