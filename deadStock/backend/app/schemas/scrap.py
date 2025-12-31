from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal


class ScrapBase(BaseModel):
    scrapped_quantity: int
    scrap_date: date
    scrap_phase: str  # Phase 1, Phase 2, etc.
    remarks: Optional[str] = None


class ScrapCreate(ScrapBase):
    pass


class ScrapResponse(ScrapBase):
    scrap_id: str
    asset_id: str
    scrap_value: Decimal
    created_at: datetime
    
    # Computed fields
    asset_description: Optional[str] = None
    cumulative_scrapped: Optional[int] = None
    cumulative_value: Optional[Decimal] = None
    
    class Config:
        from_attributes = True


class ScrapPhaseSummary(BaseModel):
    scrap_phase: str
    assets_count: int
    total_quantity_scrapped: int
    total_scrap_value: Decimal
    earliest_scrap_date: Optional[date] = None
    latest_scrap_date: Optional[date] = None

