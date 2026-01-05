from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.config import settings
from typing import List, Optional

from app.core.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, UserRoleResponse


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("", response_model=UserResponse, status_code=201)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    user = User(email=str(payload.email).lower(), role=payload.role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# Deprecated: magic link invites are handled in Next.js; this endpoint is removed.


@router.get("/role", response_model=UserRoleResponse)
def get_role_by_email(email: str = Query(..., description="Email to check role for"), db: Session = Depends(get_db)):
    normalized = email.lower()
    user = db.query(User).filter(func.lower(User.email) == normalized).first()
    if not user:
        return UserRoleResponse(email=normalized, role="user")
    return UserRoleResponse(email=user.email, role=user.role)


@router.get("/exists")
def user_exists(email: str = Query(..., description="Email to check existence"), db: Session = Depends(get_db)):
    normalized = email.lower()
    exists = db.query(User).filter(func.lower(User.email) == normalized).first() is not None
    return {"email": normalized, "exists": exists}
