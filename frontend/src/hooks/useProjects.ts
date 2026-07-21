import { useState, useEffect, useCallback } from "react";
import { Project, CreateProjectPayload } from "@/types/project";
import { StudyPort } from "@/types/studyPort";
import { projectService } from "@/services/project.service";
import { studyPortService } from "@/services/studyPort.service";

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

  // Study Port Modal States
  const [portMode, setPortMode] = useState<"new" | "copy">("new");
  const [portName, setPortName] = useState<string>("");
  const [portCode, setPortCode] = useState<string>("");
  const [portLocation, setPortLocation] = useState<string>("");
  const [portLat, setPortLat] = useState<string>("-6.101");
  const [portLong, setPortLong] = useState<string>("106.882");
  const [portDesc, setPortDesc] = useState<string>("");
  const [copySourceProjectId, setCopySourceProjectId] = useState<string>("");
  const [samplePorts, setSamplePorts] = useState<StudyPort[]>([]);

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

  // Fetch sample ports when modal opens
  useEffect(() => {
    if (isModalOpen) {
      studyPortService.getSampleStudyPorts().then((ports) => {
        setSamplePorts(ports);
        if (ports.length > 0 && !copySourceProjectId) {
          setCopySourceProjectId(ports[0].project_id);
        }
      }).catch(() => {});
    }
  }, [isModalOpen]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setCreating(true);
      setCreateError(null);

      const payload: CreateProjectPayload = {
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || undefined,
        base_year: newBaseYear,
        planning_horizon: newPlanningHorizon,
      };

      if (portMode === "new") {
        payload.study_port = {
          name: portName.trim() || `Pelabuhan ${newProjectName.trim()}`,
          code: portCode.trim() || undefined,
          location: portLocation.trim() || "Kawasan Pelabuhan Utama",
          latitude: parseFloat(portLat) || 0,
          longitude: parseFloat(portLong) || 0,
          description: portDesc.trim() || undefined,
        };
      } else if (portMode === "copy" && copySourceProjectId) {
        payload.copy_study_port_from_project_id = copySourceProjectId;
      }

      await projectService.create(payload);

      setNewProjectName("");
      setNewProjectDesc("");
      setNewBaseYear(2026);
      setNewPlanningHorizon(20);
      setPortName("");
      setPortCode("");
      setPortLocation("");
      setPortLat("-6.101");
      setPortLong("106.882");
      setPortDesc("");
      setIsModalOpen(false);

      triggerToast("Proyek perencanaan dan Study Port berhasil dibuat!");
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
    portMode,
    portName,
    portCode,
    portLocation,
    portLat,
    portLong,
    portDesc,
    copySourceProjectId,
    samplePorts,
    creating,
    createError,
    setIsModalOpen,
    setNewProjectName,
    setNewProjectDesc,
    setNewBaseYear,
    setNewPlanningHorizon,
    setPortMode,
    setPortName,
    setPortCode,
    setPortLocation,
    setPortLat,
    setPortLong,
    setPortDesc,
    setCopySourceProjectId,
    handleCreateProject,
    fetchProjects,
  };
}
