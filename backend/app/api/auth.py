"""
認證 API Module
"""
from typing import Annotated
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Body, HTTPException, status
from sqlmodel import select
from app.dependencies import get_token_header, SessionDep, get_current_user
from app.models import User, TokenBlacklist
from app.schemas.user import UserCreate, UserOut, UserLogin
from app.utils import hash_password, verify_password, create_access_token, decode_token

router = APIRouter(
    prefix="/v1/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


@router.post("/register", response_model=UserOut)
async def user_register(data: Annotated[UserCreate, Body()], session: SessionDep):
    """_summary_
    用戶註冊
    """
    # 檢查使用者名稱是否已存在
    existing_user = session.exec(
        select(User).where(User.username == data.username)
    )
    if existing_user.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="使用者名稱已存在"
        )
    # 檢查 email 是否已存在
    existing_email = session.exec(
        select(User).where(User.email == data.email)
    )
    if existing_email.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email 已存在"
        )

    new_user = User(username=data.username,
                    email=data.email,
                    password_hash=hash_password(data.password),  # 密碼應該加密存儲
                    created_at=datetime.now(timezone.utc),
                    last_login=None
                    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # 直接回傳 User 物件，FastAPI 會自動轉換為 UserOut
    return {
        **new_user.model_dump(),
        "access_token": create_access_token({
            "user_id": new_user.user_id,
            "username": new_user.username,
            "email": new_user.email
        })
    }


@router.post("/login", response_model=UserOut)
async def user_login(data: Annotated[UserLogin, Body()], session: SessionDep):
    """_summary_
    用戶登入
    """
    # 檢查使用者名稱是否已存在
    existing_user = session.exec(
        select(User).where(User.username == data.username)
    )
    user = existing_user.first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="使用者名稱不存在或密碼錯誤"
        )
    # 檢查密碼是否正確
    if not verify_password(user.password_hash, data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="使用者名稱不存在或密碼錯誤"
        )
    # 更新最後登入時間
    user.last_login = datetime.now(timezone.utc)
    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        **user.model_dump(),
        "access_token": create_access_token({
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email
        })
    }


@router.get("/me", response_model=UserOut)
async def read_current_user(data: Annotated[str, Depends(get_current_user)]):
    """_summary_
    獲取當前用戶信息
    """
    return data


@router.post("/logout")
async def user_logout(
    token: Annotated[str, Depends(get_token_header)],
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """用戶登出，將 Token 加入黑名單"""
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        exp = payload.get("exp")

        if jti and exp:
            # 檢查 user_id 是否為 None
            if current_user.user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="無效的使用者"
                )

            # 將 Token 加入黑名單
            blacklist_entry = TokenBlacklist(
                token_jti=jti,
                user_id=current_user.user_id,
                expires_at=datetime.fromtimestamp(exp, tz=timezone.utc)
            )
            session.add(blacklist_entry)
            session.commit()

        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="登出失敗"
        ) from e
