import type { ModelEntries } from '@/types/model'
import type { OptimizePayload, OptimizeResponse } from '@/types/optimize'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, Lightbulb, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FrequentlyAskedQuestions } from '@/components/frequently-asked-questions'
import { PromptOptimizer } from '@/components/prompt-optimizer'
import { Button } from '@/components/ui/button'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTemplateStore } from '@/stores/useTemplateStore'

function PromptMasterAI() {
  const [models, setModels] = useState<ModelEntries>([])
  const auth = useAuthStore(state => state.data)
  const isHydrated = useAuthStore(state => state.isHydrated)
  const { $fetch } = useFetch()
  const fetchTemplates = useTemplateStore(state => state.fetch)
  const templates = useTemplateStore(state => state.templates)

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

  useEffect(() => {
    // 只有在 Zustand 完成 hydration 且有 access_token 時才發送請求
    if (!isHydrated || !auth?.access_token) {
      return
    }

    Promise.allSettled([
      fetchTemplates(),
      $fetch<ModelEntries>('/api/v1/models/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      }),
    ]).then(([_, models]) => {
      // 處理 models 資料
      if (models.status === 'fulfilled') {
        setModels(models.value)
      }
    })
  }, [auth, isHydrated, $fetch])

  function onSubmit(data: OptimizePayload & {
    apiKey: string
  }) {
    const { apiKey, ...other } = data
    optimizeMutation.mutate(other)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          asChild={true}
        >
          <Link to="/history">
            <Clock className="h-4 w-4" />
            歷史記錄
          </Link>
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          asChild={true}
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
          Better Prompt - Prompt 優化神器
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
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: PromptMasterAI,
})
