from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class ScenarioBase(BaseModel):
    project_id: UUID
    parent_scenario_id: Optional[UUID] = None
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: str = Field("DRAFT", max_length=50)

class ScenarioCreate(BaseModel):
    project_id: UUID
    parent_scenario_id: Optional[UUID] = None
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field("DRAFT", max_length=50)

class ScenarioUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[str] = Field(None, max_length=50)

class ScenarioDomain(ScenarioBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
