import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon, Edit, Plus, Search, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TemplateForm } from '@/components/template-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Template {
  id: number
  name: string
  description: string
  content?: string
  category: string
  isDefault: boolean
}

interface TemplateFormData {
  name: string
  description: string
  content: string
  category: string
}

interface TemplateCardProps {
  template: Template
  onEdit: (template: Template) => void
  onDelete: (id: number) => void
}

interface SearchFormData {
  searchQuery: string
}

export const Route = createFileRoute('/templates/')({
  component: TemplatesPage,
})

// 預設模板資料
const defaultTemplates = [
  { id: 1, name: '預設模板', description: '通用優化模板', isDefault: true, category: 'general' },
  { id: 2, name: '普通模板', description: '基本優化模板', isDefault: true, category: 'general' },
  { id: 3, name: '擴展模板', description: '詳細優化模板', isDefault: true, category: 'general' },
  { id: 4, name: '內容創作模板', description: '適用於文章、故事等創作', isDefault: true, category: 'content' },
  { id: 5, name: '程式碼生成模板', description: '適用於程式碼生成', isDefault: true, category: 'code' },
  { id: 6, name: '問題解決模板', description: '適用於問題分析和解決', isDefault: true, category: 'problem' },
]

function TemplatesPage() {
  const [templates, setTemplates] = useState(defaultTemplates)
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false)
  const [isEditTemplateDialogOpen, setIsEditTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  // React Hook Form 設定
  const searchForm = useForm<SearchFormData>({
    defaultValues: {
      searchQuery: '',
    },
  })

  const { register, watch } = searchForm
  const searchQuery = watch('searchQuery')

  // 獲取所有唯一的類別
  const categories = ['all', ...new Set(templates.map(t => t.category))]

  // 過濾模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch
      = template.name.toLowerCase().includes(searchQuery.toLowerCase())
      || template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory

    return matchesSearch && matchesCategory
  })

  // 分類模板
  const defaultFilteredTemplates = filteredTemplates.filter(t => t.isDefault)
  const customFilteredTemplates = filteredTemplates.filter(t => !t.isDefault)

  // 新增自定義模板
  const addCustomTemplate = (template: TemplateFormData) => {
    const newTemplateObj = {
      id: templates.length + 1,
      name: template.name,
      description: template.description,
      content: template.content,
      category: template.category,
      isDefault: false,
    }
    setTemplates([...templates, newTemplateObj])
    setIsNewTemplateDialogOpen(false)
  }

  // 刪除模板
  const deleteTemplate = (id: number) => {
    setTemplates(templates.filter(template => template.id !== id))
  }

  // 編輯模板
  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setIsEditTemplateDialogOpen(true)
  }

  // 提交編輯
  const handleSubmitEdit = (updatedTemplate: TemplateFormData) => {
    setTemplates(
      templates.map(template =>
        template.id === editingTemplate!.id ? { ...template, ...updatedTemplate } : template,
      ),
    )
    setIsEditTemplateDialogOpen(false)
    setEditingTemplate(null)
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
          <Settings className="h-6 w-6" />
          模板管理
        </h1>
        <div className="w-[70px]"></div>
        {' '}
        {/* 為了保持標題居中 */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">優化模板</CardTitle>
              <CardDescription>管理您的優化模板，創建自定義模板以滿足特定需求</CardDescription>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsNewTemplateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {' '}
              新增模板
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜尋模板..."
                  {...register('searchQuery')}
                  className="pl-8"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    className={
                      activeCategory === category
                        ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                        : 'cursor-pointer hover:bg-emerald-50'
                    }
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === 'all'
                      ? '全部'
                      : category === 'general'
                        ? '一般'
                        : category === 'content'
                          ? '內容創作'
                          : category === 'code'
                            ? '程式碼'
                            : category === 'problem'
                              ? '問題解決'
                              : category}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">全部模板</TabsTrigger>
                <TabsTrigger value="custom">自定義模板</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div>
                  <h3 className="font-medium mb-3">預設模板</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {defaultFilteredTemplates.length > 0
                      ? (
                        defaultFilteredTemplates.map(template => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onEdit={handleEditTemplate}
                            onDelete={deleteTemplate}
                          />
                        ))
                      )
                      : (
                        <div className="col-span-full text-center py-4 text-muted-foreground">
                          沒有找到符合條件的預設模板
                        </div>
                      )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customFilteredTemplates.length > 0
                    ? (
                      customFilteredTemplates.map(template => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onEdit={handleEditTemplate}
                          onDelete={deleteTemplate}
                        />
                      ))
                    )
                    : (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        沒有找到自定義模板，點擊「新增模板」按鈕創建一個
                      </div>
                    )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* 新增模板對話框 */}
      <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>新增自定義模板</DialogTitle>
            <DialogDescription>創建您自己的提示詞優化模板，以滿足特定的使用場景需求。</DialogDescription>
          </DialogHeader>
          <TemplateForm onSubmit={addCustomTemplate} buttonText="儲存模板" />
        </DialogContent>
      </Dialog>

      {/* 編輯模板對話框 */}
      <Dialog open={isEditTemplateDialogOpen} onOpenChange={setIsEditTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>編輯模板</DialogTitle>
            <DialogDescription>修改模板內容和設置</DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <TemplateForm
              initialValues={{
                name: editingTemplate.name,
                description: editingTemplate.description,
                content: editingTemplate.content || '',
                category: editingTemplate.category || 'general',
              }}
              onSubmit={handleSubmitEdit}
              buttonText="更新模板"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 模板卡片組件
function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{template.name}</CardTitle>
            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
          </div>
          {template.isDefault && <Badge variant="outline">預設</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" className="flex-1">
            使用
          </Button>
          {!template.isDefault && (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit(template)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-500" onClick={() => onDelete(template.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
