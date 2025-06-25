"""
此模組定義 PromptMaster AI 後端的 Prompt 相關 Pydantic schema。
用於 Prompt 優化請求、回應與歷史紀錄的 API 資料驗證。
"""

from pydantic import BaseModel


class PromptOptimizeRequest(BaseModel):
    """
    Prompt 優化請求 schema，對應 /api/prompts/optimize API 輸入格式。
    包含原始 Prompt、模板 ID、模型名稱與溫度參數。
    """

    api_key: str
    original_prompt: str
    template_id: int
    model: str
    temperature: float | None = 0.2
    max_output_tokens: int | None = None


class PromptOptimizeResponse(BaseModel):
    """
    Prompt 優化回應 schema，對應 /api/prompts/optimize API 回傳格式。
    包含優化後 Prompt、優化分析與原始 Prompt。
    """

    optimized_prompt: str
    improvement_analysis: str
    original_prompt: str
