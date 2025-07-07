import type { TemplateEntry, TemplatePayload } from '@/types/template'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ArrowLeftIcon, Plus, Search, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { PageLayout } from '@/components/page-layout'
import { TemplateCard } from '@/components/template-card'
import { TemplateForm } from '@/components/template-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/useAuthStore'
import { useTemplateStore } from '@/stores/useTemplateStore'
import { api } from '@/utils'

interface SearchFormData {
  searchQuery: string
}

export const Route = createFileRoute('/templates/')({
  component: TemplatesPage,
  context: () => {
    return {
      useAuthStore,
    }
  },
  beforeLoad({ context }) {
    const auth = context.useAuthStore.getState().data

    if (!auth?.access_token) {
      throw redirect({
        to: '/',
      })
    }
  },
})

function TemplatesPage() {
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false)
  const [isEditTemplateDialogOpen, setIsEditTemplateDialogOpen] = useState(false)
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TemplateEntry | null>(null)
  const [deletingTemplate, setDeletingTemplate] = useState<TemplateEntry | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const templates = useTemplateStore(state => state.templates)
  const fetchTemplates = useTemplateStore(state => state.fetch)
  const pushTemplate = useTemplateStore(state => state.push)

  useEffect(() => {
    if (templates.length === 0) {
      fetchTemplates()
    }
  })

  // React Hook Form 設定
  const searchForm = useForm<SearchFormData>({
    defaultValues: {
      searchQuery: '',
    },
  })

  const { register, watch } = searchForm
  const _searchQuery = watch('searchQuery') // 暫時未使用，但保留以供未來搜尋功能

  // 獲取所有唯一的類別
  const categories = ['all', ...new Set(templates.map(t => t.category))]

  // 分類模板
  const defaultFilteredTemplates = templates.filter(t => t.is_default)
  const customFilteredTemplates = templates.filter(t => !t.is_default)

  // 新增自定義模板
  const addTemplateMutation = useMutation({
    mutationKey: ['add', 'template'],
    mutationFn: async (template: TemplatePayload) => {
      const response = await api<TemplateEntry>('/api/v1/templates/', {
        method: 'POST',
        body: template,
      })
      return response
    },
  })

  // 新增自定義模板
  const addCustomTemplate = (template: TemplatePayload) => {
    addTemplateMutation.mutate(template, {
      onSuccess(data) {
        pushTemplate(data)
        setIsNewTemplateDialogOpen(false)
      },
    })
  }

  // 刪除模板
  const deleteTemplateMutation = useMutation({
    mutationKey: ['delete', 'template'],
    mutationFn: async (template_id: number) => {
      await api(`/api/v1/templates/${template_id}`, {
        method: 'DELETE',
      })
    },
  })

  // 顯示刪除確認對話框
  const handleDeleteTemplate = (template: TemplateEntry) => {
    setDeletingTemplate(template)
    setIsDeleteConfirmDialogOpen(true)
  }

  // 確認刪除模板
  const confirmDeleteTemplate = () => {
    if (deletingTemplate) {
      deleteTemplateMutation.mutate(deletingTemplate.template_id, {
        onSuccess() {
          // 刪除成功後重新獲取模板列表
          fetchTemplates()
          setIsDeleteConfirmDialogOpen(false)
          setDeletingTemplate(null)
        },
      })
    }
  }

  // 編輯模板
  const handleEditTemplate = (template: TemplateEntry) => {
    setEditingTemplate(template)
    setIsEditTemplateDialogOpen(true)
  }

  // 提交編輯
  const editTemplateMutation = useMutation({
    mutationKey: ['edit', 'template'],
    mutationFn: async (template: TemplatePayload) => {
      const response = await api<TemplateEntry>(`/api/v1/templates/${editingTemplate?.template_id}`, {
        method: 'PUT',
        body: template,
      })
      return response
    },
  })

  // 提交編輯
  const handleSubmitEdit = (updatedTemplate: TemplatePayload) => {
    editTemplateMutation.mutate(
      updatedTemplate,
      {
        onSuccess(data) {
          // 更新模板列表
          useTemplateStore.getState().replace(data, templates.findIndex(t => t.template_id === data.template_id))
          setIsEditTemplateDialogOpen(false)
          setEditingTemplate(null)
        },
        onError(error) {
          console.error('編輯模板失敗:', error)
        },
      },
    )
  }

  return (
    <PageLayout>
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
            <Button className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer" onClick={() => setIsNewTemplateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
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
                            key={template.template_id}
                            template={template}
                            onEdit={handleEditTemplate}
                            onDelete={handleDeleteTemplate}
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
                          key={template.template_id}
                          template={template}
                          onEdit={handleEditTemplate}
                          onDelete={handleDeleteTemplate}
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

      {/* 刪除確認對話框 */}
      <Dialog open={isDeleteConfirmDialogOpen} onOpenChange={setIsDeleteConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>確認刪除模板</DialogTitle>
            <DialogDescription>
              您確定要刪除模板「
              {deletingTemplate?.name}
              」嗎？此操作無法復原。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmDialogOpen(false)
                setDeletingTemplate(null)
              }}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteTemplate}
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending ? '刪除中...' : '確定刪除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
