from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.dependencies import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create the database and tables"""
    create_db_and_tables()
    yield
    # Cleanup code can be added here if needed

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def read_root():
    """Root endpoint"""
    return {"Hello": "World"}
