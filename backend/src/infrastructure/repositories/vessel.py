from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from src.infrastructure.database.models.vessel import VesselModel
from src.domain.vessel.schemas import VesselCreate, VesselUpdate

class VesselRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = False, ship_type: Optional[str] = None) -> List[VesselModel]:
        query = self.db.query(VesselModel)
        if active_only:
            query = query.filter(VesselModel.is_active == True)
        if ship_type:
            query = query.filter(VesselModel.ship_type == ship_type)
        return query.order_by(VesselModel.name.asc()).all()

    def get_by_id(self, vessel_id: UUID) -> Optional[VesselModel]:
        return self.db.query(VesselModel).filter(VesselModel.id == vessel_id).first()

    def create(self, vessel_in: VesselCreate) -> VesselModel:
        db_vessel = VesselModel(**vessel_in.model_dump())
        self.db.add(db_vessel)
        self.db.commit()
        self.db.refresh(db_vessel)
        return db_vessel

    def update(self, db_vessel: VesselModel, vessel_in: VesselUpdate) -> VesselModel:
        update_data = vessel_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_vessel, field, value)
        self.db.commit()
        self.db.refresh(db_vessel)
        return db_vessel

    def delete(self, db_vessel: VesselModel) -> None:
        self.db.delete(db_vessel)
        self.db.commit()
