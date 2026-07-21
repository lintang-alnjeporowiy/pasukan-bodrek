from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.infrastructure.database.session import get_db
from src.application.route.service import RouteService
from src.domain.route.schemas import RouteCreate, RouteUpdate, RouteResponse

router = APIRouter(tags=["Routes"])

@router.post("/projects/{project_id}/routes", response_model=RouteResponse, status_code=status.HTTP_201_CREATED)
def create_route(project_id: UUID, payload: RouteCreate, db: Session = Depends(get_db)):
    service = RouteService(db)
    return service.create_route(project_id, payload)

@router.get("/projects/{project_id}/routes", response_model=List[RouteResponse])
def list_routes(project_id: UUID, db: Session = Depends(get_db)):
    service = RouteService(db)
    return service.list_routes(project_id)

@router.get("/routes/{route_id}", response_model=RouteResponse)
def get_route(route_id: UUID, db: Session = Depends(get_db)):
    service = RouteService(db)
    return service.get_route(route_id)

@router.patch("/routes/{route_id}", response_model=RouteResponse)
def update_route(route_id: UUID, payload: RouteUpdate, db: Session = Depends(get_db)):
    service = RouteService(db)
    return service.update_route(route_id, payload)

@router.delete("/routes/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_route(route_id: UUID, db: Session = Depends(get_db)):
    service = RouteService(db)
    service.delete_route(route_id)
