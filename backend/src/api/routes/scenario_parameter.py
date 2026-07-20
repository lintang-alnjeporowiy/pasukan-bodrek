from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from src.infrastructure.database.session import get_db
from src.application.scenario_parameter.schemas import (
    ProjectParameterCreateRequest,
    ScenarioParameterOverrideRequest,
    ResolvedParameterResponse,
    ResolvedParameterListResponse,
)
from src.application.scenario_parameter.service import ScenarioParameterService

router = APIRouter(tags=["Scenario Parameter Overrides"])

@router.get(
    "/scenarios/{scenario_id}/parameters",
    response_model=ResolvedParameterListResponse,
    summary="Get all resolved parameters for a scenario"
)
def get_all_scenario_parameters(
    scenario_id: UUID,
    db: Session = Depends(get_db)
):
    service = ScenarioParameterService(db)
    return service.resolve_all_parameters(scenario_id)

@router.get(
    "/scenarios/{scenario_id}/parameters/{parameter_key}",
    response_model=ResolvedParameterResponse,
    summary="Get resolved parameter by key for a scenario"
)
def get_scenario_parameter_by_key(
    scenario_id: UUID,
    parameter_key: str,
    db: Session = Depends(get_db)
):
    service = ScenarioParameterService(db)
    return service.resolve_parameter(scenario_id, parameter_key)

@router.post(
    "/scenarios/{scenario_id}/parameters/override",
    response_model=ResolvedParameterResponse,
    summary="Set or update a scenario parameter override"
)
def set_scenario_parameter_override(
    scenario_id: UUID,
    req: ScenarioParameterOverrideRequest,
    db: Session = Depends(get_db)
):
    service = ScenarioParameterService(db)
    return service.set_scenario_override(scenario_id, req)

@router.delete(
    "/scenarios/{scenario_id}/parameters/override/{parameter_key}",
    response_model=ResolvedParameterResponse,
    summary="Remove scenario parameter override (revert to project/system default)"
)
def delete_scenario_parameter_override(
    scenario_id: UUID,
    parameter_key: str,
    db: Session = Depends(get_db)
):
    service = ScenarioParameterService(db)
    return service.delete_scenario_override(scenario_id, parameter_key)

@router.post(
    "/projects/{project_id}/parameters/default",
    response_model=ProjectParameterCreateRequest,
    summary="Set or update project parameter default"
)
def set_project_parameter_default(
    project_id: UUID,
    req: ProjectParameterCreateRequest,
    db: Session = Depends(get_db)
):
    service = ScenarioParameterService(db)
    return service.set_project_default(project_id, req)
