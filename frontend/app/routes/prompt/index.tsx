import { createFileRoute } from '@tanstack/react-router'
import { Clock, Lightbulb, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { FrequentlyAskedQuestions } from '@/components/frequently-asked-questions'
import { PromptOptimizer } from '@/components/prompt-optimizer'
import { Button } from '@/components/ui/button'

// 預設模板資料
export const defaultTemplates = [
  { id: 1, name: '預設模板', description: '通用優化模板', isDefault: true, category: 'general' },
  { id: 2, name: '普通模板', description: '基本優化模板', isDefault: true, category: 'general' },
  { id: 3, name: '擴展模板', description: '詳細優化模板', isDefault: true, category: 'general' },
  { id: 4, name: '內容創作模板', description: '適用於文章、故事等創作', isDefault: true, category: 'content' },
  { id: 5, name: '程式碼生成模板', description: '適用於程式碼生成', isDefault: true, category: 'code' },
]

function PromptMasterAI() {
  const [templates] = useState(defaultTemplates)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          <Clock className="h-4 w-4" />
          歷史記錄
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          <User className="h-4 w-4" />
          登入/註冊
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
        >
          <Settings className="h-4 w-4" />
          模板管理
        </Button>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-600 flex items-center justify-center gap-2">
          <Lightbulb className="h-6 w-6" /> Better Prompt - Prompt 優化神器
        </h1>
        <p className="text-muted-foreground mt-2">
          一鍵優化您的提示詞，釋放 AI 模型潛能，支援各種模板與模型，請先設置 Gemini API Key 開始使用。
        </p>
      </div>

      <div className="space-y-8">
        {/* 優化工具區塊 */}
        <PromptOptimizer templates={templates} />

        {/* 常見問題區塊 */}
        <FrequentlyAskedQuestions />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/prompt/')({
  component: PromptMasterAI,
})
