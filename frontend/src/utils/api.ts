import type { AuthResponse } from '@/types/auth'
import Cookies from 'js-cookie'
import { ofetch } from 'ofetch'
import { useAuthStore } from '@/stores/useAuthStore'
import { getEnv } from '@/utils/env'
import { decode } from '../utils'

export const api = ofetch.create({
  baseURL: getEnv('API_URL'),
  onRequest({ options }) {
    const authCookie = Cookies.get('auth')
    if (authCookie) {
      const decodedAuth: AuthResponse = decode(authCookie)
      options.headers.set('Authorization', `Bearer ${decodedAuth.access_token}`)
    }
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      useAuthStore.getState().resetAuthData()
    }
  },
})
