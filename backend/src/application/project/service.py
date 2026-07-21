from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.repositories.project import ProjectRepository
from src.infrastructure.repositories.study_port import StudyPortRepository
from src.domain.project.models import ProjectCreate, ProjectUpdate, ProjectDomain

class ProjectService:
    """Application Service to coordinate project-related workflows."""
    
    def __init__(self, db: Session):
        self.db = db
        self.repository = ProjectRepository(db)
        self.study_port_repository = StudyPortRepository(db)

    def create_project(self, project_in: ProjectCreate) -> ProjectDomain:
        """Business logic for creating a new project with an optional study port."""
        db_project = self.repository.create(project_in)
        
        # Handle study port inline creation or copy if requested
        if project_in.study_port:
            self.study_port_repository.create(db_project.id, project_in.study_port)
        elif project_in.copy_study_port_from_project_id:
            self.study_port_repository.copy_from_project(
                target_project_id=db_project.id,
                source_project_id=project_in.copy_study_port_from_project_id
            )
            
        self.db.refresh(db_project)
        return ProjectDomain.model_validate(db_project)

    def get_project(self, project_id: UUID) -> Optional[ProjectDomain]:
        """Business logic for retrieving a project by ID."""
        db_project = self.repository.get_by_id(project_id)
        if not db_project:
            return None
        return ProjectDomain.model_validate(db_project)

    def list_projects(self) -> List[ProjectDomain]:
        """Business logic for listing all projects."""
        db_projects = self.repository.list_all()
        return [ProjectDomain.model_validate(p) for p in db_projects]

    def update_project(self, project_id: UUID, project_in: ProjectUpdate) -> Optional[ProjectDomain]:
        """Business logic for updating a project."""
        db_project = self.repository.get_by_id(project_id)
        if not db_project:
            return None
        db_project = self.repository.update(db_project, project_in)
        return ProjectDomain.model_validate(db_project)

    def delete_project(self, project_id: UUID) -> bool:
        """Business logic for deleting a project."""
        db_project = self.repository.get_by_id(project_id)
        if not db_project:
            return False
        self.repository.delete(db_project)
        return True
