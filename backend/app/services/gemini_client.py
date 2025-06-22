"""
Google Gemini API 客戶端
"""

from enum import Enum
import logging

from google import genai
from google.genai import types

logger = logging.getLogger(__name__)


class GeminiClient:
    """Gemini API 客戶端

    封裝 Google Gemini API 的交互，提供：
    - API 認證與設定
    - 請求建構與發送
    - 回應處理與解析
    - 錯誤處理與重試
    """

    def __init__(
        self,
        api_key: str,
    ):
        """初始化 Gemini API 客戶端

        Args:
            api_key: API 密鑰（必需參數）
        """
        if not api_key:
            raise ValueError("API 密鑰不能為空")

        self.api_key = api_key
        self._client = None
        self.default_temperature = 0.2
        self.default_max_output_tokens = 2048

    @property
    def client(self) -> genai.Client:
        """獲取 Gemini 客戶端實例（懶載入）"""
        if self._client is None:
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    def get_model_list(self):
        """
        獲取可用的模型列表
        """
        return self.client.models.list()

    def generate_content(
        self,
        model: str | None = None,
        system_instruction: str | None = None,
        content: str | None = None,
        temperature: float | None = None,
        max_output_tokens: int | None = None,
    ) -> str | None:
        """
        生成內容

        Args:
            model: 要使用的模型名稱
            system_instruction: 系統指令
            content: 使用者輸入內容
            temperature: 溫度參數（控制創造性），範圍 0.0-2.0
            max_output_tokens: 最大輸出令牌數量

        Returns:
            包含生成結果的字典，格式：
            {
                "success": bool,
                "content": str | None,
                "model": str | None,
                "usage": dict | None,
                "error": str | None
            }

        Raises:
            ValueError: 當參數無效時
            Exception: 當 API 請求失敗時
        """
        # 參數驗證
        if model is None:
            raise ValueError("模型名稱不能為空")
        if system_instruction is None:
            raise ValueError("系統指令不能為空")
        if content is None:
            raise ValueError("內容不能為空")
        temperature = (
            temperature if temperature is not None else self.default_temperature
        )
        # 驗證 temperature 範圍
        if not 0.0 <= temperature <= 2.0:
            raise ValueError(f"temperature 必須在 0 到 2 之間，目前值：{temperature}")
        max_output_tokens = (
            max_output_tokens
            if max_output_tokens is not None
            else self.default_max_output_tokens
        )  # 建構請求資料
        request_data = {
            "model": model,
            "config": types.GenerateContentConfig(
                system_instruction=system_instruction, temperature=temperature
            ),
            "contents": content,
        }

        return self.client.models.generate_content(
            model=request_data["model"],
            contents=request_data["contents"],
            config=request_data["config"],
        ).text

    def health_check(self) -> bool:
        """檢查 API 連接狀態

        Returns:
            True 如果連接正常，False 否則
        """
        try:
            # 發送簡單的測試請求
            model_list = self.get_model_list()
            return model_list is not None
        except (ConnectionError, TimeoutError, ValueError) as e:
            logger.error("健康檢查失敗: %s", str(e))
            return False


class GeminiModel(Enum):
    """Gemini 模型枚舉

    定義可用的 Gemini 模型名稱
    包括：
    - gemini-2.5-pro
    - gemini-2.5-flash
    - gemini-2.5-flash-lite-preview-06-17
    """

    GEMINI_2_5_PRO = "gemini-2.5-pro"
    GEMINI_2_5_FLASH = "gemini-2.5-flash"
    GEMINI_2_5_FLASH_LITE = "gemini-2.5-flash-lite-preview-06-17"


def gemini_service(api_key: str) -> GeminiClient:
    """建立並返回 Gemini API 客戶端實例

    Args:
        api_key: API 密鑰

    Returns:
        GeminiClient: 配置好的 Gemini 客戶端實例
    """
    return GeminiClient(api_key)
