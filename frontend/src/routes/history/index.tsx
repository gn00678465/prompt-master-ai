import type { OptimizedHistoryEntries, OptimizedHistoryResponse } from '@/types/history'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, Calendar, Clock, Copy, Lightbulb, Loader2, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/useAuthStore'
import { api } from '@/utils/api'

function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedModel, setSelectedModel] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const auth = useAuthStore(state => state.data)

  // 使用 useQuery 取得歷史記錄資料
  const {
    data: historyData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['prompt-history'],
    queryFn: async (): Promise<OptimizedHistoryEntries> => {
      const response = await api<OptimizedHistoryResponse>('/api/v1/prompts/history', {
        method: 'GET',
      })
      return response
    },
    enabled: !!auth?.access_token, // 只有在已登入時才執行查詢
    staleTime: 5 * 60 * 1000, // 5 分鐘內資料不會被視為過期
    refetchOnWindowFocus: false, // 視窗焦點變化時不自動重新取得
  })

  // 過濾和排序歷史記錄
  const filteredHistory = historyData
    .filter((item) => {
      const matchesSearch
        = item.original_prompt.toLowerCase().includes(searchQuery.toLowerCase())
        || item?.optimized_prompt?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesModel = selectedModel === 'all' || item.model_used === selectedModel
      const matchesTemplate = selectedTemplate === 'all'

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
  const copyToClipboard = (text?: string) => {
    if (!text)
      return
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
        <Button className="group cursor-pointer" variant="ghost" asChild={true}>
          <Link to="/">
            <ArrowLeftIcon
              className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
              size={16}
              aria-hidden="true"
            />
            返回
          </Link>
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
            {/* 載入狀態 */}
            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">正在載入歷史記錄...</p>
              </div>
            )}

            {/* 錯誤狀態 */}
            {isError && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <Clock className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-medium mb-2">載入失敗</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error instanceof Error ? error.message : '發生未知錯誤'}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    重新載入
                  </Button>
                </div>
              </div>
            )}

            {/* 成功載入且有資料 */}
            {!isLoading && !isError && filteredHistory.length > 0 && (
              filteredHistory.map(item => (
                <Card key={item.history_id} className="border-l-4 border-l-emerald-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
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
                            <div className="p-3 bg-gray-50 rounded-md text-sm min-h-64 max-h-64 overflow-y-auto">{item.original_prompt}</div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-muted-foreground mb-2">優化後提示詞</h4>
                            <div className="p-3 bg-emerald-50 rounded-md text-sm min-h-64 max-h-64 overflow-y-auto">
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
            )}

            {/* 沒有資料時的顯示 */}
            {!isLoading && !isError && filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">沒有找到歷史記錄</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || selectedModel !== 'all' || selectedTemplate !== 'all'
                    ? '嘗試調整搜尋條件或篩選器'
                    : '開始優化您的第一個提示詞吧！'}
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link to="/">
                    開始優化
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/history/')({
  component: HistoryPage,
  context: () => {
    return {
      useAuthStore,
    }
  },
  loader: async ({ context }) => {
    console.log('Loading history page...', context.useAuthStore)
  },
})
