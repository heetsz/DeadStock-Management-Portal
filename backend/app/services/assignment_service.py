from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from typing import Optional, List
from datetime import date
from decimal import Decimal

from app.models import Asset, AssetAssignment, Teacher, Scrap
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentReturn, AssignmentResponse


class AssignmentService:
    
    def create_assignment(
        self,
        db: Session,
        asset_id: str,
        assignment_data: AssignmentCreate
    ) -> AssetAssignment:
        """
        Create assignment with transaction and row lock to prevent race conditions.
        Validates available quantity before assignment.
        """
        # Start transaction and lock asset row
        asset = db.query(Asset).filter(Asset.asset_id == asset_id).with_for_update().first()
        
        if not asset:
            raise ValueError(f"Asset {asset_id} not found")
        
        # Calculate current usage
        active_assigned = db.query(func.coalesce(func.sum(AssetAssignment.assigned_quantity), 0)).filter(
            and_(
                AssetAssignment.asset_id == asset_id,
                AssetAssignment.return_date.is_(None)
            )
        ).scalar() or 0
        
        total_scrapped = db.query(func.coalesce(func.sum(Scrap.scrapped_quantity), 0)).filter(
            Scrap.asset_id == asset_id
        ).scalar() or 0
        
        available = asset.total_quantity - active_assigned - total_scrapped
        
        # Validate
        if assignment_data.assigned_quantity > available:
            raise ValueError(
                f"Insufficient quantity. Available: {available}, "
                f"Requested: {assignment_data.assigned_quantity}. "
                f"(Total: {asset.total_quantity}, Assigned: {active_assigned}, Scrapped: {total_scrapped})"
            )
        
        # Create assignment
        assignment = AssetAssignment(
            asset_id=asset_id,
            **assignment_data.model_dump()
        )
        
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment
    
    def get_assignments(
        self,
        db: Session,
        asset_id: Optional[str] = None,
        teacher_id: Optional[str] = None,
        active_only: bool = False
    ) -> List[AssetAssignment]:
        """Get assignments with optional filters"""
        query = db.query(AssetAssignment)
        
        if asset_id:
            query = query.filter(AssetAssignment.asset_id == asset_id)
        
        if teacher_id:
            query = query.filter(AssetAssignment.teacher_id == teacher_id)
        
        if active_only:
            query = query.filter(AssetAssignment.return_date.is_(None))
        
        return query.order_by(AssetAssignment.assignment_date.desc()).all()
    
    def return_assignment(
        self,
        db: Session,
        assignment_id: str,
        return_data: AssignmentReturn
    ) -> Optional[AssetAssignment]:
        """Mark assignment as returned (sets return_date, doesn't delete)"""
        assignment = db.query(AssetAssignment).filter(
            AssetAssignment.assignment_id == assignment_id
        ).first()
        
        if not assignment:
            return None
        
        assignment.return_date = return_data.return_date
        if return_data.remarks:
            assignment.remarks = (assignment.remarks or "") + f"\nReturn: {return_data.remarks}"
        
        db.commit()
        db.refresh(assignment)
        return assignment
    
    def get_teacher_assignments(
        self,
        db: Session,
        teacher_id: str
    ) -> List[dict]:
        """Get all assignments for a teacher with computed costs"""
        assignments = db.query(AssetAssignment).filter(
            AssetAssignment.teacher_id == teacher_id
        ).order_by(AssetAssignment.assignment_date.desc()).all()
        
        result = []
        for assignment in assignments:
            asset = db.query(Asset).filter(Asset.asset_id == assignment.asset_id).first()
            teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
            
            if asset:
                # Calculate proportional cost
                per_unit_cost = asset.original_total_cost / asset.total_quantity
                assigned_cost = per_unit_cost * assignment.assigned_quantity
                
                result.append({
                    "assignment_id": assignment.assignment_id,
                    "asset_id": assignment.asset_id,
                    "asset_description": asset.description,
                    "assigned_quantity": assignment.assigned_quantity,
                    "assigned_cost": float(assigned_cost),
                    "assignment_date": assignment.assignment_date,
                    "return_date": assignment.return_date,
                    "current_location": assignment.current_location,
                    "status": "Active" if assignment.return_date is None else "Returned",
                    "teacher_name": teacher.name if teacher else None
                })
        
        return result

