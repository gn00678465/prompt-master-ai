from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class TokenBlacklist(SQLModel, table=True):
    __tablename__: str = "token_blacklist"

    id: int | None = Field(default=None, primary_key=True)
    token_jti: str = Field(unique=True, index=True)
    user_id: int = Field(foreign_key="users.user_id")
    blacklisted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
