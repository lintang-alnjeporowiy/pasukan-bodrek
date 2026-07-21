export interface ExternalPort {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  max_draft: number;
  max_loa: number;
  cargo_productivity: number;
  productivity_unit: string;
  additional_port_time: number;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExternalPortCreate {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  max_draft: number;
  max_loa: number;
  cargo_productivity?: number;
  productivity_unit?: string;
  additional_port_time?: number;
  description?: string;
  is_active?: boolean;
}

export interface ExternalPortUpdate {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  max_draft?: number;
  max_loa?: number;
  cargo_productivity?: number;
  productivity_unit?: string;
  additional_port_time?: number;
  description?: string;
  is_active?: boolean;
}
