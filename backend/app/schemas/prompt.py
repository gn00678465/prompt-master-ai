"""
此模組定義 PromptMaster AI 後端的 Prompt 相關 Pydantic schema。
用於 Prompt 優化請求、回應與歷史紀錄的 API 資料驗證。
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PromptOptimizeRequest(BaseModel):
    """
    Prompt 優化請求 schema，對應 /api/prompts/optimize API 輸入格式。
    包含原始 Prompt、模板 ID、模型名稱與溫度參數。
    """

    original_prompt: str
    template_id: int | None = None
    model: Optional[str] = "gemini-pro"
    temperature: float | None = 0.7


class PromptOptimizeResponse(BaseModel):
    """
    Prompt 優化回應 schema，對應 /api/prompts/optimize API 回傳格式。
    包含優化後 Prompt、優化分析與原始 Prompt。
    """

    optimized_prompt: str
    improvement_analysis: str
    original_prompt: str


class PromptHistoryOut(BaseModel):
    """
    Prompt 優化歷史紀錄 schema，對應 /api/prompts/history API 回傳格式。
    包含歷史紀錄 ID、原始與優化後 Prompt、使用模型、溫度與建立時間。
    """

    history_id: int
    original_prompt: str
    optimized_prompt: str | None
    model_used: str
    temperature: float
    created_at: datetime
