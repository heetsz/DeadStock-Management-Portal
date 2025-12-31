from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from io import BytesIO

from app.core.database import get_db
from app.schemas.asset import AssetFilters
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/assets")
def export_asset_report(
    format: str = Query('pdf', regex='^(pdf|csv|xlsx)$'),
    financial_year: Optional[str] = Query(None, regex=r"^\d{4}-\d{4}$"),
    lab_id: Optional[str] = None,
    vendor_id: Optional[str] = None,
    category_id: Optional[str] = None,
    is_special_hardware: Optional[bool] = None,
    issued_status: Optional[str] = Query(None, regex="^(issued_only|not_issued|partially_issued)$"),
    scrap_status: Optional[str] = Query(None, regex="^(scrapped_only|exclude_scrapped)$"),
    teacher_id: Optional[str] = None,
    search: Optional[str] = None,
    purchase_date_from: Optional[date] = None,
    purchase_date_to: Optional[date] = None,
    cost_min: Optional[float] = Query(None, ge=0),
    cost_max: Optional[float] = Query(None, ge=0),
    scrap_cost_min: Optional[float] = Query(None, ge=0),
    scrap_cost_max: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db)
):
    """Export asset report in PDF, CSV, or Excel format"""
    filters = AssetFilters(
        financial_year=financial_year,
        lab_id=lab_id,
        vendor_id=vendor_id,
        category_id=category_id,
        is_special_hardware=is_special_hardware,
        issued_status=issued_status,
        scrap_status=scrap_status,
        teacher_id=teacher_id,
        search=search,
        purchase_date_from=purchase_date_from,
        purchase_date_to=purchase_date_to,
        cost_min=cost_min,
        cost_max=cost_max,
        scrap_cost_min=scrap_cost_min,
        scrap_cost_max=scrap_cost_max
    )
    
    service = ReportService()
    try:
        file_bytes, filename, content_type = service.generate_asset_report(db, filters, format)
        return StreamingResponse(
            BytesIO(file_bytes),
            media_type=content_type,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    from sqlalchemy import func
    from app.models import Asset, AssetAssignment, Scrap
    
    # Total assets
    total_assets = db.query(func.count(Asset.asset_id)).scalar()
    
    # Total quantity purchased
    total_quantity = db.query(func.coalesce(func.sum(Asset.total_quantity), 0)).scalar() or 0
    
    # Total original cost
    total_original_cost = db.query(func.coalesce(func.sum(Asset.original_total_cost), 0)).scalar() or 0
    
    # Total current cost
    total_current_cost = db.query(func.coalesce(func.sum(Asset.current_total_cost), 0)).scalar() or 0
    
    # Total assigned quantity
    total_assigned = db.query(
        func.coalesce(func.sum(AssetAssignment.assigned_quantity), 0)
    ).filter(AssetAssignment.return_date.is_(None)).scalar() or 0
    
    # Total scrapped quantity
    total_scrapped = db.query(func.coalesce(func.sum(Scrap.scrapped_quantity), 0)).scalar() or 0
    
    # Total available
    total_available = total_quantity - total_assigned - total_scrapped
    
    # Assets with multiple teachers
    from sqlalchemy import distinct
    assets_with_multiple_teachers = db.query(
        func.count(distinct(AssetAssignment.asset_id))
    ).filter(
        AssetAssignment.return_date.is_(None)
    ).group_by(AssetAssignment.asset_id).having(
        func.count(distinct(AssetAssignment.teacher_id)) > 1
    ).count()
    
    return {
        "total_assets": total_assets,
        "total_quantity_purchased": int(total_quantity),
        "total_original_cost": float(total_original_cost),
        "total_current_cost": float(total_current_cost),
        "total_assigned_quantity": int(total_assigned),
        "total_scrapped_quantity": int(total_scrapped),
        "total_available_quantity": int(total_available),
        "assets_with_multiple_teachers": assets_with_multiple_teachers
    }

