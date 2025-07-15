import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { get, set, del, createStore, clear } from 'idb-keyval'
import { decryptText, encryptText } from '@/utils/crypto'
import { devtools } from 'zustand/middleware'

const apiKeyStore = createStore('ApiKeyDatabase', 'ApiKey')

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name, apiKeyStore)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value, apiKeyStore)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name, apiKeyStore)
  },
}

const encryptStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const res = (await get(name, apiKeyStore)) || null
    if (res) {
      try {
        return (await decryptText(res)) || null
      } catch (error) {
        console.error('解密失敗:', error)
        clear(apiKeyStore)
        return null
      }
    }
    // 若 res 為 null，則直接回傳 null
    return null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, await encryptText(value), apiKeyStore)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name, apiKeyStore)
  },
}

interface State {
  apiKey: string | undefined
}

interface Action {
  set: (apiKey: string) => void
  clear: () => void
}

export const useAPIKeyStore = create(
  persist(
    devtools<State & Action>(
      (set) => ({
        apiKey: undefined,
        set: (apiKey: string) => set({ apiKey: apiKey }),
        clear: () => { clear(apiKeyStore) },
      }),
      {
        name: 'api-key-store',
      }
    ),
    {
      name: 'api-key', // unique name
      storage: createJSONStorage(() => encryptStorage),
    },
  )
)