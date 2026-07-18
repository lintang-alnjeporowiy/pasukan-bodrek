import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database.session import Base

class CargoFlowModel(Base):
    __tablename__ = "cargo_flows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False)
    commodity_id = Column(UUID(as_uuid=True), ForeignKey("commodities.id", ondelete="CASCADE"), nullable=False)
    direction = Column(String(50), default="INBOUND", nullable=False)
    origin = Column(String(255), nullable=False)
    destination_port = Column(String(255), nullable=False)
    base_annual_demand = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    scenario = relationship("ScenarioModel", back_populates="cargo_flows")
    tenant = relationship("TenantModel")
    commodity = relationship("CommodityModel")
