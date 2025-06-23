from contextlib import asynccontextmanager
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    auth_router,
    history_router,
    models_router,
    prompt_router,
    template_router,
)
from app.dependencies import create_db_and_tables
from app.utils import get_redis_client


def check_redis_connection():
    """
    檢查 Redis 連接
    Raises:
        Exception: 如果無法連接到 Redis
    """
    try:
        r = get_redis_client()
        r.ping()
        print("✅ Redis 連線成功")
        r.close()  # 記得關閉連接
    except ConnectionError as e:
        print(f"❌ Redis 連線失敗 - 連接錯誤: {e}")
        sys.exit(1)
    except TimeoutError as e:
        print(f"❌ Redis 連線失敗 - 超時: {e}")
        sys.exit(1)


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Create the database and tables"""
    create_db_and_tables()
    check_redis_connection()
    yield
    # Cleanup code can be added here if needed


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api",
)
app.include_router(prompt_router, prefix="/api")
app.include_router(template_router, prefix="/api")
app.include_router(models_router, prefix="/api")
app.include_router(history_router, prefix="/api")
