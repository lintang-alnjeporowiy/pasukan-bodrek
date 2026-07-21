from uuid import UUID
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.infrastructure.repositories.cargo_flow import CargoFlowRepository
from src.infrastructure.repositories.vessel import VesselRepository
from src.infrastructure.repositories.commodity_vessel_compatibility import CommodityVesselCompatibilityRepository
from src.infrastructure.repositories.scenario import ScenarioRepository
from src.infrastructure.repositories.scenario_vessel_candidate import ScenarioVesselCandidateRepository
from src.application.route_compatibility.service import RouteCompatibilityService
from src.domain.vessel.schemas import VesselResponse
from src.domain.candidate_generation.schemas import CandidateVesselItem, CandidateGenerationResponse

class CandidateGenerationService:
    def __init__(self, db: Session):
        self.db = db
        self.cargo_flow_repo = CargoFlowRepository(db)
        self.vessel_repo = VesselRepository(db)
        self.comp_repo = CommodityVesselCompatibilityRepository(db)
        self.scenario_repo = ScenarioRepository(db)
        self.svc_repo = ScenarioVesselCandidateRepository(db)
        self.route_comp_service = RouteCompatibilityService()

    def generate_candidates_for_cargo_flow(
        self,
        cargo_flow_id: UUID,
        scenario_id: Optional[UUID] = None
    ) -> CandidateGenerationResponse:
        # 1. Fetch Cargo Flow
        cargo_flow = self.cargo_flow_repo.get_by_id(cargo_flow_id)
        if not cargo_flow:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cargo Flow tidak ditemukan")

        # 2. Fetch Scenario if provided
        target_scenario_id = scenario_id or cargo_flow.scenario_id
        if target_scenario_id:
            scenario = self.scenario_repo.get_by_id(target_scenario_id)
            if not scenario:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skenario tidak ditemukan")

        # 3. Fetch Route & Commodity
        route = cargo_flow.route
        commodity = cargo_flow.commodity
        if not route:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cargo Flow belum memiliki Rute terasosiasi")

        # 4. Fetch stored vessel candidates if available
        existing_candidate_rows = self.svc_repo.get_candidates(target_scenario_id, cargo_flow_id) if target_scenario_id else []
        has_stored_selections = len(existing_candidate_rows) > 0
        selected_vessel_ids = {c.vessel_id for c in existing_candidate_rows if c.is_selected}

        # 5. Fetch all vessels & commodity compatibilities
        all_vessels = self.vessel_repo.get_all(active_only=False)
        commodity_compatibilities = self.comp_repo.get_all(commodity_id=cargo_flow.commodity_id, active_only=True)
        compatible_vessel_ids = {c.vessel_id for c in commodity_compatibilities}
        has_commodity_rules = len(commodity_compatibilities) > 0

        candidates: List[CandidateVesselItem] = []
        valid_count = 0

        for v in all_vessels:
            is_comp = True
            val_msgs: List[str] = []
            rej_reasons: List[str] = []

            # Step A: Commodity Compatibility Check
            if has_commodity_rules:
                if v.id not in compatible_vessel_ids:
                    is_comp = False
                    rej_reasons.append(
                        f"Kapal '{v.name}' tidak terdaftar sebagai kapal yang kompatibel dengan komoditas '{commodity.name if commodity else 'Cargo'}'."
                    )
                else:
                    val_msgs.append(f"Kompatibilitas Komoditas OK: Kapal '{v.name}' kompatibel dengan komoditas.")
            else:
                val_msgs.append("Kompatibilitas Komoditas OK: Tidak ada pembatasan khusus untuk komoditas ini.")

            # Step B: Port Compatibility Check (Study Port & External Port Draft/LOA)
            port_res = self.route_comp_service.check_compatibility(route, v)
            val_msgs.extend(port_res.validation_messages)
            if not port_res.is_compatible:
                is_comp = False
                rej_reasons.extend(port_res.rejection_reasons)

            # Step C: Scenario Availability Check
            if not v.is_active:
                is_comp = False
                rej_reasons.append(f"Ketersediaan Skenario: Kapal '{v.name}' bermode Non-Aktif (tidak tersedia).")
            else:
                val_msgs.append(f"Ketersediaan Skenario OK: Kapal '{v.name}' aktif dan tersedia.")

            if is_comp:
                valid_count += 1

            # Determine manual selection state
            if has_stored_selections:
                is_selected = (v.id in selected_vessel_ids)
            else:
                is_selected = is_comp  # Default select all technically compatible vessels

            candidates.append(
                CandidateVesselItem(
                    vessel=VesselResponse.model_validate(v),
                    is_compatible=is_comp,
                    is_selected_for_scenario=is_selected,
                    validation_messages=val_msgs,
                    rejection_reasons=rej_reasons
                )
            )

        return CandidateGenerationResponse(
            cargo_flow_id=cargo_flow_id,
            scenario_id=target_scenario_id,
            total_vessels_evaluated=len(all_vessels),
            total_valid_candidates=valid_count,
            candidates=candidates
        )

    def save_scenario_vessel_candidates(
        self,
        scenario_id: UUID,
        cargo_flow_id: UUID,
        selected_vessel_ids: List[UUID]
    ) -> List[UUID]:
        """Saves user's manual selection of chosen vessels for optimization in a scenario."""
        self.svc_repo.save_selected_candidates(
            scenario_id=scenario_id,
            cargo_flow_id=cargo_flow_id,
            selected_vessel_ids=selected_vessel_ids
        )
        return selected_vessel_ids
