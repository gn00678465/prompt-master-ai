"""
應用程式設定模組
"""

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """應用程式設定"""

    # server 設定
    host: str = "0.0.0.0"
    port: int = 8000

    # JWT 設定
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Redis 設定
    redis_host: str = "localhost"
    redis_port: int = 6379

    # 資料庫設定
    database_type: str = "sqlite"
    database_url: str = ""

    model_config = SettingsConfigDict(env_file=".env")

    @field_validator("secret_key", mode="before")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        """驗證 SECRET_KEY 是否已設定"""
        if not v:
            raise ValueError("SECRET_KEY environment variable is not set.")
        return v

    @model_validator(mode="after")
    def set_database_url(self) -> "Settings":
        """根據 database_type 設定 database_url"""
        if self.database_type == "sqlite":
            self.database_url = "sqlite:///db/database.db"
        elif self.database_type == "postgres" and not self.database_url:
            raise ValueError(
                "DATABASE_URL environment variable must be set when DATABASE_TYPE is postgres."
            )
        return self


# 建立全域設定實例
settings = Settings()  # type: ignore
