"""
應用程式設定模組
"""
import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """應用程式設定"""
    # JWT 設定
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '30'))

    # 資料庫設定
    database_url: str = "sqlite:///database.db"

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
