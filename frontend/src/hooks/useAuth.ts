import type { AuthResponse } from '@/types/auth'
import * as jose from 'jose'
import { useCallback, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { decode, encode } from '@/utils'
import useCookie from './useCookie'

const defaultCookieOptions = {
  sameSite: 'strict',
  secure: true,
} satisfies Cookies.CookieAttributes

/**
 * 使用認證 Cookie 的狀態和操作函數
 * @returns [auth, setAuth, clearAuth]
 */
export function useAuth() {
  const [cookie, setCookie, deleteCookie] = useCookie('auth')
  const setAuthStore = useAuthStore(state => state.updateAuthData)
  const clearAuthStore = useAuthStore(state => state.resetAuthData)

  const auth = useMemo(() => {
    if (!cookie) {
      return null
    }
    try {
      const decodedAuth = decode<AuthResponse>(cookie)
      const token = jose.decodeJwt(decodedAuth.access_token)
      if (token.exp && token.exp * 1000 > Date.now()) {
        return decodedAuth
      }
      return null // Token expired
    }
    catch (error) {
      console.error('Failed to decode auth cookie:', error)
      return null // Invalid cookie
    }
  }, [cookie])

  useEffect(() => {
    if (auth) {
      setAuthStore(auth)
    }
    else {
      clearAuthStore()
      // If auth is null but a cookie exists, it means the cookie is invalid or expired.
      // We should remove it.
      if (cookie) {
        deleteCookie()
      }
    }
  }, [auth, cookie, setAuthStore, clearAuthStore, deleteCookie])

  const handleSetAuth = useCallback((newAuth: AuthResponse) => {
    const token = jose.decodeJwt(newAuth.access_token)

    if (newAuth && token.exp) {
      const data = encode(newAuth)
      // Set cookie, which is the source of truth.
      // The useMemo and useEffect will handle the state update.
      setCookie(data, {
        expires: new Date(token.exp * 1000),
        ...defaultCookieOptions,
      })
      // We can also update the zustand store immediately for responsiveness.
      setAuthStore(newAuth)
    }
  }, [setCookie, setAuthStore])

  const clearAuth = useCallback(() => {
    // Delete cookie, which is the source of truth.
    deleteCookie()
    // We can also clear the zustand store immediately.
    clearAuthStore()
  }, [deleteCookie, clearAuthStore])

  return [
    auth,
    handleSetAuth,
    clearAuth,
  ] as [
    AuthResponse | null,
    (auth: AuthResponse) => void,
    () => void,
  ]
}
