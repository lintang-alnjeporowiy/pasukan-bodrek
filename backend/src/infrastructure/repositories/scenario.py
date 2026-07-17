from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.scenario import ScenarioModel
from src.domain.scenario.models import ScenarioCreate, ScenarioUpdate

class ScenarioRepository:
    """Repository to manage Scenario database operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, scenario_id: UUID) -> Optional[ScenarioModel]:
        """Retrieve a scenario by its unique ID."""
        return self.db.query(ScenarioModel).filter(ScenarioModel.id == scenario_id).first()

    def list_by_project(self, project_id: UUID) -> List[ScenarioModel]:
        """List all scenarios belonging to a specific project."""
        return self.db.query(ScenarioModel).filter(ScenarioModel.project_id == project_id).order_by(ScenarioModel.created_at.asc()).all()

    def create(self, scenario_in: ScenarioCreate) -> ScenarioModel:
        """Create a new scenario."""
        db_scenario = ScenarioModel(
            project_id=scenario_in.project_id,
            parent_scenario_id=scenario_in.parent_scenario_id,
            name=scenario_in.name,
            description=scenario_in.description,
            status=scenario_in.status
        )
        self.db.add(db_scenario)
        self.db.commit()
        self.db.refresh(db_scenario)
        return db_scenario

    def update(self, db_scenario: ScenarioModel, scenario_in: ScenarioUpdate) -> ScenarioModel:
        """Update an existing scenario."""
        update_data = scenario_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_scenario, field, value)
        self.db.commit()
        self.db.refresh(db_scenario)
        return db_scenario

    def delete(self, db_scenario: ScenarioModel) -> None:
        """Delete a scenario."""
        self.db.delete(db_scenario)
        self.db.commit()
