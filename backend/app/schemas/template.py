"""
此模組定義 PromptMaster AI 後端的模板相關 Pydantic schema。
用於模板建立與查詢的 API 資料驗證。
"""

from datetime import datetime

from pydantic import BaseModel, Field, field_validator


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

    name: str = Field(
        ..., min_length=1, max_length=100, description="模板名稱，必填且不能為空"
    )
    description: str | None = Field(None, max_length=500, description="模板描述，可選")
    content: str = Field(..., min_length=1, description="模板內容，必填且不能為空")
    category: str | None = Field(None, max_length=50, description="模板分類，可選")

    @field_validator("name", "content")
    @classmethod
    def validate_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("欄位不能為空白")
        return v.strip()

    @field_validator("description", "category")
    @classmethod
    def validate_optional_fields(cls, v: str | None) -> str | None:
        if v is not None:
            return v.strip() if v.strip() else None
        return v


class TemplateUpdate(BaseModel):
    """
    模板更新請求 schema，對應 PUT /api/templates/{id} API 輸入格式。
    所有欄位都是可選的，只更新傳入的欄位。
    """

    name: str | None = None
    description: str | None = None
    content: str | None = None
    category: str | None = None
