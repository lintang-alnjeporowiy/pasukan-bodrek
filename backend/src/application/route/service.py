from uuid import UUID
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.infrastructure.repositories.route import RouteRepository
from src.infrastructure.repositories.project import ProjectRepository
from src.infrastructure.repositories.study_port import StudyPortRepository
from src.infrastructure.repositories.external_port import ExternalPortRepository
from src.domain.route.schemas import RouteCreate, RouteUpdate, RouteResponse

class RouteService:
    def __init__(self, db: Session):
        self.repo = RouteRepository(db)
        self.project_repo = ProjectRepository(db)
        self.study_port_repo = StudyPortRepository(db)
        self.external_port_repo = ExternalPortRepository(db)

    def _to_response(self, model) -> RouteResponse:
        resp = RouteResponse.model_validate(model)
        if model.study_port:
            resp.study_port_name = model.study_port.name
        if model.external_port:
            resp.external_port_name = model.external_port.name
        return resp

    def create_route(self, project_id: UUID, data: RouteCreate) -> RouteResponse:
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project dengan ID {project_id} tidak ditemukan"
            )

        study_port = self.study_port_repo.get_by_project_id(project_id)
        if not study_port:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project belum memiliki Study Port. Harap tambahkan Study Port terlebih dahulu."
            )

        external_port = self.external_port_repo.get_by_id(data.external_port_id)
        if not external_port:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"External Port dengan ID {data.external_port_id} tidak ditemukan"
            )

        if data.distance_nm <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Jarak pelayaran (distance_nm) harus lebih besar dari 0 NM"
            )

        route = self.repo.create(project_id=project_id, study_port_id=study_port.id, data=data)
        return self._to_response(route)

    def list_routes(self, project_id: UUID) -> List[RouteResponse]:
        project = self.project_repo.get_by_id(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project dengan ID {project_id} tidak ditemukan"
            )
        routes = self.repo.list_by_project(project_id)
        return [self._to_response(r) for r in routes]

    def get_route(self, route_id: UUID) -> RouteResponse:
        route = self.repo.get_by_id(route_id)
        if not route:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Rute dengan ID {route_id} tidak ditemukan"
            )
        return self._to_response(route)

    def update_route(self, route_id: UUID, data: RouteUpdate) -> RouteResponse:
        if data.external_port_id is not None:
            ext_port = self.external_port_repo.get_by_id(data.external_port_id)
            if not ext_port:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"External Port dengan ID {data.external_port_id} tidak ditemukan"
                )

        if data.distance_nm is not None and data.distance_nm <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Jarak pelayaran (distance_nm) harus lebih besar dari 0 NM"
            )

        route = self.repo.update(route_id, data)
        if not route:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Rute dengan ID {route_id} tidak ditemukan"
            )
        return self._to_response(route)

    def delete_route(self, route_id: UUID) -> None:
        deleted = self.repo.delete(route_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Rute dengan ID {route_id} tidak ditemukan"
            )
