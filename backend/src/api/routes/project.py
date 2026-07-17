from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from src.infrastructure.database import get_db
from src.domain.project.models import ProjectCreate, ProjectDomain
from src.application.project import ProjectService

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("", response_model=ProjectDomain, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new planning project."""
    service = ProjectService(db)
    return service.create_project(project_in)

@router.get("", response_model=List[ProjectDomain])
def list_projects(db: Session = Depends(get_db)):
    """List all projects."""
    service = ProjectService(db)
    return service.list_projects()

@router.get("/{project_id}", response_model=ProjectDomain)
def get_project(project_id: UUID, db: Session = Depends(get_db)):
    """Get a project by its unique ID."""
    service = ProjectService(db)
    project = service.get_project(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project
