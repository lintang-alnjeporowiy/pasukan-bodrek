import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database.session import Base

class BathymetryProfileModel(Base):
    __tablename__ = "bathymetry_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    study_port_id = Column(UUID(as_uuid=True), ForeignKey("study_ports.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    study_port = relationship("StudyPortModel", backref="bathymetry_profiles")
    points = relationship(
        "BathymetryPointModel",
        back_populates="profile",
        cascade="all, delete-orphan",
        order_by="BathymetryPointModel.distance_from_shore"
    )

class BathymetryPointModel(Base):
    __tablename__ = "bathymetry_points"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bathymetry_profile_id = Column(UUID(as_uuid=True), ForeignKey("bathymetry_profiles.id", ondelete="CASCADE"), nullable=False)
    distance_from_shore = Column(Float, nullable=False)
    water_depth = Column(Float, nullable=False)
    sequence = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    profile = relationship("BathymetryProfileModel", back_populates="points")
