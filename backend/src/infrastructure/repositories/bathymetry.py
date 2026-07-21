from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.bathymetry import BathymetryProfileModel, BathymetryPointModel
from src.domain.bathymetry.schemas import (
    BathymetryProfileCreate,
    BathymetryProfileUpdate,
    BathymetryPointCreate,
    BathymetryPointUpdate,
)

class BathymetryRepository:
    def __init__(self, db: Session):
        self.db = db

    # --- Profile Operations ---

    def create_profile(self, study_port_id: UUID, data: BathymetryProfileCreate) -> BathymetryProfileModel:
        profile = BathymetryProfileModel(
            study_port_id=study_port_id,
            name=data.name.strip(),
            description=data.description.strip() if data.description else None,
        )
        self.db.add(profile)
        self.db.flush()

        if data.points:
            for idx, pt in enumerate(data.points):
                point = BathymetryPointModel(
                    bathymetry_profile_id=profile.id,
                    distance_from_shore=pt.distance_from_shore,
                    water_depth=pt.water_depth,
                    sequence=pt.sequence if pt.sequence > 0 else idx + 1,
                )
                self.db.add(point)

        self.db.commit()
        self.db.refresh(profile)
        return profile

    def get_profile_by_id(self, profile_id: UUID) -> Optional[BathymetryProfileModel]:
        return self.db.query(BathymetryProfileModel).filter(BathymetryProfileModel.id == profile_id).first()

    def list_profiles_by_study_port(self, study_port_id: UUID) -> List[BathymetryProfileModel]:
        return (
            self.db.query(BathymetryProfileModel)
            .filter(BathymetryProfileModel.study_port_id == study_port_id)
            .order_by(BathymetryProfileModel.created_at.asc())
            .all()
        )

    def update_profile(self, profile_id: UUID, data: BathymetryProfileUpdate) -> Optional[BathymetryProfileModel]:
        profile = self.get_profile_by_id(profile_id)
        if not profile:
            return None

        if data.name is not None:
            profile.name = data.name.strip()
        if data.description is not None:
            profile.description = data.description.strip() if data.description else None

        self.db.commit()
        self.db.refresh(profile)
        return profile

    def delete_profile(self, profile_id: UUID) -> bool:
        profile = self.get_profile_by_id(profile_id)
        if not profile:
            return False
        self.db.delete(profile)
        self.db.commit()
        return True

    # --- Point Operations ---

    def add_point(self, profile_id: UUID, data: BathymetryPointCreate) -> BathymetryPointModel:
        point = BathymetryPointModel(
            bathymetry_profile_id=profile_id,
            distance_from_shore=data.distance_from_shore,
            water_depth=data.water_depth,
            sequence=data.sequence,
        )
        self.db.add(point)
        self.db.commit()
        self.db.refresh(point)
        return point

    def get_point_by_id(self, point_id: UUID) -> Optional[BathymetryPointModel]:
        return self.db.query(BathymetryPointModel).filter(BathymetryPointModel.id == point_id).first()

    def update_point(self, point_id: UUID, data: BathymetryPointUpdate) -> Optional[BathymetryPointModel]:
        point = self.get_point_by_id(point_id)
        if not point:
            return None
        if data.distance_from_shore is not None:
            point.distance_from_shore = data.distance_from_shore
        if data.water_depth is not None:
            point.water_depth = data.water_depth
        if data.sequence is not None:
            point.sequence = data.sequence

        self.db.commit()
        self.db.refresh(point)
        return point

    def delete_point(self, point_id: UUID) -> bool:
        point = self.get_point_by_id(point_id)
        if not point:
            return False
        self.db.delete(point)
        self.db.commit()
        return True
