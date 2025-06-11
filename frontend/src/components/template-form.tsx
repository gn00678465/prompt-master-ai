import type React from 'react'
import type { TemplatePayload } from '@/types/template'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const templateSchema = z.object({
  name: z.string().min(1, '模板名稱為必填項目').max(100, '模板名稱不可超過 100 個字元'),
  description: z.string().max(500, '模板描述不可超過 500 個字元').optional(),
  category: z.string().min(1, '請選擇模板類別'),
  content: z.string().min(1, '模板內容為必填項目').max(5000, '模板內容不可超過 5000 個字元'),
})

const defaultInitialValues: TemplatePayload = {
  name: '',
  description: '',
  content: '',
  category: 'general',
}

interface TemplateFormProps {
  onSubmit: (template: TemplatePayload) => void
  initialValues?: TemplatePayload
  buttonText?: string
}

export function TemplateForm({
  onSubmit,
  initialValues = defaultInitialValues,
  buttonText = '儲存模板',
}: TemplateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TemplatePayload>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialValues,
  })

  const watchedCategory = watch('category')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          模板名稱
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="輸入模板名稱"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">模板描述</Label>
        <Input
          id="description"
          {...register('description')}
          placeholder="簡短描述此模板的用途"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">模板類別</Label>
        <Select value={watchedCategory} onValueChange={value => setValue('category', value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選擇模板類別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">一般用途</SelectItem>
            <SelectItem value="content">內容創作</SelectItem>
            <SelectItem value="code">程式碼生成</SelectItem>
            <SelectItem value="problem">問題解決</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">
          模板內容
          <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder="輸入模板內容，可以包含變數和指令..."
          rows={8}
          aria-invalid={!!errors.content}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
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
