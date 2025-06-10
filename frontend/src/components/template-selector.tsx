import type { Template, Templates } from '../types/template'
import { Check, Search } from 'lucide-react'
import { useState } from 'react'
import { ListBox, ListBoxItem } from 'react-aria-components'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface TemplateSelectorProps {
  templates: Templates
  selectedTemplateId: Template['template_id']
  onSelectTemplate: (templateId: Template['template_id']) => void
}

export function TemplateSelector({ templates, selectedTemplateId, onSelectTemplate }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 獲取所有唯一的類別
  const categories = ['all', ...new Set(templates.map(t => t.category))]

  // 過濾模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch
      = template.name.toLowerCase().includes(searchQuery.toLowerCase())
        || template.description?.includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-3">
      <div className="relative">
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
            variant={selectedCategory === category ? 'default' : 'outline'}
            className={
              selectedCategory === category
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                : 'cursor-pointer hover:bg-emerald-50'
            }
            onClick={() => setSelectedCategory(category)}
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

      <Card className="border-dashed p-0">
        <CardContent className="p-2">
          <ScrollArea className="h-[180px] pr-3">
            <ListBox
              className="bg-background space-y-1 p-1 text-sm transition-[color,box-shadow]"
              aria-label="Select framework"
              selectionMode="single"
              defaultSelectedKeys={[2]}
            >
              {filteredTemplates.length > 0
                ? (
                    filteredTemplates.map(template => (
                      <ListBoxItem
                        key={template.template_id}
                        className={`flex items-center justify-between data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 relative rounded px-2 py-1.5 outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-visible:ring-[3px] ${selectedTemplateId === template.template_id ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : ''
                        }`}
                        textValue={template.name}
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                            {template.is_default && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                預設
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selectedTemplateId === template.template_id && <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />}
                      </ListBoxItem>
                    ))
                  )
                : (
                    <div className="text-center py-8 text-muted-foreground">沒有找到符合條件的模板</div>
                  )}
            </ListBox>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
