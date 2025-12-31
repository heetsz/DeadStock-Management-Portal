from app.schemas.lab import LabCreate, LabUpdate, LabResponse
from app.schemas.vendor import VendorCreate, VendorUpdate, VendorResponse
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherResponse
from app.schemas.asset import (
    AssetCreate, AssetUpdate, AssetResponse, AssetListResponse, AssetFilters
)
from app.schemas.assignment import (
    AssignmentCreate, AssignmentUpdate, AssignmentResponse, AssignmentReturn
)
from app.schemas.scrap import ScrapCreate, ScrapResponse, ScrapPhaseSummary

__all__ = [
    "LabCreate", "LabUpdate", "LabResponse",
    "VendorCreate", "VendorUpdate", "VendorResponse",
    "CategoryCreate", "CategoryUpdate", "CategoryResponse",
    "TeacherCreate", "TeacherUpdate", "TeacherResponse",
    "AssetCreate", "AssetUpdate", "AssetResponse", "AssetListResponse", "AssetFilters",
    "AssignmentCreate", "AssignmentUpdate", "AssignmentResponse", "AssignmentReturn",
    "ScrapCreate", "ScrapResponse", "ScrapPhaseSummary",
]

