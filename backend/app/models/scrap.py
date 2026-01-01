from sqlalchemy import Column, String, Text, Integer, Date, Numeric, DateTime, ForeignKey, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Scrap(Base):
    __tablename__ = "scrap"
    
    scrap_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    asset_id = Column(String(36), ForeignKey("asset.asset_id", ondelete="CASCADE"), nullable=False)
    scrapped_quantity = Column(Integer, nullable=False)
    scrap_date = Column(Date, nullable=False)
    phase_id = Column(String(36), ForeignKey("scrap_phase.phase_id", ondelete="RESTRICT"), nullable=False)
    scrap_value = Column(Numeric(14, 2), nullable=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    # Relationships
    asset = relationship("Asset", back_populates="scraps")
    phase = relationship("ScrapPhase", back_populates="scraps")
    
    def __repr__(self):
        return f"<Scrap(scrap_id={self.scrap_id}, asset_id={self.asset_id}, quantity={self.scrapped_quantity}, phase_id={self.phase_id})>"

