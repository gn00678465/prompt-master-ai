import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface TemplateFormProps {
  onSubmit: (template: {
    name: string
    description: string
    content: string
    category: string
  }) => void
  initialValues?: {
    name: string
    description: string
    content: string
    category: string
  }
  buttonText?: string
}

export function TemplateForm({
  onSubmit,
  initialValues = { name: '', description: '', content: '', category: 'general' },
  buttonText = '儲存模板',
}: TemplateFormProps) {
  const [template, setTemplate] = useState(initialValues)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(template)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">模板名稱</Label>
        <Input
          id="name"
          value={template.name}
          onChange={e => setTemplate({ ...template, name: e.target.value })}
          placeholder="輸入模板名稱"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">模板描述</Label>
        <Input
          id="description"
          value={template.description}
          onChange={e => setTemplate({ ...template, description: e.target.value })}
          placeholder="簡短描述此模板的用途"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">模板類別</Label>
        <Select value={template.category} onValueChange={value => setTemplate({ ...template, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="選擇模板類別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">一般用途</SelectItem>
            <SelectItem value="content">內容創作</SelectItem>
            <SelectItem value="code">程式碼生成</SelectItem>
            <SelectItem value="problem">問題解決</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">模板內容</Label>
        <Textarea
          id="content"
          value={template.content}
          onChange={e => setTemplate({ ...template, content: e.target.value })}
          placeholder="輸入模板內容，可以包含變數和指令..."
          rows={8}
          required
        />
        <p className="text-xs text-muted-foreground">
          提示：您可以使用
          {'{input}'}
          {' '}
          作為使用者輸入的提示詞佔位符。
        </p>
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
        {buttonText}
      </Button>
    </form>
  )
}
