"""
Prompt 相關 API 端點
"""
from typing import List
from fastapi import APIRouter, HTTPException, status
from sqlmodel import select, desc
from app.dependencies import SessionDep, CurrentUserDep
from app.models import PromptHistory
from app.schemas.prompt import PromptOptimizeRequest, PromptOptimizeResponse, PromptHistoryOut
from app.services.prompt_optimizer import PromptOptimizerService
from app.services.gemini_client import gemini_service

router = APIRouter(
    prefix="/v1/prompts",
    tags=["prompts"],
    responses={404: {"description": "Not found"}},
)


@router.post("/optimize", response_model=PromptOptimizeResponse)
async def optimize_prompt(
    request: PromptOptimizeRequest,
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    優化 Prompt

    根據選擇的模板作為系統提示詞與 Gemini API 互動
    """
    if current_user.user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="無效的使用者 ID"
        )

    try:
        optimizer = PromptOptimizerService(session, gemini_service())
        result = await optimizer.optimize_prompt(
            user_id=current_user.user_id,
            request=request
        )
        return result

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) from e
    except PermissionError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        ) from e
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) from e


@router.get("/history", response_model=List[PromptHistoryOut])
async def get_prompt_history(
    session: SessionDep,
    current_user: CurrentUserDep
):
    """
    獲取用戶的 Prompt 歷史記錄
    """

    statement = select(PromptHistory).where(
        PromptHistory.user_id == current_user.user_id
    ).order_by(desc(PromptHistory.created_at))

    history = session.exec(statement).all()

    return [
        PromptHistoryOut(
            history_id=h.history_id,
            original_prompt=h.original_prompt,
            optimized_prompt=h.optimized_prompt,
            model_used=h.model_used,
            temperature=h.temperature,
            created_at=h.created_at
        )
        for h in history
        if h.history_id is not None
    ]
