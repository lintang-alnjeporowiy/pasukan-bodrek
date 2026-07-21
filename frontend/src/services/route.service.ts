import { Route, RouteCreate, RouteUpdate } from "@/types/route";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const routeService = {
  async getRoutesByProject(projectId: string): Promise<Route[]> {
    const res = await fetch(`${API_URL}/projects/${projectId}/routes`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal mengambil daftar Rute" }));
      throw new Error(err.detail || "Gagal mengambil daftar Rute");
    }
    return res.json();
  },

  async createRoute(projectId: string, data: RouteCreate): Promise<Route> {
    const res = await fetch(`${API_URL}/projects/${projectId}/routes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal membuat Rute" }));
      throw new Error(err.detail || "Gagal membuat Rute");
    }
    return res.json();
  },

  async updateRoute(routeId: string, data: RouteUpdate): Promise<Route> {
    const res = await fetch(`${API_URL}/routes/${routeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal memperbarui Rute" }));
      throw new Error(err.detail || "Gagal memperbarui Rute");
    }
    return res.json();
  },

  async deleteRoute(routeId: string): Promise<void> {
    const res = await fetch(`${API_URL}/routes/${routeId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Gagal menghapus Rute" }));
      throw new Error(err.detail || "Gagal menghapus Rute");
    }
  },
};
