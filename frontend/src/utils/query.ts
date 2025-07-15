import type { ModelEntries } from '@/types/model'
import {  queryOptions } from '@tanstack/react-query'
import { api } from '@/utils'

export const modelOptions = queryOptions<ModelEntries>({
  queryKey: ['models'],
  queryFn: () => api('/api/v1/models/models', {
    method: 'GET',
  }),
  staleTime: 300000, // 5 minutes
})