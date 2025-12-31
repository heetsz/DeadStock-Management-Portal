from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_, or_, distinct
from typing import Optional, List
from datetime import date
import math

from app.models import Asset, AssetAssignment, Scrap, Lab, Vendor, Category, Teacher
from app.schemas.asset import AssetCreate, AssetUpdate, AssetFilters, AssetResponse, AssetListResponse
from app.utils.financial_year import calculate_financial_year


class AssetService:
    
    def create_asset(self, db: Session, asset_data: AssetCreate) -> Asset:
        """Create a new asset with auto-calculated financial year"""
        financial_year = calculate_financial_year(asset_data.purchase_date)
        
        db_asset = Asset(
            **asset_data.model_dump(),
            financial_year=financial_year,
            current_total_cost=asset_data.original_total_cost
        )
        
        db.add(db_asset)
        db.commit()
        db.refresh(db_asset)
        return db_asset
    
    def get_asset(self, db: Session, asset_id: str) -> Optional[Asset]:
        """Get asset by ID"""
        return db.query(Asset).filter(Asset.asset_id == asset_id).first()
    
    def update_asset(self, db: Session, asset_id: str, asset_data: AssetUpdate) -> Optional[Asset]:
        """Update asset"""
        db_asset = self.get_asset(db, asset_id)
        if not db_asset:
            return None
        
        update_data = asset_data.model_dump(exclude_unset=True)
        
        # Recalculate financial year if purchase_date changed
        if "purchase_date" in update_data:
            update_data["financial_year"] = calculate_financial_year(update_data["purchase_date"])
        
        for key, value in update_data.items():
            setattr(db_asset, key, value)
        
        db.commit()
        db.refresh(db_asset)
        return db_asset
    
    def delete_asset(self, db: Session, asset_id: str) -> bool:
        """Delete asset (only if no assignments/scrap exist)"""
        db_asset = self.get_asset(db, asset_id)
        if not db_asset:
            return False
        
        # Check if has assignments or scraps
        has_assignments = db.query(AssetAssignment).filter(
            AssetAssignment.asset_id == asset_id
        ).first() is not None
        
        has_scraps = db.query(Scrap).filter(
            Scrap.asset_id == asset_id
        ).first() is not None
        
        if has_assignments or has_scraps:
            return False  # Cannot delete
        
        db.delete(db_asset)
        db.commit()
        return True
    
    def _get_active_assigned_quantity(self, db: Session, asset_id: str) -> int:
        """Get total active assigned quantity for an asset"""
        result = db.query(func.coalesce(func.sum(AssetAssignment.assigned_quantity), 0)).filter(
            and_(
                AssetAssignment.asset_id == asset_id,
                AssetAssignment.return_date.is_(None)
            )
        ).scalar()
        return int(result) if result else 0
    
    def _get_total_scrapped_quantity(self, db: Session, asset_id: str) -> int:
        """Get total scrapped quantity for an asset"""
        result = db.query(func.coalesce(func.sum(Scrap.scrapped_quantity), 0)).filter(
            Scrap.asset_id == asset_id
        ).scalar()
        return int(result) if result else 0
    
    def _get_available_quantity(self, db: Session, asset: Asset) -> int:
        """Calculate available quantity"""
        active_assigned = self._get_active_assigned_quantity(db, asset.asset_id)
        total_scrapped = self._get_total_scrapped_quantity(db, asset.asset_id)
        return asset.total_quantity - active_assigned - total_scrapped
    
    def get_filtered_assets(
        self,
        db: Session,
        filters: AssetFilters,
        page: int = 1,
        size: int = 50,
        sort_by: str = "purchase_date",
        sort_order: str = "desc"
    ) -> AssetListResponse:
        """Get filtered assets with pagination"""
        
        # Base query
        query = db.query(Asset).distinct()
        
        # Track if we need vendor join for search
        needs_vendor_join = False
        
        # Apply filters
        conditions = []
        
        if filters.financial_year:
            conditions.append(Asset.financial_year == filters.financial_year)
        
        if filters.lab_id:
            conditions.append(Asset.lab_id == filters.lab_id)
        
        if filters.vendor_id:
            conditions.append(Asset.vendor_id == filters.vendor_id)
        
        if filters.category_id:
            conditions.append(Asset.category_id == filters.category_id)
        
        if filters.is_special_hardware is not None:
            conditions.append(Asset.is_special_hardware == filters.is_special_hardware)
        
        if filters.purchase_date_from:
            conditions.append(Asset.purchase_date >= filters.purchase_date_from)
        
        if filters.purchase_date_to:
            conditions.append(Asset.purchase_date <= filters.purchase_date_to)
        
        if filters.cost_min is not None:
            conditions.append(Asset.original_total_cost >= filters.cost_min)
        
        if filters.cost_max is not None:
            conditions.append(Asset.original_total_cost <= filters.cost_max)
        
        # Status filters require subqueries
        if filters.issued_status or filters.scrap_status or filters.teacher_id or filters.has_multiple_teachers:
            # We'll filter after fetching and calculating
            pass
        
        if filters.search:
            search_term = f"%{filters.search}%"
            # Search in asset description, remarks, and vendor name (via join)
            search_conditions = [
                Asset.description.ilike(search_term),
                Asset.remarks.ilike(search_term)
            ]
            
            # Add vendor name search - need to join Vendor table
            needs_vendor_join = True
            search_conditions.append(Vendor.vendor_name.ilike(search_term))
            
            conditions.append(or_(*search_conditions))
        
        # Apply vendor join if needed for search
        if needs_vendor_join:
            query = query.outerjoin(Vendor, Vendor.vendor_id == Asset.vendor_id)
        
        if conditions:
            query = query.filter(and_(*conditions))
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        sort_column = getattr(Asset, sort_by, Asset.purchase_date)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
        
        # Pagination
        offset = (page - 1) * size
        assets = query.offset(offset).limit(size).all()
        
        # Calculate derived fields and apply status filters
        asset_responses = []
        for asset in assets:
            active_assigned = self._get_active_assigned_quantity(db, asset.asset_id)
            total_scrapped = self._get_total_scrapped_quantity(db, asset.asset_id)
            available = asset.total_quantity - active_assigned - total_scrapped
            
            # Apply status filters
            if filters.issued_status:
                if filters.issued_status == "issued_only" and active_assigned == 0:
                    continue
                elif filters.issued_status == "not_issued" and active_assigned > 0:
                    continue
                elif filters.issued_status == "partially_issued":
                    if not (0 < active_assigned < asset.total_quantity):
                        continue
            
            if filters.scrap_status:
                if filters.scrap_status == "scrapped_only" and total_scrapped == 0:
                    continue
                elif filters.scrap_status == "exclude_scrapped" and total_scrapped == asset.total_quantity:
                    # Exclude only if ALL are scrapped (fully scrapped)
                    continue
            
            if filters.teacher_id:
                # Check if asset has active assignment to this teacher
                has_assignment = db.query(AssetAssignment).filter(
                    and_(
                        AssetAssignment.asset_id == asset.asset_id,
                        AssetAssignment.teacher_id == filters.teacher_id,
                        AssetAssignment.return_date.is_(None)
                    )
                ).first() is not None
                if not has_assignment:
                    continue
            
            if filters.has_multiple_teachers:
                # Count distinct teachers with active assignments
                teacher_count = db.query(func.count(distinct(AssetAssignment.teacher_id))).filter(
                    and_(
                        AssetAssignment.asset_id == asset.asset_id,
                        AssetAssignment.return_date.is_(None)
                    )
                ).scalar()
                if teacher_count <= 1:
                    continue
            
            # Apply scrap cost filters
            if filters.scrap_cost_min is not None or filters.scrap_cost_max is not None:
                scrap_cost = float(asset.original_total_cost - asset.current_total_cost)
                if filters.scrap_cost_min is not None and scrap_cost < filters.scrap_cost_min:
                    continue
                if filters.scrap_cost_max is not None and scrap_cost > filters.scrap_cost_max:
                    continue
            
            asset_dict = {
                **asset.__dict__,
                "active_assigned_quantity": active_assigned,
                "total_scrapped_quantity": total_scrapped,
                "available_quantity": available,
                "is_issued": active_assigned > 0,
                "is_fully_issued": active_assigned == asset.total_quantity,
                "is_partially_issued": 0 < active_assigned < asset.total_quantity,
                "is_scrapped": total_scrapped > 0
            }
            asset_responses.append(AssetResponse(**asset_dict))
        
        # Recalculate total after filtering
        total = len(asset_responses) if filters.issued_status or filters.scrap_status or filters.teacher_id or filters.has_multiple_teachers else total
        
        return AssetListResponse(
            items=asset_responses,
            total=total,
            page=page,
            size=size,
            pages=math.ceil(total / size) if total > 0 else 0
        )
    
    def get_asset_with_details(self, db: Session, asset_id: str) -> Optional[AssetResponse]:
        """Get asset with all computed fields"""
        asset = self.get_asset(db, asset_id)
        if not asset:
            return None
        
        active_assigned = self._get_active_assigned_quantity(db, asset_id)
        total_scrapped = self._get_total_scrapped_quantity(db, asset_id)
        available = asset.total_quantity - active_assigned - total_scrapped
        
        asset_dict = {
            **asset.__dict__,
            "active_assigned_quantity": active_assigned,
            "total_scrapped_quantity": total_scrapped,
            "available_quantity": available,
            "is_issued": active_assigned > 0,
            "is_fully_issued": active_assigned == asset.total_quantity,
            "is_partially_issued": 0 < active_assigned < asset.total_quantity,
            "is_scrapped": total_scrapped > 0
        }
        
        return AssetResponse(**asset_dict)

