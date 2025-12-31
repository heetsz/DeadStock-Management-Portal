from pydantic import BaseModel
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    is_special: bool = False
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    is_special: Optional[bool] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    category_id: str
    
    class Config:
        from_attributes = True

