"""
應用程式設定模組
"""
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """應用程式設定"""
    # JWT 設定
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # 資料庫設定
    database_url: str = "sqlite:///database.db"

    # Gemini API 設定
    gemini_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env")

    @field_validator('secret_key')
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        """驗證 SECRET_KEY 是否已設定"""
        if not v:
            raise ValueError("SECRET_KEY environment variable is not set.")
        return v


# 建立全域設定實例
settings = Settings()  # type: ignore
