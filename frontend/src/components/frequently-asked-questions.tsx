import { ChevronDown, ChevronRight } from 'lucide-react'
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
            <AccordionTrigger className="text-emerald-600 font-medium">
              <div className="flex items-center">
                <ChevronDown className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                1. 如何使用 Better Prompt?
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
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
            <AccordionTrigger className="text-emerald-600 font-medium">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                2. 如何選擇合適的 AI 模型?
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
              <p>選擇適合您需求的 AI 模型取決於您的具體使用場景和需求。Gemini 2.5 Pro 提供了最佳的性能和功能平衡。</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-emerald-600 font-medium">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                3. 如何選擇優化模板?
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
              <p>不同的模板適用於不同類型的提示優化需求，您可以根據您的具體使用場景選擇最合適的模板。</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-emerald-600 font-medium">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                4. "溫度"參數是什麼意思，如何設置?
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
              <p>
                溫度參數控制 AI
                生成內容的創造性和隨機性。較低的溫度值會產生更確定和一致的回答，而較高的溫度值會產生更多樣化和創造性的回答。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-emerald-600 font-medium">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                5. 為什麼我的 API 密鑰無法保存或提示無效?
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
              <p>
                請確保您輸入的 API 密鑰格式正確，並且您的帳戶有足夠的配額。如果問題持續存在，請嘗試重新生成一個新的 API
                密鑰。
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-emerald-600 font-medium">
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-emerald-600 mr-2 shrink-0" />
                6. 優化失敗或返回錯誤信息怎麼辦?
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-7">
              <p>
                如果優化過程中遇到錯誤，請檢查您的網絡連接和 API
                密鑰是否有效。您也可以嘗試減少提示詞的長度或調整溫度參數。
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
