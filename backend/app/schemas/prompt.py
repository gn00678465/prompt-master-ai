from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PromptOptimizeRequest(BaseModel):
    original_prompt: str
    template_id: int | None = None
    model: Optional[str] = "gemini-pro"
    temperature: float | None = 0.7

class PromptOptimizeResponse(BaseModel):
    optimized_prompt: str
    improvement_analysis: str
    original_prompt: str

class PromptHistoryOut(BaseModel):
    history_id: int
    original_prompt: str
    optimized_prompt: str | None
    model_used: str
    temperature: float
    created_at: datetime
