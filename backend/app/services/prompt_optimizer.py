"""
Prompt 優化服務模組
"""
from typing import Optional
from sqlmodel import Session, select
from app.models import Template, PromptHistory
from app.schemas.prompt import PromptOptimizeRequest, PromptOptimizeResponse
from app.services.gemini_client import GeminiClient


class PromptOptimizerService:
    """
    提供 Prompt 優化的服務
    """

    def __init__(self, session: Session, gemini_client: GeminiClient):
        self.session = session
        self.gemini_client = gemini_client

    async def optimize_prompt(
        self,
        user_id: int,
        request: PromptOptimizeRequest
    ) -> PromptOptimizeResponse:
        """
        優化 Prompt 的主要邏輯

        1. 驗證並獲取模板
        2. 檢查用戶權限
        3. 呼叫 Gemini API
        4. 儲存歷史記錄
        5. 返回結果
        """
        # 1. 獲取模板
        template = await self._get_template(request.template_id)

        # 驗證必要參數
        if not request.model:
            raise ValueError("模型名稱不能為空")

        if request.temperature is None:
            raise ValueError("溫度參數不能為空")

        model = request.model
        temperature = request.temperature
        # template_id 已在 _get_template 中驗證，確保不為 None
        template_id = request.template_id
        if template_id is None:
            raise ValueError("模板 ID 不能為空")

        # 2. 調用 Gemini API 進行優化
        optimized_result = await self._call_gemini_api(
            template.content,
            request.original_prompt,
            model,
            temperature
        )

        # 3. 儲存歷史記錄
        await self._save_history(
            user_id=user_id,
            original_prompt=request.original_prompt,
            optimized_prompt=optimized_result["optimized_prompt"],
            template_id=template_id,
            model_used=model,
            temperature=temperature
        )

        # 4. 返回結果
        return PromptOptimizeResponse(
            optimized_prompt=optimized_result["optimized_prompt"],
            improvement_analysis=optimized_result["improvement_analysis"],
            original_prompt=request.original_prompt
        )

    async def _get_template(self, template_id: Optional[int]) -> Template:
        """獲取模板"""
        if template_id is None:
            raise ValueError("未提供模板")

        statement = select(Template).where(
            Template.template_id == template_id)

        template = self.session.exec(statement).first()
        if not template:
            raise ValueError("模板不存在")

        return template

    async def _call_gemini_api(
        self,
        template_content: str,
        user_prompt: str,
        model: str,
        temperature: float
    ) -> dict:
        """調用 Gemini API"""
        try:
            optimized_text = self.gemini_client.generate_content(
                model=model,
                system_instruction=template_content,
                content=user_prompt,
                temperature=temperature
            )

            # 這裡需要進一步處理 Gemini 回應，提取優化後的 prompt 和分析
            # 暫時簡化處理
            return {
                "optimized_prompt": optimized_text,
                "improvement_analysis": "已根據模板進行優化"
            }

        except Exception as e:
            raise RuntimeError(f"Gemini API 呼叫失敗: {str(e)}") from e

    async def _save_history(
        self,
        user_id: int,
        original_prompt: str,
        optimized_prompt: str,
        template_id: int,
        model_used: str,
        temperature: float
    ) -> PromptHistory:
        """儲存優化歷史記錄"""
        history = PromptHistory(
            user_id=user_id,
            original_prompt=original_prompt,
            optimized_prompt=optimized_prompt,
            template_id=template_id,
            model_used=model_used,
            temperature=temperature
        )

        self.session.add(history)
        self.session.commit()
        self.session.refresh(history)

        return history
