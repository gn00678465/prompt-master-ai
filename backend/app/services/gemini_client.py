"""
Google Gemini API 客戶端
"""
import time
import logging
from enum import Enum
from typing import Optional, Dict, Any
from google import genai
from app.config import settings

logger = logging.getLogger(__name__)

class GeminiModel(Enum):
    """
    Gemini 模型枚舉
    提供可用的 Gemini 模型名稱
    """
    GEMINI_2_5_FLASH = 'gemini-2.5-flash-preview-05-20'
    GEMINI_2_5_PRO = 'gemini-2.5-pro-preview-05-06'
    GEMINI_2_0_FLASH = 'gemini-2.0-flash-001'
    GEMINI_2_0_FLASH_LITE = 'gemini-2.0-flash-lite-001'


class GeminiClient:
    """Gemini API 客戶端
    
    封裝 Google Gemini API 的交互，提供：
    - API 認證與設定
    - 請求建構與發送
    - 回應處理與解析
    - 錯誤處理與重試
    """

    def __init__(self, api_key: Optional[str] = None, max_retries: int = 3, retry_delay: float = 1.0):
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
    
    def generate_content(self, prompt: str, model: GeminiModel = GeminiModel.GEMINI_2_5_FLASH, **kwargs) -> Dict[str, Any]:
        """生成內容
        
        Args:
            prompt: 輸入提示
            model: 使用的模型名稱
            **kwargs: 其他生成參數（如 temperature, max_tokens 等）
            
        Returns:
            包含生成結果的字典
            
        Raises:
            Exception: 當 API 調用失敗時
        """
        request_data = {
            "model": model,
            "contents": [{"parts": [{"text": prompt}]}],
            **kwargs
        }

        return self._execute_with_retry(self._generate_content_request, request_data)

    def _generate_content_request(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """執行生成內容請求"""
        try:
            response = self.client.models.generate_content(**request_data)
            return self._parse_response(response)
        except Exception as e:
            logger.error(f"Gemini API 請求失敗: {str(e)}")
            raise

    def _parse_response(self, response) -> Dict[str, Any]:
        """解析 API 回應
        
        Args:
            response: Gemini API 回應物件
            
        Returns:
            解析後的回應資料
        """
        try:
            # 根據 Gemini API 回應格式解析
            if hasattr(response, 'candidates') and response.candidates:
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and candidate.content:
                    content = candidate.content
                    if hasattr(content, 'parts') and content.parts:
                        text = content.parts[0].text
                        return {
                            "success": True,
                            "content": text,
                            "model": getattr(response, 'model_version', None),
                            "usage": getattr(response, 'usage_metadata', None)
                        }

            return {
                "success": False,
                "content": None,
                "error": "無法解析 API 回應"
            }
        except Exception as e:
            logger.error(f"解析 API 回應時發生錯誤: {str(e)}")
            return {
                "success": False,
                "content": None,
                "error": f"回應解析錯誤: {str(e)}"
            }

    def _execute_with_retry(self, func, *args, **kwargs) -> Dict[str, Any]:
        """執行函式並提供重試機制

        Args:
            func: 要執行的函式
            *args: 函式位置參數
            **kwargs: 函式關鍵字參數

        Returns:
            函式執行結果
        """
        last_exception = None

        for attempt in range(self.max_retries + 1):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_exception = e
                logger.warning(f"API 請求失敗 (嘗試 {attempt + 1}/{self.max_retries + 1}): {str(e)}")
                
                if attempt < self.max_retries:
                    time.sleep(self.retry_delay * (2 ** attempt))  # 指數退避
                else:
                    logger.error(f"API 請求在 {self.max_retries + 1} 次嘗試後仍然失敗")

        if last_exception is not None:
            raise last_exception
        else:
            raise Exception("未知錯誤：重試循環結束但沒有捕獲到例外")

    def health_check(self) -> bool:
        """檢查 API 連接狀態

        Returns:
            True 如果連接正常，False 否則
        """
        try:
            # 發送簡單的測試請求
            test_response = self.generate_content("Hello", model=GeminiModel.GEMINI_2_5_FLASH)
            return test_response.get("success", False)
        except Exception as e:
            logger.error(f"健康檢查失敗: {str(e)}")
            return False


def gemini_service() -> GeminiClient:
    """建立並返回 Gemini API 客戶端實例（相容性函式）
    
    這個函式提供向後相容性，建議直接使用 GeminiClient 類別
    """
    return GeminiClient(settings.gemini_api_key)
