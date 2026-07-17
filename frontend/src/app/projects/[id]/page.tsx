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

export default function ProjectWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const projectId = unwrappedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Create Scenario Form States
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newScenarioName, setNewScenarioName] = useState<string>("");
  const [newScenarioDescription, setNewScenarioDescription] = useState<string>("");
  const [newScenarioParentId, setNewScenarioParentId] = useState<string>("");
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenCreateModal = () => {
    setNewScenarioName("");
    setNewScenarioDescription("");
    setNewScenarioParentId("");
    setFormErrors({});
    setSubmitError(null);
    setShowCreateModal(true);
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

      // 2. Fetch project scenarios
      const scenarioRes = await fetch(`http://localhost:8000/projects/${projectId}/scenarios`, { cache: "no-store" });
      if (!scenarioRes.ok) {
        throw new Error("Gagal mengambil data skenario.");
      }
      const scenarioData = await scenarioRes.json();
      setScenarios(scenarioData);
      
      // Default active scenario to first one, if any
      if (scenarioData.length > 0 && !activeScenario) {
        setActiveScenario(scenarioData[0]);
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
  }, [projectId]);

  const handleCreateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!newScenarioName.trim()) {
      setFormErrors({ name: "Nama skenario wajib diisi." });
      return;
    }
    if (newScenarioName.length > 255) {
      setFormErrors({ name: "Nama skenario tidak boleh melebihi 255 karakter." });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      project_id: projectId,
      parent_scenario_id: newScenarioParentId || null,
      name: newScenarioName.trim(),
      description: newScenarioDescription.trim() || null,
      status: "DRAFT", // Default status is DRAFT
    };

    try {
      const res = await fetch("http://localhost:8000/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Gagal menyimpan skenario.");
      }

      const created = await res.json();
      showToast(`Skenario "${created.name}" berhasil dibuat.`);
      setShowCreateModal(false);

      // Refresh list
      const scenarioRes = await fetch(`http://localhost:8000/projects/${projectId}/scenarios`, { cache: "no-store" });
      if (scenarioRes.ok) {
        const scenarioData = await scenarioRes.json();
        setScenarios(scenarioData);
        // Automatically activate the newly created scenario
        setActiveScenario(created);
      }
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScenario = async (scenarioId: string, scenarioName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus skenario "${scenarioName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/scenarios/${scenarioId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Gagal menghapus skenario.");
      }
      showToast(`Skenario "${scenarioName}" berhasil dihapus.`);
      if (activeScenario?.id === scenarioId) {
        setActiveScenario(null);
      }
      // Refresh list
      const scenarioRes = await fetch(`http://localhost:8000/projects/${projectId}/scenarios`, { cache: "no-store" });
      if (scenarioRes.ok) {
        const scenarioData = await scenarioRes.json();
        setScenarios(scenarioData);
        if (scenarioData.length > 0) {
          setActiveScenario(scenarioData[0]);
        }
      }
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan.");
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", disabled: false },
    { id: "cargo", label: "Cargo", disabled: true },
    { id: "ports", label: "Ports", disabled: true },
    { id: "fleet", label: "Fleet", disabled: true },
    { id: "equipment", label: "Equipment", disabled: true },
    { id: "infrastructure", label: "Infrastructure", disabled: true },
    { id: "parameters", label: "Parameters", disabled: true },
    { id: "calculation", label: "Calculation", disabled: true },
    { id: "results", label: "Results", disabled: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/"
            className="text-slate-500 hover:text-slate-200 transition flex items-center gap-1.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali
          </Link>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Proyek:</span>
            <span className="font-semibold text-slate-200">{project?.name || "Memuat..."}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          
          {/* Active Scenario Selector Badge */}
          <div className="flex items-center gap-2 text-sm bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1">
            <span className="text-slate-500 font-medium">Skenario Aktif:</span>
            <span className="text-cyan-400 font-semibold">{activeScenario?.name || "Pilih Skenario"}</span>
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

      {/* Modal Dialog for New Scenario */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-100">Buat Skenario Baru</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-500 hover:text-slate-300 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreateScenario} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nama Skenario <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Optimasi Alternatif A"
                  value={newScenarioName}
                  onChange={(e) => {
                    setNewScenarioName(e.target.value);
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-950/60 border text-slate-200 text-sm font-medium placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition ${
                    formErrors.name ? "border-rose-500/60 focus:ring-rose-500/30" : "border-slate-800"
                  }`}
                  disabled={submitting}
                />
                {formErrors.name && (
                  <p className="text-rose-500 text-xs mt-1.5">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Deskripsi Skenario
                </label>
                <textarea
                  placeholder="Jelaskan asumsi atau tujuan dari skenario ini..."
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 text-sm font-medium placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition resize-none"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Skenario Induk (Opsional)
                </label>
                <select
                  value={newScenarioParentId}
                  onChange={(e) => setNewScenarioParentId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 text-sm font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition appearance-none cursor-pointer"
                  disabled={submitting}
                >
                  <option value="">-- Tanpa Induk (Mulai dari Nol) --</option>
                  {scenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-800/50 border border-slate-800 hover:bg-slate-800 text-slate-300 transition duration-200 active:scale-95"
                  disabled={submitting}
                >
                  Batal
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition duration-200 shadow-lg shadow-cyan-500/10 active:scale-95 flex items-center gap-2 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Skenario"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-slate-950/40 border-b border-slate-900 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "border-cyan-500 text-cyan-400"
                    : tab.disabled
                    ? "border-transparent text-slate-600 cursor-not-allowed"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
                disabled={tab.disabled}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 z-10 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Memuat data ruang kerja...</p>
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
          /* Workspace Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Project Overview Metadata */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-slate-200 mb-4 border-b border-slate-800 pb-3">
                  Detail Proyek
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                      Deskripsi
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {project?.description || "Tidak ada deskripsi."}
                    </p>
                  </div>

                  {project?.location && (
                    <div>
                      <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        Lokasi Studi
                      </span>
                      <p className="text-slate-300 font-medium">{project.location}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        Tahun Mulai
                      </span>
                      <p className="text-slate-300 font-mono font-medium">{project?.base_year}</p>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                        Horizon
                      </span>
                      <p className="text-slate-300 font-mono font-medium">{project?.planning_horizon} tahun</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 pt-4 text-xs text-slate-500 space-y-1">
                    <div>Dibuat: {formatDate(project?.created_at || "")}</div>
                    <div>Pembaruan Terakhir: {formatDate(project?.updated_at || "")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Scenario list */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-6 backdrop-blur-sm flex flex-col min-h-[400px]">
                {/* Header bar of Scenario section */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-200">Skenario Analisis</h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
                      {scenarios.length}
                    </span>
                  </div>

                  <button
                    onClick={handleOpenCreateModal}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition duration-200 active:scale-95 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Skenario Baru
                  </button>
                </div>

                {/* Scenario List Content */}
                {scenarios.length === 0 ? (
                  /* Empty state of scenarios */
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-600 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-300 mb-2">Belum ada skenario</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      Skenario mewakili alternatif parameter peramalan dan alokasi. Buat skenario pertama Anda untuk memulai simulasi.
                    </p>
                    <button
                      onClick={handleOpenCreateModal}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition duration-200 active:scale-95"
                    >
                      Buat Skenario
                    </button>
                  </div>
                ) : (
                  /* Scenario Cards Grid */
                  <div className="space-y-4 flex-1">
                    {scenarios.map((scenario) => {
                      const isActive = activeScenario?.id === scenario.id;
                      return (
                        <div 
                          key={scenario.id}
                          className={`border rounded-2xl p-5 backdrop-blur-sm transition duration-300 flex items-start justify-between gap-4 ${
                            isActive
                              ? "bg-cyan-950/10 border-cyan-500/50 shadow-lg shadow-cyan-950/20"
                              : "bg-slate-900/20 border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/30"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h4 className={`font-bold text-base ${isActive ? "text-cyan-400" : "text-slate-200"}`}>
                                {scenario.name}
                              </h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                scenario.status === "READY"
                                  ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50"
                                  : "bg-amber-950/30 text-amber-400 border border-amber-900/50"
                              }`}>
                                {scenario.status}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                              {scenario.description || "Tidak ada deskripsi skenario."}
                            </p>
                            
                            <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-2 font-mono">
                              <div>Dibuat: {formatDate(scenario.created_at)}</div>
                              {scenario.parent_scenario_id && (
                                <div className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                  <span>Turunan: {
                                    scenarios.find(s => s.id === scenario.parent_scenario_id)?.name || `ID ${scenario.parent_scenario_id.slice(0, 8)}...`
                                  }</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <button
                              onClick={() => router.push(`/projects/${projectId}/scenarios/${scenario.id}`)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400 transition duration-300 flex items-center justify-center gap-1"
                            >
                              Buka
                            </button>

                            <button
                              onClick={() => handleDeleteScenario(scenario.id, scenario.name)}
                              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition duration-200 flex items-center justify-center"
                              title="Hapus Skenario"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 text-center py-6 px-6 z-10">
        <p className="text-xs text-slate-600">
          Maritime Transportation Planner &copy; {new Date().getFullYear()} &bull; Built under NixOS Environment
        </p>
      </footer>
    </div>
  );
}
