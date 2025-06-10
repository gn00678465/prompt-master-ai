import { Copy, Edit, Lightbulb, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ApiKeyInput } from '@/components/api-key-input'
import { TemplateSelector } from '@/components/template-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

interface OptimizationFormData {
  apiKey: string
  templateId: number
  model: string
  temperature: number
  originalPrompt: string
}

export function PromptOptimizer({ templates }) {
  const [optimizedResult, setOptimizedResult] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)

  const { control, handleSubmit, formState: { errors }, reset } = useForm<OptimizationFormData>({
    defaultValues: {
      apiKey: '',
      templateId: 1,
      model: 'gemini-2.5-pro',
      temperature: 0.1,
      originalPrompt: '',
    },
  })

  const onSubmit = async (data: OptimizationFormData) => {
    setIsOptimizing(true)
    try {
      // Mock API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockResult = `優化後的提示詞：

根據所選模板和設定，您的原始提示詞已被優化如下：

原始提示詞：${data.originalPrompt}

優化建議：
1. 增加更具體的上下文描述
2. 明確定義期望的輸出格式
3. 添加相關的約束條件和範例

優化後的提示詞：
請以${data.model}的角色，根據以下要求進行回應...

[此處為完整的優化提示詞內容]

使用溫度：${data.temperature}
選用模板：${templates.find(t => t.id === data.templateId)?.name || '未知模板'}`

      setOptimizedResult(mockResult)
    }
    catch (error) {
      console.error('優化失敗:', error)
    }
    finally {
      setIsOptimizing(false)
    }
  }

  const handleCopyResult = () => {
    navigator.clipboard.writeText(optimizedResult)
  }

  const handleClearResult = () => {
    setOptimizedResult('')
  }

  const handleClearForm = () => {
    reset()
    setOptimizedResult('')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
              <Edit className="h-5 w-5" />
              {' '}
              優化設置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Controller
              name="apiKey"
              control={control}
              rules={{ required: 'API 金鑰為必填項目' }}
              render={({ field }) => (
                <div className="space-y-1">
                  <ApiKeyInput {...field} />
                  {errors.apiKey && (
                    <p className="text-sm text-red-500">{errors.apiKey.message}</p>
                  )}
                </div>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">優化模板</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 flex items-center gap-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <Settings className="h-3.5 w-3.5" />
                  模板管理
                </Button>
              </div>
              <Controller
                name="templateId"
                control={control}
                render={({ field }) => (
                  <TemplateSelector
                    templates={templates}
                    selectedTemplateId={field.value}
                    onSelectTemplate={field.onChange}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">使用模型</h3>
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇模型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                        <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                        <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">溫度</h3>
                <Controller
                  name="temperature"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Slider
                        value={[field.value]}
                        min={0}
                        max={1}
                        step={0.1}
                        onValueChange={values => field.onChange(values[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>低溫=穩定內容</span>
                        <span>{field.value}</span>
                        <span>高溫=創新內容</span>
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Edit className="h-4 w-4 text-emerald-600" />
                {' '}
                原始提示詞
              </h3>
              <Controller
                name="originalPrompt"
                control={control}
                rules={{
                  required: '請輸入原始提示詞',
                  minLength: { value: 10, message: '提示詞至少需要 10 個字符' },
                }}
                render={({ field }) => (
                  <div className="space-y-1">
                    <Textarea
                      {...field}
                      placeholder="在此輸入您的原始提示詞..."
                      className="min-h-[150px]"
                    />
                    {errors.originalPrompt && (
                      <p className="text-sm text-red-500">{errors.originalPrompt.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isOptimizing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {isOptimizing ? '優化中...' : '優化提示詞'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearForm}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
              <Lightbulb className="h-5 w-5" />
              {' '}
              優化結果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 min-h-[400px] bg-gray-50">
              {isOptimizing
                ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                        <p className="text-muted-foreground">正在優化您的提示詞...</p>
                      </div>
                    </div>
                  )
                : optimizedResult
                  ? (
                      <div className="whitespace-pre-wrap text-sm">{optimizedResult}</div>
                    )
                  : (
                      <p className="text-muted-foreground">優化後的提示詞將顯示在這裡...</p>
                    )}
            </div>

            <div className="flex gap-2 mt-4 justify-end">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleCopyResult}
                disabled={!optimizedResult}
              >
                <Copy className="h-4 w-4" />
                {' '}
                複製結果
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleClearResult}
                disabled={!optimizedResult}
              >
                <Trash2 className="h-4 w-4" />
                {' '}
                清空結果
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
