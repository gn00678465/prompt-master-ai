// app/routes/__root.tsx
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/stores/useAuthStore'
import appCss from '@/styles/app.css?url'
import { meOptions, seo } from '@/utils'

export interface RouterContext {
  queryClient: QueryClient
  useAuthStore?: typeof useAuthStore
  env: {
    API_URL: string
  }
}

export const Route = createRootRouteWithContext<RouterContext>()({
  context: () => {
    return {
      useAuthStore,
    }
  },
  async beforeLoad({ context, location }) {
    const updateAuthData = context.useAuthStore?.getState().updateAuthData
    const auth = context.useAuthStore?.getState().data

    const authRequired = ['/history', '/templates']

    if (!auth && authRequired.some(path => location.pathname.startsWith(path))) {
      // If the user is not authenticated and tries to access a protected route, redirect to home
      throw redirect({ to: '/' })
    }

    if (auth) {
      context.queryClient.ensureQueryData(meOptions)
        .then((data) => {
          updateAuthData?.(data)
        })
        .catch(() => {
          if (authRequired.some(path => location.pathname.startsWith(path))) {
            throw redirect({ to: '/' })
          }
        })
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'Prompt Master',
        description: '一鍵優化您的提示詞，釋放 AI 模型潛能，支援各種模板與模型，請先設置 Gemini API Key 開始使用。',
      }),
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <TanStackRouterDevtools initialIsOpen={false} />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
