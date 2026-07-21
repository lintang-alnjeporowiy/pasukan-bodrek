export type RouteDirection = "INBOUND" | "OUTBOUND";

export interface Route {
  id: string;
  project_id: string;
  study_port_id: string;
  external_port_id: string;
  study_port_name?: string;
  external_port_name?: string;
  name: string;
  direction: RouteDirection;
  distance_nm: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RouteCreate {
  name: string;
  direction: RouteDirection;
  external_port_id: string;
  distance_nm: number;
  description?: string;
  is_active?: boolean;
}

export interface RouteUpdate {
  name?: string;
  direction?: RouteDirection;
  external_port_id?: string;
  distance_nm?: number;
  description?: string;
  is_active?: boolean;
}
