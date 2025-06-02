"""
模型定義
"""

from pydantic import BaseModel


class Model(BaseModel):
    """
    模型資料結構，包含模型名稱、顯示名稱、描述與版本。
    """

    name: str | None
    displayName: str | None
    description: str | None
    version: str
