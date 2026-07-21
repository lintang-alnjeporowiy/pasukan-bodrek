from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class ScenarioVesselCandidateSaveInput(BaseModel):
    selected_vessel_ids: List[UUID] = Field(..., description="Daftar ID kapal yang dipilih secara manual oleh pengguna")

class ScenarioVesselCandidateResponse(BaseModel):
    id: UUID
    scenario_id: UUID
    cargo_flow_id: Optional[UUID] = None
    vessel_id: UUID
    is_selected: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
