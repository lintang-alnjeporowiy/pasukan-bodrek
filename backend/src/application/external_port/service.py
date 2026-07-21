from uuid import UUID
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.infrastructure.repositories.external_port import ExternalPortRepository
from src.domain.external_port.schemas import ExternalPortCreate, ExternalPortUpdate, ExternalPortResponse

class ExternalPortService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ExternalPortRepository(db)

    def get_all(self, active_only: bool = False) -> List[ExternalPortResponse]:
        ports = self.repository.get_all(active_only=active_only)
        return [ExternalPortResponse.model_validate(p) for p in ports]

    def get_by_id(self, port_id: UUID) -> ExternalPortResponse:
        port = self.repository.get_by_id(port_id)
        if not port:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="External Port tidak ditemukan")
        return ExternalPortResponse.model_validate(port)

    def create_port(self, port_in: ExternalPortCreate) -> ExternalPortResponse:
        port = self.repository.create(port_in)
        return ExternalPortResponse.model_validate(port)

    def update_port(self, port_id: UUID, port_in: ExternalPortUpdate) -> ExternalPortResponse:
        port = self.repository.get_by_id(port_id)
        if not port:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="External Port tidak ditemukan")
        updated_port = self.repository.update(port, port_in)
        return ExternalPortResponse.model_validate(updated_port)

    def delete_port(self, port_id: UUID) -> None:
        port = self.repository.get_by_id(port_id)
        if not port:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="External Port tidak ditemukan")
        self.repository.delete(port)
