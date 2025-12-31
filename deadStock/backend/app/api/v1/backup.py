from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime
import json
from io import BytesIO

from app.core.database import get_db
from app.models import Lab, Vendor, Category, Teacher, Asset, AssetAssignment, Scrap

router = APIRouter(prefix="/backup", tags=["Backup & Restore"])


@router.get("/export")
def export_backup(db: Session = Depends(get_db)):
    """
    Export complete system backup as JSON file.
    Includes all tables: Labs, Vendors, Categories, Teachers, Assets, Assignments, Scrap
    """
    try:
        # Collect all data
        backup_data = {
            "version": "1.0",
            "export_date": datetime.now().isoformat(),
            "labs": [{
                "lab_id": lab.lab_id,
                "lab_name": lab.lab_name,
                "room_number": lab.room_number,
                "status": lab.status,
                "created_at": lab.created_at.isoformat() if lab.created_at else None
            } for lab in db.query(Lab).all()],
            "vendors": [{
                "vendor_id": vendor.vendor_id,
                "vendor_name": vendor.vendor_name,
                "bill_number": vendor.bill_number,
                "contact_info": vendor.contact_info,
                "created_at": vendor.created_at.isoformat() if vendor.created_at else None
            } for vendor in db.query(Vendor).all()],
            "categories": [{
                "category_id": cat.category_id,
                "name": cat.name,
                "is_special": cat.is_special,
                "is_active": cat.is_active
            } for cat in db.query(Category).all()],
            "teachers": [{
                "teacher_id": teacher.teacher_id,
                "name": teacher.name,
                "department": teacher.department,
                "designation": teacher.designation,
                "is_active": teacher.is_active,
                "created_at": teacher.created_at.isoformat() if teacher.created_at else None
            } for teacher in db.query(Teacher).all()],
            "assets": [{
                "asset_id": asset.asset_id,
                "description": asset.description,
                "category_id": asset.category_id,
                "is_special_hardware": asset.is_special_hardware,
                "total_quantity": asset.total_quantity,
                "purchase_date": asset.purchase_date.isoformat() if asset.purchase_date else None,
                "financial_year": asset.financial_year,
                "vendor_id": asset.vendor_id,
                "original_total_cost": str(asset.original_total_cost),
                "current_total_cost": str(asset.current_total_cost),
                "lab_id": asset.lab_id,
                "physical_location": asset.physical_location,
                "remarks": asset.remarks,
                "created_at": asset.created_at.isoformat() if asset.created_at else None,
                "updated_at": asset.updated_at.isoformat() if asset.updated_at else None
            } for asset in db.query(Asset).all()],
            "assignments": [{
                "assignment_id": assignment.assignment_id,
                "asset_id": assignment.asset_id,
                "teacher_id": assignment.teacher_id,
                "assigned_quantity": assignment.assigned_quantity,
                "assignment_date": assignment.assignment_date.isoformat() if assignment.assignment_date else None,
                "return_date": assignment.return_date.isoformat() if assignment.return_date else None,
                "current_location": assignment.current_location,
                "remarks": assignment.remarks,
                "created_at": assignment.created_at.isoformat() if assignment.created_at else None
            } for assignment in db.query(AssetAssignment).all()],
            "scraps": [{
                "scrap_id": scrap.scrap_id,
                "asset_id": scrap.asset_id,
                "scrapped_quantity": scrap.scrapped_quantity,
                "scrap_date": scrap.scrap_date.isoformat() if scrap.scrap_date else None,
                "scrap_phase": scrap.scrap_phase,
                "scrap_value": str(scrap.scrap_value),
                "remarks": scrap.remarks,
                "created_at": scrap.created_at.isoformat() if scrap.created_at else None
            } for scrap in db.query(Scrap).all()]
        }
        
        # Convert to JSON
        json_str = json.dumps(backup_data, indent=2, ensure_ascii=False)
        json_bytes = json_str.encode('utf-8')
        
        # Create file response
        filename = f"deadstock_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        return StreamingResponse(
            BytesIO(json_bytes),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")


