export interface OptimizePayload {
  original_prompt: string
  template_id: number
  model: string
  temperature: number
  max_output_tokens?: number
}

export interface OptimizeEntry {
  optimized_prompt: 'string'
  improvement_analysis: 'string'
  original_prompt: 'string'
}

export type OptimizeResponse = OptimizeEntry
