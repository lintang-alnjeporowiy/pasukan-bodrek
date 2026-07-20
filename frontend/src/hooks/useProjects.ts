import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types/project";
import { projectService } from "@/services/project.service";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>("");
  const [newProjectDesc, setNewProjectDesc] = useState<string>("");
  const [newBaseYear, setNewBaseYear] = useState<number>(2026);
  const [newPlanningHorizon, setNewPlanningHorizon] = useState<number>(20);
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
      setHealthStatus("connected");
    } catch (err: any) {
      setError(err.message || "Gagal menghubungkan ke service backend API.");
      setHealthStatus("disconnected");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setCreating(true);
      setCreateError(null);
      await projectService.create({
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || undefined,
        base_year: newBaseYear,
        planning_horizon: newPlanningHorizon,
      });

      setNewProjectName("");
      setNewProjectDesc("");
      setNewBaseYear(2026);
      setNewPlanningHorizon(20);
      setIsModalOpen(false);

      triggerToast("Proyek perencanaan berhasil dibuat!");
      await fetchProjects();
    } catch (err: any) {
      setCreateError(err.message || "Gagal membuat proyek baru.");
    } finally {
      setCreating(false);
    }
  };

  return {
    projects,
    loading,
    error,
    healthStatus,
    toastMessage,
    isModalOpen,
    newProjectName,
    newProjectDesc,
    newBaseYear,
    newPlanningHorizon,
    creating,
    createError,
    setIsModalOpen,
    setNewProjectName,
    setNewProjectDesc,
    setNewBaseYear,
    setNewPlanningHorizon,
    handleCreateProject,
    fetchProjects,
  };
}
