import { useEffect, type MouseEventHandler } from 'react'
import type { ModelEntries } from '@/types/model'
import type { OptimizePayload, OptimizeResponse } from '@/types/optimize'
import type { TemplateEntries } from '@/types/template'
import { useMutation, queryOptions } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, Lightbulb, User } from 'lucide-react'
import { FrequentlyAskedQuestions } from '@/components/frequently-asked-questions'
import { PageLayout } from '@/components/page-layout'
import { PromptOptimizer } from '@/components/prompt-optimizer'
import { Button } from '@/components/ui/button'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTemplateStore } from '@/stores/useTemplateStore'
import { api, modelOptions } from '@/utils'

export const Route = createFileRoute('/')({
  component: PromptMasterAI,
  context: () => {
    return {
      useAuthStore,
    }
  },
  loader: async ({ context }) => {
    const auth = context.useAuthStore.getState().data

    const templateOptions = queryOptions<TemplateEntries>({
      queryKey: ['templates'],
      queryFn: () => api('/api/v1/templates/', {
        method: 'GET',
        headers: auth?.access_token ? {
          Authorization: `Bearer ${auth?.access_token}`,
        } : undefined
      }),
      staleTime: 300000, // 5 minutes
    })

    await Promise.all([
      context.queryClient.prefetchQuery(modelOptions),
      context.queryClient.prefetchQuery(templateOptions),
    ])

    return {
      models: context.queryClient.getQueryData(modelOptions.queryKey) || [],
      templates: context.queryClient.getQueryData(templateOptions.queryKey) || [],
    }
  },
})

function PromptMasterAI() {
  const { models, templates } = Route.useLoaderData()
  const auth = useAuthStore(state => state.data)
  const { $fetch } = useFetch()
  const setTemplates = useTemplateStore(state => state.update)

  useEffect(() => {
    setTemplates(templates)
  }, [models, templates])

  const optimizeMutation = useMutation({
    mutationKey: ['optimize'],
    mutationFn: (data: OptimizePayload) => {
      return $fetch<OptimizeResponse>('/api/v1/prompts/optimize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth?.access_token}`,
        },
        body: data,
      })
    },
  })

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => {
      return $fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${auth?.access_token}`,
        },
      })
    },
    onSuccess: () => {
      useAuthStore.getState().resetAuthData()
    },
  })

  const onLogout: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (auth?.access_token) {
      e.preventDefault()
      e.stopPropagation()
      logoutMutation.mutate()
    }
  }

  function onSubmit(data: OptimizePayload) {
    optimizeMutation.mutate(data)
  }

  return (
    <PageLayout>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          asChild={true}
        >
          {
            auth && (
              <Link to="/history">
                <Clock className="h-4 w-4" />
                歷史記錄
              </Link>
            )
          }
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          asChild={true}
          onClick={onLogout}
        >
          <Link to="/auth">
            <User className="h-4 w-4" />
            {auth?.access_token ? '登出' : '登入/註冊'}
          </Link>
        </Button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-2">
          <Lightbulb className="h-6 w-6" />
          {' '}
          Prompt Master - Prompt 優化工具
        </h1>
        <p className="text-muted-foreground mt-2">
          一鍵優化您的提示詞，釋放 AI 模型潛能，支援各種模板與模型，請先設置 Gemini API Key 開始使用。
        </p>
      </div>

      <div className="space-y-8">
        {/* 優化工具區塊 */}
        <PromptOptimizer templates={templates} models={models} isLoading={optimizeMutation.isPending} optimizedTemplate={optimizeMutation.data?.optimized_prompt} onSubmit={onSubmit} />

        {/* 常見問題區塊 */}
        <FrequentlyAskedQuestions />
      </div>
    </PageLayout>
  )
}
