"""
API 路由：模型相關操作
"""

from typing import List

from fastapi import APIRouter

from app.schemas.model import Model
from app.services.gemini_client import GeminiModel

router = APIRouter(
    prefix="/v1/models",
    tags=["models"],
    responses={404: {"description": "Not found"}},
)


@router.get("/models")
async def get_available_models() -> List[Model]:
    """
    獲取可用的模型列表
    """
    _models: List[Model] = []  # 將 GeminiModel 枚舉轉換為 Model 物件列表
    for gemini_model in GeminiModel:
        # 將底線替換為空格，然後轉換為標題格式
        display_name = gemini_model.name.replace("_", " ").title()
        # 將 "2 5" 替換為 "2.5"
        display_name = display_name.replace("2 5", "2.5")

        model = Model(
            name=gemini_model.value,
            displayName=display_name,
        )
        _models.append(model)

    return _models
