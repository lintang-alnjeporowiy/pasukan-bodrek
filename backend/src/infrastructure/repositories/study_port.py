from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from src.infrastructure.database.models.study_port import StudyPortModel
from src.domain.study_port.schemas import StudyPortCreate, StudyPortUpdate

class StudyPortRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_project_id(self, project_id: UUID) -> Optional[StudyPortModel]:
        return self.db.query(StudyPortModel).filter(StudyPortModel.project_id == project_id).first()

    def get_by_id(self, study_port_id: UUID) -> Optional[StudyPortModel]:
        return self.db.query(StudyPortModel).filter(StudyPortModel.id == study_port_id).first()

    def create(self, project_id: UUID, study_port_in: StudyPortCreate) -> StudyPortModel:
        db_study_port = StudyPortModel(
            project_id=project_id,
            name=study_port_in.name,
            code=study_port_in.code,
            location=study_port_in.location,
            latitude=study_port_in.latitude,
            longitude=study_port_in.longitude,
            description=study_port_in.description,
        )
        self.db.add(db_study_port)
        self.db.commit()
        self.db.refresh(db_study_port)
        return db_study_port

    def copy_from_project(self, target_project_id: UUID, source_project_id: UUID) -> Optional[StudyPortModel]:
        source_port = self.get_by_project_id(source_project_id)
        if not source_port:
            return None
        db_study_port = StudyPortModel(
            project_id=target_project_id,
            name=source_port.name,
            code=source_port.code,
            location=source_port.location,
            latitude=source_port.latitude,
            longitude=source_port.longitude,
            description=source_port.description,
        )
        self.db.add(db_study_port)
        self.db.commit()
        self.db.refresh(db_study_port)
        return db_study_port

    def update(self, study_port: StudyPortModel, study_port_in: StudyPortUpdate) -> StudyPortModel:
        update_data = study_port_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(study_port, field, value)
        self.db.commit()
        self.db.refresh(study_port)
        return study_port

    def get_all_samples(self) -> List[StudyPortModel]:
        return self.db.query(StudyPortModel).all()

