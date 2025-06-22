"""
Prompt 優化服務模組
"""

from sqlmodel import Session, select

from app.models import PromptHistory, Template
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
        self, user_id: int | None, request: PromptOptimizeRequest
    ) -> PromptOptimizeResponse:
        """
        優化 Prompt 的主要邏輯

        1. 驗證並獲取模板
        2. 檢查用戶權限
        3. 呼叫 Gemini API
        4. 儲存歷史記錄(如果用戶已登入)
        5. 返回結果
        """
        # 1. 獲取模板
        template = await self._get_template(user_id, request.template_id)

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
            temperature,
            max_output_tokens=request.max_output_tokens,
        )

        # 3. 儲存歷史記錄
        if user_id is not None:
            await self._save_history(
                user_id=user_id,
                original_prompt=request.original_prompt,
                optimized_prompt=optimized_result["optimized_prompt"],
                template_id=template_id,
                model_used=model,
                temperature=temperature,
            )  # 4. 返回結果
        return PromptOptimizeResponse(
            optimized_prompt=optimized_result["optimized_prompt"],
            improvement_analysis=optimized_result["improvement_analysis"],
            original_prompt=request.original_prompt,
        )

    async def _get_template(
        self, user_id: int | None, template_id: int | None
    ) -> Template:
        """
        獲取模板

        規則：
        - 當 user_id is not None: 尋找符合 user_id 與 template_id 的模板
        - 當 user_id is None: 尋找符合 is_default=True 與 template_id 的模板
        """
        if template_id is None:
            raise ValueError("未提供模板")

        # 根據 user_id 是否為 None 來構建不同的查詢條件
        if user_id is not None:
            # 已登入用戶：查找該用戶的模板
            statement = select(Template).where(
                Template.template_id == template_id, Template.user_id == user_id
            )
        else:
            # 未登入用戶：只能使用預設模板
            statement = select(Template).where(
                Template.template_id == template_id, Template.is_default
            )

        template = self.session.exec(statement).first()
        if not template:
            raise ValueError("模板不存在")

        return template

    async def _call_gemini_api(
        self,
        template_content: str,
        user_prompt: str,
        model: str,
        temperature: float,
        max_output_tokens: int | None = None,
    ) -> dict:
        """調用 Gemini API"""
        try:
            optimized_text = self.gemini_client.generate_content(
                model=model,
                system_instruction=template_content,
                content=user_prompt,
                temperature=temperature,
                max_output_tokens=max_output_tokens,
            )

            # 這裡需要進一步處理 Gemini 回應，提取優化後的 prompt 和分析
            # 暫時簡化處理
            return {
                "optimized_prompt": optimized_text,
                "improvement_analysis": "已根據模板進行優化",
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
        temperature: float,
    ) -> PromptHistory:
        """儲存優化歷史記錄"""
        history = PromptHistory(
            user_id=user_id,
            original_prompt=original_prompt,
            optimized_prompt=optimized_prompt,
            template_id=template_id,
            model_used=model_used,
            temperature=temperature,
        )

        self.session.add(history)
        self.session.commit()
        self.session.refresh(history)

        return history
