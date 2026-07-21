import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from src.infrastructure.database.session import Base

class ScenarioVesselCandidateModel(Base):
    __tablename__ = "scenario_vessel_candidates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False)
    cargo_flow_id = Column(UUID(as_uuid=True), ForeignKey("cargo_flows.id", ondelete="CASCADE"), nullable=True)
    vessel_id = Column(UUID(as_uuid=True), ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False)
    is_selected = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint('scenario_id', 'cargo_flow_id', 'vessel_id', name='uq_scenario_cargo_flow_vessel_candidate'),
    )

    # Relationships
    scenario = relationship("ScenarioModel", backref="vessel_candidates")
    cargo_flow = relationship("CargoFlowModel", backref="vessel_candidates")
    vessel = relationship("VesselModel", backref="scenario_candidates")
