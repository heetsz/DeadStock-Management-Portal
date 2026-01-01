from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ScrapPhaseBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True


class ScrapPhaseCreate(ScrapPhaseBase):
    pass


class ScrapPhaseUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class ScrapPhaseResponse(ScrapPhaseBase):
    phase_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

