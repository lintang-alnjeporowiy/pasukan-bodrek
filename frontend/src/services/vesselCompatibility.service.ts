import { apiFetch } from "./api";
import { Vessel } from "@/types/vessel";

export interface CommodityVesselCompatibility {
  id: string;
  commodity_id: string;
  vessel_id: string;
  notes?: string | null;
  is_active: boolean;
  commodity?: {
    id: string;
    name: string;
    code?: string | null;
    unit: string;
  };
  vessel?: Vessel;
}

export const vesselCompatibilityService = {
  async getCompatibilities(commodityId?: string, vesselId?: string): Promise<CommodityVesselCompatibility[]> {
    const params = new URLSearchParams();
    if (commodityId) params.append("commodity_id", commodityId);
    if (vesselId) params.append("vessel_id", vesselId);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<CommodityVesselCompatibility[]>(`/commodity-vessel-compatibilities${queryString}`);
  },

  async batchSetVesselsForCommodity(commodityId: string, vesselIds: string[]): Promise<CommodityVesselCompatibility[]> {
    return apiFetch<CommodityVesselCompatibility[]>("/commodity-vessel-compatibilities/batch", {
      method: "PUT",
      body: JSON.stringify({
        commodity_id: commodityId,
        vessel_ids: vesselIds,
      }),
    });
  },

  async deleteCompatibility(id: string): Promise<void> {
    return apiFetch<void>(`/commodity-vessel-compatibilities/${id}`, {
      method: "DELETE",
    });
  },
};
