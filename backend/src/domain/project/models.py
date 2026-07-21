from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional
from src.domain.study_port.schemas import StudyPortCreate, StudyPortResponse

class ProjectBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    location: Optional[str] = Field(None, max_length=255)
    base_year: int = Field(..., ge=2000, le=2100)
    planning_horizon: int = Field(..., ge=1, le=100)

class ProjectCreate(ProjectBase):
    study_port: Optional[StudyPortCreate] = None
    copy_study_port_from_project_id: Optional[UUID] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    location: Optional[str] = Field(None, max_length=255)
    base_year: Optional[int] = Field(None, ge=2000, le=2100)
    planning_horizon: Optional[int] = Field(None, ge=1, le=100)

class ProjectDomain(ProjectBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    study_port: Optional[StudyPortResponse] = None

    model_config = ConfigDict(from_attributes=True)
