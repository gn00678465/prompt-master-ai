import { useCallback } from 'react'
import { FetchError } from '@/utils/error'

export function useFetch() {
  const $fetch = useCallback(async <TData = any, TError = unknown>(url: string, init?: RequestInit) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/${url}`.replace(/(?<!:)\/{2,}/g, '/')
    const res = await fetch(apiUrl, init)
    if (!res.ok) {
      const errorData = await res.json()
      // 建立一個自訂錯誤物件，包含 API 回應的詳細資訊
      const error = new FetchError(
        'FetchFailed',
        res.status,
        res.statusText,
        res,
        errorData,
      ) as FetchError<TError>
      return Promise.reject(error)
    }
    return await (await res.json() as TData)
  }, [])

  return { $fetch }
}
