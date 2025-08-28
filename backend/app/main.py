"""應用程式進入點"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    auth_router,
    health_router,
    history_router,
    models_router,
    prompt_router,
    template_router,
)
from app.dependencies import create_db_and_tables
from app.services.redis_client import Redis


@asynccontextmanager
async def lifespan(_: FastAPI):
    """Create the database and tables"""
    create_db_and_tables()
    await Redis.check_connection()
    # 關閉 Redis 連接
    await Redis.close()
    # MCP 應用程式會在這裡自動清理
    yield


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
app.include_router(health_router, prefix="/api")
