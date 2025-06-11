import { ArrowLeftIcon, Calendar, Clock, Copy, Lightbulb, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// 模擬歷史記錄資料
const mockHistoryData = [
  {
    history_id: 1,
    original_prompt: '寫一篇關於人工智慧的文章',
    optimized_prompt:
      '請撰寫一篇深入探討人工智慧技術發展、應用領域及未來趨勢的專業文章，文章應包含：1. AI技術的核心概念與發展歷程 2. 當前主要應用領域的具體案例 3. 對社會經濟的影響分析 4. 未來發展趨勢預測。文章長度約1500-2000字，語調專業但易懂，目標讀者為對科技有興趣的一般大眾。',
    template_used: {
      template_id: 4,
      name: '內容創作模板',
    },
    model_used: 'gemini-2.5-pro',
    temperature: 0.7,
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    history_id: 2,
    original_prompt: '幫我寫一個Python函數來排序列表',
    optimized_prompt:
      '請使用Python編寫一個高效的列表排序函數，具體要求如下：\n\n**技術規格：**\n- 語言：Python 3.8+\n- 實現多種排序算法選項（快速排序、合併排序、堆排序）\n- 支援自定義比較函數\n\n**功能需求：**\n- 函數名稱：advanced_sort\n- 參數：列表、排序算法選擇、比較函數（可選）\n- 返回：排序後的新列表（不修改原列表）\n\n**代碼要求：**\n- 包含完整的錯誤處理\n- 添加詳細的文檔字符串\n- 提供使用示例\n- 包含時間複雜度分析註釋',
    template_used: {
      template_id: 5,
      name: '程式碼生成模板',
    },
    model_used: 'gemini-1.5-pro',
    temperature: 0.3,
    created_at: '2024-01-14T15:45:00Z',
  },
  {
    history_id: 3,
    original_prompt: '如何提高團隊工作效率',
    optimized_prompt:
      '請提供一套全面的團隊工作效率提升解決方案，包含以下結構化分析：\n\n**問題分析：**\n- 識別影響團隊效率的主要因素\n- 分析當前工作流程中的瓶頸\n- 評估團隊協作現狀\n\n**解決方案：**\n1. 短期改進措施（1-3個月內可實施）\n2. 中期優化策略（3-6個月）\n3. 長期發展規劃（6個月以上）\n\n**實施建議：**\n- 具體的執行步驟和時間表\n- 所需資源和工具推薦\n- 成效評估指標和方法\n- 可能遇到的挑戰及應對策略\n\n請提供可操作性強的建議，適用於10-50人的中小型團隊。',
    template_used: {
      template_id: 6,
      name: '問題解決模板',
    },
    model_used: 'gemini-2.5-pro',
    temperature: 0.5,
    created_at: '2024-01-13T09:20:00Z',
  },
]

function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModel, setSelectedModel] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // 過濾和排序歷史記錄
  const filteredHistory = mockHistoryData
    .filter((item) => {
      const matchesSearch
        = item.original_prompt.toLowerCase().includes(searchQuery.toLowerCase())
        || item.optimized_prompt.toLowerCase().includes(searchQuery.toLowerCase())
        || item.template_used.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesModel = selectedModel === 'all' || item.model_used === selectedModel
      const matchesTemplate = selectedTemplate === 'all' || item.template_used.name === selectedTemplate

      return matchesSearch && matchesModel && matchesTemplate
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
    })

  // 複製到剪貼板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // 這裡可以添加 toast 通知
  }

  // 重新使用提示詞
  const reusePrompt = (_item: any) => {
    // 這裡應該導航到優化頁面並預填充資料
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button className="group cursor-pointer" variant="ghost">
          <ArrowLeftIcon
            className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
            size={16}
            aria-hidden="true"
          />
          返回
        </Button>
        <h1 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          優化歷史記錄
        </h1>
        <div className="w-[70px]"></div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            我的優化記錄
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 搜尋和篩選區域 */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜尋提示詞內容..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="選擇模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有模型</SelectItem>
                    <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="選擇模板" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有模板</SelectItem>
                    <SelectItem value="內容創作模板">內容創作</SelectItem>
                    <SelectItem value="程式碼生成模板">程式碼生成</SelectItem>
                    <SelectItem value="問題解決模板">問題解決</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="排序" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">最新優先</SelectItem>
                    <SelectItem value="oldest">最舊優先</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 歷史記錄列表 */}
          <div className="space-y-4">
            {filteredHistory.length > 0
              ? (
                filteredHistory.map(item => (
                  <Card key={item.history_id} className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                            {item.template_used.name}
                          </Badge>
                          <Badge variant="secondary">{item.model_used}</Badge>
                          <span className="text-sm text-muted-foreground">
                            溫度:
                            {item.temperature}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="comparison" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="comparison">對比檢視</TabsTrigger>
                          <TabsTrigger value="optimized">優化結果</TabsTrigger>
                        </TabsList>

                        <TabsContent value="comparison" className="mt-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">原始提示詞</h4>
                              <div className="p-3 bg-gray-50 rounded-md text-sm">{item.original_prompt}</div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-2">優化後提示詞</h4>
                              <div className="p-3 bg-emerald-50 rounded-md text-sm max-h-32 overflow-y-auto">
                                {item.optimized_prompt}
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="optimized" className="mt-4">
                          <div className="p-3 bg-emerald-50 rounded-md text-sm">{item.optimized_prompt}</div>
                        </TabsContent>
                      </Tabs>

                      <div className="flex gap-2 mt-4 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(item.optimized_prompt)}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          複製
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => reusePrompt(item)}
                          className="flex items-center gap-1 text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                        >
                          <RotateCcw className="h-3 w-3" />
                          重新使用
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          刪除
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
              : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">沒有找到歷史記錄</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery || selectedModel !== 'all' || selectedTemplate !== 'all'
                      ? '嘗試調整搜尋條件或篩選器'
                      : '開始優化您的第一個提示詞吧！'}
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    開始優化
                  </Button>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute({
  component: HistoryPage,
})
