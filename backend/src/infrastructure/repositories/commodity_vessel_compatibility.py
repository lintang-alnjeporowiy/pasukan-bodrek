from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from src.infrastructure.database.models.commodity_vessel_compatibility import CommodityVesselCompatibilityModel

class CommodityVesselCompatibilityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(
        self,
        commodity_id: Optional[UUID] = None,
        vessel_id: Optional[UUID] = None,
        active_only: bool = False
    ) -> List[CommodityVesselCompatibilityModel]:
        query = self.db.query(CommodityVesselCompatibilityModel)
        if commodity_id:
            query = query.filter(CommodityVesselCompatibilityModel.commodity_id == commodity_id)
        if vessel_id:
            query = query.filter(CommodityVesselCompatibilityModel.vessel_id == vessel_id)
        if active_only:
            query = query.filter(CommodityVesselCompatibilityModel.is_active == True)
        return query.all()

    def get_by_id(self, comp_id: UUID) -> Optional[CommodityVesselCompatibilityModel]:
        return self.db.query(CommodityVesselCompatibilityModel).filter(CommodityVesselCompatibilityModel.id == comp_id).first()

    def get_by_commodity_and_vessel(self, commodity_id: UUID, vessel_id: UUID) -> Optional[CommodityVesselCompatibilityModel]:
        return self.db.query(CommodityVesselCompatibilityModel).filter(
            CommodityVesselCompatibilityModel.commodity_id == commodity_id,
            CommodityVesselCompatibilityModel.vessel_id == vessel_id
        ).first()

    def create(self, commodity_id: UUID, vessel_id: UUID, notes: Optional[str] = None, is_active: bool = True) -> CommodityVesselCompatibilityModel:
        db_comp = CommodityVesselCompatibilityModel(
            commodity_id=commodity_id,
            vessel_id=vessel_id,
            notes=notes,
            is_active=is_active
        )
        self.db.add(db_comp)
        self.db.commit()
        self.db.refresh(db_comp)
        return db_comp

    def delete(self, db_comp: CommodityVesselCompatibilityModel) -> None:
        self.db.delete(db_comp)
        self.db.commit()

    def set_compatible_vessels_for_commodity(self, commodity_id: UUID, vessel_ids: List[UUID]) -> List[CommodityVesselCompatibilityModel]:
        # Delete existing mappings for this commodity
        self.db.query(CommodityVesselCompatibilityModel).filter(
            CommodityVesselCompatibilityModel.commodity_id == commodity_id
        ).delete()
        
        new_mappings = []
        for vid in set(vessel_ids):
            m = CommodityVesselCompatibilityModel(commodity_id=commodity_id, vessel_id=vid, is_active=True)
            self.db.add(m)
            new_mappings.append(m)
        
        self.db.commit()
        for m in new_mappings:
            self.db.refresh(m)
        return new_mappings
