from sqlalchemy import Column, String, Text, Boolean, DateTime, text
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Teacher(Base):
    __tablename__ = "teacher"
    
    teacher_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(Text, nullable=False)
    department = Column(Text, nullable=True)
    designation = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))
    
    def __repr__(self):
        return f"<Teacher(teacher_id={self.teacher_id}, name={self.name})>"

