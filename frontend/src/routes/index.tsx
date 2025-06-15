import type { ModelEntries } from '@/types/model'
import type { TemplateEntries } from '@/types/template'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, Lightbulb, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FrequentlyAskedQuestions } from '@/components/frequently-asked-questions'
import { PromptOptimizer } from '@/components/prompt-optimizer'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/useAuthStore'
import { useFetch } from '@/hooks/useFetch'

function PromptMasterAI() {
  const [templates, setTemplates] = useState<TemplateEntries>([])
  const [models, setModels] = useState<ModelEntries>([])
  const auth = useAuthStore(state => state.data)
  const isHydrated = useAuthStore(state => state.isHydrated)
  const { $fetch } = useFetch()

  useEffect(() => {
    // 只有在 Zustand 完成 hydration 且有 access_token 時才發送請求
    if (!isHydrated || !auth?.access_token) {
      return
    }

    Promise.allSettled([
      $fetch<TemplateEntries>('/api/v1/templates/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      }),
      $fetch<ModelEntries>('/api/v1/models/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      }),
    ]).then(([templates, models]) => {
      // 處理 templates 資料
      if (templates.status === 'fulfilled') {
        setTemplates(templates.value)
      }

      // 處理 models 資料
      if (models.status === 'fulfilled') {
        setModels(models.value)
      }
    })
  }, [auth, isHydrated, $fetch])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          asChild={true}
        >
          <Link to="/history">
            <Clock className="h-4 w-4" />
            歷史記錄
          </Link>
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
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
        <PromptOptimizer templates={templates} models={models} />

        {/* 常見問題區塊 */}
        <FrequentlyAskedQuestions />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: PromptMasterAI,
})
