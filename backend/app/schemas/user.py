from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserOut(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    created_at: datetime
    last_login: datetime | None

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str