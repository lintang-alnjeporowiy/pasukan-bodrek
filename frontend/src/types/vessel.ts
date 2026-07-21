export type CharterRateBasis = "PER_DAY" | "PER_MONTH" | "PER_YEAR";

export interface Vessel {
  id: string;
  // 1. General Information
  name: string;
  code?: string | null;
  ship_type: string;
  is_active: boolean;
  description?: string | null;

  // 2. Principal Dimensions
  loa: number;
  beam: number;
  draft: number;
  depth: number;
  dwt: number;
  gt?: number | null;

  // 3. Cargo Characteristics
  capacity: number;
  capacity_unit: string;

  // 4. Operational Characteristics
  service_speed_knots: number;
  operating_speed_knots: number;

  // 5. Machinery
  main_engine_power_kw: number;
  aux_engine_power_kw: number;

  // 6. Fuel Characteristics
  me_sfoc: number;
  me_sea_load_factor: number;
  me_port_load_factor: number;

  ae_sfoc: number;
  ae_sea_load_factor: number;
  ae_port_load_factor: number;

  // 7. Commercial Characteristics
  charter_rate: number;
  charter_rate_basis: CharterRateBasis;

  created_at: string;
  updated_at: string;
}

export interface VesselCreateInput {
  name: string;
  code?: string;
  ship_type: string;
  is_active?: boolean;
  description?: string;

  loa: number;
  beam: number;
  draft: number;
  depth: number;
  dwt: number;
  gt?: number;

  capacity: number;
  capacity_unit: string;

  service_speed_knots: number;
  operating_speed_knots: number;

  main_engine_power_kw: number;
  aux_engine_power_kw: number;

  me_sfoc: number;
  me_sea_load_factor: number;
  me_port_load_factor: number;

  ae_sfoc: number;
  ae_sea_load_factor: number;
  ae_port_load_factor: number;

  charter_rate: number;
  charter_rate_basis: CharterRateBasis;
}

export type VesselUpdateInput = Partial<VesselCreateInput>;
