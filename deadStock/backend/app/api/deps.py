from app.core.database import get_db
from sqlalchemy.orm import Session


def get_database():
    """Dependency for database session"""
    return get_db()

