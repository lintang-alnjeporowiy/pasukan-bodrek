from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from src.infrastructure.database.session import get_db
from src.application.external_port.service import ExternalPortService
from src.domain.external_port.schemas import ExternalPortCreate, ExternalPortUpdate, ExternalPortResponse

router = APIRouter(prefix="/external-ports", tags=["External Ports"])

@router.get("", response_model=List[ExternalPortResponse])
def list_external_ports(
    active_only: bool = Query(False, description="Filter hanya pelabuhan eksternal yang aktif"),
    db: Session = Depends(get_db)
):
    service = ExternalPortService(db)
    return service.get_all(active_only=active_only)

@router.get("/{port_id}", response_model=ExternalPortResponse)
def get_external_port(port_id: UUID, db: Session = Depends(get_db)):
    service = ExternalPortService(db)
    return service.get_by_id(port_id)

@router.post("", response_model=ExternalPortResponse, status_code=status.HTTP_201_CREATED)
def create_external_port(payload: ExternalPortCreate, db: Session = Depends(get_db)):
    service = ExternalPortService(db)
    return service.create_port(payload)

@router.put("/{port_id}", response_model=ExternalPortResponse)
def update_external_port(port_id: UUID, payload: ExternalPortUpdate, db: Session = Depends(get_db)):
    service = ExternalPortService(db)
    return service.update_port(port_id, payload)

@router.delete("/{port_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_external_port(port_id: UUID, db: Session = Depends(get_db)):
    service = ExternalPortService(db)
    service.delete_port(port_id)
    return None
