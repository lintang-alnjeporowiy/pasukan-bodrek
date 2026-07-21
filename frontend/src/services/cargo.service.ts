import { apiFetch } from "./api";
import { Commodity, Tenant, CargoFlow, ProjectionResult } from "@/types/cargo";

export const cargoService = {
  // Commodities
  async getCommodities(): Promise<Commodity[]> {
    return apiFetch<Commodity[]>("/commodities");
  },

  async createCommodity(data: {
    name: string;
    code?: string;
    unit: string;
    description?: string;
    is_active?: boolean;
  }): Promise<Commodity> {
    return apiFetch<Commodity>("/commodities", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCommodity(
    id: string,
    data: {
      name?: string;
      code?: string;
      unit?: string;
      description?: string;
      is_active?: boolean;
    }
  ): Promise<Commodity> {
    return apiFetch<Commodity>(`/commodities/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteCommodity(id: string): Promise<void> {
    return apiFetch<void>(`/commodities/${id}`, {
      method: "DELETE",
    });
  },

  // Tenants
  async getTenants(projectId: string): Promise<Tenant[]> {
    return apiFetch<Tenant[]>(`/projects/${projectId}/tenants`);
  },

  async createTenant(data: {
    project_id: string;
    name: string;
    commodity_id?: string;
    description?: string;
    is_active?: boolean;
  }): Promise<Tenant> {
    return apiFetch<Tenant>(`/projects/${data.project_id}/tenants`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },


  async updateTenant(
    id: string,
    data: {
      name?: string;
      commodity_id?: string;
      description?: string;
      is_active?: boolean;
    }
  ): Promise<Tenant> {
    return apiFetch<Tenant>(`/tenants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteTenant(id: string): Promise<void> {
    return apiFetch<void>(`/tenants/${id}`, {
      method: "DELETE",
    });
  },

  // Cargo Flows
  async getCargoFlows(scenarioId: string, direction?: string): Promise<CargoFlow[]> {
    const query = direction ? `?direction=${direction}` : "";
    return apiFetch<CargoFlow[]>(`/scenarios/${scenarioId}/cargo-flows${query}`);
  },

  async createCargoFlow(data: {
    scenario_id: string;
    tenant_id: string;
    commodity_id: string;
    route_id?: string;
    direction: string;
    origin: string;
    destination_port: string;
    base_annual_demand: number;
    unit: string;
    start_year: number;
    growth_rate: number;
    maximum_demand: number;
    is_active?: boolean;
  }): Promise<CargoFlow> {
    return apiFetch<CargoFlow>(`/scenarios/${data.scenario_id}/cargo-flows`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateCargoFlow(
    id: string,
    data: Partial<CargoFlow>
  ): Promise<CargoFlow> {
    return apiFetch<CargoFlow>(`/cargo-flows/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteCargoFlow(id: string): Promise<void> {
    return apiFetch<void>(`/cargo-flows/${id}`, {
      method: "DELETE",
    });
  },

  // Demand Projection
  async calculateDemandProjection(cargoFlowId: string): Promise<ProjectionResult> {
    return apiFetch<ProjectionResult>(`/cargo-flows/${cargoFlowId}/projection`);
  },

};
