from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session
from src.infrastructure.database.models.scenario_vessel_candidate import ScenarioVesselCandidateModel

class ScenarioVesselCandidateRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_candidates(
        self,
        scenario_id: UUID,
        cargo_flow_id: Optional[UUID] = None
    ) -> List[ScenarioVesselCandidateModel]:
        query = self.db.query(ScenarioVesselCandidateModel).filter(
            ScenarioVesselCandidateModel.scenario_id == scenario_id
        )
        if cargo_flow_id is not None:
            query = query.filter(ScenarioVesselCandidateModel.cargo_flow_id == cargo_flow_id)
        return query.all()

    def get_selected_vessel_ids(
        self,
        scenario_id: UUID,
        cargo_flow_id: Optional[UUID] = None
    ) -> List[UUID]:
        candidates = self.get_candidates(scenario_id, cargo_flow_id)
        return [c.vessel_id for c in candidates if c.is_selected]

    def save_selected_candidates(
        self,
        scenario_id: UUID,
        cargo_flow_id: Optional[UUID],
        selected_vessel_ids: List[UUID]
    ) -> List[ScenarioVesselCandidateModel]:
        # Delete existing entries for this scenario & cargo flow
        query = self.db.query(ScenarioVesselCandidateModel).filter(
            ScenarioVesselCandidateModel.scenario_id == scenario_id
        )
        if cargo_flow_id is not None:
            query = query.filter(ScenarioVesselCandidateModel.cargo_flow_id == cargo_flow_id)
        else:
            query = query.filter(ScenarioVesselCandidateModel.cargo_flow_id.is_(None))
        
        query.delete(synchronize_session=False)

        # Create new entries
        new_entries = [
            ScenarioVesselCandidateModel(
                scenario_id=scenario_id,
                cargo_flow_id=cargo_flow_id,
                vessel_id=vid,
                is_selected=True
            )
            for vid in selected_vessel_ids
        ]
        self.db.add_all(new_entries)
        self.db.commit()
        return new_entries
