from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from src.infrastructure.database import get_db
from src.domain.cargo_flow.models import CargoFlowCreate, CargoFlowDomain, CargoFlowUpdate
from src.application.cargo_flow import CargoFlowService

router = APIRouter(tags=["Cargo Flows"])

@router.post("/scenarios/{scenario_id}/cargo-flows", response_model=CargoFlowDomain, status_code=status.HTTP_201_CREATED)
def create_cargo_flow(scenario_id: UUID, flow_in: CargoFlowCreate, db: Session = Depends(get_db)):
    """Create a new cargo flow under a scenario."""
    service = CargoFlowService(db)
    return service.create_cargo_flow(scenario_id, flow_in)

@router.get("/scenarios/{scenario_id}/cargo-flows", response_model=List[CargoFlowDomain])
def list_cargo_flows(scenario_id: UUID, db: Session = Depends(get_db)):
    """List all cargo flows under a scenario."""
    service = CargoFlowService(db)
    return service.list_cargo_flows(scenario_id)

@router.get("/cargo-flows/{cargo_flow_id}", response_model=CargoFlowDomain)
def get_cargo_flow(cargo_flow_id: UUID, db: Session = Depends(get_db)):
    """Get a cargo flow by its unique ID."""
    service = CargoFlowService(db)
    flow = service.get_cargo_flow(cargo_flow_id)
    if not flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cargo flow not found"
        )
    return flow

@router.patch("/cargo-flows/{cargo_flow_id}", response_model=CargoFlowDomain)
def update_cargo_flow(cargo_flow_id: UUID, flow_in: CargoFlowUpdate, db: Session = Depends(get_db)):
    """Update details of a specific cargo flow."""
    service = CargoFlowService(db)
    flow = service.update_cargo_flow(cargo_flow_id, flow_in)
    if not flow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cargo flow not found"
        )
    return flow

@router.delete("/cargo-flows/{cargo_flow_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cargo_flow(cargo_flow_id: UUID, db: Session = Depends(get_db)):
    """Delete a specific cargo flow."""
    service = CargoFlowService(db)
    success = service.delete_cargo_flow(cargo_flow_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cargo flow not found"
        )
    return
