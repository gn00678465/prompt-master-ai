import type { TemplateEntry } from '@/types/template'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { api } from '@/utils'
import { useAuthStore } from './useAuthStore'

interface State {
  templates: TemplateEntry[]
}

interface Action {
  fetch: () => Promise<void>
  update: (templates: TemplateEntry[]) => void
  push: (template: TemplateEntry) => void
  insert: (template: TemplateEntry, index: number) => void
  replace: (template: TemplateEntry, index: number) => void
  delete: (index: number) => void
}

export const useTemplateStore = create(devtools<State & Action>(
  (set) => {
    const auth = useAuthStore.getState().data

    return {
      templates: [],
      update: (templates: TemplateEntry[]) => set({ templates }),
      push: (template: TemplateEntry) => set(state => ({ templates: [...state.templates, template] })),
      insert: (template: TemplateEntry, index: number) => set((state) => {
        const templates = [...state.templates]
        templates.splice(index, 0, template)
        return { templates }
      }),
      replace: (template: TemplateEntry, index: number) => set((state) => {
        const templates = [...state.templates]
        templates.splice(index, 1, template)
        return { templates }
      }),
      delete: (index: number) => (
        set((state) => {
          const templates = [...state.templates]
          templates.splice(index, 1)
          return { templates }
        })
      ),
      fetch: async () => {
        if (!auth?.access_token) {
          throw new Error('No access token found')
        }
        const response = await api<TemplateEntry[]>('/api/v1/templates/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth?.access_token}`,
          },
        })
        set({ templates: response })
      },
    }
  },
))
