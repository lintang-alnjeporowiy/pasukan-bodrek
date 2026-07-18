from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class CargoFlowBase(BaseModel):
    tenant_id: UUID
    commodity_id: UUID
    direction: str = "INBOUND"
    origin: str = Field(..., min_length=1, max_length=255)
    destination_port: str = Field(..., min_length=1, max_length=255)
    base_annual_demand: float = Field(..., ge=0.0)
    unit: str = Field(..., min_length=1, max_length=50)
    is_active: bool = True

class CargoFlowCreate(CargoFlowBase):
    pass

class CargoFlowUpdate(BaseModel):
    tenant_id: Optional[UUID] = None
    commodity_id: Optional[UUID] = None
    direction: Optional[str] = None
    origin: Optional[str] = Field(None, min_length=1, max_length=255)
    destination_port: Optional[str] = Field(None, min_length=1, max_length=255)
    base_annual_demand: Optional[float] = Field(None, ge=0.0)
    unit: Optional[str] = Field(None, min_length=1, max_length=50)
    is_active: Optional[bool] = None

class CargoFlowDomain(CargoFlowBase):
    id: UUID
    scenario_id: UUID
    tenant_name: Optional[str] = None
    commodity_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
