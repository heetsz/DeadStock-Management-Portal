from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LabBase(BaseModel):
    lab_name: str
    room_number: Optional[str] = None
    status: str = "ACTIVE"


class LabCreate(LabBase):
    pass


class LabUpdate(BaseModel):
    lab_name: Optional[str] = None
    room_number: Optional[str] = None
    status: Optional[str] = None


class LabResponse(LabBase):
    lab_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

