export interface Template {
  template_id: number
  name: string
  description?: string
  is_default: boolean
  category: string
  content: string
  created_at: Date
}

export type Templates = Array<Template>
