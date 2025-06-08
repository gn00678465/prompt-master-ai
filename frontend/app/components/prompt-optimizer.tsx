import { Copy, Edit, Lightbulb, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ApiKeyInput } from '@/components/api-key-input'
import { TemplateSelector } from '@/components/template-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

export function PromptOptimizer({ templates }) {
  const [temperature, setTemperature] = useState([0.1])
  const [selectedTemplate, setSelectedTemplate] = useState(1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
            <Edit className="h-5 w-5" /> 優化設置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ApiKeyInput />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">優化模板</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-8 flex items-center gap-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Settings className="h-3.5 w-3.5" />
                模板管理
              </Button>
            </div>
            <TemplateSelector
              templates={templates}
              selectedTemplateId={selectedTemplate}
              onSelectTemplate={(id) => setSelectedTemplate(id)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">使用模型</h3>
              <Select defaultValue="gemini-2.5-pro">
                <SelectTrigger>
                  <SelectValue placeholder="選擇模型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">溫度</h3>
              <Slider value={temperature} min={0} max={1} step={0.1} onValueChange={setTemperature} className="py-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>低溫=穩定內容</span>
                <span>{temperature[0]}</span>
                <span>高溫=創新內容</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Edit className="h-4 w-4 text-emerald-600" /> 原始提示詞
            </h3>
            <Textarea placeholder="在此輸入您的原始提示詞..." className="min-h-[150px]" />
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2">
            <Edit className="h-4 w-4" /> 優化提示詞
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
            <Lightbulb className="h-5 w-5" /> 優化結果
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 min-h-[400px]">
            <p className="text-muted-foreground">優化後的提示詞將顯示在這裡...</p>
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <Copy className="h-4 w-4" /> 複製結果
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> 清空
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
