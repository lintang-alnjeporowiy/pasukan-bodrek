from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.repositories.cargo_flow import CargoFlowRepository
from src.infrastructure.database.models.cargo_flow import CargoFlowModel
from src.domain.cargo_flow.models import CargoFlowCreate, CargoFlowUpdate, CargoFlowDomain

class CargoFlowService:
    """Application Service to coordinate cargo flow-related workflows."""

    def __init__(self, db: Session):
        self.repository = CargoFlowRepository(db)

    def _map_to_domain(self, db_flow: CargoFlowModel) -> CargoFlowDomain:
        domain = CargoFlowDomain.model_validate(db_flow)
        if db_flow.tenant:
            domain.tenant_name = db_flow.tenant.name
        if db_flow.commodity:
            domain.commodity_name = db_flow.commodity.name
        return domain

    def create_cargo_flow(self, scenario_id: UUID, flow_in: CargoFlowCreate) -> CargoFlowDomain:
        """Business logic for creating a new cargo flow."""
        db_flow = self.repository.create(scenario_id, flow_in)
        return self._map_to_domain(db_flow)

    def get_cargo_flow(self, cargo_flow_id: UUID) -> Optional[CargoFlowDomain]:
        """Business logic for retrieving a cargo flow by ID."""
        db_flow = self.repository.get_by_id(cargo_flow_id)
        if not db_flow:
            return None
        return self._map_to_domain(db_flow)

    def list_cargo_flows(self, scenario_id: UUID) -> List[CargoFlowDomain]:
        """Business logic for listing all cargo flows for a scenario."""
        db_flows = self.repository.list_by_scenario(scenario_id)
        return [self._map_to_domain(f) for f in db_flows]

    def update_cargo_flow(self, cargo_flow_id: UUID, flow_in: CargoFlowUpdate) -> Optional[CargoFlowDomain]:
        """Business logic for updating a cargo flow."""
        db_flow = self.repository.get_by_id(cargo_flow_id)
        if not db_flow:
            return None
        db_flow = self.repository.update(db_flow, flow_in)
        return self._map_to_domain(db_flow)

    def delete_cargo_flow(self, cargo_flow_id: UUID) -> bool:
        """Business logic for deleting a cargo flow."""
        db_flow = self.repository.get_by_id(cargo_flow_id)
        if not db_flow:
            return False
        self.repository.delete(db_flow)
        return True
