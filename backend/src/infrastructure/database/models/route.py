import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database.session import Base

class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    study_port_id = Column(UUID(as_uuid=True), ForeignKey("study_ports.id", ondelete="CASCADE"), nullable=False)
    external_port_id = Column(UUID(as_uuid=True), ForeignKey("external_ports.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    direction = Column(String(20), nullable=False) # 'INBOUND' or 'OUTBOUND'
    distance_nm = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("ProjectModel", backref="routes")
    study_port = relationship("StudyPortModel", backref="routes")
    external_port = relationship("ExternalPortModel", backref="routes")
