from uuid import UUID
from typing import Optional, List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.infrastructure.repositories.study_port import StudyPortRepository
from src.infrastructure.repositories.project import ProjectRepository
from src.domain.study_port.schemas import StudyPortCreate, StudyPortUpdate, StudyPortResponse

class StudyPortService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = StudyPortRepository(db)
        self.project_repository = ProjectRepository(db)

    def get_study_port_by_project(self, project_id: UUID) -> StudyPortResponse:
        project = self.project_repository.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=status.HTTP_444_NOT_FOUND if hasattr(status, 'HTTP_444_NOT_FOUND') else 404, detail="Proyek tidak ditemukan")
        
        study_port = self.repository.get_by_project_id(project_id)
        if not study_port:
            raise HTTPException(status_code=404, detail="Study Port belum dikonfigurasi untuk proyek ini")
        return StudyPortResponse.model_validate(study_port)

    def create_study_port(self, project_id: UUID, study_port_in: StudyPortCreate) -> StudyPortResponse:
        project = self.project_repository.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Proyek tidak ditemukan")

        existing_port = self.repository.get_by_project_id(project_id)
        if existing_port:
            raise HTTPException(
                status_code=400,
                detail="Proyek ini sudah memiliki Study Port. Setiap proyek hanya boleh memiliki 1 Study Port."
            )

        study_port = self.repository.create(project_id, study_port_in)
        return StudyPortResponse.model_validate(study_port)

    def copy_study_port_from_project(self, target_project_id: UUID, source_project_id: UUID) -> StudyPortResponse:
        target_project = self.project_repository.get_by_id(target_project_id)
        if not target_project:
            raise HTTPException(status_code=404, detail="Proyek target tidak ditemukan")

        existing_port = self.repository.get_by_project_id(target_project_id)
        if existing_port:
            raise HTTPException(
                status_code=400,
                detail="Proyek target sudah memiliki Study Port."
            )

        copied_port = self.repository.copy_from_project(target_project_id, source_project_id)
        if not copied_port:
            raise HTTPException(status_code=404, detail="Study Port pada proyek sumber tidak ditemukan")
        
        return StudyPortResponse.model_validate(copied_port)

    def update_study_port(self, project_id: UUID, study_port_in: StudyPortUpdate) -> StudyPortResponse:
        study_port = self.repository.get_by_project_id(project_id)
        if not study_port:
            raise HTTPException(status_code=404, detail="Study Port tidak ditemukan")

        updated_port = self.repository.update(study_port, study_port_in)
        return StudyPortResponse.model_validate(updated_port)

    def get_all_samples(self) -> List[StudyPortResponse]:
        ports = self.repository.get_all_samples()
        return [StudyPortResponse.model_validate(p) for p in ports]
