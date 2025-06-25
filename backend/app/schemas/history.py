"""
此模組定義 PromptMaster AI 後端的 Prompt 相關 Pydantic schema。
用於 Prompt 優化請求、回應與歷史紀錄的 API 資料驗證。
"""

from datetime import datetime

from pydantic import BaseModel


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
