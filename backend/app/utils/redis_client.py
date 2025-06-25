"""
Redis
"""

import redis

from app.config import settings


def get_redis_client():
    """
    獲取 Redis 客戶端
    Returns:
        redis.Redis: Redis 客戶端實例
    """
    return redis.Redis(
        host=settings.redis_host, port=settings.redis_port, db=0, decode_responses=True
    )
