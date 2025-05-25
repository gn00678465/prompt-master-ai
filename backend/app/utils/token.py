"""
JWT 相關邏輯模組
"""
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.config import settings

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """建立 JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def decode_token(token: str):
    """驗證 JWT token 並回傳 payload"""
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    return payload
