"""
Token 黑名單相關邏輯模組
"""

from datetime import datetime, timezone

from app.services.redis_client import Redis


async def is_token_blacklisted(jti: str) -> bool:
    """檢查 Token 是否在黑名單中"""
    if Redis.redis_client is not None:
        result = await Redis.redis_client.exists(f"token_blacklist:{jti}")
        return result == 1
    return False


async def add_token_to_blacklist(jti: str, expires_at: int):
    """將 Token 加入黑名單"""
    if Redis.redis_client is not None:
        # 計算剩餘過期時間（秒）
        expires_datetime = datetime.fromtimestamp(expires_at, tz=timezone.utc)
        ttl = int((expires_datetime - datetime.now(timezone.utc)).total_seconds())
        if ttl > 0:
            await Redis.redis_client.setex(f"token_blacklist:{jti}", ttl, "blacklisted")
