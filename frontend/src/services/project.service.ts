import { apiFetch } from "./api";
import { Project } from "@/types/project";

export const projectService = {
  async getAll(): Promise<Project[]> {
    return apiFetch<Project[]>("/projects");
  },

  async getById(id: string): Promise<Project> {
    return apiFetch<Project>(`/projects/${id}`);
  },

  async create(data: {
    name: string;
    description?: string;
    base_year: number;
    planning_horizon: number;
  }): Promise<Project> {
    return apiFetch<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      base_year?: number;
      planning_horizon?: number;
    }
  ): Promise<Project> {
    return apiFetch<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return apiFetch<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};
