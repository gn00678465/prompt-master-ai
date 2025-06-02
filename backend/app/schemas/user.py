"""
此模組定義 PromptMaster AI 後端的使用者相關 Pydantic schema。
用於 API 請求與回應的資料驗證。
"""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    """
    用戶資料輸出 schema，對應 API 回傳格式。
    包含 user_id、使用者名稱、Email、建立時間與最後登入時間。
    """

    user_id: int
    username: str
    email: EmailStr
    created_at: datetime
    last_login: datetime | None
    access_token: str | None = None


class UserLogin(BaseModel):
    """
    用戶登入請求 schema，對應登入 API 所需欄位。
    包含使用者名稱或 Email 及密碼。
    """

    username: str
    password: str


class UserCreate(UserLogin):
    """
    用戶註冊請求 schema，對應註冊 API 所需欄位。
    包含使用者名稱、Email 及密碼。
    """

    email: EmailStr
