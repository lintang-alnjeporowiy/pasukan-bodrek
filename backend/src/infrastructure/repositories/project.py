from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.project import ProjectModel
from src.domain.project.models import ProjectCreate, ProjectUpdate

class ProjectRepository:
    """Repository to manage Project database operations."""
    
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, project_id: UUID) -> Optional[ProjectModel]:
        """Retrieve a project by its unique ID."""
        return self.db.query(ProjectModel).filter(ProjectModel.id == project_id).first()

    def list_all(self) -> List[ProjectModel]:
        """List all projects ordered by creation date desc."""
        return self.db.query(ProjectModel).order_by(ProjectModel.created_at.desc()).all()

    def create(self, project_in: ProjectCreate) -> ProjectModel:
        """Create a new project."""
        db_project = ProjectModel(
            name=project_in.name,
            description=project_in.description,
            location=project_in.location,
            base_year=project_in.base_year,
            planning_horizon=project_in.planning_horizon
        )
        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)
        return db_project

    def update(self, db_project: ProjectModel, project_in: ProjectUpdate) -> ProjectModel:
        """Update an existing project."""
        update_data = project_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_project, field, value)
        self.db.commit()
        self.db.refresh(db_project)
        return db_project

    def delete(self, db_project: ProjectModel) -> None:
        """Delete a project."""
        self.db.delete(db_project)
        self.db.commit()
