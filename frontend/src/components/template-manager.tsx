import { ArrowLeft, Edit, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { TemplateForm } from '@/components/template-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TemplateManager({ templates, onAddTemplate, onDeleteTemplate, onEditTemplate, onBack }) {
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false)
  const [isEditTemplateDialogOpen, setIsEditTemplateDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

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
  const customTemplates = filteredTemplates.filter(t => !t.isDefault)

  // 編輯模板
  const handleEditTemplate = (template) => {
    setEditingTemplate(template)
    setIsEditTemplateDialogOpen(true)
  }

  // 提交編輯
  const handleSubmitEdit = (updatedTemplate) => {
    onEditTemplate(editingTemplate.id, updatedTemplate)
    setIsEditTemplateDialogOpen(false)
    setEditingTemplate(null)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Button>
        <h1 className="text-2xl font-bold text-emerald-600">模板管理</h1>
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
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.length > 0
                    ? (
                        filteredTemplates.map(template => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onEdit={handleEditTemplate}
                            onDelete={onDeleteTemplate}
                          />
                        ))
                      )
                    : (
                        <div className="col-span-full text-center py-8 text-muted-foreground">沒有找到符合條件的模板</div>
                      )}
                </div>
              </TabsContent>

              <TabsContent value="custom" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customTemplates.length > 0
                    ? (
                        customTemplates.map(template => (
                          <TemplateCard
                            key={template.id}
                            template={template}
                            onEdit={handleEditTemplate}
                            onDelete={onDeleteTemplate}
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
          <TemplateForm
            onSubmit={(template) => {
              onAddTemplate(template)
              setIsNewTemplateDialogOpen(false)
            }}
            buttonText="儲存模板"
          />
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
function TemplateCard({ template, onEdit, onDelete }) {
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
