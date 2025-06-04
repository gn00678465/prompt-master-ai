from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
import pytest

from app.dependencies import get_session
from app.main import app


# 模擬資料庫依賴
async def get_test_database():
    return {"test": "database"}


# 覆寫依賴
app.dependency_overrides[get_session] = get_test_database


@pytest.fixture
def client():
    """同步測試客戶端"""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
async def async_client():
    """異步測試客戶端"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def sample_user_data():
    """測試用戶資料"""
    return {"username": "testuser", "email": "test@example.com", "is_active": True}
