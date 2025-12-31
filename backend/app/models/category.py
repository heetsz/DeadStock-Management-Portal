from sqlalchemy import Column, String, Text, Boolean
from app.core.database import Base
import uuid


class Category(Base):
    __tablename__ = "category"
    
    category_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(Text, nullable=False, unique=True)
    is_special = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    def __repr__(self):
        return f"<Category(category_id={self.category_id}, name={self.name})>"

