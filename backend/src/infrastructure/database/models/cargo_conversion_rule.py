import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database.session import Base

class CargoConversionRuleModel(Base):
    __tablename__ = "cargo_conversion_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    commodity_id = Column(UUID(as_uuid=True), ForeignKey("commodities.id", ondelete="SET NULL"), nullable=True)
    source_unit = Column(String(50), nullable=False)
    target_unit = Column(String(50), nullable=False)
    conversion_factor = Column(Float, nullable=False)
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    commodity = relationship("CommodityModel")
