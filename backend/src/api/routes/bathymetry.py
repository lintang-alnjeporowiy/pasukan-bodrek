from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.infrastructure.database.session import get_db
from src.application.bathymetry.service import BathymetryService
from src.domain.bathymetry.schemas import (
    BathymetryProfileCreate,
    BathymetryProfileUpdate,
    BathymetryProfileResponse,
    BathymetryPointCreate,
    BathymetryPointUpdate,
    BathymetryPointResponse,
)

router = APIRouter(tags=["Bathymetry"])

# --- Bathymetry Profile Routes ---

@router.post("/study-ports/{study_port_id}/bathymetry-profiles", response_model=BathymetryProfileResponse, status_code=status.HTTP_21_CREATED if hasattr(status, 'HTTP_21_CREATED') else 201)
def create_bathymetry_profile(study_port_id: UUID, payload: BathymetryProfileCreate, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    return service.create_profile(study_port_id, payload)

@router.get("/study-ports/{study_port_id}/bathymetry-profiles", response_model=List[BathymetryProfileResponse])
def list_bathymetry_profiles(study_port_id: UUID, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    return service.list_profiles(study_port_id)

@router.get("/bathymetry-profiles/{profile_id}", response_model=BathymetryProfileResponse)
def get_bathymetry_profile(profile_id: UUID, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    return service.get_profile(profile_id)

@router.patch("/bathymetry-profiles/{profile_id}", response_model=BathymetryProfileResponse)
def update_bathymetry_profile(profile_id: UUID, payload: BathymetryProfileUpdate, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    return service.update_profile(profile_id, payload)

@router.delete("/bathymetry-profiles/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bathymetry_profile(profile_id: UUID, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    service.delete_profile(profile_id)

# --- Bathymetry Point Routes ---

@router.post("/bathymetry-profiles/{profile_id}/points", response_model=BathymetryPointResponse, status_code=201)
def add_bathymetry_point(profile_id: UUID, payload: BathymetryPointCreate, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    return service.add_point(profile_id, payload)

@router.patch("/bathymetry-points/{point_id}", response_model=BathymetryPointResponse)
def update_bathymetry_point(point_id: UUID, payload: BathymetryPointUpdate, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    return service.update_point(point_id, payload)

@router.delete("/bathymetry-points/{point_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_bathymetry_point(point_id: UUID, db: Session = Depends(get_db)):
    service = BathymetryService(db)
    service.delete_point(point_id)
