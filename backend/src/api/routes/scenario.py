from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from src.infrastructure.database import get_db
from src.domain.scenario.models import ScenarioCreate, ScenarioDomain
from src.application.scenario import ScenarioService

router = APIRouter(tags=["Scenarios"])

@router.post("/scenarios", response_model=ScenarioDomain, status_code=status.HTTP_201_CREATED)
def create_scenario(scenario_in: ScenarioCreate, db: Session = Depends(get_db)):
    """Create a new scenario for a project."""
    service = ScenarioService(db)
    scenario = service.create_scenario(scenario_in)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create scenario. Verify project_id and parent_scenario_id exist."
        )
    return scenario

@router.get("/scenarios/{scenario_id}", response_model=ScenarioDomain)
def get_scenario(scenario_id: UUID, db: Session = Depends(get_db)):
    """Get details of a specific scenario."""
    service = ScenarioService(db)
    scenario = service.get_scenario(scenario_id)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )
    return scenario

@router.get("/projects/{project_id}/scenarios", response_model=List[ScenarioDomain])
def list_scenarios_by_project(project_id: UUID, db: Session = Depends(get_db)):
    """List all scenarios belonging to a specific project."""
    service = ScenarioService(db)
    # Check if project exists
    from src.application.project import ProjectService
    project_service = ProjectService(db)
    project = project_service.get_project(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return service.list_scenarios_by_project(project_id)

@router.delete("/scenarios/{scenario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scenario(scenario_id: UUID, db: Session = Depends(get_db)):
    """Delete a scenario."""
    service = ScenarioService(db)
    if not service.delete_scenario(scenario_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scenario not found"
        )

