import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types/project";
import { Scenario } from "@/types/scenario";
import { projectService } from "@/services/project.service";
import { scenarioService } from "@/services/scenario.service";

export function useScenarioWorkspace(projectId: string, scenarioId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [parentScenario, setParentScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scenario Settings Edit States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editBaseYear, setEditBaseYear] = useState<number>(2026);
  const [editPlanningHorizon, setEditPlanningHorizon] = useState<number>(20);
  const [updating, setUpdating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Scenario Lifecycle Modal State
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<boolean>(false);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [projData, scenarioData] = await Promise.all([
        projectService.getById(projectId),
        scenarioService.getById(scenarioId),
      ]);

      setProject(projData);
      setScenario(scenarioData);
      setEditName(scenarioData.name);
      setEditDescription(scenarioData.description || "");
      setEditBaseYear(scenarioData.base_year || projData.base_year);
      setEditPlanningHorizon(scenarioData.planning_horizon || projData.planning_horizon);

      if (scenarioData.parent_scenario_id) {
        try {
          const parentData = await scenarioService.getById(scenarioData.parent_scenario_id);
          setParentScenario(parentData);
        } catch {
          // Ignore parent fetch error
        }
      }

      setHealthStatus("connected");
    } catch (err: any) {
      setError(err.message || "Gagal memuat data skenario.");
      setHealthStatus("disconnected");
    } finally {
      setLoading(false);
    }
  }, [projectId, scenarioId]);

  useEffect(() => {
    if (projectId && scenarioId) {
      loadData();
    }
  }, [projectId, scenarioId, loadData]);

  const handleUpdateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      setUpdating(true);
      setValidationError(null);

      const updated = await scenarioService.update(scenarioId, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      });

      setScenario(updated);
      setIsEditing(false);
      triggerToast("Detail skenario berhasil diperbarui!");
    } catch (err: any) {
      setValidationError(err.message || "Gagal mengupdate skenario.");
    } finally {
      setUpdating(false);
    }
  };

  const handleArchiveScenario = async () => {
    try {
      setUpdating(true);
      const updated = await scenarioService.update(scenarioId, {
        status: "ARCHIVED",
      });
      setScenario(updated);
      setShowArchiveConfirm(false);
      triggerToast("Skenario berhasil diarsipkan.");
    } catch (err: any) {
      alert(err.message || "Gagal mengarsipkan skenario.");
    } finally {
      setUpdating(false);
    }
  };

  return {
    project,
    scenario,
    parentScenario,
    loading,
    error,
    healthStatus,
    activeTab,
    toastMessage,
    isEditing,
    editName,
    editDescription,
    editBaseYear,
    editPlanningHorizon,
    updating,
    validationError,
    showArchiveConfirm,
    setActiveTab,
    setIsEditing,
    setEditName,
    setEditDescription,
    setEditBaseYear,
    setEditPlanningHorizon,
    setShowArchiveConfirm,
    triggerToast,
    handleUpdateScenario,
    handleArchiveScenario,
    refreshData: loadData,
  };
}
