"""
Prompt 相關 API 端點
"""

from fastapi import APIRouter, HTTPException, status

from app.dependencies import OptionalVerifyUserDep, SessionDep
from app.schemas.prompt import (
    PromptOptimizeRequest,
    PromptOptimizeResponse,
)
from app.services.gemini_client import gemini_service
from app.services.prompt_optimizer import PromptOptimizerService

router = APIRouter(
    prefix="/v1/prompts",
    tags=["optimize"],
    responses={404: {"description": "Not found"}},
)


@router.post("/optimize", response_model=PromptOptimizeResponse)
async def optimize_prompt(
    request: PromptOptimizeRequest,
    session: SessionDep,
    current_user: OptionalVerifyUserDep,
):
    """
    優化 Prompt

    根據選擇的模板作為系統提示詞與 Gemini API 互動

    只有登入情況下才會將結果紀錄於資料庫內
    """
    user_id = current_user.user_id if current_user else None

    if not request.api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="API 金鑰不能為空"
        )

    try:
        optimizer = PromptOptimizerService(session, gemini_service(request.api_key))
        result = await optimizer.optimize_prompt(user_id=user_id, request=request)
        return result

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e
