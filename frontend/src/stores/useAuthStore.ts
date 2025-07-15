import type { AuthResponse } from '@/types/auth'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createJSONStorage, persist } from 'zustand/middleware'

interface State {
  data: AuthResponse | null
  isHydrated: boolean
}

interface Action {
  updateAuthData: (data: AuthResponse) => void
  resetAuthData: () => void
  setHydrated: () => void
}

export const useAuthStore = create(persist(
  devtools<State & Action>(
    set => ({
      data: null,
      isHydrated: false,
      updateAuthData: data => set(() => ({ data })),
      resetAuthData: () => set(() => ({ data: null })),
      setHydrated: () => set(() => ({ isHydrated: true })),
    }),
    {
        name: 'auth-store',
      }
  ),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => sessionStorage),
    partialize: state => ({ data: state.data }),
    onRehydrateStorage: () => (state) => {
      state?.setHydrated()
    },
  },
),
)
