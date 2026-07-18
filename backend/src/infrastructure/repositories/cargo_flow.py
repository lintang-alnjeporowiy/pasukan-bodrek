from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.cargo_flow import CargoFlowModel
from src.domain.cargo_flow.models import CargoFlowCreate, CargoFlowUpdate

class CargoFlowRepository:
    """Repository to manage CargoFlow database operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, cargo_flow_id: UUID) -> Optional[CargoFlowModel]:
        """Retrieve a cargo flow by its unique ID."""
        return self.db.query(CargoFlowModel).filter(CargoFlowModel.id == cargo_flow_id).first()

    def list_by_scenario(self, scenario_id: UUID) -> List[CargoFlowModel]:
        """List all cargo flows belonging to a specific scenario."""
        return self.db.query(CargoFlowModel)\
            .filter(CargoFlowModel.scenario_id == scenario_id)\
            .order_by(CargoFlowModel.created_at.asc())\
            .all()

    def create(self, scenario_id: UUID, flow_in: CargoFlowCreate) -> CargoFlowModel:
        """Create a new cargo flow under a scenario."""
        db_flow = CargoFlowModel(
            scenario_id=scenario_id,
            tenant_id=flow_in.tenant_id,
            commodity_id=flow_in.commodity_id,
            direction=flow_in.direction,
            origin=flow_in.origin,
            destination_port=flow_in.destination_port,
            base_annual_demand=flow_in.base_annual_demand,
            unit=flow_in.unit,
            start_year=flow_in.start_year,
            growth_rate=flow_in.growth_rate,
            maximum_demand=flow_in.maximum_demand,
            is_active=flow_in.is_active
        )
        self.db.add(db_flow)
        self.db.commit()
        self.db.refresh(db_flow)
        return db_flow

    def update(self, db_flow: CargoFlowModel, flow_in: CargoFlowUpdate) -> CargoFlowModel:
        """Update an existing cargo flow."""
        update_data = flow_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_flow, field, value)
        self.db.commit()
        self.db.refresh(db_flow)
        return db_flow

    def delete(self, db_flow: CargoFlowModel) -> None:
        """Delete a cargo flow."""
        self.db.delete(db_flow)
        self.db.commit()
