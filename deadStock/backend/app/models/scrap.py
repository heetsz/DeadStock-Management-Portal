from sqlalchemy import Column, String, Text, Integer, Date, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Scrap(Base):
    __tablename__ = "scrap"
    
    scrap_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    asset_id = Column(String, ForeignKey("asset.asset_id", ondelete="CASCADE"), nullable=False)
    scrapped_quantity = Column(Integer, nullable=False)
    scrap_date = Column(Date, nullable=False, server_default=func.current_date())
    scrap_phase = Column(Text, nullable=False)  # Phase 1, Phase 2, etc.
    scrap_value = Column(Numeric(14, 2), nullable=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    asset = relationship("Asset", back_populates="scraps")
    
    def __repr__(self):
        return f"<Scrap(scrap_id={self.scrap_id}, asset_id={self.asset_id}, quantity={self.scrapped_quantity}, phase={self.scrap_phase})>"

