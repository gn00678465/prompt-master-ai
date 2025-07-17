import type { AuthResponse } from '@/types/auth'
import type { ModelEntries } from '@/types/model'
import type { TemplateEntries } from '@/types/template'
import { queryOptions } from '@tanstack/react-query'
import { api } from '@/utils'

export const modelOptions = queryOptions<ModelEntries>({
  queryKey: ['models'],
  queryFn: () => api('/api/v1/models/models', {
    method: 'GET',
  }),
  staleTime: 300000, // 5 minutes
})

export const meOptions = queryOptions<AuthResponse>({
  queryKey: ['auth', 'me'],
  queryFn: async () => {
    const response = await api('/api/v1/auth/me')
    return response
  },
  staleTime: 0, // No caching, always fetch fresh data
})

export const templateOptions = queryOptions<TemplateEntries>({
  queryKey: ['templates'],
  queryFn: () => api('/api/v1/templates/', {
    method: 'GET',
  }),
  staleTime: 300000, // 5 minutes
})
