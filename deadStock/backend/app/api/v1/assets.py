from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.core.database import get_db
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, AssetListResponse, AssetFilters
from app.services.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["Assets"])


@router.get("", response_model=AssetListResponse)
def get_assets(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    sort_by: str = Query("purchase_date", regex="^[a-z_]+$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    financial_year: Optional[str] = Query(None, regex=r"^\d{4}-\d{4}$"),
    lab_id: Optional[str] = None,
    vendor_id: Optional[str] = None,
    category_id: Optional[str] = None,
    is_special_hardware: Optional[bool] = None,
    issued_status: Optional[str] = Query(None, regex="^(issued_only|not_issued|partially_issued)$"),
    scrap_status: Optional[str] = Query(None, regex="^(scrapped_only|exclude_scrapped)$"),
    teacher_id: Optional[str] = None,
    has_multiple_teachers: Optional[bool] = None,
    search: Optional[str] = Query(None, min_length=2, max_length=200),
    purchase_date_from: Optional[date] = None,
    purchase_date_to: Optional[date] = None,
    cost_min: Optional[float] = Query(None, ge=0),
    cost_max: Optional[float] = Query(None, ge=0),
    scrap_cost_min: Optional[float] = Query(None, ge=0),
    scrap_cost_max: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db)
):
    """Get assets with multiple simultaneous filters"""
    filters = AssetFilters(
        financial_year=financial_year,
        lab_id=lab_id,
        vendor_id=vendor_id,
        category_id=category_id,
        is_special_hardware=is_special_hardware,
        issued_status=issued_status,
        scrap_status=scrap_status,
        teacher_id=teacher_id,
        has_multiple_teachers=has_multiple_teachers,
        search=search,
        purchase_date_from=purchase_date_from,
        purchase_date_to=purchase_date_to,
        cost_min=cost_min,
        cost_max=cost_max,
        scrap_cost_min=scrap_cost_min,
        scrap_cost_max=scrap_cost_max
    )
    
    service = AssetService()
    return service.get_filtered_assets(db, filters, page, size, sort_by, sort_order)


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: str, db: Session = Depends(get_db)):
    """Get asset by ID with computed fields"""
    service = AssetService()
    asset = service.get_asset_with_details(db, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset


@router.post("", response_model=AssetResponse, status_code=201)
def create_asset(asset_data: AssetCreate, db: Session = Depends(get_db)):
    """Create a new asset"""
    service = AssetService()
    asset = service.create_asset(db, asset_data)
    return service.get_asset_with_details(db, asset.asset_id)


@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(asset_id: str, asset_data: AssetUpdate, db: Session = Depends(get_db)):
    """Update an asset"""
    service = AssetService()
    asset = service.update_asset(db, asset_id, asset_data)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return service.get_asset_with_details(db, asset_id)


@router.delete("/{asset_id}", status_code=204)
def delete_asset(asset_id: str, db: Session = Depends(get_db)):
    """Delete an asset (only if no assignments/scrap exist)"""
    service = AssetService()
    if not service.delete_asset(db, asset_id):
        raise HTTPException(
            status_code=400,
            detail="Cannot delete asset with existing assignments or scrap records"
        )

