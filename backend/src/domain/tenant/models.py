from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class TenantBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    commodity_id: Optional[UUID] = None
    description: Optional[str] = None
    is_active: bool = True

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    commodity_id: Optional[UUID] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class TenantDomain(TenantBase):
    id: UUID
    project_id: UUID
    commodity_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
