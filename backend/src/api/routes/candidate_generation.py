from uuid import UUID
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from src.infrastructure.database import get_db
from src.domain.candidate_generation.schemas import CandidateGenerationResponse
from src.domain.scenario_vessel_candidate.schemas import ScenarioVesselCandidateSaveInput
from src.application.candidate_generation.service import CandidateGenerationService

router = APIRouter(tags=["Candidate Generation"])

@router.get(
    "/cargo-flows/{cargo_flow_id}/candidate-vessels",
    response_model=CandidateGenerationResponse,
    summary="Preview kandidat kapal dinamis untuk cargo flow"
)
def get_candidate_vessels(
    cargo_flow_id: UUID,
    scenario_id: Optional[UUID] = Query(None, description="ID Skenario Opsional"),
    db: Session = Depends(get_db)
):
    """Generates and previews dynamic candidate vessels for a given cargo flow following the 4-step filtering pipeline."""
    service = CandidateGenerationService(db)
    return service.generate_candidates_for_cargo_flow(cargo_flow_id=cargo_flow_id, scenario_id=scenario_id)

@router.post(
    "/cargo-flows/{cargo_flow_id}/candidate-vessels/preview",
    response_model=CandidateGenerationResponse,
    summary="Preview endpoint untuk generasi kandidat kapal"
)
def preview_candidate_vessels(
    cargo_flow_id: UUID,
    scenario_id: Optional[UUID] = Query(None),
    db: Session = Depends(get_db)
):
    """Preview endpoint (POST) for generating candidate vessel lists dynamically."""
    service = CandidateGenerationService(db)
    return service.generate_candidates_for_cargo_flow(cargo_flow_id=cargo_flow_id, scenario_id=scenario_id)

@router.put(
    "/scenarios/{scenario_id}/cargo-flows/{cargo_flow_id}/candidate-vessels",
    response_model=List[UUID],
    summary="Simpan pilihan kandidat kapal manual skenario"
)
def save_scenario_candidate_vessels(
    scenario_id: UUID,
    cargo_flow_id: UUID,
    payload: ScenarioVesselCandidateSaveInput,
    db: Session = Depends(get_db)
):
    """Persists user's manual selection of chosen vessels for optimization in a scenario."""
    service = CandidateGenerationService(db)
    return service.save_scenario_vessel_candidates(
        scenario_id=scenario_id,
        cargo_flow_id=cargo_flow_id,
        selected_vessel_ids=payload.selected_vessel_ids
    )
