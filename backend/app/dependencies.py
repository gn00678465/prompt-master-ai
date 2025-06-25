"""
依賴注入模組
"""

from pathlib import Path
import subprocess
from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import ExpiredSignatureError, JWTError
from sqlmodel import Session, SQLModel, create_engine, select

from app.config import settings
from app.models import User
from app.utils import decode_token, is_token_blacklisted

engine = create_engine(settings.database_url, connect_args={"check_same_thread": False})


def run_alembic_migration():
    """執行 Alembic 資料庫遷移"""
    try:
        # 取得專案根目錄
        backend_dir = Path(__file__).parent.parent

        print("🔄 檢查資料庫遷移狀態...")

        # 執行 alembic upgrade head
        # 明確指定編碼為 utf-8，避免 Windows CP950 編碼問題
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",  # 遇到無法解碼的字符時用替代字符替換
            check=True,
        )

        if result.stdout.strip():
            print("✅ 資料庫遷移完成:")
            print(result.stdout)
        else:
            print("✅ 資料庫已是最新版本")

    except subprocess.CalledProcessError as e:
        print("❌ 資料庫遷移失敗:")
        print(e.stderr)
        print("⚠️  繼續使用 SQLModel.metadata.create_all() 建立資料表")
        # 如果遷移失敗，回退到原本的建立方式
        SQLModel.metadata.create_all(engine)
    except FileNotFoundError:
        print("⚠️  找不到 alembic 指令，使用 SQLModel.metadata.create_all() 建立資料表")
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        print(f"⚠️  遷移過程發生錯誤: {e}")
        print("⚠️  使用 SQLModel.metadata.create_all() 建立資料表")
        SQLModel.metadata.create_all(engine)


def create_db_and_tables():
    """建立資料庫和資料表"""
    # 嘗試執行 Alembic 遷移，如果失敗則使用原本方式
    run_alembic_migration()


def get_session():
    """取得資料庫會話"""
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

security = HTTPBearer(
    auto_error=False  # 當沒有提供 token 時不自動拋出錯誤
)


def get_token_header(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> str:
    """
    取得 token，基本驗證
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is missing"
        )
    return credentials.credentials


def verify_current_user(
    token: Annotated[str, Depends(get_token_header)],
    session: Annotated[Session, Depends(get_session)],
) -> User | None:
    """
    驗證 token 並回傳當前使用者
    """
    try:
        payload = decode_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="無效的認證憑證"
            )

        # 檢查 JTI 是否在黑名單中
        jti: str | None = payload.get("jti")
        if jti and is_token_blacklisted(jti):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 已失效"
            )

        user_id = payload.get("user_id")
        user = session.exec(select(User).where(User.user_id == user_id))
        return user.first()  # 返回第一個匹配的使用者
    except ExpiredSignatureError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 已過期，請重新登入"
        ) from e
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="無效的認證憑證"
        ) from e


def get_optional_token_header(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> str | None:
    """
    取得可選的 token，如果沒有提供則回傳 None
    """
    if credentials is None:
        return None
    return credentials.credentials


def verify_optional_current_user(
    token: Annotated[str | None, Depends(get_optional_token_header)],
    session: Annotated[Session, Depends(get_session)],
) -> User | None:
    """
    可選的使用者驗證，如果沒有 token 則回傳 None
    """
    if token is None:
        return None

    try:
        payload = decode_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="無效的認證憑證"
            )

        # 檢查 JTI 是否在黑名單中
        jti: str | None = payload.get("jti")
        if jti and is_token_blacklisted(jti):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 已失效"
            )

        user_id = payload.get("user_id")
        user = session.exec(select(User).where(User.user_id == user_id))
        return user.first()  # 返回第一個匹配的使用者
    except ExpiredSignatureError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token 已過期，請重新登入"
        ) from e
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="無效的認證憑證"
        ) from e


VerifyUserDep = Annotated[User, Depends(verify_current_user)]
OptionalVerifyUserDep = Annotated[User | None, Depends(verify_optional_current_user)]
