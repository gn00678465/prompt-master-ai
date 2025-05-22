from datetime import datetime, timezone
from sqlmodel import SQLModel, Field

class UserPreferences(SQLModel, table=True):
    preference_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.user_id", unique=True)
    default_model: str
    default_temperature: float
    default_template_id: int = Field(foreign_key="templates.template_id")
    theme: str = Field(default='light')
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime | None = None