import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database.session import Base

class CommodityVesselCompatibilityModel(Base):
    __tablename__ = "commodity_vessel_compatibilities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    commodity_id = Column(UUID(as_uuid=True), ForeignKey("commodities.id", ondelete="CASCADE"), nullable=False)
    vessel_id = Column(UUID(as_uuid=True), ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False)
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    commodity = relationship("CommodityModel", backref="vessel_compatibilities")
    vessel = relationship("VesselModel", backref="commodity_compatibilities")

    __table_args__ = (
        UniqueConstraint("commodity_id", "vessel_id", name="uq_commodity_vessel_compatibility"),
    )
