from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from src.domain.commodity.models import CommodityDomain
from src.domain.vessel.schemas import VesselResponse


class CommodityVesselCompatibilityBase(BaseModel):
    commodity_id: UUID = Field(..., description="ID Komoditas")
    vessel_id: UUID = Field(..., description="ID Kapal")
    notes: Optional[str] = Field(None, description="Catatan Kompatibilitas")
    is_active: bool = Field(True, description="Status Keaktifan Mapping")

class CommodityVesselCompatibilityCreate(CommodityVesselCompatibilityBase):
    pass

class CommodityVesselCompatibilityUpdate(BaseModel):
    notes: Optional[str] = None
    is_active: Optional[bool] = None

class CommodityVesselCompatibilityResponse(CommodityVesselCompatibilityBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    commodity: Optional[CommodityDomain] = None
    vessel: Optional[VesselResponse] = None


    model_config = ConfigDict(from_attributes=True)

class BatchSetVesselsForCommodityInput(BaseModel):
    commodity_id: UUID = Field(..., description="ID Komoditas")
    vessel_ids: List[UUID] = Field(..., description="Daftar ID Kapal yang Kompatibel")
