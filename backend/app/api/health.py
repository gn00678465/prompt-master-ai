"""
Health check endpoint
"""

from fastapi import APIRouter

router = APIRouter(
    prefix="/v1/health",
    tags=["health"],
    responses={404: {"description": "Not found"}},
)


@router.get("", response_model=dict, summary="Health Check")
def health_check():
    """
    Checks if the API service is running.
    """
    return {"status": "ok"}