@router.post("/restore")
async def restore_backup(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Restore system from backup JSON file.
    WARNING: This will replace all existing data!
    """
    try:
        # Read file
        content = await file.read()
        backup_data = json.loads(content.decode('utf-8'))
        
        # Validate backup format
        if "version" not in backup_data:
            raise HTTPException(status_code=400, detail="Invalid backup file format")
        
        # Clear existing data (in reverse order of dependencies)
        db.query(Scrap).delete()
        db.query(AssetAssignment).delete()
        db.query(Asset).delete()
        db.query(Teacher).delete()
        db.query(Category).delete()
        db.query(Vendor).delete()
        db.query(Lab).delete()
        db.commit()
        
        # Restore Labs
        for lab_data in backup_data.get("labs", []):
            lab = Lab(
                lab_id=lab_data["lab_id"],
                lab_name=lab_data["lab_name"],
                room_number=lab_data.get("room_number"),
                status=lab_data.get("status", "ACTIVE")
            )
            db.add(lab)
        
        # Restore Vendors
        for vendor_data in backup_data.get("vendors", []):
            vendor = Vendor(
                vendor_id=vendor_data["vendor_id"],
                vendor_name=vendor_data["vendor_name"],
                bill_number=vendor_data.get("bill_number"),
                contact_info=vendor_data.get("contact_info")
            )
            db.add(vendor)
        
        # Restore Categories
        for cat_data in backup_data.get("categories", []):
            category = Category(
                category_id=cat_data["category_id"],
                name=cat_data["name"],
                is_special=cat_data.get("is_special", False),
                is_active=cat_data.get("is_active", True)
            )
            db.add(category)
        
        # Restore Teachers
        for teacher_data in backup_data.get("teachers", []):
            teacher = Teacher(
                teacher_id=teacher_data["teacher_id"],
                name=teacher_data["name"],
                department=teacher_data.get("department"),
                designation=teacher_data.get("designation"),
                is_active=teacher_data.get("is_active", True)
            )
            db.add(teacher)
        
        # Restore Assets
        for asset_data in backup_data.get("assets", []):
            from datetime import datetime as dt
            from decimal import Decimal
            
            asset = Asset(
                asset_id=asset_data["asset_id"],
                description=asset_data["description"],
                category_id=asset_data.get("category_id"),
                is_special_hardware=asset_data.get("is_special_hardware", False),
                total_quantity=asset_data["total_quantity"],
                purchase_date=dt.fromisoformat(asset_data["purchase_date"]) if asset_data.get("purchase_date") else None,
                financial_year=asset_data["financial_year"],
                vendor_id=asset_data.get("vendor_id"),
                original_total_cost=Decimal(asset_data["original_total_cost"]),
                current_total_cost=Decimal(asset_data["current_total_cost"]),
                lab_id=asset_data.get("lab_id"),
                physical_location=asset_data.get("physical_location"),
                remarks=asset_data.get("remarks")
            )
            db.add(asset)
        
        # Restore Assignments
        for assignment_data in backup_data.get("assignments", []):
            from datetime import datetime as dt
            
            assignment = AssetAssignment(
                assignment_id=assignment_data["assignment_id"],
                asset_id=assignment_data["asset_id"],
                teacher_id=assignment_data.get("teacher_id"),
                assigned_quantity=assignment_data["assigned_quantity"],
                assignment_date=dt.fromisoformat(assignment_data["assignment_date"]) if assignment_data.get("assignment_date") else None,
                return_date=dt.fromisoformat(assignment_data["return_date"]) if assignment_data.get("return_date") else None,
                current_location=assignment_data.get("current_location"),
                remarks=assignment_data.get("remarks")
            )
            db.add(assignment)
        
        # Restore Scraps
        for scrap_data in backup_data.get("scraps", []):
            from datetime import datetime as dt
            from decimal import Decimal
            
            scrap = Scrap(
                scrap_id=scrap_data["scrap_id"],
                asset_id=scrap_data["asset_id"],
                scrapped_quantity=scrap_data["scrapped_quantity"],
                scrap_date=dt.fromisoformat(scrap_data["scrap_date"]) if scrap_data.get("scrap_date") else None,
                scrap_phase=scrap_data["scrap_phase"],
                scrap_value=Decimal(scrap_data["scrap_value"]),
                remarks=scrap_data.get("remarks")
            )
            db.add(scrap)
        
        db.commit()
        
        return {
            "message": "Backup restored successfully",
            "labs": len(backup_data.get("labs", [])),
            "vendors": len(backup_data.get("vendors", [])),
            "categories": len(backup_data.get("categories", [])),
            "teachers": len(backup_data.get("teachers", [])),
            "assets": len(backup_data.get("assets", [])),
            "assignments": len(backup_data.get("assignments", [])),
            "scraps": len(backup_data.get("scraps", []))
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")

