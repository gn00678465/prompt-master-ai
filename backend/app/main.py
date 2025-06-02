from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import auth_router, models_router, prompt_router, template_router
from app.dependencies import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create the database and tables"""
    create_db_and_tables()
    yield
    # Cleanup code can be added here if needed


app = FastAPI(lifespan=lifespan)
app.include_router(
    auth_router,
    prefix="/api",
)
app.include_router(prompt_router, prefix="/api")
app.include_router(template_router, prefix="/api")
app.include_router(models_router, prefix="/api")


@app.get("/")
async def read_root():
    """Root endpoint"""
    return {"Hello": "World"}
