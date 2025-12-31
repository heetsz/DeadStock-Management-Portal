from fastapi import APIRouter
from app.api.v1 import assets, assignments, scrap, masters, reports, filters, backup

api_router = APIRouter()

api_router.include_router(assets.router, prefix="/api/v1")
api_router.include_router(assignments.router, prefix="/api/v1")
api_router.include_router(scrap.router, prefix="/api/v1")
api_router.include_router(masters.router, prefix="/api/v1")
api_router.include_router(reports.router, prefix="/api/v1")
api_router.include_router(filters.router, prefix="/api/v1")
api_router.include_router(backup.router, prefix="/api/v1")

