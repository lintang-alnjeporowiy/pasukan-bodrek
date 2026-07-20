export interface Commodity {
  id: string;
  name: string;
  code?: string;
  unit: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  project_id: string;
  commodity_id?: string;
  commodity_name?: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CargoFlow {
  id: string;
  scenario_id: string;
  tenant_id: string;
  tenant_name?: string;
  commodity_id: string;
  commodity_name?: string;
  direction: string;
  origin: string;
  destination_port: string;
  base_annual_demand: number;
  unit: string;
  start_year: number;
  growth_rate: number;
  maximum_demand: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectionYearResult {
  year: number;
  calendar_year: number;
  demand: number;
  trace: string;
}

export interface ProjectionResult {
  cargo_flow_id: string;
  planning_horizon: number;
  start_year: number;
  base_year: number;
  initial_demand: number;
  growth_rate: number;
  maximum_demand: number;
  projections: ProjectionYearResult[];
}

export interface CargoConversionRule {
  id: string;
  commodity_id?: string | null;
  commodity_name?: string | null;
  source_unit: string;
  target_unit: string;
  conversion_factor: number;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversionTraceStep {
  step_number: number;
  description: string;
  formula?: string | null;
  value?: number | null;
}

export interface ConversionTestResult {
  source_value: number;
  source_unit: string;
  target_value: number;
  target_unit: string;
  conversion_factor: number;
  applied_rule_id?: string | null;
  status: string;
  steps: ConversionTraceStep[];
}
