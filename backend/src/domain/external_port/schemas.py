from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class ExternalPortBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Nama Pelabuhan Eksternal")
    country: str = Field(..., min_length=1, max_length=255, description="Negara / Lokasi Pelabuhan")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Koordinat Latitude (-90 s/d 90)")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Koordinat Longitude (-180 s/d 180)")
    max_draft: float = Field(..., gt=0.0, description="Draft Maksimum (meter)")
    max_loa: float = Field(..., gt=0.0, description="Length Overall Maksimum (meter)")
    cargo_productivity: float = Field(0.0, ge=0.0, description="Produktivitas Bongkar Muat")
    productivity_unit: str = Field("ton/hour", max_length=50, description="Satuan Produktivitas (e.g. ton/hour, TEU/hour)")
    additional_port_time: float = Field(0.0, ge=0.0, description="Waktu Tambahan Pelabuhan (jam)")
    description: Optional[str] = Field(None, description="Keterangan / Deskripsi Pelabuhan")
    is_active: bool = Field(True, description="Status Keaktifan Pelabuhan")

class ExternalPortCreate(ExternalPortBase):
    pass

class ExternalPortUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    country: Optional[str] = Field(None, min_length=1, max_length=255)
    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    max_draft: Optional[float] = Field(None, gt=0.0)
    max_loa: Optional[float] = Field(None, gt=0.0)
    cargo_productivity: Optional[float] = Field(None, ge=0.0)
    productivity_unit: Optional[str] = Field(None, max_length=50)
    additional_port_time: Optional[float] = Field(None, ge=0.0)
    description: Optional[str] = None
    is_active: Optional[bool] = None

class ExternalPortResponse(ExternalPortBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
