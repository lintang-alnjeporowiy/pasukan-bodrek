from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class StudyPortBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Nama Pelabuhan")
    code: Optional[str] = Field(None, max_length=50, description="Kode Pelabuhan (Opsional)")
    location: str = Field(..., min_length=1, max_length=255, description="Lokasi Pelabuhan")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Koordinat Latitude (-90 s/d 90)")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Koordinat Longitude (-180 s/d 180)")
    description: Optional[str] = Field(None, description="Deskripsi Tambahan")

class StudyPortCreate(StudyPortBase):
    pass

class StudyPortUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    location: Optional[str] = Field(None, min_length=1, max_length=255)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    description: Optional[str] = None

class StudyPortResponse(StudyPortBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
