from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from src.domain.vessel.schemas import VesselResponse

class CandidateVesselItem(BaseModel):
    vessel: VesselResponse
    is_compatible: bool = Field(..., description="Status kelayakan teknis kapal sebagai kandidat")
    is_selected_for_scenario: bool = Field(default=True, description="Status pilihan manual pengguna untuk skenario ini")
    validation_messages: List[str] = Field(default_factory=list, description="Pesan sukses pengecekan pipeline")
    rejection_reasons: List[str] = Field(default_factory=list, description="Alasan penolakan kandidat jika tidak kompatibel")

    model_config = ConfigDict(from_attributes=True)


class CandidateGenerationResponse(BaseModel):
    cargo_flow_id: UUID
    scenario_id: Optional[UUID] = None
    total_vessels_evaluated: int
    total_valid_candidates: int
    candidates: List[CandidateVesselItem]

    model_config = ConfigDict(from_attributes=True)
