from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from typing import List


from app.core.database import get_db
from app.schemas.scrap import ScrapCreate, ScrapResponse, ScrapPhaseSummary
from app.services.scrap_service import ScrapService

router = APIRouter(prefix="/scrap", tags=["Scrap"])


@router.post("/assets/{asset_id}/scrap", response_model=ScrapResponse, status_code=201)
def create_scrap(
    asset_id: str,
    scrap_data: ScrapCreate,
    db: Session = Depends(get_db)
):
    """Create scrap record with auto-calculated proportional value"""
    service = ScrapService()
    try:
        scrap = service.create_scrap(db, asset_id, scrap_data)
        return ScrapResponse(
            **scrap.__dict__,
            asset_description=None,
            cumulative_scrapped=None,
            cumulative_value=None
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=dict)
def get_scrap_records(
    asset_id: Optional[str] = None,
    phase_id: Optional[str] = Query(None, description="Filter by scrap phase ID"),
    financial_year: Optional[str] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get scrap records with filters"""
    service = ScrapService()
    return service.get_scrap_records(
        db, asset_id, phase_id, financial_year, date_from, date_to, page, size
    )


@router.get("/summary-by-phase", response_model=List[ScrapPhaseSummary])
def get_phase_summary(db: Session = Depends(get_db)):
    """Get scrap summary by phase"""
    service = ScrapService()
    return service.get_phase_summary(db)


@router.get("/assets/{asset_id}/history", response_model=dict)
def get_asset_scrap_history(asset_id: str, db: Session = Depends(get_db)):
    """Get scrap history for an asset"""
    service = ScrapService()
    from app.services.asset_service import AssetService
    asset_service = AssetService()
    
    asset = asset_service.get_asset(db, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    scrap_history = service.get_scrap_records(db, asset_id=asset_id, page=1, size=1000)
    
    return {
        "asset": {
            "asset_id": asset.asset_id,
            "description": asset.description,
            "total_quantity": asset.total_quantity,
            "original_total_cost": float(asset.original_total_cost),
            "current_total_cost": float(asset.current_total_cost)
        },
        "scrap_history": scrap_history["items"]
    }

