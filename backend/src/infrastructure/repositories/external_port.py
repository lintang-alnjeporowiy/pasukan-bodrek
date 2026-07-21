from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from src.infrastructure.database.models.external_port import ExternalPortModel
from src.domain.external_port.schemas import ExternalPortCreate, ExternalPortUpdate

class ExternalPortRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, active_only: bool = False) -> List[ExternalPortModel]:
        query = self.db.query(ExternalPortModel)
        if active_only:
            query = query.filter(ExternalPortModel.is_active == True)
        return query.order_by(ExternalPortModel.name.asc()).all()

    def get_by_id(self, port_id: UUID) -> Optional[ExternalPortModel]:
        return self.db.query(ExternalPortModel).filter(ExternalPortModel.id == port_id).first()

    def create(self, port_in: ExternalPortCreate) -> ExternalPortModel:
        db_port = ExternalPortModel(
            name=port_in.name,
            country=port_in.country,
            latitude=port_in.latitude,
            longitude=port_in.longitude,
            max_draft=port_in.max_draft,
            max_loa=port_in.max_loa,
            cargo_productivity=port_in.cargo_productivity,
            productivity_unit=port_in.productivity_unit,
            additional_port_time=port_in.additional_port_time,
            description=port_in.description,
            is_active=port_in.is_active,
        )
        self.db.add(db_port)
        self.db.commit()
        self.db.refresh(db_port)
        return db_port

    def update(self, db_port: ExternalPortModel, port_in: ExternalPortUpdate) -> ExternalPortModel:
        update_data = port_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_port, field, value)
        self.db.commit()
        self.db.refresh(db_port)
        return db_port

    def delete(self, db_port: ExternalPortModel) -> None:
        self.db.delete(db_port)
        self.db.commit()
