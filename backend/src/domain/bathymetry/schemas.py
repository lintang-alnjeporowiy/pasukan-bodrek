from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

# --- Bathymetry Point Schemas ---

class BathymetryPointBase(BaseModel):
    distance_from_shore: float = Field(..., ge=0.0, description="Jarak dari garis pantai (meter)")
    water_depth: float = Field(..., ge=0.0, description="Kedalaman air (meter)")
    sequence: int = Field(default=0, ge=0, description="Urutan titik data")

class BathymetryPointCreate(BathymetryPointBase):
    pass

class BathymetryPointUpdate(BaseModel):
    distance_from_shore: Optional[float] = Field(None, ge=0.0)
    water_depth: Optional[float] = Field(None, ge=0.0)
    sequence: Optional[int] = Field(None, ge=0)

class BathymetryPointResponse(BathymetryPointBase):
    id: UUID
    bathymetry_profile_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Bathymetry Profile Schemas ---

class BathymetryProfileBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Nama profil batimetri")
    description: Optional[str] = Field(None, description="Keterangan profil batimetri")

class BathymetryProfileCreate(BathymetryProfileBase):
    points: Optional[List[BathymetryPointBase]] = Field(default_factory=list, description="Titik-titik data batimetri awal")

class BathymetryProfileUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None

class BathymetryProfileResponse(BathymetryProfileBase):
    id: UUID
    study_port_id: UUID
    points: List[BathymetryPointResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
