from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.infrastructure.database import get_db
from src.domain.vessel.schemas import VesselCreate, VesselUpdate, VesselResponse
from src.application.vessel.service import VesselService

router = APIRouter(prefix="/vessels", tags=["Vessels"])

@router.get("", response_model=List[VesselResponse])
def list_vessels(
    active_only: bool = False,
    ship_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Mendapatkan daftar semua kapal master data."""
    service = VesselService(db)
    return service.get_all(active_only=active_only, ship_type=ship_type)

@router.post("", response_model=VesselResponse, status_code=status.HTTP_201_CREATED)
def create_vessel(
    vessel_in: VesselCreate,
    db: Session = Depends(get_db)
):
    """Menambahkan kapal master baru."""
    service = VesselService(db)
    return service.create_vessel(vessel_in)

@router.get("/{vessel_id}", response_model=VesselResponse)
def get_vessel(
    vessel_id: UUID,
    db: Session = Depends(get_db)
):
    """Mendapatkan detail kapal berdasarkan ID."""
    service = VesselService(db)
    return service.get_by_id(vessel_id)

@router.patch("/{vessel_id}", response_model=VesselResponse)
def update_vessel(
    vessel_id: UUID,
    vessel_in: VesselUpdate,
    db: Session = Depends(get_db)
):
    """Mengubah data kapal berdasarkan ID."""
    service = VesselService(db)
    return service.update_vessel(vessel_id, vessel_in)

@router.delete("/{vessel_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vessel(
    vessel_id: UUID,
    db: Session = Depends(get_db)
):
    """Menghapus kapal master data."""
    service = VesselService(db)
    service.delete_vessel(vessel_id)
    return
