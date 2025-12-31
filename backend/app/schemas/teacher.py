from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TeacherBase(BaseModel):
    name: str
    department: Optional[str] = None
    designation: Optional[str] = None
    is_active: bool = True


class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    is_active: Optional[bool] = None


class TeacherResponse(TeacherBase):
    teacher_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

