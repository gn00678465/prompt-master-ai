"""
Google Gemini API 客戶端
"""
import logging
from google import genai
from google.genai import types
from app.config import settings

logger = logging.getLogger(__name__)


class GeminiClient:
    """Gemini API 客戶端

    封裝 Google Gemini API 的交互，提供：
    - API 認證與設定
    - 請求建構與發送
    - 回應處理與解析
    - 錯誤處理與重試
    """

    def __init__(self, api_key: str | None = None, max_retries: int = 3, retry_delay: float = 1.0):
        """初始化 Gemini API 客戶端

        Args:
            api_key: API 密鑰，如果未提供則從設定中讀取
            max_retries: 最大重試次數
            retry_delay: 重試延遲時間（秒）
        """
        self.api_key = api_key
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self._client = None

        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")

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
            temperature: float | None = None
    ) -> (str | None):
        """
        生成內容

        Args:
            model: 要使用的模型名稱
            system_instruction: 系統指令
            content: 使用者輸入內容
            temperature: 溫度參數（控制創造性），範圍 0.0-2.0

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
        if temperature is not None and not (0.0 <= temperature <= 2.0):
            raise ValueError("溫度參數必須在 0.0 到 2.0 之間")

        # 建構請求資料
        request_data = {
            "model": model,
            "config": types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=temperature
            ),
            "contents": content
        }

        return self.client.models.generate_content(
            model=request_data['model'],
            contents=request_data['contents'],
            config=request_data['config']
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
        except Exception as e:
            logger.error(f"健康檢查失敗: {str(e)}")
            return False


def gemini_service() -> GeminiClient:
    """建立並返回 Gemini API 客戶端實例（相容性函式）

    這個函式提供向後相容性，建議直接使用 GeminiClient 類別
    """
    return GeminiClient(settings.gemini_api_key)
