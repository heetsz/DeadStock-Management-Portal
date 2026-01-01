from sqlalchemy import Column, String, Text, Integer, Date, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class AssetAssignment(Base):
    __tablename__ = "asset_assignment"
    
    assignment_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    asset_id = Column(String(36), ForeignKey("asset.asset_id", ondelete="CASCADE"), nullable=False)
    teacher_id = Column(String(36), ForeignKey("teacher.teacher_id", ondelete="SET NULL"), nullable=True)
    assigned_quantity = Column(Integer, nullable=False)
    assignment_date = Column(Date, nullable=False)
    return_date = Column(Date, nullable=True)
    current_location = Column(Text, nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    # Relationships
    asset = relationship("Asset", back_populates="assignments")
    teacher = relationship("Teacher", backref="assignments")
    
    def __repr__(self):
        return f"<AssetAssignment(assignment_id={self.assignment_id}, asset_id={self.asset_id}, quantity={self.assigned_quantity})>"

