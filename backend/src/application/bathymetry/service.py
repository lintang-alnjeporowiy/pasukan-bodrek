from uuid import UUID
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.infrastructure.repositories.bathymetry import BathymetryRepository
from src.infrastructure.repositories.study_port import StudyPortRepository
from src.domain.bathymetry.schemas import (
    BathymetryProfileCreate,
    BathymetryProfileUpdate,
    BathymetryProfileResponse,
    BathymetryPointCreate,
    BathymetryPointUpdate,
    BathymetryPointResponse,
)

class BathymetryService:
    def __init__(self, db: Session):
        self.repo = BathymetryRepository(db)
        self.study_port_repo = StudyPortRepository(db)

    def create_profile(self, study_port_id: UUID, data: BathymetryProfileCreate) -> BathymetryProfileResponse:
        study_port = self.study_port_repo.get_by_id(study_port_id)
        if not study_port:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Study Port dengan ID {study_port_id} tidak ditemukan"
            )
        profile = self.repo.create_profile(study_port_id, data)
        return BathymetryProfileResponse.model_validate(profile)

    def list_profiles(self, study_port_id: UUID) -> List[BathymetryProfileResponse]:
        study_port = self.study_port_repo.get_by_id(study_port_id)
        if not study_port:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Study Port dengan ID {study_port_id} tidak ditemukan"
            )
        profiles = self.repo.list_profiles_by_study_port(study_port_id)
        return [BathymetryProfileResponse.model_validate(p) for p in profiles]

    def get_profile(self, profile_id: UUID) -> BathymetryProfileResponse:
        profile = self.repo.get_profile_by_id(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profil batimetri dengan ID {profile_id} tidak ditemukan"
            )
        return BathymetryProfileResponse.model_validate(profile)

    def update_profile(self, profile_id: UUID, data: BathymetryProfileUpdate) -> BathymetryProfileResponse:
        profile = self.repo.update_profile(profile_id, data)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profil batimetri dengan ID {profile_id} tidak ditemukan"
            )
        return BathymetryProfileResponse.model_validate(profile)

    def delete_profile(self, profile_id: UUID) -> None:
        deleted = self.repo.delete_profile(profile_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profil batimetri dengan ID {profile_id} tidak ditemukan"
            )

    def add_point(self, profile_id: UUID, data: BathymetryPointCreate) -> BathymetryPointResponse:
        profile = self.repo.get_profile_by_id(profile_id)
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Profil batimetri dengan ID {profile_id} tidak ditemukan"
            )
        point = self.repo.add_point(profile_id, data)
        return BathymetryPointResponse.model_validate(point)

    def update_point(self, point_id: UUID, data: BathymetryPointUpdate) -> BathymetryPointResponse:
        point = self.repo.update_point(point_id, data)
        if not point:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Titik batimetri dengan ID {point_id} tidak ditemukan"
            )
        return BathymetryPointResponse.model_validate(point)

    def delete_point(self, point_id: UUID) -> None:
        deleted = self.repo.delete_point(point_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Titik batimetri dengan ID {point_id} tidak ditemukan"
            )
