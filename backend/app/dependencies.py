"""
依賴注入模組
"""
from typing import Annotated
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, create_engine, SQLModel
from jose import ExpiredSignatureError, JWTError
from app.utils import decode_token
from sqlmodel import select
from app.models.user import User

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    """建立資料庫和資料表"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """取得資料庫會話"""
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

security = HTTPBearer(
    auto_error=False  # 當沒有提供 token 時不自動拋出錯誤
)

def get_token_header(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    """
    取得 token，基本驗證
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing"
        )
    return credentials.credentials


def get_current_user(
    token: Annotated[str, Depends(get_token_header)], 
    session: SessionDep
):
    """
    驗證 token 並回傳當前使用者
    """
    try:
        payload = decode_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="無效的認證憑證"
            )
        user_id = payload.get("user_id")
        user = session.exec(
            select(User).where(User.user_id == user_id)
        )
        return user.first()  # 返回第一個匹配的使用者
    except ExpiredSignatureError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 已過期，請重新登入"
        ) from e
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無效的認證憑證"
        ) from e
