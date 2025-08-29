"""Redis 客戶端封裝類別"""

import sys

import redis.asyncio as redis

from app.config import settings


class Redis:
    """Redis 客戶端封裝類別"""

    redis_client: redis.Redis | None = None

    @classmethod
    async def connect(cls):
        """連接到 Redis 伺服器"""
        try:
            # Connect to Redis server
            cls.redis_client = redis.Redis(
                host=settings.redis_host,
                port=settings.redis_port,
                db=0,
                decode_responses=True,
            )
            # 測試連接
            await cls.redis_client.ping()
        except redis.RedisError as e:
            print(f"Failed to connect to Redis: {e}")
            raise

    @classmethod
    async def check_connection(cls):
        """
        檢查 Redis 連接
        Raises:
            Exception: 如果無法連接到 Redis
        """
        try:
            await cls.connect()
            print("✅ Redis 連線成功")
        except ConnectionError as e:
            print(f"❌ Redis 連線失敗 - 連接錯誤: {e}")
            sys.exit(1)
        except TimeoutError as e:
            print(f"❌ Redis 連線失敗 - 超時: {e}")
            sys.exit(1)
        except redis.RedisError as e:
            print(f"❌ Redis 連線失敗 - Redis 錯誤: {e}")
            sys.exit(1)

    @classmethod
    async def close(cls):
        """關閉 Redis 連接"""
        if cls.redis_client is not None:
            await cls.redis_client.aclose()

    @classmethod
    async def insert_string(cls, key: str, value: str):
        if cls.redis_client is not None:
            await cls.redis_client.set(key, value)

    @classmethod
    async def query_key(cls, key: str):
        if cls.redis_client is not None:
            value = await cls.redis_client.get(key)
            return value
