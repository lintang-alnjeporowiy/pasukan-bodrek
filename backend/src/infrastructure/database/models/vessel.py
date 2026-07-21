import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from src.infrastructure.database.session import Base

class VesselModel(Base):
    __tablename__ = "vessels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # 1. General Information
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True)
    ship_type = Column(String(100), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    description = Column(Text, nullable=True)

    # 2. Principal Dimensions
    loa = Column(Float, nullable=False)
    beam = Column(Float, nullable=False)
    draft = Column(Float, nullable=False)
    depth = Column(Float, nullable=False)
    dwt = Column(Float, nullable=False)
    gt = Column(Float, nullable=True)

    # 3. Cargo Characteristics
    capacity = Column(Float, nullable=False)
    capacity_unit = Column(String(50), nullable=False, default="Ton")

    # 4. Operational Characteristics
    service_speed_knots = Column(Float, nullable=False)
    operating_speed_knots = Column(Float, nullable=False, default=14.0)

    # 5. Machinery
    main_engine_power_kw = Column(Float, nullable=False, default=5000.0)
    aux_engine_power_kw = Column(Float, nullable=False, default=500.0)

    # 6. Fuel Characteristics - Main Engine
    me_sfoc = Column(Float, nullable=False, default=180.0)
    me_sea_load_factor = Column(Float, nullable=False, default=0.85)
    me_port_load_factor = Column(Float, nullable=False, default=0.10)

    # 6. Fuel Characteristics - Auxiliary Engine
    ae_sfoc = Column(Float, nullable=False, default=220.0)
    ae_sea_load_factor = Column(Float, nullable=False, default=0.70)
    ae_port_load_factor = Column(Float, nullable=False, default=0.50)

    # 7. Commercial Characteristics
    charter_rate = Column(Float, nullable=False, default=0.0)
    charter_rate_basis = Column(String(20), nullable=False, default="PER_DAY")

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
