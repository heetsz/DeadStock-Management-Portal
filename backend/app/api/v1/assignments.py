from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.core.database import get_db
from app.schemas.assignment import AssignmentCreate, AssignmentResponse, AssignmentReturn
from app.services.assignment_service import AssignmentService

router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.post("/assets/{asset_id}/assign", response_model=AssignmentResponse, status_code=201)
def assign_asset(
    asset_id: str,
    assignment_data: AssignmentCreate,
    db: Session = Depends(get_db)
):
    """Assign asset to teacher with quantity validation"""
    service = AssignmentService()
    try:
        assignment = service.create_assignment(db, asset_id, assignment_data)
        return AssignmentResponse(
            **assignment.__dict__,
            assigned_cost=None,
            teacher_name=None,
            asset_description=None
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=List[AssignmentResponse])
def get_assignments(
    asset_id: Optional[str] = None,
    teacher_id: Optional[str] = None,
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    """Get assignments with optional filters"""
    service = AssignmentService()
    assignments = service.get_assignments(db, asset_id, teacher_id, active_only)
    
    result = []
    for a in assignments:
        # Calculate assigned cost if asset exists
        assigned_cost = None
        if a.asset:
            per_unit_cost = float(a.asset.original_total_cost) / a.asset.total_quantity
            assigned_cost = per_unit_cost * a.assigned_quantity
        
        result.append(AssignmentResponse(
            **a.__dict__,
            assigned_cost=assigned_cost,
            teacher_name=a.teacher.name if a.teacher else None,
            asset_description=a.asset.description if a.asset else None
        ))
    
    return result


@router.put("/{assignment_id}/return", response_model=AssignmentResponse)
def return_assignment(
    assignment_id: str,
    return_data: AssignmentReturn,
    db: Session = Depends(get_db)
):
    """Mark assignment as returned"""
    service = AssignmentService()
    assignment = service.return_assignment(db, assignment_id, return_data)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return AssignmentResponse(
        **assignment.__dict__,
        assigned_cost=None,
        teacher_name=assignment.teacher.name if assignment.teacher else None,
        asset_description=assignment.asset.description if assignment.asset else None
    )


@router.get("/teachers/{teacher_id}", response_model=List[dict])
def get_teacher_assignments(teacher_id: str, db: Session = Depends(get_db)):
    """Get all assignments for a teacher with computed costs"""
    service = AssignmentService()
    return service.get_teacher_assignments(db, teacher_id)

