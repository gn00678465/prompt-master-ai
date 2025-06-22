"""
Prompt History 相關 API 端點
"""

from typing import List

from fastapi import APIRouter
from sqlmodel import desc, select

from app.dependencies import SessionDep, VerifyUserDep
from app.models import PromptHistory
from app.schemas.prompt import (
    PromptHistoryOut,
)

router = APIRouter(
    prefix="/v1/prompts",
    tags=["history"],
    responses={404: {"description": "Not found"}},
)


@router.get("/history", response_model=List[PromptHistoryOut])
async def get_prompt_history(session: SessionDep, current_user: VerifyUserDep):
    """
    獲取用戶的 Prompt 歷史記錄
    """

    statement = (
        select(PromptHistory)
        .where(PromptHistory.user_id == current_user.user_id)
        .order_by(desc(PromptHistory.created_at))
    )

    history = session.exec(statement).all()

    return [
        PromptHistoryOut(
            history_id=h.history_id,
            original_prompt=h.original_prompt,
            optimized_prompt=h.optimized_prompt,
            model_used=h.model_used,
            temperature=h.temperature,
            created_at=h.created_at,
        )
        for h in history
        if h.history_id is not None
    ]
