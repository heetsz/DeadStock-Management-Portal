from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime
from decimal import Decimal


class AssignmentBase(BaseModel):
    teacher_id: Optional[str] = None
    assigned_quantity: int
    assignment_date: date
    current_location: Optional[str] = None
    remarks: Optional[str] = None


class AssignmentCreate(AssignmentBase):
    pass


class AssignmentUpdate(BaseModel):
    teacher_id: Optional[str] = None
    assigned_quantity: Optional[int] = None
    assignment_date: Optional[date] = None
    current_location: Optional[str] = None
    remarks: Optional[str] = None


class AssignmentReturn(BaseModel):
    return_date: date
    remarks: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    assignment_id: str
    asset_id: str
    return_date: Optional[date] = None
    created_at: datetime
    
    # Computed fields
    assigned_cost: Optional[Decimal] = None
    teacher_name: Optional[str] = None
    asset_description: Optional[str] = None
    
    class Config:
        from_attributes = True

