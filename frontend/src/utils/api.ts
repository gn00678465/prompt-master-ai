import { ofetch } from 'ofetch'
import { useAuthStore } from '@/stores/useAuthStore'

export const api = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  onRequest({ options }) {
    const auth = useAuthStore.getState().data
    if (auth?.access_token) {
      options.headers.set('Authorization', `Bearer ${auth.access_token}`)
    }
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      useAuthStore.getState().resetAuthData()
    }
  },
})
