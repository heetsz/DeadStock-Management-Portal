from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VendorBase(BaseModel):
    vendor_name: str
    bill_number: Optional[str] = None
    contact_info: Optional[str] = None


class VendorCreate(VendorBase):
    pass


class VendorUpdate(BaseModel):
    vendor_name: Optional[str] = None
    bill_number: Optional[str] = None
    contact_info: Optional[str] = None


class VendorResponse(VendorBase):
    vendor_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

