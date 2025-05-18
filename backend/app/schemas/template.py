from pydantic import BaseModel
from datetime import datetime

class TemplateOut(BaseModel):
    template_id: int
    name: str
    description: str | None
    is_default: bool
    category: str | None
    created_at: datetime

class TemplateCreate(BaseModel):
    name: str
    description: str | None
    content: str
    category: str | None = None
