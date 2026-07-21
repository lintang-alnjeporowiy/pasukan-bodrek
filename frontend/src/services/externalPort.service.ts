import { ExternalPort, ExternalPortCreate, ExternalPortUpdate } from "@/types/externalPort";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const externalPortService = {
  async getAll(activeOnly: boolean = false): Promise<ExternalPort[]> {
    const res = await fetch(`${API_URL}/external-ports${activeOnly ? "?active_only=true" : ""}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal mengambil data Pelabuhan Eksternal" }));
      throw new Error(err.detail || "Gagal mengambil data Pelabuhan Eksternal");
    }
    return res.json();
  },

  async getById(id: string): Promise<ExternalPort> {
    const res = await fetch(`${API_URL}/external-ports/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal mengambil detail Pelabuhan Eksternal" }));
      throw new Error(err.detail || "Gagal mengambil detail Pelabuhan Eksternal");
    }
    return res.json();
  },

  async create(data: ExternalPortCreate): Promise<ExternalPort> {
    const res = await fetch(`${API_URL}/external-ports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal membuat Pelabuhan Eksternal baru" }));
      throw new Error(err.detail || "Gagal membuat Pelabuhan Eksternal baru");
    }
    return res.json();
  },

  async update(id: string, data: ExternalPortUpdate): Promise<ExternalPort> {
    const res = await fetch(`${API_URL}/external-ports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal memperbarui Pelabuhan Eksternal" }));
      throw new Error(err.detail || "Gagal memperbarui Pelabuhan Eksternal");
    }
    return res.json();
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/external-ports/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal menghapus Pelabuhan Eksternal" }));
      throw new Error(err.detail || "Gagal menghapus Pelabuhan Eksternal");
    }
  },
};
