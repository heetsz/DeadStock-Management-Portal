from sqlalchemy import Column, String, Text, Integer, Date, Numeric, Boolean, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Asset(Base):
    __tablename__ = "asset"
    
    asset_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    description = Column(Text, nullable=False)
    category_id = Column(String(36), ForeignKey("category.category_id"), nullable=True)
    is_special_hardware = Column(Boolean, default=False, nullable=False)
    
    total_quantity = Column(Integer, nullable=False)
    purchase_date = Column(Date, nullable=False)
    financial_year = Column(Text, nullable=False)
    
    vendor_id = Column(String(36), ForeignKey("vendor.vendor_id"), nullable=True)
    original_total_cost = Column(Numeric(14, 2), nullable=False)
    current_total_cost = Column(Numeric(14, 2), nullable=False)
    
    lab_id = Column(String(36), ForeignKey("lab.lab_id"), nullable=True)
    physical_location = Column(Text, nullable=True)
    
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), onupdate=func.now())
    
    # Relationships
    category = relationship("Category", backref="assets")
    vendor = relationship("Vendor", backref="assets")
    lab = relationship("Lab", backref="assets")
    assignments = relationship("AssetAssignment", back_populates="asset", cascade="all, delete-orphan")
    scraps = relationship("Scrap", back_populates="asset", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Asset(asset_id={self.asset_id}, description={self.description}, quantity={self.total_quantity})>"

