export interface Scenario {
  id: string;
  project_id: string;
  parent_scenario_id?: string | null;
  name: string;
  description?: string | null;
  status: string;
  base_year?: number;
  planning_horizon?: number;
  created_at: string;
  updated_at: string;
}

export interface ScenarioParameterOverride {
  id: string;
  scenario_id: string;
  parameter_key: string;
  override_value: number;
  reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResolvedParameter {
  key: string;
  name: string;
  category: string;
  effective_value: number;
  unit: string;
  source: "SCENARIO_OVERRIDE" | "PROJECT_DEFAULT" | "SYSTEM_DEFAULT";
  is_overridden: boolean;
  system_default_value: number;
  project_default_value?: number | null;
  override_value?: number | null;
  reason?: string | null;
  description?: string | null;
}
