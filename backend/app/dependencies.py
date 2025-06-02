"""
依賴注入模組
"""
from typing import Annotated

from app.models import User
from app.utils import decode_token, is_token_blacklisted
from app.config import settings

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import ExpiredSignatureError, JWTError
from sqlmodel import Session, SQLModel, create_engine, select

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False}
)

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
) -> (User | None):
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

         # 檢查 JTI 是否在黑名單中
        jti = payload.get("jti")
        if jti and is_token_blacklisted(jti, session):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token 已失效"
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

CurrentUserDep = Annotated[User, Depends(get_current_user)]
