export interface OptimizedHistoryEntry {
  history_id: number
  original_prompt: string
  optimized_prompt?: string
  model_used: string
  temperature: number
  created_at: string
}

export type OptimizedHistoryEntries = OptimizedHistoryEntry[]

export type OptimizedHistoryResponse = OptimizedHistoryEntries
