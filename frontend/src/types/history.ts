export interface OptimizedHistory {
    history_id: number
    original_prompt: string
    optimized_prompt?: string
    model_used: string
    temperature: number
    created_at: string
}
