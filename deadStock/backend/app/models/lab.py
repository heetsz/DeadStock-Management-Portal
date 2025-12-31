from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Lab(Base):
    __tablename__ = "lab"
    
    lab_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    lab_name = Column(Text, nullable=False)
    room_number = Column(Text, nullable=True)
    status = Column(String, default="ACTIVE", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Lab(lab_id={self.lab_id}, lab_name={self.lab_name}, room_number={self.room_number})>"

