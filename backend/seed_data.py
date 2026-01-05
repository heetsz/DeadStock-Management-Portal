"""
Seed script to initialize database with default categories and sample data
Run: python seed_data.py
"""
from app.core.database import SessionLocal, init_db
from app.models import Category, Lab, Vendor, Teacher, Asset, ScrapPhase, User
from app.schemas.asset import AssetCreate
from app.utils.financial_year import calculate_financial_year
from datetime import date
from decimal import Decimal


def seed_categories(db):
    """Create default categories"""
    categories = [
        {"name": "Desktop Computer", "is_special": False},
        {"name": "Laptop", "is_special": False},
        {"name": "Printer", "is_special": False},
        {"name": "Projector", "is_special": False},
        {"name": "Server", "is_special": False},
        {"name": "Switch", "is_special": False},
        {"name": "Smart TV", "is_special": False},
        {"name": "Access Point", "is_special": False},
        {"name": "SOFTWARE", "is_special": False},
        {"name": "Special Hardware Device", "is_special": True},
    ]
    
    for cat_data in categories:
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        if not existing:
            category = Category(**cat_data)
            db.add(category)
    
    db.commit()
    print("✓ Categories seeded")


def seed_labs(db):
    """Create sample labs"""
    labs = [
        {"lab_name": "Lab 1", "room_number": "602", "status": "ACTIVE"},
        {"lab_name": "Lab 2", "room_number": "606", "status": "ACTIVE"},
        {"lab_name": "Lab 3", "room_number": "508", "status": "ACTIVE"},
    ]
    
    for lab_data in labs:
        existing = db.query(Lab).filter(Lab.lab_name == lab_data["lab_name"]).first()
        if not existing:
            lab = Lab(**lab_data)
            db.add(lab)
    
    db.commit()
    print("✓ Labs seeded")


def seed_vendors(db):
    """Create sample vendors"""
    vendors = [
        {"vendor_name": "Dell India", "bill_number": "DELL/2024/123"},
        {"vendor_name": "HP Solutions", "bill_number": "HP/2023/456"},
        {"vendor_name": "Lenovo India", "bill_number": "LEN/2024/789"},
    ]
    
    for vendor_data in vendors:
        existing = db.query(Vendor).filter(Vendor.vendor_name == vendor_data["vendor_name"]).first()
        if not existing:
            vendor = Vendor(**vendor_data)
            db.add(vendor)
    
    db.commit()
    print("✓ Vendors seeded")


def seed_teachers(db):
    """Create sample teachers"""
    teachers = [
        {"name": "Prof. Prachi Gharpure", "department": "Computer Engineering", "designation": "Professor"},
        {"name": "Prof. John Doe", "department": "Computer Engineering", "designation": "Associate Professor"},
        {"name": "Prof. Jane Smith", "department": "Computer Engineering", "designation": "Assistant Professor"},
    ]
    
    for teacher_data in teachers:
        existing = db.query(Teacher).filter(Teacher.name == teacher_data["name"]).first()
        if not existing:
            teacher = Teacher(**teacher_data)
            db.add(teacher)
    
    db.commit()
    print("✓ Teachers seeded")


def seed_scrap_phases(db):
    """Create default scrap phases"""
    phases = [
        {"name": "Phase 1", "description": "Initial scrap phase"},
        {"name": "Phase 2", "description": "Secondary scrap phase"},
        {"name": "Phase 3", "description": "Final scrap phase"},
    ]
    
    for phase_data in phases:
        existing = db.query(ScrapPhase).filter(ScrapPhase.name == phase_data["name"]).first()
        if not existing:
            phase = ScrapPhase(**phase_data)
            db.add(phase)
    
    db.commit()
    print("✓ Scrap phases seeded")


def seed_sample_assets(db):
    """Create sample assets"""
    # Get IDs
    desktop_cat = db.query(Category).filter(Category.name == "Desktop Computer").first()
    printer_cat = db.query(Category).filter(Category.name == "Printer").first()
    lab1 = db.query(Lab).filter(Lab.lab_name == "Lab 1").first()
    lab2 = db.query(Lab).filter(Lab.lab_name == "Lab 2").first()
    dell = db.query(Vendor).filter(Vendor.vendor_name == "Dell India").first()
    hp = db.query(Vendor).filter(Vendor.vendor_name == "HP Solutions").first()
    
    if not all([desktop_cat, printer_cat, lab1, lab2, dell, hp]):
        print("⚠ Skipping sample assets - required masters not found")
        return
    
    assets = [
        {
            "description": "Desktop Computer Dell OptiPlex",
            "category_id": desktop_cat.category_id,
            "total_quantity": 10,
            "purchase_date": date(2024, 3, 15),
            "vendor_id": dell.vendor_id,
            "original_total_cost": Decimal("500000.00"),
            "lab_id": lab1.lab_id,
            "physical_location": "Lab",
            "remarks": "For B.Tech students"
        },
        {
            "description": "HP LaserJet Printer",
            "category_id": printer_cat.category_id,
            "total_quantity": 2,
            "purchase_date": date(2023, 8, 20),
            "vendor_id": hp.vendor_id,
            "original_total_cost": Decimal("80000.00"),
            "lab_id": lab2.lab_id,
            "physical_location": "Lab",
            "remarks": "For faculty use"
        },
    ]
    
    from app.services.asset_service import AssetService
    service = AssetService()
    for asset_data in assets:
        existing = db.query(Asset).filter(Asset.description == asset_data["description"]).first()
        if not existing:
            asset = service.create_asset(db, AssetCreate(**asset_data))
            print(f"✓ Created asset: {asset.description}")
    
    print("✓ Sample assets seeded")


def main():
    """Main seed function"""
    print("Starting database seeding...")
    
    # Initialize database
    init_db()
    
    db = SessionLocal()
    try:
        seed_categories(db)
        seed_labs(db)
        seed_vendors(db)
        seed_teachers(db)
        seed_scrap_phases(db)
        seed_sample_assets(db)
        # Seed initial admin user
        admin_email = "heet.shah123@spit.ac.in"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            db.add(User(email=admin_email.lower(), role="admin"))
            db.commit()
            print(f"✓ Seeded admin user: {admin_email}")
        else:
            # Ensure role is admin if exists
            if existing_admin.role != "admin":
                existing_admin.role = "admin"
                db.commit()
                print(f"✓ Updated {admin_email} to admin role")
        
        print("\n✅ Database seeding completed successfully!")
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()

