from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from typing import Optional, List
from datetime import date
from decimal import Decimal
import math

from app.models import Asset, Scrap
from app.schemas.scrap import ScrapCreate, ScrapResponse, ScrapPhaseSummary


class ScrapService:
    
    def create_scrap(
        self,
        db: Session,
        asset_id: str,
        scrap_data: ScrapCreate
    ) -> Scrap:
        """
        Create scrap record with auto-calculated proportional value.
        Uses transaction + row lock to prevent race conditions.
        """
        # Lock asset row
        asset = db.query(Asset).filter(Asset.asset_id == asset_id).with_for_update().first()
        
        if not asset:
            raise ValueError(f"Asset {asset_id} not found")
        
        # Calculate current usage
        from app.services.asset_service import AssetService
        asset_service = AssetService()
        active_assigned = asset_service._get_active_assigned_quantity(db, asset_id)
        total_scrapped = asset_service._get_total_scrapped_quantity(db, asset_id)
        
        available = asset.total_quantity - active_assigned - total_scrapped
        
        # Validate
        if scrap_data.scrapped_quantity > available:
            raise ValueError(
                f"Cannot scrap {scrap_data.scrapped_quantity} units. "
                f"Only {available} units available "
                f"(Total: {asset.total_quantity}, "
                f"Assigned: {active_assigned}, "
                f"Already Scrapped: {total_scrapped})"
            )
        
        # Calculate proportional scrap value
        # Based on CURRENT cost and REMAINING quantity
        remaining_qty = asset.total_quantity - total_scrapped
        if remaining_qty > 0:
            per_unit_cost = float(asset.current_total_cost) / remaining_qty
            scrap_value = Decimal(str(per_unit_cost * scrap_data.scrapped_quantity))
        else:
            scrap_value = Decimal('0')
        
        # Create scrap record
        scrap = Scrap(
            asset_id=asset_id,
            scrapped_quantity=scrap_data.scrapped_quantity,
            scrap_phase=scrap_data.scrap_phase,
            scrap_date=scrap_data.scrap_date,
            scrap_value=scrap_value,
            remarks=scrap_data.remarks
        )
        
        db.add(scrap)
        
        # Update asset's current cost
        asset.current_total_cost = asset.current_total_cost - scrap_value
        
        db.commit()
        db.refresh(scrap)
        return scrap
    
    def get_scrap_records(
        self,
        db: Session,
        asset_id: Optional[str] = None,
        scrap_phase: Optional[str] = None,
        financial_year: Optional[str] = None,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
        page: int = 1,
        size: int = 50
    ) -> dict:
        """Get scrap records with filters"""
        query = db.query(Scrap).join(Asset)
        
        conditions = []
        
        if asset_id:
            conditions.append(Scrap.asset_id == asset_id)
        
        if scrap_phase:
            conditions.append(Scrap.scrap_phase == scrap_phase)
        
        if financial_year:
            conditions.append(Asset.financial_year == financial_year)
        
        if date_from:
            conditions.append(Scrap.scrap_date >= date_from)
        
        if date_to:
            conditions.append(Scrap.scrap_date <= date_to)
        
        if conditions:
            query = query.filter(and_(*conditions))
        
        # Count
        total = query.count()
        
        # Paginate
        query = query.order_by(Scrap.scrap_date.desc())
        scraps = query.offset((page - 1) * size).limit(size).all()
        
        # Enhance with asset info
        result = []
        for scrap in scraps:
            asset = db.query(Asset).filter(Asset.asset_id == scrap.asset_id).first()
            
            # Calculate cumulative values
            cumulative_scrapped = db.query(func.coalesce(func.sum(Scrap.scrapped_quantity), 0)).filter(
                and_(
                    Scrap.asset_id == scrap.asset_id,
                    Scrap.scrap_date <= scrap.scrap_date
                )
            ).scalar() or 0
            
            cumulative_value = db.query(func.coalesce(func.sum(Scrap.scrap_value), 0)).filter(
                and_(
                    Scrap.asset_id == scrap.asset_id,
                    Scrap.scrap_date <= scrap.scrap_date
                )
            ).scalar() or 0
            
            scrap_dict = {
                **scrap.__dict__,
                "asset_description": asset.description if asset else None,
                "cumulative_scrapped": int(cumulative_scrapped),
                "cumulative_value": float(cumulative_value)
            }
            result.append(ScrapResponse(**scrap_dict))
        
        return {
            "items": result,
            "total": total,
            "page": page,
            "pages": math.ceil(total / size) if total > 0 else 0
        }
    
    def get_phase_summary(self, db: Session) -> List[ScrapPhaseSummary]:
        """Get summary statistics by scrap phase"""
        results = db.query(
            Scrap.scrap_phase,
            func.count(func.distinct(Scrap.asset_id)).label('assets_count'),
            func.sum(Scrap.scrapped_quantity).label('total_quantity'),
            func.sum(Scrap.scrap_value).label('total_value'),
            func.min(Scrap.scrap_date).label('earliest_date'),
            func.max(Scrap.scrap_date).label('latest_date')
        ).group_by(Scrap.scrap_phase).order_by(Scrap.scrap_phase).all()
        
        return [
            ScrapPhaseSummary(
                scrap_phase=row.scrap_phase,
                assets_count=row.assets_count,
                total_quantity_scrapped=int(row.total_quantity) if row.total_quantity else 0,
                total_scrap_value=Decimal(str(row.total_value)) if row.total_value else Decimal('0'),
                earliest_scrap_date=row.earliest_date,
                latest_scrap_date=row.latest_date
            )
            for row in results
        ]

