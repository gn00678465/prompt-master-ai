"""
此模組定義 PromptMaster AI 後端的模板相關 Pydantic schema。
用於模板建立與查詢的 API 資料驗證。
"""

from datetime import datetime
from pydantic import BaseModel

class TemplateOut(BaseModel):
    """
    模板資料輸出 schema，對應 /api/templates API 回傳格式。
    包含模板 ID、名稱、描述、是否為預設、分類與建立時間。
    """
    template_id: int
    name: str
    description: str | None
    is_default: bool
    category: str | None
    created_at: datetime

class TemplateCreate(BaseModel):
    """
    模板建立請求 schema，對應 /api/templates API 輸入格式。
    包含名稱、描述、內容與分類。
    """
    name: str
    description: str | None
    content: str
    category: str | None = None
