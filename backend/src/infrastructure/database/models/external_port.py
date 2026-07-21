import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from src.infrastructure.database.session import Base

class ExternalPortModel(Base):
    __tablename__ = "external_ports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    country = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    max_draft = Column(Float, nullable=False)
    max_loa = Column(Float, nullable=False)
    cargo_productivity = Column(Float, nullable=False, default=0.0)
    productivity_unit = Column(String(50), nullable=False, default="ton/hour")
    additional_port_time = Column(Float, nullable=False, default=0.0)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
