from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from src.infrastructure.database.models.route import RouteModel
from src.domain.route.schemas import RouteCreate, RouteUpdate

class RouteRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, project_id: UUID, study_port_id: UUID, data: RouteCreate) -> RouteModel:
        route = RouteModel(
            project_id=project_id,
            study_port_id=study_port_id,
            external_port_id=data.external_port_id,
            name=data.name.strip(),
            direction=data.direction.value if hasattr(data.direction, 'value') else str(data.direction),
            distance_nm=data.distance_nm,
            description=data.description.strip() if data.description else None,
            is_active=data.is_active,
        )
        self.db.add(route)
        self.db.commit()
        self.db.refresh(route)
        return route

    def get_by_id(self, route_id: UUID) -> Optional[RouteModel]:
        return (
            self.db.query(RouteModel)
            .options(joinedload(RouteModel.study_port), joinedload(RouteModel.external_port))
            .filter(RouteModel.id == route_id)
            .first()
        )

    def list_by_project(self, project_id: UUID) -> List[RouteModel]:
        return (
            self.db.query(RouteModel)
            .options(joinedload(RouteModel.study_port), joinedload(RouteModel.external_port))
            .filter(RouteModel.project_id == project_id)
            .order_by(RouteModel.created_at.desc())
            .all()
        )

    def update(self, route_id: UUID, data: RouteUpdate) -> Optional[RouteModel]:
        route = self.get_by_id(route_id)
        if not route:
            return None

        if data.name is not None:
            route.name = data.name.strip()
        if data.direction is not None:
            route.direction = data.direction.value if hasattr(data.direction, 'value') else str(data.direction)
        if data.external_port_id is not None:
            route.external_port_id = data.external_port_id
        if data.distance_nm is not None:
            route.distance_nm = data.distance_nm
        if data.description is not None:
            route.description = data.description.strip() if data.description else None
        if data.is_active is not None:
            route.is_active = data.is_active

        self.db.commit()
        self.db.refresh(route)
        return route

    def delete(self, route_id: UUID) -> bool:
        route = self.get_by_id(route_id)
        if not route:
            return False
        self.db.delete(route)
        self.db.commit()
        return True
