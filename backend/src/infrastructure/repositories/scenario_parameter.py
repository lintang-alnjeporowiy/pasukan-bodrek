from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.scenario_parameter import (
    ProjectParameterModel,
    ScenarioParameterOverrideModel,
)

class ScenarioParameterRepository:
    """Repository to manage Project Parameters and Scenario Parameter Overrides in DB."""

    def __init__(self, db: Session):
        self.db = db

    # --- Project Defaults ---
    def get_project_parameter(self, project_id: UUID, parameter_key: str) -> Optional[ProjectParameterModel]:
        return (
            self.db.query(ProjectParameterModel)
            .filter(
                ProjectParameterModel.project_id == project_id,
                ProjectParameterModel.parameter_key == parameter_key,
            )
            .first()
        )

    def list_project_parameters(self, project_id: UUID) -> List[ProjectParameterModel]:
        return (
            self.db.query(ProjectParameterModel)
            .filter(ProjectParameterModel.project_id == project_id)
            .all()
        )

    def set_project_parameter(self, project_id: UUID, parameter_key: str, value: str) -> ProjectParameterModel:
        existing = self.get_project_parameter(project_id, parameter_key)
        if existing:
            existing.value = str(value)
            db_param = existing
        else:
            db_param = ProjectParameterModel(
                project_id=project_id,
                parameter_key=parameter_key,
                value=str(value),
            )
            self.db.add(db_param)
        self.db.commit()
        self.db.refresh(db_param)
        return db_param

    def delete_project_parameter(self, project_id: UUID, parameter_key: str) -> bool:
        existing = self.get_project_parameter(project_id, parameter_key)
        if existing:
            self.db.delete(existing)
            self.db.commit()
            return True
        return False

    # --- Scenario Overrides ---
    def get_scenario_override(self, scenario_id: UUID, parameter_key: str) -> Optional[ScenarioParameterOverrideModel]:
        return (
            self.db.query(ScenarioParameterOverrideModel)
            .filter(
                ScenarioParameterOverrideModel.scenario_id == scenario_id,
                ScenarioParameterOverrideModel.parameter_key == parameter_key,
            )
            .first()
        )

    def list_scenario_overrides(self, scenario_id: UUID) -> List[ScenarioParameterOverrideModel]:
        return (
            self.db.query(ScenarioParameterOverrideModel)
            .filter(ScenarioParameterOverrideModel.scenario_id == scenario_id)
            .all()
        )

    def set_scenario_override(
        self, scenario_id: UUID, parameter_key: str, override_value: str, reason: Optional[str] = None
    ) -> ScenarioParameterOverrideModel:
        existing = self.get_scenario_override(scenario_id, parameter_key)
        if existing:
            existing.override_value = str(override_value)
            if reason is not None:
                existing.reason = reason
            db_override = existing
        else:
            db_override = ScenarioParameterOverrideModel(
                scenario_id=scenario_id,
                parameter_key=parameter_key,
                override_value=str(override_value),
                reason=reason,
            )
            self.db.add(db_override)
        self.db.commit()
        self.db.refresh(db_override)
        return db_override

    def delete_scenario_override(self, scenario_id: UUID, parameter_key: str) -> bool:
        existing = self.get_scenario_override(scenario_id, parameter_key)
        if existing:
            self.db.delete(existing)
            self.db.commit()
            return True
        return False
