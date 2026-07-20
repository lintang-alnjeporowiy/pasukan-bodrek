import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types/project";
import { Scenario } from "@/types/scenario";
import { projectService } from "@/services/project.service";
import { scenarioService } from "@/services/scenario.service";

export function useProjectDetail(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Scenario Modal state
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [newScenarioName, setNewScenarioName] = useState<string>("");
  const [newScenarioDesc, setNewScenarioDesc] = useState<string>("");
  const [parentScenarioId, setParentScenarioId] = useState<string>("");
  const [creatingScenario, setCreatingScenario] = useState<boolean>(false);
  const [scenarioError, setScenarioError] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projData, scenarioList] = await Promise.all([
        projectService.getById(projectId),
        scenarioService.getByProjectId(projectId),
      ]);

      setProject(projData);
      setScenarios(scenarioList);
      setHealthStatus("connected");
    } catch (err: any) {
      setError(err.message || "Gagal memuat detail proyek.");
      setHealthStatus("disconnected");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId, loadData]);

  const handleCreateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioName.trim()) return;

    try {
      setCreatingScenario(true);
      setScenarioError(null);

      await scenarioService.create({
        project_id: projectId,
        name: newScenarioName.trim(),
        description: newScenarioDesc.trim() || undefined,
        parent_scenario_id: parentScenarioId || null,
        status: "DRAFT",
      });

      setNewScenarioName("");
      setNewScenarioDesc("");
      setParentScenarioId("");
      setIsScenarioModalOpen(false);

      triggerToast("Skenario analisis berhasil dibuat!");
      await loadData();
    } catch (err: any) {
      setScenarioError(err.message || "Gagal membuat skenario.");
    } finally {
      setCreatingScenario(false);
    }
  };

  return {
    project,
    scenarios,
    loading,
    error,
    healthStatus,
    toastMessage,
    isScenarioModalOpen,
    newScenarioName,
    newScenarioDesc,
    parentScenarioId,
    creatingScenario,
    scenarioError,
    setIsScenarioModalOpen,
    setNewScenarioName,
    setNewScenarioDesc,
    setParentScenarioId,
    handleCreateScenario,
    refreshData: loadData,
  };
}
