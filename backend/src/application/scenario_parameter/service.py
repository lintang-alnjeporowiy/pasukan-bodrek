from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.domain.scenario_parameter.system_registry import (
    SYSTEM_PARAMETERS_REGISTRY,
    get_system_parameter_def,
)
from src.infrastructure.repositories.scenario_parameter import ScenarioParameterRepository
from src.infrastructure.repositories.scenario import ScenarioRepository
from src.application.scenario_parameter.schemas import (
    ProjectParameterCreateRequest,
    ScenarioParameterOverrideRequest,
    ResolvedParameterResponse,
    ResolvedParameterListResponse,
)

class ScenarioParameterService:
    """Service to manage parameter precedence: Scenario Override > Project Default > System Default."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = ScenarioParameterRepository(db)
        self.scenario_repo = ScenarioRepository(db)

    def resolve_parameter(self, scenario_id: UUID, parameter_key: str) -> ResolvedParameterResponse:
        scenario = self.scenario_repo.get_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skenario dengan ID {scenario_id} tidak ditemukan."
            )

        system_def = get_system_parameter_def(parameter_key)
        if not system_def:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter key '{parameter_key}' tidak terdaftar dalam sistem."
            )

        project_param = self.repo.get_project_parameter(scenario.project_id, parameter_key)
        scenario_override = self.repo.get_scenario_override(scenario_id, parameter_key)

        project_default_val = project_param.value if project_param else None
        override_val = scenario_override.override_value if scenario_override else None
        override_reason = scenario_override.reason if scenario_override else None

        if scenario_override is not None and override_val is not None:
            effective_val = override_val
            source = "SCENARIO_OVERRIDE"
            is_overridden = True
        elif project_param is not None and project_default_val is not None:
            effective_val = project_default_val
            source = "PROJECT_DEFAULT"
            is_overridden = False
        else:
            effective_val = system_def.default_value
            source = "SYSTEM_DEFAULT"
            is_overridden = False

        return ResolvedParameterResponse(
            parameter_key=system_def.key,
            parameter_name=system_def.name,
            category=system_def.category,
            system_default_value=system_def.default_value,
            project_default_value=project_default_val,
            override_value=override_val,
            effective_value=effective_val,
            unit=system_def.unit,
            source=source,
            is_overridden=is_overridden,
            reason=override_reason,
            description=system_def.description,
        )

    def resolve_all_parameters(self, scenario_id: UUID) -> ResolvedParameterListResponse:
        scenario = self.scenario_repo.get_by_id(scenario_id)
        if not scenario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Skenario dengan ID {scenario_id} tidak ditemukan."
            )

        resolved_list: List[ResolvedParameterResponse] = []
        for key in SYSTEM_PARAMETERS_REGISTRY.keys():
            resolved = self.resolve_parameter(scenario_id, key)
            resolved_list.append(resolved)

        return ResolvedParameterListResponse(
            scenario_id=scenario_id,
            project_id=scenario.project_id,
            parameters=resolved_list,
        )

    def set_scenario_override(
        self, scenario_id: UUID, req: ScenarioParameterOverrideRequest
    ) -> ResolvedParameterResponse:
        system_def = get_system_parameter_def(req.parameter_key)
        if not system_def:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter key '{req.parameter_key}' tidak terdaftar dalam sistem."
            )

        self.repo.set_scenario_override(
            scenario_id=scenario_id,
            parameter_key=req.parameter_key,
            override_value=req.override_value,
            reason=req.reason,
        )
        return self.resolve_parameter(scenario_id, req.parameter_key)

    def delete_scenario_override(self, scenario_id: UUID, parameter_key: str) -> ResolvedParameterResponse:
        self.repo.delete_scenario_override(scenario_id, parameter_key)
        return self.resolve_parameter(scenario_id, parameter_key)

    def set_project_default(self, project_id: UUID, req: ProjectParameterCreateRequest) -> ProjectParameterCreateRequest:
        system_def = get_system_parameter_def(req.parameter_key)
        if not system_def:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Parameter key '{req.parameter_key}' tidak terdaftar dalam sistem."
            )

        self.repo.set_project_parameter(
            project_id=project_id,
            parameter_key=req.parameter_key,
            value=req.value,
        )
        return req
