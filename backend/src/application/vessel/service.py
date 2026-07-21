from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.infrastructure.repositories.vessel import VesselRepository
from src.domain.vessel.schemas import VesselCreate, VesselUpdate, VesselResponse

class VesselService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = VesselRepository(db)

    def get_all(self, active_only: bool = False, ship_type: Optional[str] = None) -> List[VesselResponse]:
        vessels = self.repository.get_all(active_only=active_only, ship_type=ship_type)
        return [VesselResponse.model_validate(v) for v in vessels]

    def get_by_id(self, vessel_id: UUID) -> VesselResponse:
        vessel = self.repository.get_by_id(vessel_id)
        if not vessel:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kapal tidak ditemukan")
        return VesselResponse.model_validate(vessel)

    def create_vessel(self, vessel_in: VesselCreate) -> VesselResponse:
        vessel = self.repository.create(vessel_in)
        return VesselResponse.model_validate(vessel)

    def update_vessel(self, vessel_id: UUID, vessel_in: VesselUpdate) -> VesselResponse:
        vessel = self.repository.get_by_id(vessel_id)
        if not vessel:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kapal tidak ditemukan")
        updated_vessel = self.repository.update(vessel, vessel_in)
        return VesselResponse.model_validate(updated_vessel)

    def delete_vessel(self, vessel_id: UUID) -> None:
        vessel = self.repository.get_by_id(vessel_id)
        if not vessel:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kapal tidak ditemukan")
        self.repository.delete(vessel)
