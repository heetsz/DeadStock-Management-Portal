from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Optional


RoleType = Literal["admin", "user"]


class UserBase(BaseModel):
    email: EmailStr
    role: RoleType = "user"

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str):
        if v not in ("admin", "user"):
            raise ValueError("role must be 'admin' or 'user'")
        return v


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    user_id: str

    class Config:
        from_attributes = True


class UserRoleResponse(BaseModel):
    email: EmailStr
    role: RoleType
