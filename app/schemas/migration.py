from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.migration import MigrationStatus
from datetime import datetime

class MigrationCreate(BaseModel):
    source_email: EmailStr
    source_password: str
    source_host: str
    dest_email: EmailStr
    dest_password: str
    dest_host: str

class MigrationResponse(BaseModel):
    id: int
    user_id: int
    source_email: str
    source_host: str
    dest_email: str
    dest_host: str
    status: MigrationStatus
    created_at: datetime
    logs: Optional[str] = None

    class Config:
        from_attributes = True
