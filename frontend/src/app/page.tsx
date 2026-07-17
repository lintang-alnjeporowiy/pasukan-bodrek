"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    base_year: 2026,
    planning_horizon: 20,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/projects", {
        mode: "cors",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Gagal mengambil data proyek");
      }
      const data = await response.json();
      setProjects(data);
      setHealthStatus("connected");
    } catch (err: any) {
      setError("Gagal terhubung ke API backend. Pastikan server backend sudah berjalan.");
      setHealthStatus("disconnected");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Nama proyek wajib diisi.";
    }
    if (!formData.base_year || formData.base_year < 2000 || formData.base_year > 2100) {
      errors.base_year = "Tahun mulai harus berada di antara tahun 2000 dan 2100.";
    }
    if (!formData.planning_horizon || formData.planning_horizon < 1 || formData.planning_horizon > 100) {
      errors.planning_horizon = "Horizon perencanaan harus berada di antara 1 dan 100 tahun.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("http://localhost:8000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Gagal membuat proyek baru.");
      }

      // Success
      showToast("Proyek berhasil dibuat!");
      setShowCreateForm(false);
      setFormData({
        name: "",
        description: "",
        location: "",
        base_year: 2026,
        planning_horizon: 20,
      });
      setFormErrors({});
      fetchProjects();
    } catch (err: any) {
      setSubmitError(err.message || "Gagal menyimpan proyek. Pastikan server database terhubung.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "base_year" || name === "planning_horizon" ? (value === "" ? "" : parseInt(value, 10)) : value
    }));
    // Clear validation error when typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-cyan-500/20">
            M
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Maritime Planner
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Health Badge */}
          <div className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              healthStatus === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" :
              healthStatus === "disconnected" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-amber-500 animate-spin"
            }`} />
            {healthStatus === "connected" ? "API Connected" :
             healthStatus === "disconnected" ? "API Disconnected" : "Checking Connection..."}
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

      {/* Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Buat Proyek Baru</h2>
              <p className="text-slate-400 text-sm mt-1">
                Masukkan parameter dasar studi transportasi laut baru Anda.
              </p>
            </div>

            {submitError && (
              <div className="mb-6 p-4 bg-rose-950/20 border border-rose-900/30 text-rose-400 rounded-xl text-xs leading-relaxed">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Nama Proyek <span className="text-cyan-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Perencanaan Pelabuhan KEK Gresik"
                  className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-600 transition ${
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
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Berikan deskripsi singkat studi ini..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-600 transition resize-none"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Contoh: Jawa Timur, Indonesia"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder:text-slate-600 transition"
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Tahun Mulai <span className="text-cyan-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="base_year"
                    value={formData.base_year}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition ${
                      formErrors.base_year ? "border-rose-500/60 focus:ring-rose-500/30" : "border-slate-800"
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.base_year && (
                    <p className="text-rose-500 text-xs mt-1.5">{formErrors.base_year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Horizon Perencanaan (Tahun) <span className="text-cyan-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="planning_horizon"
                    value={formData.planning_horizon}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition ${
                      formErrors.planning_horizon ? "border-rose-500/60 focus:ring-rose-500/30" : "border-slate-800"
                    }`}
                    disabled={submitting}
                  />
                  {formErrors.planning_horizon && (
                    <p className="text-rose-500 text-xs mt-1.5">{formErrors.planning_horizon}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormErrors({});
                    setSubmitError(null);
                  }}
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
                    "Simpan Proyek"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 z-10 flex flex-col">
        {/* Title area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">
              Daftar Proyek
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2">
              Pilih proyek perencanaan transportasi laut aktif atau buat proyek baru untuk memulai analisis.
            </p>
          </div>
          
          <div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full md:w-auto px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition duration-300 shadow-lg shadow-cyan-500/10 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Proyek Baru
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Memuat daftar proyek...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-6 text-2xl font-bold">
              !
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">Terjadi Kesalahan</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 transition duration-300 text-slate-200 active:scale-95"
            >
              Coba Lagi
            </button>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center max-w-lg mx-auto bg-slate-900/20 border border-slate-900/60 rounded-3xl p-12 backdrop-blur-sm">
            <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-inner shadow-black/40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-3">Belum ada proyek yang dibuat</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
              Buat proyek pertama Anda untuk memulai konfigurasi rute, kapasitas pelabuhan, dan optimalisasi armada logistik laut.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition duration-300 shadow-lg shadow-cyan-500/10 active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Buat Proyek
            </button>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between hover:border-slate-800 transition duration-300 group hover:shadow-xl hover:shadow-cyan-950/5 relative overflow-hidden"
              >
                {/* Background accent line on hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition duration-300" />
                
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-slate-200 group-hover:text-slate-100 transition duration-200 line-clamp-1">
                      {project.name}
                    </h3>
                  </div>

                  <p className="text-slate-400 text-xs md:text-sm line-clamp-3 leading-relaxed min-h-[40px]">
                    {project.description || "Tidak ada deskripsi proyek."}
                  </p>

                  <div className="space-y-2 border-t border-slate-900/60 pt-4 text-xs text-slate-500">
                    {project.location && (
                      <div className="flex justify-between">
                        <span>Lokasi:</span>
                        <span className="font-medium text-slate-300">{project.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Tahun Mulai:</span>
                      <span className="font-mono text-slate-300">{project.base_year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horizon Perencanaan:</span>
                      <span className="font-mono text-slate-300">{project.planning_horizon} tahun</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900/60 flex flex-col gap-4">
                  <div className="flex flex-col gap-1 text-[10px] text-slate-600 font-mono">
                    <div>Dibuat: {formatDate(project.created_at)}</div>
                    <div>Diperbarui: {formatDate(project.updated_at)}</div>
                  </div>
                  
                  <button
                    onClick={() => showToast(`Membuka proyek "${project.name}"...`)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400 transition duration-300 flex items-center justify-center gap-2 group-hover:border-slate-700"
                  >
                    <span>Buka Proyek</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 transition duration-300 group-hover:translate-x-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
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
