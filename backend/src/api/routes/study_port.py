from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from src.infrastructure.database.session import get_db
from src.application.study_port.service import StudyPortService
from src.domain.study_port.schemas import StudyPortCreate, StudyPortUpdate, StudyPortResponse

router = APIRouter(tags=["Study Ports"])

@router.get("/projects/{project_id}/study-port", response_model=StudyPortResponse)
def get_study_port_by_project(project_id: UUID, db: Session = Depends(get_db)):
    service = StudyPortService(db)
    return service.get_study_port_by_project(project_id)

@router.post("/projects/{project_id}/study-port", response_model=StudyPortResponse, status_code=status.HTTP_201_CREATED)
def create_study_port_for_project(
    project_id: UUID,
    payload: StudyPortCreate,
    db: Session = Depends(get_db)
):
    service = StudyPortService(db)
    return service.create_study_port(project_id, payload)

@router.post("/projects/{project_id}/study-port/copy", response_model=StudyPortResponse, status_code=status.HTTP_201_CREATED)
def copy_study_port_from_project(
    project_id: UUID,
    source_project_id: UUID = Query(..., description="ID proyek sumber yang akan disalin Study Port-nya"),
    db: Session = Depends(get_db)
):
    service = StudyPortService(db)
    return service.copy_study_port_from_project(target_project_id=project_id, source_project_id=source_project_id)

@router.put("/projects/{project_id}/study-port", response_model=StudyPortResponse)
def update_study_port(
    project_id: UUID,
    payload: StudyPortUpdate,
    db: Session = Depends(get_db)
):
    service = StudyPortService(db)
    return service.update_study_port(project_id, payload)

@router.get("/study-ports/samples", response_model=List[StudyPortResponse])
def list_sample_study_ports(db: Session = Depends(get_db)):
    service = StudyPortService(db)
    return service.get_all_samples()
