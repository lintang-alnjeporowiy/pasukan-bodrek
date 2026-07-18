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

interface Commodity {
  id: string;
  name: string;
  code?: string;
  unit: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Tenant {
  id: string;
  project_id: string;
  commodity_id?: string;
  commodity_name?: string;
  name: string;
  description?: string;
  is_active: boolean;
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

  // Scenario Lifecycle Modal State
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<boolean>(false);

  // Cargo Tab Sub-Navigation & Commodities CRUD States
  const [cargoSubTab, setCargoSubTab] = useState<string>("commodities");
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loadingCommodities, setLoadingCommodities] = useState<boolean>(false);

  // Add/Edit Commodity Form States
  const [isCommodityModalOpen, setIsCommodityModalOpen] = useState<boolean>(false);
  const [editingCommodity, setEditingCommodity] = useState<Commodity | null>(null);
  const [commName, setCommName] = useState<string>("");
  const [commCode, setCommCode] = useState<string>("");
  const [commUnit, setCommUnit] = useState<string>("Ton");
  const [commDesc, setCommDesc] = useState<string>("");
  const [commActive, setCommActive] = useState<boolean>(true);
  const [commError, setCommError] = useState<string | null>(null);
  const [commSaving, setCommSaving] = useState<boolean>(false);

  // Tenants States
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState<boolean>(false);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState<boolean>(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [tenantName, setTenantName] = useState<string>("");
  const [tenantCommodityId, setTenantCommodityId] = useState<string>("");
  const [tenantDesc, setTenantDesc] = useState<string>("");
  const [tenantActive, setTenantActive] = useState<boolean>(true);
  const [tenantError, setTenantError] = useState<string | null>(null);
  const [tenantSaving, setTenantSaving] = useState<boolean>(false);

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

  const fetchCommodities = async () => {
    setLoadingCommodities(true);
    try {
      const res = await fetch("http://localhost:8000/commodities", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCommodities(data);
      }
    } catch (err) {
      console.error("Gagal memuat komoditas", err);
    } finally {
      setLoadingCommodities(false);
    }
  };

  const fetchTenants = async () => {
    setLoadingTenants(true);
    try {
      const res = await fetch(`http://localhost:8000/projects/${projectId}/tenants`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
      }
    } catch (err) {
      console.error("Gagal memuat tenants", err);
    } finally {
      setLoadingTenants(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId, scenarioId]);

  useEffect(() => {
    if (activeTab === "cargo") {
      if (cargoSubTab === "commodities") {
        fetchCommodities();
      } else if (cargoSubTab === "tenants") {
        fetchTenants();
        fetchCommodities(); // fetch master commodities for references
      }
    }
  }, [activeTab, cargoSubTab]);

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
      
      // If we archive, ensure editing is closed
      if (newStatus === "ARCHIVED") {
        setIsEditing(false);
      }
    } catch (err: any) {
      showToast("Gagal memperbarui status.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scenario?.status === "ARCHIVED") {
      setValidationError("Skenario yang telah diarsipkan tidak dapat diedit.");
      return;
    }

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

  // Commodity Actions
  const handleOpenAddCommodity = () => {
    setEditingCommodity(null);
    setCommName("");
    setCommCode("");
    setCommUnit("Ton");
    setCommDesc("");
    setCommActive(true);
    setCommError(null);
    setIsCommodityModalOpen(true);
  };

  const handleOpenEditCommodity = (comm: Commodity) => {
    setEditingCommodity(comm);
    setCommName(comm.name);
    setCommCode(comm.code || "");
    setCommUnit(comm.unit);
    setCommDesc(comm.description || "");
    setCommActive(comm.is_active);
    setCommError(null);
    setIsCommodityModalOpen(true);
  };

  const handleSaveCommodity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommError(null);

    if (!commName.trim()) {
      setCommError("Nama komoditas wajib diisi.");
      return;
    }
    if (!commUnit.trim()) {
      setCommError("Satuan wajib diisi.");
      return;
    }

    setCommSaving(true);
    try {
      const payload = {
        name: commName.trim(),
        code: commCode.trim() || null,
        unit: commUnit.trim(),
        description: commDesc.trim() || null,
        is_active: commActive,
      };

      let res;
      if (editingCommodity) {
        res = await fetch(`http://localhost:8000/commodities/${editingCommodity.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:8000/commodities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Gagal menyimpan komoditas.");
      }

      showToast(editingCommodity ? "Komoditas berhasil diperbarui." : "Komoditas baru berhasil ditambahkan.");
      setIsCommodityModalOpen(false);
      fetchCommodities();
    } catch (err: any) {
      setCommError(err.message || "Terjadi kesalahan saat menyimpan komoditas.");
    } finally {
      setCommSaving(false);
    }
  };

  const handleDeleteCommodity = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus komoditas "${name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/commodities/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Komoditas berhasil dihapus.");
        fetchCommodities();
      } else {
        const errData = await res.json();
        showToast(errData.detail || "Gagal menghapus komoditas.");
      }
    } catch (err) {
      showToast("Gagal menghapus komoditas.");
    }
  };

  // Tenant Actions
  const handleOpenAddTenant = () => {
    setEditingTenant(null);
    setTenantName("");
    setTenantCommodityId("");
    setTenantDesc("");
    setTenantActive(true);
    setTenantError(null);
    setIsTenantModalOpen(true);
  };

  const handleOpenEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setTenantName(tenant.name);
    setTenantCommodityId(tenant.commodity_id || "");
    setTenantDesc(tenant.description || "");
    setTenantActive(tenant.is_active);
    setTenantError(null);
    setIsTenantModalOpen(true);
  };

  const handleSaveTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setTenantError(null);

    if (!tenantName.trim()) {
      setTenantError("Nama tenant wajib diisi.");
      return;
    }

    setTenantSaving(true);
    try {
      const payload = {
        name: tenantName.trim(),
        commodity_id: tenantCommodityId || null,
        description: tenantDesc.trim() || null,
        is_active: tenantActive,
      };

      let res;
      if (editingTenant) {
        res = await fetch(`http://localhost:8000/tenants/${editingTenant.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`http://localhost:8000/projects/${projectId}/tenants`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Gagal menyimpan tenant.");
      }

      showToast(editingTenant ? "Tenant berhasil diperbarui." : "Tenant baru berhasil ditambahkan.");
      setIsTenantModalOpen(false);
      fetchTenants();
    } catch (err: any) {
      setTenantError(err.message || "Terjadi kesalahan saat menyimpan tenant.");
    } finally {
      setTenantSaving(false);
    }
  };

  const handleDeleteTenant = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus tenant "${name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/tenants/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Tenant berhasil dihapus.");
        fetchTenants();
      } else {
        const errData = await res.json();
        showToast(errData.detail || "Gagal menghapus tenant.");
      }
    } catch (err) {
      showToast("Gagal menghapus tenant.");
    }
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

      {/* Archive Confirmation Modal Overlay */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold">
                !
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-100">Arsipkan Skenario?</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Apakah Anda yakin ingin mengarsipkan skenario <strong>"{scenario?.name}"</strong>? Setelah diarsipkan, skenario akan terkunci secara permanen menjadi read-only dan tidak dapat diedit kembali.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowArchiveConfirm(false);
                  await handleUpdateStatus("ARCHIVED");
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-slate-100 hover:bg-rose-500 transition"
              >
                Ya, Arsipkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commodity Modal Overlay */}
      {isCommodityModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                {editingCommodity ? "Edit Komoditas" : "Tambah Komoditas Baru"}
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Definisikan entitas komoditas global untuk perencanaan kargo.
              </p>
            </div>

            {commError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs">
                {commError}
              </div>
            )}

            <form onSubmit={handleSaveCommodity} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Nama Komoditas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={commName}
                    onChange={(e) => setCommName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition"
                    placeholder="Contoh: Coal, CPO, HSD"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Kode Komoditas
                  </label>
                  <input
                    type="text"
                    value={commCode}
                    onChange={(e) => setCommCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition"
                    placeholder="Contoh: C-COAL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Satuan (Unit) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={commUnit}
                    onChange={(e) => setCommUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition"
                  >
                    <option value="Ton">Ton</option>
                    <option value="TEU">TEU</option>
                    <option value="KL">KL</option>
                    <option value="M3">M3 (Cubic Meter)</option>
                    <option value="Box">Box</option>
                  </select>
                </div>

                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
                  <div className="space-y-0.5">
                    <span className="block text-slate-300 text-xs font-medium">Status Aktif</span>
                    <span className="text-[10px] text-slate-500">Dapat dipilih pada flows</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={commActive}
                    onChange={(e) => setCommActive(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                  Deskripsi Komoditas
                </label>
                <textarea
                  value={commDesc}
                  onChange={(e) => setCommDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition resize-none"
                  placeholder="Keterangan fisik, sifat cargo, dll..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCommodityModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={commSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition flex items-center gap-1.5"
                >
                  {commSaving ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tenant Modal Overlay */}
      {isTenantModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                {editingTenant ? "Edit Tenant" : "Tambah Tenant Baru"}
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Definisikan penyewa industri baru untuk proyek aktif ini.
              </p>
            </div>

            {tenantError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-xs">
                {tenantError}
              </div>
            )}

            <form onSubmit={handleSaveTenant} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Nama Tenant <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition"
                    placeholder="Contoh: PT Semen Indonesia"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    Komoditas Utama
                  </label>
                  <select
                    value={tenantCommodityId}
                    onChange={(e) => setTenantCommodityId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition"
                  >
                    <option value="">-- Pilih Komoditas --</option>
                    {commodities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.code ? `(${c.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 md:col-span-2">
                  <div className="space-y-0.5">
                    <span className="block text-slate-300 text-xs font-medium">Status Aktif</span>
                    <span className="text-[10px] text-slate-500">Menyatakan tenant aktif beroperasi</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tenantActive}
                    onChange={(e) => setTenantActive(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-800 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                  Deskripsi / Keterangan
                </label>
                <textarea
                  value={tenantDesc}
                  onChange={(e) => setTenantDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition resize-none"
                  placeholder="Keterangan alur operasi tenant..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTenantModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={tenantSaving}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition flex items-center gap-1.5"
                >
                  {tenantSaving ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
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
                                  : scenario?.status === "ARCHIVED"
                                  ? "bg-slate-900 text-slate-400 border border-slate-800"
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
                            {scenario?.status !== "ARCHIVED" ? (
                              <>
                                <button
                                  onClick={() => setIsEditing(true)}
                                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                                >
                                  Edit Pengaturan
                                </button>
                                <div className="w-[1px] h-6 bg-slate-800 mx-1" />
                                
                                {scenario?.status === "DRAFT" && (
                                  <button
                                    onClick={() => handleUpdateStatus("READY")}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition"
                                  >
                                    Set Ready
                                  </button>
                                )}

                                {scenario?.status === "READY" && (
                                  <button
                                    onClick={() => handleUpdateStatus("DRAFT")}
                                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition"
                                  >
                                    Set Draft
                                  </button>
                                )}

                                <button
                                  onClick={() => setShowArchiveConfirm(true)}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/30 border border-rose-900/50 text-rose-400 hover:bg-rose-900/50 transition"
                                >
                                  Arsipkan
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                Terkunci (Archived)
                              </div>
                            )}
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

              {/* Tab: Cargo (Commodity & Tenant CRUD) */}
              {activeTab === "cargo" && (
                <div className="space-y-6 flex-1 flex flex-col">
                  {/* Cargo Sub-tabs Navigation */}
                  <div className="flex border-b border-slate-900 gap-6 pb-2">
                    <button
                      onClick={() => setCargoSubTab("commodities")}
                      className={`text-sm font-semibold pb-2 border-b-2 transition ${
                        cargoSubTab === "commodities"
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Commodities (Master)
                    </button>
                    <button
                      onClick={() => setCargoSubTab("tenants")}
                      className={`text-sm font-semibold pb-2 border-b-2 transition ${
                        cargoSubTab === "tenants"
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Tenants
                    </button>
                    <button
                      onClick={() => setCargoSubTab("flows")}
                      className={`text-sm font-semibold pb-2 border-b-2 transition ${
                        cargoSubTab === "flows"
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Cargo Flows
                    </button>
                    <button
                      onClick={() => setCargoSubTab("conversion")}
                      className={`text-sm font-semibold pb-2 border-b-2 transition ${
                        cargoSubTab === "conversion"
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Conversion Rules
                    </button>
                  </div>

                  {cargoSubTab === "commodities" ? (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-100">Daftar Komoditas (Master Data)</h3>
                          <p className="text-slate-400 text-xs max-w-xl">
                            Kelola komoditas utama yang dapat digunakan untuk pendefinisian cargo flow di seluruh skenario perencanaan.
                          </p>
                        </div>
                        {scenario?.status !== "ARCHIVED" && (
                          <button
                            onClick={handleOpenAddCommodity}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                          >
                            + Tambah Komoditas
                          </button>
                        )}
                      </div>

                      {loadingCommodities ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-20">
                          <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                          <p className="text-slate-500 text-xs mt-3">Memuat daftar komoditas...</p>
                        </div>
                      ) : commodities.length === 0 ? (
                        <div className="bg-slate-900/10 border border-slate-900/60 rounded-3xl p-12 flex-1 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-500 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.125a3.375 3.375 0 01-3.375 3.375H7.75a3.375 3.375 0 01-3.375-3.375L3.75 7.5M10 3.75h4" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-slate-200 mb-2">Belum Ada Komoditas</h3>
                          <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                            Tambahkan master komoditas baru (seperti Batubara, HSD, Liquid Bulk, dll.) untuk memulai pendefinisian kargo.
                          </p>
                          {scenario?.status !== "ARCHIVED" && (
                            <button
                              onClick={handleOpenAddCommodity}
                              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition duration-200"
                            >
                              Tambah Komoditas Pertama
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="border border-slate-900 bg-slate-900/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/50">
                                <th className="px-6 py-4">Nama Komoditas</th>
                                <th className="px-6 py-4">Kode</th>
                                <th className="px-6 py-4">Satuan (Unit)</th>
                                <th className="px-6 py-4">Deskripsi</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900 text-sm">
                              {commodities.map((comm) => (
                                <tr key={comm.id} className="hover:bg-slate-900/20 transition">
                                  <td className="px-6 py-4 font-semibold text-slate-200">{comm.name}</td>
                                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{comm.code || "-"}</td>
                                  <td className="px-6 py-4 text-slate-300">{comm.unit}</td>
                                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{comm.description || "-"}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                      comm.is_active
                                        ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50"
                                        : "bg-rose-950/30 text-rose-400 border border-rose-900/50"
                                    }`}>
                                      {comm.is_active ? "Aktif" : "Nonaktif"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenEditCommodity(comm)}
                                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
                                    >
                                      Edit
                                    </button>
                                    {scenario?.status !== "ARCHIVED" && (
                                      <button
                                        onClick={() => handleDeleteCommodity(comm.id, comm.name)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/20 transition"
                                      >
                                        Hapus
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : cargoSubTab === "tenants" ? (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-100">Daftar Tenant Pelanggan</h3>
                          <p className="text-slate-400 text-xs max-w-xl">
                            Kelola profil tenant penyewa lahan industri pelabuhan yang memiliki alur cargo masuk/keluar pada proyek ini.
                          </p>
                        </div>
                        {scenario?.status !== "ARCHIVED" && (
                          <button
                            onClick={handleOpenAddTenant}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
                          >
                            + Tambah Tenant
                          </button>
                        )}
                      </div>

                      {loadingTenants ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-20">
                          <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                          <p className="text-slate-500 text-xs mt-3">Memuat daftar tenant...</p>
                        </div>
                      ) : tenants.length === 0 ? (
                        <div className="bg-slate-900/10 border border-slate-900/60 rounded-3xl p-12 flex-1 flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-500 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-slate-200 mb-2">Belum Ada Tenant</h3>
                          <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                            Tambahkan tenant penyewa (seperti PT Semen Indonesia, PT Pupuk Kaltim, dll.) untuk memulai konfigurasi logistik pelabuhan.
                          </p>
                          {scenario?.status !== "ARCHIVED" && (
                            <button
                              onClick={handleOpenAddTenant}
                              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition duration-200"
                            >
                              Tambah Tenant Pertama
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="border border-slate-900 bg-slate-900/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-900/50">
                                <th className="px-6 py-4">Nama Tenant</th>
                                <th className="px-6 py-4">Komoditas Utama</th>
                                <th className="px-6 py-4">Deskripsi</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900 text-sm">
                              {tenants.map((ten) => (
                                <tr key={ten.id} className="hover:bg-slate-900/20 transition">
                                  <td className="px-6 py-4 font-semibold text-slate-200">{ten.name}</td>
                                  <td className="px-6 py-4 text-slate-300">
                                    {ten.commodity_name ? (
                                      <span className="bg-slate-900 border border-slate-800 text-cyan-400 text-xs px-2 py-1 rounded">
                                        {ten.commodity_name}
                                      </span>
                                    ) : (
                                      <span className="text-slate-500">-</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{ten.description || "-"}</td>
                                  <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                      ten.is_active
                                        ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50"
                                        : "bg-rose-950/30 text-rose-400 border border-rose-900/50"
                                    }`}>
                                      {ten.is_active ? "Aktif" : "Nonaktif"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenEditTenant(ten)}
                                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 transition"
                                    >
                                      Edit
                                    </button>
                                    {scenario?.status !== "ARCHIVED" && (
                                      <button
                                        onClick={() => handleDeleteTenant(ten.id, ten.name)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-950/20 transition"
                                      >
                                        Hapus
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Other Sub-Tabs: Flows, Conversion Rules Placeholders */
                    <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-12 flex-1 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-500 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-200 mb-2">
                        Sub Modul {cargoSubTab.toUpperCase()} Sedang Dikonstruksi
                      </h3>
                      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                        Fitur master dan operasional kargo untuk **{cargoSubTab}** akan tersedia pada langkah pengembangan selanjutnya.
                      </p>
                      <button
                        onClick={() => setCargoSubTab("commodities")}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition duration-200"
                      >
                        Kembali ke Commodities (Master)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Placeholder tabs */}
              {activeTab !== "overview" && activeTab !== "cargo" && (
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
