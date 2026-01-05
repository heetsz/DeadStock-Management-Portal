from sqlalchemy import Column, String, DateTime, text, UniqueConstraint
from app.core.database import Base
import uuid


class User(Base):
    __tablename__ = "app_user"
    __table_args__ = (
        UniqueConstraint("email", name="uq_user_email"),
    )

    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")  # values: 'admin', 'user'
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"))

    def __repr__(self):
        return f"<User(user_id={self.user_id}, email={self.email}, role={self.role})>"
