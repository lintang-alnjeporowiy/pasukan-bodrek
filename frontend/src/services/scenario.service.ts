import { apiFetch } from "./api";
import { Scenario, ResolvedParameter } from "@/types/scenario";

export const scenarioService = {
  async getByProjectId(projectId: string): Promise<Scenario[]> {
    return apiFetch<Scenario[]>(`/projects/${projectId}/scenarios`);
  },

  async getById(scenarioId: string): Promise<Scenario> {
    return apiFetch<Scenario>(`/scenarios/${scenarioId}`);
  },

  async create(data: {
    project_id: string;
    parent_scenario_id?: string | null;
    name: string;
    description?: string;
    status?: string;
  }): Promise<Scenario> {
    return apiFetch<Scenario>("/scenarios", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    scenarioId: string,
    data: {
      name?: string;
      description?: string;
      status?: string;
    }
  ): Promise<Scenario> {
    return apiFetch<Scenario>(`/scenarios/${scenarioId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(scenarioId: string): Promise<void> {
    return apiFetch<void>(`/scenarios/${scenarioId}`, {
      method: "DELETE",
    });
  },

  async getResolvedParameters(scenarioId: string): Promise<ResolvedParameter[]> {
    return apiFetch<ResolvedParameter[]>(`/scenarios/${scenarioId}/parameters`);
  },

  async setScenarioOverride(
    scenarioId: string,
    parameterKey: string,
    overrideValue: number,
    reason?: string
  ): Promise<Scenario> {
    return apiFetch<Scenario>(`/scenarios/${scenarioId}/parameters/override`, {
      method: "POST",
      body: JSON.stringify({
        scenario_id: scenarioId,
        parameter_key: parameterKey,
        override_value: overrideValue,
        reason,
      }),
    });
  },

  async removeScenarioOverride(scenarioId: string, parameterKey: string): Promise<void> {
    return apiFetch<void>(`/scenarios/${scenarioId}/parameters/override/${parameterKey}`, {
      method: "DELETE",
    });
  },
};
