from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class PromptHistory(SQLModel, table=True):
    """
    PromptHistory 類別，用於儲存提示詞歷史紀錄。
    """

    __tablename__: str = "prompt_history"

    history_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id")
    original_prompt: str
    optimized_prompt: str
    template_id: int = Field(foreign_key="templates.template_id")
    model_used: str
    temperature: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
