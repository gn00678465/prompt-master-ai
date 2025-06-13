import type { AuthResponse } from '@/types/auth'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface State {
  data: AuthResponse | null
}

interface Action {
  updateAuthData: (data: AuthResponse) => void
  resetAuthData: () => void
}

export const useAuthStore = create(devtools<State & Action>(set => ({
  data: null,
  updateAuthData: data => set(() => ({ data })),
  resetAuthData: () => set(() => ({ data: null })),
})))
