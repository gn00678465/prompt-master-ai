"""
JWT 相關邏輯模組
"""
import uuid
from datetime import datetime, timedelta, timezone

from app.config import settings
from app.models.token_blacklist import TokenBlacklist
from jose import jwt
from sqlmodel import select


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """建立 JWT access token 包含 JTI"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(
            timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)

    # 新增 JTI (JWT ID)
    jti = str(uuid.uuid4())
    to_encode.update({
        "exp": expire,
        "jti": jti,
        "iat": datetime.now(timezone.utc).timestamp()
    })

    encoded_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def decode_token(token: str):
    """驗證 JWT token 並回傳 payload"""
    payload = jwt.decode(token, settings.secret_key,
                         algorithms=[settings.algorithm])
    return payload


def is_token_blacklisted(jti: str, session) -> bool:
    """檢查 Token 是否在黑名單中"""
    statement = select(TokenBlacklist).where(TokenBlacklist.token_jti == jti)
    return session.exec(statement).first() is not None
