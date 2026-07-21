from uuid import UUID
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

CharterRateBasis = Literal["PER_DAY", "PER_MONTH", "PER_YEAR"]

class VesselBase(BaseModel):
    # 1. General Information
    name: str = Field(..., min_length=1, max_length=255, description="Nama Kapal")
    code: Optional[str] = Field(None, max_length=50, description="Kode Kapal")
    ship_type: str = Field(..., min_length=1, max_length=100, description="Tipe Kapal")
    is_active: bool = Field(True, description="Status Aktif")
    description: Optional[str] = Field(None, description="Deskripsi / Catatan")

    # 2. Principal Dimensions
    loa: float = Field(..., gt=0.0, description="Length Overall (meter)")
    beam: float = Field(..., gt=0.0, description="Beam / Lebar (meter)")
    draft: float = Field(..., gt=0.0, description="Draft (meter)")
    depth: float = Field(..., gt=0.0, description="Depth / Tinggi Geladak (meter)")
    dwt: float = Field(..., gt=0.0, description="Deadweight Tonnage (DWT)")
    gt: Optional[float] = Field(None, ge=0.0, description="Gross Tonnage (GT)")

    # 3. Cargo Characteristics
    capacity: float = Field(..., gt=0.0, description="Payload Capacity")
    capacity_unit: str = Field("Ton", max_length=50, description="Satuan Kapasitas (e.g. Ton, TEU, m3)")

    # 4. Operational Characteristics
    service_speed_knots: float = Field(..., gt=0.0, description="Design Speed (Knots)")
    operating_speed_knots: float = Field(14.0, gt=0.0, description="Default Operating Speed (Knots)")

    # 5. Machinery
    main_engine_power_kw: float = Field(5000.0, gt=0.0, description="Main Engine Power (kW)")
    aux_engine_power_kw: float = Field(500.0, ge=0.0, description="Auxiliary Engine Power (kW)")

    # 6. Fuel Characteristics - Main Engine
    me_sfoc: float = Field(180.0, ge=0.0, description="ME SFOC (g/kWh)")
    me_sea_load_factor: float = Field(0.85, ge=0.0, le=1.0, description="ME Sea Load Factor (0-1)")
    me_port_load_factor: float = Field(0.10, ge=0.0, le=1.0, description="ME Port Load Factor (0-1)")

    # 6. Fuel Characteristics - Auxiliary Engine
    ae_sfoc: float = Field(220.0, ge=0.0, description="AE SFOC (g/kWh)")
    ae_sea_load_factor: float = Field(0.70, ge=0.0, le=1.0, description="AE Sea Load Factor (0-1)")
    ae_port_load_factor: float = Field(0.50, ge=0.0, le=1.0, description="AE Port Load Factor (0-1)")

    # 7. Commercial Characteristics
    charter_rate: float = Field(0.0, ge=0.0, description="Charter Rate ($ / IDR)")
    charter_rate_basis: CharterRateBasis = Field("PER_DAY", description="Basis Sewa (PER_DAY, PER_MONTH, PER_YEAR)")

class VesselCreate(VesselBase):
    pass

class VesselUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    code: Optional[str] = Field(None, max_length=50)
    ship_type: Optional[str] = Field(None, min_length=1, max_length=100)
    is_active: Optional[bool] = None
    description: Optional[str] = None

    loa: Optional[float] = Field(None, gt=0.0)
    beam: Optional[float] = Field(None, gt=0.0)
    draft: Optional[float] = Field(None, gt=0.0)
    depth: Optional[float] = Field(None, gt=0.0)
    dwt: Optional[float] = Field(None, gt=0.0)
    gt: Optional[float] = Field(None, ge=0.0)

    capacity: Optional[float] = Field(None, gt=0.0)
    capacity_unit: Optional[str] = Field(None, max_length=50)

    service_speed_knots: Optional[float] = Field(None, gt=0.0)
    operating_speed_knots: Optional[float] = Field(None, gt=0.0)

    main_engine_power_kw: Optional[float] = Field(None, gt=0.0)
    aux_engine_power_kw: Optional[float] = Field(None, ge=0.0)

    me_sfoc: Optional[float] = Field(None, ge=0.0)
    me_sea_load_factor: Optional[float] = Field(None, ge=0.0, le=1.0)
    me_port_load_factor: Optional[float] = Field(None, ge=0.0, le=1.0)

    ae_sfoc: Optional[float] = Field(None, ge=0.0)
    ae_sea_load_factor: Optional[float] = Field(None, ge=0.0, le=1.0)
    ae_port_load_factor: Optional[float] = Field(None, ge=0.0, le=1.0)

    charter_rate: Optional[float] = Field(None, ge=0.0)
    charter_rate_basis: Optional[CharterRateBasis] = None

class VesselResponse(VesselBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
