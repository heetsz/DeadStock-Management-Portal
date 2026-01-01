from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import Lab, Vendor, Category, Teacher, ScrapPhase
from app.schemas.lab import LabCreate, LabUpdate, LabResponse
from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherResponse
from app.schemas.scrap_phase import ScrapPhaseCreate, ScrapPhaseUpdate, ScrapPhaseResponse

router = APIRouter(prefix="/masters", tags=["Masters"])


# Labs
@router.get("/labs", response_model=List[LabResponse])
def get_labs(db: Session = Depends(get_db)):
    """Get all labs"""
    return db.query(Lab).all()


@router.post("/labs", response_model=LabResponse, status_code=201)
def create_lab(lab_data: LabCreate, db: Session = Depends(get_db)):
    """Create a new lab"""
    db_lab = Lab(**lab_data.model_dump())
    db.add(db_lab)
    db.commit()
    db.refresh(db_lab)
    return db_lab


@router.put("/labs/{lab_id}", response_model=LabResponse)
def update_lab(lab_id: str, lab_data: LabUpdate, db: Session = Depends(get_db)):
    """Update a lab"""
    db_lab = db.query(Lab).filter(Lab.lab_id == lab_id).first()
    if not db_lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    
    update_data = lab_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_lab, key, value)
    
    db.commit()
    db.refresh(db_lab)
    return db_lab


@router.delete("/labs/{lab_id}", status_code=204)
def delete_lab(lab_id: str, db: Session = Depends(get_db)):
    """Delete a lab"""
    from app.models import Asset
    db_lab = db.query(Lab).filter(Lab.lab_id == lab_id).first()
    if not db_lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    
    # Check if lab is used by any assets
    assets_count = db.query(Asset).filter(Asset.lab_id == lab_id).count()
    if assets_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete lab. It is used by {assets_count} asset(s)."
        )
    
    db.delete(db_lab)
    db.commit()


# Vendors
@router.get("/vendors", response_model=List[VendorResponse])
def get_vendors(db: Session = Depends(get_db)):
    """Get all vendors"""
    return db.query(Vendor).all()


@router.post("/vendors", response_model=VendorResponse, status_code=201)
def create_vendor(vendor_data: VendorCreate, db: Session = Depends(get_db)):
    """Create a new vendor"""
    db_vendor = Vendor(**vendor_data.model_dump())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    return db_vendor


@router.put("/vendors/{vendor_id}", response_model=VendorResponse)
def update_vendor(vendor_id: str, vendor_data: VendorUpdate, db: Session = Depends(get_db)):
    """Update a vendor"""
    db_vendor = db.query(Vendor).filter(Vendor.vendor_id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    update_data = vendor_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_vendor, key, value)
    
    db.commit()
    db.refresh(db_vendor)
    return db_vendor


@router.delete("/vendors/{vendor_id}", status_code=204)
def delete_vendor(vendor_id: str, db: Session = Depends(get_db)):
    """Delete a vendor"""
    from app.models import Asset
    db_vendor = db.query(Vendor).filter(Vendor.vendor_id == vendor_id).first()
    if not db_vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    # Check if vendor is used by any assets
    assets_count = db.query(Asset).filter(Asset.vendor_id == vendor_id).count()
    if assets_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete vendor. It is used by {assets_count} asset(s)."
        )
    
    db.delete(db_vendor)
    db.commit()


# Categories
@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Get all categories"""
    return db.query(Category).all()


@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(category_data: CategoryCreate, db: Session = Depends(get_db)):
    """Create a new category"""
    db_category = Category(**category_data.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(category_id: str, category_data: CategoryUpdate, db: Session = Depends(get_db)):
    """Update a category"""
    db_category = db.query(Category).filter(Category.category_id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category


@router.delete("/categories/{category_id}", status_code=204)
def delete_category(category_id: str, db: Session = Depends(get_db)):
    """Delete a category"""
    from app.models import Asset
    db_category = db.query(Category).filter(Category.category_id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category is used by any assets
    assets_count = db.query(Asset).filter(Asset.category_id == category_id).count()
    if assets_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category. It is used by {assets_count} asset(s)."
        )
    
    db.delete(db_category)
    db.commit()


# Teachers
@router.get("/teachers", response_model=List[TeacherResponse])
def get_teachers(db: Session = Depends(get_db)):
    """Get all teachers"""
    return db.query(Teacher).all()


@router.post("/teachers", response_model=TeacherResponse, status_code=201)
def create_teacher(teacher_data: TeacherCreate, db: Session = Depends(get_db)):
    """Create a new teacher"""
    db_teacher = Teacher(**teacher_data.model_dump())
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


@router.put("/teachers/{teacher_id}", response_model=TeacherResponse)
def update_teacher(teacher_id: str, teacher_data: TeacherUpdate, db: Session = Depends(get_db)):
    """Update a teacher"""
    db_teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    update_data = teacher_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_teacher, key, value)
    
    db.commit()
    db.refresh(db_teacher)
    return db_teacher


@router.delete("/teachers/{teacher_id}", status_code=204)
def delete_teacher(teacher_id: str, db: Session = Depends(get_db)):
    """Delete a teacher"""
    from app.models import AssetAssignment
    db_teacher = db.query(Teacher).filter(Teacher.teacher_id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    
    # Check if teacher has any active assignments
    active_assignments = db.query(AssetAssignment).filter(
        AssetAssignment.teacher_id == teacher_id,
        AssetAssignment.return_date.is_(None)
    ).count()
    if active_assignments > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete teacher. Has {active_assignments} active assignment(s)."
        )
    
    db.delete(db_teacher)
    db.commit()


# Scrap Phases
@router.get("/scrap-phases", response_model=List[ScrapPhaseResponse])
def get_scrap_phases(db: Session = Depends(get_db)):
    """Get all scrap phases"""
    return db.query(ScrapPhase).filter(ScrapPhase.is_active == True).all()


@router.post("/scrap-phases", response_model=ScrapPhaseResponse, status_code=201)
def create_scrap_phase(phase_data: ScrapPhaseCreate, db: Session = Depends(get_db)):
    """Create a new scrap phase"""
    db_phase = ScrapPhase(**phase_data.model_dump())
    db.add(db_phase)
    db.commit()
    db.refresh(db_phase)
    return db_phase


@router.put("/scrap-phases/{phase_id}", response_model=ScrapPhaseResponse)
def update_scrap_phase(phase_id: str, phase_data: ScrapPhaseUpdate, db: Session = Depends(get_db)):
    """Update a scrap phase"""
    db_phase = db.query(ScrapPhase).filter(ScrapPhase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Scrap phase not found")
    
    update_data = phase_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_phase, key, value)
    
    db.commit()
    db.refresh(db_phase)
    return db_phase


@router.delete("/scrap-phases/{phase_id}", status_code=204)
def delete_scrap_phase(phase_id: str, db: Session = Depends(get_db)):
    """Delete a scrap phase"""
    from app.models import Scrap
    db_phase = db.query(ScrapPhase).filter(ScrapPhase.phase_id == phase_id).first()
    if not db_phase:
        raise HTTPException(status_code=404, detail="Scrap phase not found")
    
    # Check if phase is used by any scraps
    scraps_count = db.query(Scrap).filter(Scrap.phase_id == phase_id).count()
    if scraps_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete scrap phase. It is used by {scraps_count} scrap record(s)."
        )
    
    db.delete(db_phase)
    db.commit()

