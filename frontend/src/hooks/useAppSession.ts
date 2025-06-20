import type { AuthResponse } from '@/types/auth'
import { useSession } from '@tanstack/react-start/server'

export function useAppSession() {
  return useSession<AuthResponse>({
    password: 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
  })
}
