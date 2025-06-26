import { PlusIcon } from 'lucide-react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FrequentlyAskedQuestions() {
  const [expandedFaq, setExpandedFaq] = useState('item-1')

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl text-emerald-600">常見問題解答 (FAQ)</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible value={expandedFaq} onValueChange={setExpandedFaq}>
          <AccordionItem value="item-1">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="text-emerald-600 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <div className="flex items-center">
                  1. 如何使用 Prompt Master?
                </div>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pl-4">
              <p className="mb-4">非常簡單！</p>
              <ol className="list-decimal pl-5 space-y-4">
                <li>
                  首先，您需要一個 Google Gemini API 密鑰，您可以訪問
                  {' '}
                  <a href="#" className="text-emerald-600 hover:underline">
                    Google AI Studio
                  </a>
                  {' '}
                  獲取。
                </li>
                <li>
                  獲取密鑰後，在頁面頂部的"優化設置"區域找到"API 密鑰"部分，將您的密鑰粘貼到輸入框中，然後點擊"儲存"。
                </li>
                <li>
                  之後，在"原始提示詞"文本框中輸入您想要優化的內容，選擇合適的模型、模板和溫度，然後點擊"優化提示詞"按鈕即可！
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="text-emerald-600 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <div className="flex items-center">
                  2. 如何選擇合適的 AI 模型?
                </div>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pl-4">
              <p className="mb-4">選擇適合您需求的 AI 模型取決於您的具體使用場景和需求。以下是三個主要模型的詳細比較：</p>

              <div className="space-y-4">
                <div className="p-4 space-y-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-700">🚀 Gemini 2.5 Pro</h4>
                  <p className="text-sm text-gray-700">
                    <strong>最強大的思考模型，回覆準確率和效能皆極為優異</strong>
                  </p>
                </div>

                <div className="p-4 space-y-2 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-700">⚡ Gemini 2.5 Flash</h4>
                  <p className="text-sm text-gray-700">
                    <strong>價格與效能兼具的最佳型號，提供全面的功能</strong>
                  </p>
                </div>

                <div className="p-4 space-y-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-700">💰 Gemini 2.5 Flash-Lite</h4>
                  <p className="text-sm text-gray-700">
                    <strong>經過最佳化調整，延遲時間短且成本效益高</strong>
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>
                    <strong>💡 選擇建議：</strong>
                  </li>
                  <li>
                    複雜分析和推理任務 → 選擇
                    {' '}
                    <strong>2.5 Pro</strong>
                  </li>
                  <li>
                    一般用途和成本考量 → 選擇
                    {' '}
                    <strong>2.5 Flash</strong>
                  </li>
                  <li>
                    高頻率簡單任務 → 選擇
                    {' '}
                    <strong>2.5 Flash-Lite</strong>
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="text-emerald-600 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <div className="flex items-center">
                  3. 如何選擇優化模板?
                </div>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pl-4">
              <p>不同的模板適用於不同類型的提示優化需求，您可以根據您的具體使用場景選擇最合適的模板。</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="text-emerald-600 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <div className="flex items-center">
                  4. "溫度"參數是什麼意思，如何設置?
                </div>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pl-4">
              <p>
                溫度參數控制 AI
                生成內容的創造性和隨機性。較低的溫度值會產生更確定和一致的回答，而較高的溫度值會產生更多樣化和創造性的回答。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="text-emerald-600 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <div className="flex items-center">
                  5. 為什麼我的 API 密鑰無法保存或提示無效?
                </div>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pl-4">
              <p>
                請確保您輸入的 API 密鑰格式正確，並且您的帳戶有足夠的配額。如果問題持續存在，請嘗試重新生成一個新的 API
                密鑰。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="text-emerald-600 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <div className="flex items-center">
                  6. 優化失敗或返回錯誤信息怎麼辦?
                </div>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pl-4">
              <p>
                如果優化過程中遇到錯誤，請檢查您的網絡連接和 API
                密鑰是否有效。您也可以嘗試減少提示詞的長度或調整溫度參數。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="text-emerald-600 focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-2 text-left text-sm text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
                <div className="flex items-center">
                  7. 如何撰寫恰當的提示詞模板?
                </div>
                <PlusIcon
                  size={16}
                  className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pl-4">
              <p className="mb-4">撰寫優秀的提示詞模板需要考慮四個核心要素：</p>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">🎭 角色 (Persona)</h4>
                  <p className="text-sm text-gray-700">明確定義 AI 應該扮演的角色和回應方式，例如："你是一位專業的技術文檔撰寫專家"</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">📋 任務 (Task)</h4>
                  <p className="text-sm text-gray-700">清楚說明你希望 AI 執行什麼任務或建立什麼內容，越具體越好</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">🔍 上下文 (Context)</h4>
                  <p className="text-sm text-gray-700">提供盡可能多的背景資訊，包括目標受眾、使用場景、相關限制等</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <h4 className="font-semibold text-emerald-700 mb-2">📝 格式 (Format)</h4>
                  <p className="text-sm text-gray-700">明確指定期望的輸出結構和格式，如條列式、表格、步驟說明等</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                💡 提示：您不需要使用全部四個要素，但結合使用幾個會顯著提升結果品質。
              </p>
              <p className="mt-3 text-sm text-gray-600">
                📚 更多詳細指南請參考：
                {' '}
                <a
                  href="https://support.google.com/gemini/answer/15235603"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  Google Gemini 官方建立自訂 Gems 指南
                </a>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
