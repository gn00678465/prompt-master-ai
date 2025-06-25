"""
Token 黑名單相關邏輯模組
"""

from datetime import datetime, timezone

from app.utils.redis_client import get_redis_client


def is_token_blacklisted(jti: str) -> bool:
    """檢查 Token 是否在黑名單中"""
    r = get_redis_client()
    return r.exists(f"token_blacklist:{jti}") == 1


def add_token_to_blacklist(jti: str, expires_at: int):
    """將 Token 加入黑名單"""
    r = get_redis_client()
    # 計算剩餘過期時間（秒）
    expires_datetime = datetime.fromtimestamp(expires_at, tz=timezone.utc)
    ttl = int((expires_datetime - datetime.now(timezone.utc)).total_seconds())
    if ttl > 0:
        r.setex(f"token_blacklist:{jti}", ttl, "blacklisted")
