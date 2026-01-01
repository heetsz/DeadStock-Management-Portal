from sqlalchemy import Column, String, Boolean, DateTime, text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class ScrapPhase(Base):
    __tablename__ = "scrap_phase"
    
    phase_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, unique=True)
    description = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    # Relationships
    scraps = relationship("Scrap", back_populates="phase")
    
    def __repr__(self):
        return f"<ScrapPhase(phase_id={self.phase_id}, name={self.name})>"

