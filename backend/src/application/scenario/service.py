from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.repositories.scenario import ScenarioRepository
from src.infrastructure.repositories.project import ProjectRepository
from src.domain.scenario.models import ScenarioCreate, ScenarioUpdate, ScenarioDomain

class ScenarioService:
    """Application Service to coordinate scenario-related workflows."""

    def __init__(self, db: Session):
        self.scenario_repository = ScenarioRepository(db)
        self.project_repository = ProjectRepository(db)

    def create_scenario(self, scenario_in: ScenarioCreate) -> Optional[ScenarioDomain]:
        """Business logic for creating a new scenario."""
        # 1. Verify that the project exists
        project = self.project_repository.get_by_id(scenario_in.project_id)
        if not project:
            return None

        # 2. Verify that parent scenario exists if referenced
        if scenario_in.parent_scenario_id:
            parent = self.scenario_repository.get_by_id(scenario_in.parent_scenario_id)
            if not parent:
                return None

        db_scenario = self.scenario_repository.create(scenario_in)
        return ScenarioDomain.model_validate(db_scenario)

    def get_scenario(self, scenario_id: UUID) -> Optional[ScenarioDomain]:
        """Retrieve a scenario by its ID."""
        db_scenario = self.scenario_repository.get_by_id(scenario_id)
        if not db_scenario:
            return None
        return ScenarioDomain.model_validate(db_scenario)

    def list_scenarios_by_project(self, project_id: UUID) -> List[ScenarioDomain]:
        """List all scenarios under a specific project."""
        db_scenarios = self.scenario_repository.list_by_project(project_id)
        return [ScenarioDomain.model_validate(s) for s in db_scenarios]

    def update_scenario(self, scenario_id: UUID, scenario_in: ScenarioUpdate) -> Optional[ScenarioDomain]:
        """Update an existing scenario."""
        db_scenario = self.scenario_repository.get_by_id(scenario_id)
        if not db_scenario:
            return None
        db_scenario = self.scenario_repository.update(db_scenario, scenario_in)
        return ScenarioDomain.model_validate(db_scenario)

    def delete_scenario(self, scenario_id: UUID) -> bool:
        """Delete a scenario."""
        db_scenario = self.scenario_repository.get_by_id(scenario_id)
        if not db_scenario:
            return False
        self.scenario_repository.delete(db_scenario)
        return True
