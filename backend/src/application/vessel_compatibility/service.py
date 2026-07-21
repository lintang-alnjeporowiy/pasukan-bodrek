from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.infrastructure.repositories.commodity_vessel_compatibility import CommodityVesselCompatibilityRepository
from src.infrastructure.repositories.commodity import CommodityRepository
from src.infrastructure.repositories.vessel import VesselRepository
from src.domain.vessel_compatibility.schemas import (
    CommodityVesselCompatibilityCreate,
    CommodityVesselCompatibilityResponse,
    BatchSetVesselsForCommodityInput,
)

class CommodityVesselCompatibilityService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = CommodityVesselCompatibilityRepository(db)
        self.commodity_repo = CommodityRepository(db)
        self.vessel_repo = VesselRepository(db)

    def get_all(
        self,
        commodity_id: Optional[UUID] = None,
        vessel_id: Optional[UUID] = None,
        active_only: bool = False
    ) -> List[CommodityVesselCompatibilityResponse]:
        mappings = self.repository.get_all(commodity_id=commodity_id, vessel_id=vessel_id, active_only=active_only)
        return [CommodityVesselCompatibilityResponse.model_validate(m) for m in mappings]

    def add_compatibility(self, input_data: CommodityVesselCompatibilityCreate) -> CommodityVesselCompatibilityResponse:
        commodity = self.commodity_repo.get_by_id(input_data.commodity_id)
        if not commodity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Komoditas tidak ditemukan")

        vessel = self.vessel_repo.get_by_id(input_data.vessel_id)
        if not vessel:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kapal tidak ditemukan")

        existing = self.repository.get_by_commodity_and_vessel(input_data.commodity_id, input_data.vessel_id)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Kompatibilitas antara komoditas dan kapal ini sudah terdaftar")

        comp = self.repository.create(
            commodity_id=input_data.commodity_id,
            vessel_id=input_data.vessel_id,
            notes=input_data.notes,
            is_active=input_data.is_active
        )
        return CommodityVesselCompatibilityResponse.model_validate(comp)

    def delete_compatibility(self, comp_id: UUID) -> None:
        comp = self.repository.get_by_id(comp_id)
        if not comp:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data kompatibilitas tidak ditemukan")
        self.repository.delete(comp)

    def batch_set_vessels_for_commodity(self, payload: BatchSetVesselsForCommodityInput) -> List[CommodityVesselCompatibilityResponse]:
        commodity = self.commodity_repo.get_by_id(payload.commodity_id)
        if not commodity:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Komoditas tidak ditemukan")

        for vid in payload.vessel_ids:
            v = self.vessel_repo.get_by_id(vid)
            if not v:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Kapal dengan ID {vid} tidak ditemukan")

        updated_mappings = self.repository.set_compatible_vessels_for_commodity(payload.commodity_id, payload.vessel_ids)
        return [CommodityVesselCompatibilityResponse.model_validate(m) for m in updated_mappings]
