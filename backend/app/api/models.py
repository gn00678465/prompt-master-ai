"""
API 路由：模型相關操作
"""

from typing import List

from fastapi import APIRouter, HTTPException, status

from app.dependencies import CurrentUserDep
from app.schemas.model import Model
from app.services.gemini_client import gemini_service

router = APIRouter(
    prefix="/v1/models",
    tags=["models"],
    responses={404: {"description": "Not found"}},
)


@router.get("/models")
async def get_available_models(_: CurrentUserDep) -> List[Model]:
    """
    獲取可用的模型列表
    """
    _models: List[Model] = []

    try:
        models = gemini_service().get_model_list()
        for m in models:
            if m.supported_actions and m.version and m.version.startswith("2.5"):
                for action in m.supported_actions:
                    if action == "generateContent":
                        _models.append(
                            Model(
                                name=m.name,
                                displayName=m.display_name,
                                description=m.description,
                                version=m.version,
                            )
                        )
                        break  # 找到支援的動作後跳出內層迴圈
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"無法獲取模型列表: {str(e)}",
        ) from e

    return _models
