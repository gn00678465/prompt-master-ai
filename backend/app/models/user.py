from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """
    User 類別，用於儲存用戶資訊。
    """

    __tablename__: str = "users"  # 明確指定資料表名稱

    user_id: int | None = Field(default=None, primary_key=True)
    username: str = Field(unique=True)
    email: str = Field(unique=True)
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: datetime | None = None
