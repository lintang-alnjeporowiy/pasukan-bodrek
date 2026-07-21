from uuid import UUID
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator

class RouteDirectionEnum(str, Enum):
    INBOUND = "INBOUND"
    OUTBOUND = "OUTBOUND"

class RouteBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Nama Rute Pelayaran")
    direction: RouteDirectionEnum = Field(..., description="Arah Rute (INBOUND atau OUTBOUND)")
    external_port_id: UUID = Field(..., description="ID External Port")
    distance_nm: float = Field(..., gt=0.0, description="Jarak Pelayaran dalam Nautical Miles (NM > 0)")
    description: Optional[str] = Field(None, description="Keterangan rute")
    is_active: bool = Field(default=True, description="Status aktif rute")

class RouteCreate(RouteBase):
    pass

class RouteUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    direction: Optional[RouteDirectionEnum] = None
    external_port_id: Optional[UUID] = None
    distance_nm: Optional[float] = Field(None, gt=0.0)
    description: Optional[str] = None
    is_active: Optional[bool] = None

class RouteResponse(RouteBase):
    id: UUID
    project_id: UUID
    study_port_id: UUID
    study_port_name: Optional[str] = None
    external_port_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
