export interface Project {
  id: string;
  name: string;
  description?: string | null;
  base_year: number;
  planning_horizon: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectParameter {
  id: string;
  project_id: string;
  parameter_key: string;
  parameter_value: number;
  created_at: string;
  updated_at: string;
}
