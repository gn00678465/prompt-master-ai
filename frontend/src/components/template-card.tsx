import type { TemplateEntry } from '@/types/template'
import { Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'

export interface TemplateCardProps {
  template: TemplateEntry
  onEdit: (template: TemplateEntry) => void
  onDelete: (template: TemplateEntry) => void
}

// 模板卡片組件
export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
              </div>
              {template.is_default && <Badge variant="outline">預設</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="flex-1 cursor-pointer" disabled={template.is_default} onClick={() => onEdit(template)}>
                <Edit className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                編輯
              </Button>
              {!template.is_default && (
                <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => onDelete(template)}>
                  <Trash2 className="" size={16} aria-hidden="true" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-[var(--radix-hover-card-trigger-width)] whitespace-pre-line bg-primary text-primary-foreground max-h-[400px] overflow-auto">{template.content}</HoverCardContent>
    </HoverCard>

  )
}
