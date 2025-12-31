from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Vendor(Base):
    __tablename__ = "vendor"
    
    vendor_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vendor_name = Column(Text, nullable=False)
    bill_number = Column(Text, nullable=True)
    contact_info = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Vendor(vendor_id={self.vendor_id}, vendor_name={self.vendor_name})>"

