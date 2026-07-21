import { apiFetch } from "./api";
import { Vessel } from "@/types/vessel";

export interface CandidateVesselItem {
  vessel: Vessel;
  is_compatible: boolean;
  is_selected_for_scenario: boolean;
  validation_messages: string[];
  rejection_reasons: string[];
}


export interface CandidateGenerationResponse {
  cargo_flow_id: string;
  scenario_id?: string | null;
  total_vessels_evaluated: number;
  total_valid_candidates: number;
  candidates: CandidateVesselItem[];
}

export const candidateVesselService = {
  async getCandidateVessels(cargoFlowId: string, scenarioId?: string): Promise<CandidateGenerationResponse> {
    const params = new URLSearchParams();
    if (scenarioId) params.append("scenario_id", scenarioId);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<CandidateGenerationResponse>(`/cargo-flows/${cargoFlowId}/candidate-vessels${queryString}`);
  },

  async saveCandidateVessels(scenarioId: string, cargoFlowId: string, selectedVesselIds: string[]): Promise<string[]> {
    return apiFetch<string[]>(`/scenarios/${scenarioId}/cargo-flows/${cargoFlowId}/candidate-vessels`, {
      method: "PUT",
      body: JSON.stringify({
        selected_vessel_ids: selectedVesselIds,
      }),
    });
  },
};
