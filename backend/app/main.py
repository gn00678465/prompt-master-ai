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
from app.services.mcp_server import mcp_app
from app.services.redis_client import Redis


@asynccontextmanager
async def app_lifespan(_: FastAPI):
    """Create the database and tables"""
    create_db_and_tables()
    await Redis.check_connection()
    # 關閉 Redis 連接
    await Redis.close()
    yield


# Combine both lifespans
@asynccontextmanager
async def combined_lifespan(_: FastAPI):
    """Run both lifespans"""
    async with app_lifespan(_):
        async with mcp_app.lifespan(_):
            yield


app = FastAPI(title="Prompt Master", lifespan=combined_lifespan)
app.mount("/mcp", mcp_app)

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
