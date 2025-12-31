from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal


class AssetBase(BaseModel):
    description: str
    category_id: Optional[str] = None
    is_special_hardware: bool = False
    total_quantity: int
    purchase_date: date
    vendor_id: Optional[str] = None
    original_total_cost: Decimal
    lab_id: Optional[str] = None
    physical_location: Optional[str] = None
    remarks: Optional[str] = None


class AssetCreate(AssetBase):
    pass


class AssetUpdate(BaseModel):
    description: Optional[str] = None
    category_id: Optional[str] = None
    is_special_hardware: Optional[bool] = None
    total_quantity: Optional[int] = None
    purchase_date: Optional[date] = None
    vendor_id: Optional[str] = None
    original_total_cost: Optional[Decimal] = None
    lab_id: Optional[str] = None
    physical_location: Optional[str] = None
    remarks: Optional[str] = None


class AssetResponse(AssetBase):
    asset_id: str
    financial_year: str
    current_total_cost: Decimal
    created_at: datetime
    updated_at: datetime
    
    # Computed fields
    active_assigned_quantity: int = 0
    total_scrapped_quantity: int = 0
    available_quantity: int = 0
    is_issued: bool = False
    is_fully_issued: bool = False
    is_partially_issued: bool = False
    is_scrapped: bool = False
    
    class Config:
        from_attributes = True


class AssetFilters(BaseModel):
    financial_year: Optional[str] = None
    lab_id: Optional[str] = None
    vendor_id: Optional[str] = None
    category_id: Optional[str] = None
    is_special_hardware: Optional[bool] = None
    issued_status: Optional[str] = None  # issued_only, not_issued, partially_issued
    scrap_status: Optional[str] = None  # scrapped_only, exclude_scrapped
    teacher_id: Optional[str] = None
    has_multiple_teachers: Optional[bool] = None
    search: Optional[str] = None
    purchase_date_from: Optional[date] = None
    purchase_date_to: Optional[date] = None
    cost_min: Optional[float] = None
    cost_max: Optional[float] = None
    scrap_cost_min: Optional[float] = None  # Min scrapped cost
    scrap_cost_max: Optional[float] = None  # Max scrapped cost


class AssetListResponse(BaseModel):
    items: List[AssetResponse]
    total: int
    page: int
    size: int
    pages: int

