import { StudyPort, StudyPortCreate, StudyPortUpdate } from "@/types/studyPort";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const studyPortService = {
  async getStudyPortByProject(projectId: string): Promise<StudyPort> {
    const res = await fetch(`${API_URL}/projects/${projectId}/study-port`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal mengambil Study Port" }));
      throw new Error(err.detail || "Gagal mengambil Study Port");
    }
    return res.json();
  },

  async createStudyPort(projectId: string, data: StudyPortCreate): Promise<StudyPort> {
    const res = await fetch(`${API_URL}/projects/${projectId}/study-port`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal membuat Study Port" }));
      throw new Error(err.detail || "Gagal membuat Study Port");
    }
    return res.json();
  },

  async copyStudyPortFromProject(targetProjectId: string, sourceProjectId: string): Promise<StudyPort> {
    const res = await fetch(`${API_URL}/projects/${targetProjectId}/study-port/copy?source_project_id=${sourceProjectId}`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal menyalin Study Port" }));
      throw new Error(err.detail || "Gagal menyalin Study Port");
    }
    return res.json();
  },

  async updateStudyPort(projectId: string, data: StudyPortUpdate): Promise<StudyPort> {
    const res = await fetch(`${API_URL}/projects/${projectId}/study-port`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal memperbarui Study Port" }));
      throw new Error(err.detail || "Gagal memperbarui Study Port");
    }
    return res.json();
  },

  async getSampleStudyPorts(): Promise<StudyPort[]> {
    const res = await fetch(`${API_URL}/study-ports/samples`);
    if (!res.ok) return [];
    return res.json();
  },
};
