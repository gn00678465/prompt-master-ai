import type { ModelEntries } from '@/types/model'
import type { OptimizePayload } from '@/types/optimize'
import type { TemplateEntries } from '@/types/template'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Copy, Edit, Lightbulb, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { ApiKeyInput } from '@/components/api-key-input'
import { TemplateSelector } from '@/components/template-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

type OptimizationFormData = OptimizePayload & {
  apiKey: string
}

interface PromptOptimizerProps {
  templates?: TemplateEntries
  models?: ModelEntries
  isLoading?: boolean
  optimizedTemplate?: string
  onSubmit?: (data: OptimizationFormData) => void | Promise<void>
}

const schema = z.object({
  template_id: z.number(),
  model: z.string().min(1, '請選擇一個模型'),
  temperature: z.number().min(0, '溫度不能小於 0').max(1, '溫度不能大於 1'),
  original_prompt: z.string().min(1, '提示詞為必填項目'),
  apiKey: z.string().min(1, 'API 金鑰為必填項目'),
})

function defaultOnSubmit() { }

export function PromptOptimizer({ templates, models, optimizedTemplate = '', isLoading = false, onSubmit = defaultOnSubmit }: PromptOptimizerProps) {
  const [localOptimizedResult, setLocalOptimizedResult] = useState('')

  // 計算最終顯示的優化結果：優先使用 prop 傳入的值，否則使用本地狀態
  const displayedResult = optimizedTemplate || localOptimizedResult

  const { control, handleSubmit, formState: { errors }, reset } = useForm<OptimizationFormData>({
    defaultValues: {
      template_id: 0,
      model: '',
      temperature: 0.1,
      original_prompt: '',
      apiKey: '',
    },
    resolver: zodResolver(schema),
  })
  const handleCopyResult = () => {
    navigator.clipboard.writeText(displayedResult)
  }

  const handleClearResult = () => {
    setLocalOptimizedResult('')
  }

  const handleClearForm = () => {
    reset()
    setLocalOptimizedResult('')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-max-[1100px]">
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
                  className="h-8 flex items-center gap-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  asChild={true}
                >
                  <Link to="/templates">
                    <Settings className="h-3.5 w-3.5" />
                    模板管理
                  </Link>
                </Button>
              </div>
              <Controller
                name="template_id"
                control={control}
                render={({ field }) => (
                  <TemplateSelector
                    templates={templates || []}
                    selectedTemplateId={field.value}
                    onSelectTemplateId={field.onChange}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <h3 className="font-medium">使用模型</h3>
                <Controller
                  name="model"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full" aria-invalid={!!errors.model}>
                        <SelectValue placeholder="選擇模型" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          models?.length
                            ? models.map(model => (
                              <SelectItem key={model.name} value={model.name}>
                                {model.displayName}
                              </SelectItem>
                            ))
                            : (
                              <SelectItem value="empty" disabled>無可用模型</SelectItem>
                            )
                        }
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Flash Lite 速度快，Flash 品質佳，Pro 品質最佳但最慢</span>
                </div>
                {errors.model && (
                  <p className="text-sm text-red-500">{errors.model.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">溫度</h3>
                <Controller
                  name="temperature"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Slider
                        value={[field.value || 0]}
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
                name="original_prompt"
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
                      className="min-h-[150px] max-h-[400px]"
                      aria-invalid={!!errors.original_prompt}
                    />
                    {errors.original_prompt && (
                      <p className="text-sm text-red-500">{errors.original_prompt.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {isLoading ? '優化中...' : '優化提示詞'}
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

        <Card className="h-max-[1100px]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
              <Lightbulb className="h-5 w-5" />
              {' '}
              優化結果
            </CardTitle>
          </CardHeader>
          {' '}
          <CardContent className="flex-1 flex flex-col">
            {' '}
            <Textarea
              value={displayedResult}
              onChange={e => setLocalOptimizedResult(e.target.value)}
              placeholder="優化後的提示詞將顯示在這裡..."
              className="min-h-[400px] max-h-[1046px] text-sm bg-gray-50 h-full"
              readOnly={false}
            />

            <div className="flex gap-2 mt-4 justify-end">
              {' '}
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleCopyResult}
                disabled={!displayedResult}
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
                disabled={!displayedResult}
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
