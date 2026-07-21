export interface StudyPort {
  id: string;
  project_id: string;
  name: string;
  code?: string | null;
  location: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudyPortCreate {
  name: string;
  code?: string;
  location: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface StudyPortUpdate {
  name?: string;
  code?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}
