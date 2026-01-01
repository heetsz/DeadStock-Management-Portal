from sqlalchemy import Column, String, Text, DateTime, text
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Lab(Base):
    __tablename__ = "lab"
    
    lab_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lab_name = Column(Text, nullable=False)
    room_number = Column(Text, nullable=True)
    status = Column(String(50), default="ACTIVE", nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    def __repr__(self):
        return f"<Lab(lab_id={self.lab_id}, lab_name={self.lab_name}, room_number={self.room_number})>"

