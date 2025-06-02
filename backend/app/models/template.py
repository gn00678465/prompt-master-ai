from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class Template(SQLModel, table=True):
    """
    Template model for storing template information.
    """

    __tablename__: str = "templates"  # 明確指定資料表名稱

    template_id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="users.user_id")
    name: str
    description: Optional[str] = None
    content: str
    is_default: bool = False
    category: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None
