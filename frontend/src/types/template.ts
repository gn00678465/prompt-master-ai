export interface TemplateEntry {
  template_id: number
  name: string
  description?: string
  is_default: boolean
  category: string
  content: string
  created_at: Date
}

export type TemplateEntries = Array<TemplateEntry>

export interface TemplatePayload {
  name: string
  description?: string
  category: string
  content: string
}
