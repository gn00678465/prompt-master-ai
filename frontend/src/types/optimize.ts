export interface OptimizePayload {
  original_prompt: string
  template_id: number
  model: string
  temperature: number
  max_output_tokens?: number
}
