"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  base_year: number;
  planning_horizon: number;
  created_at: string;
  updated_at: string;
}

interface Scenario {
  id: string;
  project_id: string;
  parent_scenario_id?: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function ScenarioWorkspace({
  params,
}: {
  params: Promise<{ id: string; scenarioId: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.id;
  const scenarioId = unwrappedParams.scenarioId;

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

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch project details
      const projectRes = await fetch(`http://localhost:8000/projects/${projectId}`, { cache: "no-store" });
      if (!projectRes.ok) {
        throw new Error("Proyek tidak ditemukan.");
      }
      const projectData = await projectRes.json();
      setProject(projectData);
      setEditBaseYear(projectData.base_year);
      setEditPlanningHorizon(projectData.planning_horizon);

      // 2. Fetch scenario details
      const scenarioRes = await fetch(`http://localhost:8000/scenarios/${scenarioId}`, { cache: "no-store" });
      if (!scenarioRes.ok) {
        throw new Error("Skenario tidak ditemukan.");
      }
      const scenarioData = await scenarioRes.json();
      setScenario(scenarioData);
      setEditName(scenarioData.name);
      setEditDescription(scenarioData.description || "");

      // 3. Fetch parent scenario if exists
      if (scenarioData.parent_scenario_id) {
        const parentRes = await fetch(`http://localhost:8000/scenarios/${scenarioData.parent_scenario_id}`, { cache: "no-store" });
        if (parentRes.ok) {
          const parentData = await parentRes.json();
          setParentScenario(parentData);
        } else {
          setParentScenario(null);
        }
      } else {
        setParentScenario(null);
      }
      setHealthStatus("connected");
    } catch (err: any) {
      setError(err.message || "Gagal memuat data dari server backend.");
      setHealthStatus("disconnected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, scenarioId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!scenario) return;
    try {
      const res = await fetch(`http://localhost:8000/scenarios/${scenarioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error("Gagal memperbarui status di server.");
      }
      const updatedScenario = await res.json();
      setScenario(updatedScenario);
      showToast(`Status skenario diubah menjadi "${newStatus}".`);
    } catch (err: any) {
      showToast("Gagal memperbarui status.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Client-side validations
    if (!editName.trim()) {
      setValidationError("Nama skenario wajib diisi.");
      return;
    }
    if (editName.length > 255) {
      setValidationError("Nama skenario maksimal 255 karakter.");
      return;
    }
    if (editBaseYear < 2000 || editBaseYear > 2100) {
      setValidationError("Tahun mulai harus berada di antara tahun 2000 dan 2100.");
      return;
    }
    if (editPlanningHorizon < 1 || editPlanningHorizon > 100) {
      setValidationError("Planning horizon harus berada di antara 1 dan 100 tahun.");
      return;
    }

    setUpdating(true);
    try {
      // 1. Update Scenario details
      const scenarioPromise = fetch(`http://localhost:8000/scenarios/${scenarioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
        }),
      });

      // 2. Update Project details (Base Year, Planning Horizon)
      const projectPromise = fetch(`http://localhost:8000/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base_year: editBaseYear,
          planning_horizon: editPlanningHorizon,
        }),
      });

      const [scenarioRes, projectRes] = await Promise.all([scenarioPromise, projectPromise]);

      if (!scenarioRes.ok) {
        const errData = await scenarioRes.json();
        throw new Error(errData.detail || "Gagal memperbarui detail skenario.");
      }
      if (!projectRes.ok) {
        const errData = await projectRes.json();
        throw new Error(errData.detail || "Gagal memperbarui parameter proyek.");
      }

      showToast("Pengaturan skenario berhasil disimpan.");
      setIsEditing(false);
      await fetchData();
    } catch (err: any) {
      setValidationError(err.message || "Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    if (scenario && project) {
      setEditName(scenario.name);
      setEditDescription(scenario.description || "");
      setEditBaseYear(project.base_year);
      setEditPlanningHorizon(project.planning_horizon);
    }
    setValidationError(null);
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" },
    { id: "cargo", label: "Cargo", icon: "M20.25 7.5l-.625 10.125a3.375 3.375 0 01-3.375 3.375H7.75a3.375 3.375 0 01-3.375-3.375L3.75 7.5M10 3.75h4" },
    { id: "ports", label: "Ports", icon: "M2.25 21h19.5m-18-3.75h16.5M4.5 13.5h15" },
    { id: "fleet", label: "Fleet", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0" },
    { id: "equipment", label: "Equipment", icon: "M10.34 15.84c-.68-.68-.86-1.72-.49-2.58l.66-1.54" },
    { id: "parameters", label: "Parameters", icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55" },
    { id: "calculation", label: "Calculation", icon: "M15.75 15.75V18m-3-9h.008v.008H12.75V9" },
    { id: "results", label: "Results", icon: "M3.75 3v16.5M21 19.5H3.75M6.75 15" },
  ];

  const endYear = (project?.base_year || 0) + (project?.planning_horizon || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href={`/projects/${projectId}`}
            className="text-slate-500 hover:text-slate-200 transition flex items-center gap-1.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali ke Proyek
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Proyek:</span>
            <span className="font-semibold text-slate-200">{project?.name || "Memuat..."}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Skenario:</span>
            <span className="font-bold text-cyan-400">{scenario?.name || "Memuat..."}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              healthStatus === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" :
              healthStatus === "disconnected" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-amber-500 animate-spin"
            }`} />
            {healthStatus === "connected" ? "API Connected" : "Disconnected"}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-800 text-cyan-200 px-6 py-3 rounded-xl shadow-2xl animate-fade-in-up flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Main Workspace Layout with Sidebar Navigation */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 z-10">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 backdrop-blur-sm">
            <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
              Menu Skenario
            </span>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-medium transition duration-200 flex items-center gap-3 ${
                      isActive
                        ? "bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-400"
                        : "hover:bg-slate-800/40 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Memuat data skenario...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-6 text-2xl font-bold">
                !
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">Terjadi Kesalahan</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{error}</p>
              <button
                onClick={fetchData}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 transition text-slate-200"
              >
                Coba Lagi
              </button>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Tab: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6 flex-1 flex flex-col">
                  {/* Scenario Summary Card */}
                  <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    {!isEditing ? (
                      /* VIEW MODE */
                      <>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h2 className="text-2xl font-bold text-slate-100">{scenario?.name}</h2>
                              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                                scenario?.status === "READY"
                                  ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50"
                                  : "bg-amber-950/30 text-amber-400 border border-amber-900/50"
                              }`}>
                                {scenario?.status}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm max-w-xl">
                              {scenario?.description || "Tidak ada deskripsi skenario."}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsEditing(true)}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                            >
                              Edit Pengaturan
                            </button>
                            <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                            <button
                              onClick={() => handleUpdateStatus("DRAFT")}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                                scenario?.status === "DRAFT"
                                  ? "bg-amber-950/40 border border-amber-800 text-amber-400 cursor-default"
                                  : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                              }`}
                              disabled={scenario?.status === "DRAFT"}
                            >
                              Draft
                            </button>
                            <button
                              onClick={() => handleUpdateStatus("READY")}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                                scenario?.status === "READY"
                                  ? "bg-emerald-950/40 border border-emerald-800 text-emerald-400 cursor-default"
                                  : "bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
                              }`}
                              disabled={scenario?.status === "READY"}
                            >
                              Ready
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-900 text-sm">
                          <div className="space-y-3">
                            <h4 className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                              Detail Parameter Analisis
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-slate-900">
                                <span className="text-slate-500">Skenario ID</span>
                                <span className="font-mono text-slate-300 text-xs">{scenario?.id}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-900">
                                <span className="text-slate-500">Dibuat Pada</span>
                                <span className="text-slate-300">{formatDate(scenario?.created_at || "")}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-900">
                                <span className="text-slate-500">Skenario Induk</span>
                                <span className="text-slate-300">
                                  {parentScenario ? (
                                    <Link 
                                      href={`/projects/${projectId}/scenarios/${parentScenario.id}`}
                                      className="text-cyan-400 hover:underline"
                                    >
                                      {parentScenario.name}
                                    </Link>
                                  ) : (
                                    "None (Root)"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-slate-400 font-semibold text-xs uppercase tracking-wider">
                              Asosiasi Proyek
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-slate-900">
                                <span className="text-slate-500">Nama Proyek</span>
                                <span className="text-slate-300 font-medium">{project?.name}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-900">
                                <span className="text-slate-500">Tahun Mulai (Start)</span>
                                <span className="text-slate-300 font-mono">{project?.base_year}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-900">
                                <span className="text-slate-500">Planning Horizon</span>
                                <span className="text-slate-300 font-mono">{project?.planning_horizon} tahun</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-900">
                                <span className="text-slate-500">Tahun Selesai (End)</span>
                                <span className="text-slate-300 font-mono">{endYear}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* EDIT MODE FORM */
                      <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-100">Edit Pengaturan Skenario</h3>
                            <p className="text-slate-500 text-xs mt-1">Ubah parameter utama analisis skenario dan proyek dasar.</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 transition"
                            >
                              Batal
                            </button>
                            <button
                              type="submit"
                              disabled={updating}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {updating ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                                  Menyimpan...
                                </>
                              ) : (
                                "Simpan Perubahan"
                              )}
                            </button>
                          </div>
                        </div>

                        {validationError && (
                          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs leading-relaxed">
                            {validationError}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column - Scenario Attributes */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                                Nama Skenario <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition"
                                placeholder="Masukkan nama skenario"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                                Deskripsi Skenario
                              </label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition resize-none"
                                placeholder="Jelaskan karakteristik alternatif skenario..."
                              />
                            </div>
                          </div>

                          {/* Right Column - Project Attributes */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                                Tahun Mulai (Start Year) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={editBaseYear}
                                onChange={(e) => setEditBaseYear(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none font-mono transition"
                                min={2000}
                                max={2100}
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                                Planning Horizon (Tahun) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={editPlanningHorizon}
                                onChange={(e) => setEditPlanningHorizon(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none font-mono transition"
                                min={1}
                                max={100}
                                required
                              />
                            </div>

                            <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-4 flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="block text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
                                  Kalkulasi Tahun Selesai (End Year)
                                </span>
                                <span className="text-slate-400 text-xs">
                                  Tahun Mulai ({editBaseYear}) + Horizon ({editPlanningHorizon})
                                </span>
                              </div>
                              <div className="text-xl font-bold text-cyan-400 font-mono">
                                {editBaseYear + editPlanningHorizon}
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Guide Board Card */}
                  <div className="bg-slate-900/10 border border-slate-900/60 rounded-3xl p-6 flex-1 flex flex-col justify-center text-center max-w-lg mx-auto py-12">
                    <div className="w-14 h-14 bg-cyan-950/20 border border-cyan-800/30 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 mb-2">Workspace Skenario Aktif</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Gunakan menu navigasi di panel kiri untuk mendefinisikan komoditas cargo, terminal pelabuhan, armada kapal, parameter peramalan, kalkulasi demand, dan meninjau hasil optimasi.
                    </p>
                  </div>
                </div>
              )}

              {/* Placeholder tabs */}
              {activeTab !== "overview" && (
                <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-12 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-500 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">
                    Modul {tabs.find((t) => t.id === activeTab)?.label} Sedang Dikonstruksi
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                    Halaman pengisian parameter dan analisis **{tabs.find((t) => t.id === activeTab)?.label}** untuk skenario ini akan diimplementasikan pada langkah pengerjaan berikutnya.
                  </p>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition duration-200"
                  >
                    Kembali ke Overview
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 text-center py-6 px-6 z-10">
        <p className="text-xs text-slate-600">
          Maritime Transportation Planner &copy; {new Date().getFullYear()} &bull; Built under NixOS Environment
        </p>
      </footer>
    </div>
  );
}
