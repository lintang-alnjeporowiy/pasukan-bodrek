import { apiFetch } from "./api";
import { Vessel, VesselCreateInput, VesselUpdateInput } from "@/types/vessel";

export const vesselService = {
  async getVessels(activeOnly: boolean = false, shipType?: string): Promise<Vessel[]> {
    const params = new URLSearchParams();
    if (activeOnly) params.append("active_only", "true");
    if (shipType) params.append("ship_type", shipType);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<Vessel[]>(`/vessels${queryString}`);
  },

  async getVessel(id: string): Promise<Vessel> {
    return apiFetch<Vessel>(`/vessels/${id}`);
  },

  async createVessel(data: VesselCreateInput): Promise<Vessel> {
    return apiFetch<Vessel>("/vessels", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateVessel(id: string, data: VesselUpdateInput): Promise<Vessel> {
    return apiFetch<Vessel>(`/vessels/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteVessel(id: string): Promise<void> {
    return apiFetch<void>(`/vessels/${id}`, {
      method: "DELETE",
    });
  },
};
