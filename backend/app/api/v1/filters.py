"""
Filters endpoint - Helper endpoint to document available filter options
"""
from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/filters", tags=["Filters"])


@router.get("/options")
def get_filter_options() -> Dict[str, Any]:
    """
    Get available filter options for assets endpoint.
    
    This is a documentation endpoint. Actual filtering is done via query parameters
    on GET /api/v1/assets endpoint.
    
    Example usage:
    GET /api/v1/assets?financial_year=2024-2025&lab_id=xxx&issued_status=issued_only
    """
    return {
        "filters": {
            "financial_year": {
                "type": "string",
                "format": "YYYY-YYYY",
                "example": "2024-2025",
                "description": "Financial year filter"
            },
            "lab_id": {
                "type": "uuid",
                "description": "Filter by lab ID"
            },
            "vendor_id": {
                "type": "uuid",
                "description": "Filter by vendor ID"
            },
            "category_id": {
                "type": "uuid",
                "description": "Filter by category ID"
            },
            "is_special_hardware": {
                "type": "boolean",
                "description": "Filter special hardware only"
            },
            "issued_status": {
                "type": "string",
                "options": ["issued_only", "not_issued", "partially_issued"],
                "description": "Filter by assignment status"
            },
            "scrap_status": {
                "type": "string",
                "options": ["scrapped_only", "exclude_scrapped"],
                "description": "scrapped_only: only fully/partially scrapped assets. exclude_scrapped: exclude only fully scrapped assets"
            },
            "teacher_id": {
                "type": "uuid",
                "description": "Filter assets assigned to specific teacher"
            },
            "has_multiple_teachers": {
                "type": "boolean",
                "description": "Filter assets assigned to multiple teachers"
            },
            "search": {
                "type": "string",
                "description": "Search in description and remarks"
            },
            "purchase_date_from": {
                "type": "date",
                "format": "YYYY-MM-DD",
                "description": "Filter by purchase date from"
            },
            "purchase_date_to": {
                "type": "date",
                "format": "YYYY-MM-DD",
                "description": "Filter by purchase date to"
            },
            "cost_min": {
                "type": "float",
                "description": "Minimum original cost"
            },
            "cost_max": {
                "type": "float",
                "description": "Maximum original cost"
            }
        },
        "pagination": {
            "page": {
                "type": "integer",
                "default": 1,
                "description": "Page number for pagination"
            },
            "size": {
                "type": "integer",
                "default": 50,
                "max": 100,
                "description": "Page size"
            },
            "sort_by": {
                "type": "string",
                "default": "purchase_date",
                "description": "Field to sort by"
            },
            "sort_order": {
                "type": "string",
                "options": ["asc", "desc"],
                "default": "desc",
                "description": "Sort order"
            }
        },
        "note": "All filters can be combined using AND logic. Use GET /api/v1/assets with query parameters.",
        "endpoint": "/api/v1/assets"
    }

