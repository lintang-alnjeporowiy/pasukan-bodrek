import { StudyPort, StudyPortCreate } from "./studyPort";

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  base_year: number;
  planning_horizon: number;
  status: string;
  created_at: string;
  updated_at: string;
  study_port?: StudyPort | null;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  location?: string;
  base_year: number;
  planning_horizon: number;
  study_port?: StudyPortCreate;
  copy_study_port_from_project_id?: string;
}

export interface ProjectParameter {
  id: string;
  project_id: string;
  parameter_key: string;
  parameter_value: number;
  created_at: string;
  updated_at: string;
}
