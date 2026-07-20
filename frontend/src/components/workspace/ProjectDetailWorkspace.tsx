import React from "react";
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Toast } from "@/components/common/Toast";
import { NewScenarioModal } from "@/components/dialogs/NewScenarioModal";
import { useProjectDetail } from "@/hooks/useProjectDetail";

interface ProjectDetailWorkspaceProps {
  projectId: string;
}

export const ProjectDetailWorkspace: React.FC<ProjectDetailWorkspaceProps> = ({ projectId }) => {
  const {
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
  } = useProjectDetail(projectId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header healthStatus={healthStatus} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-400 transition">Daftar Proyek</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{project?.name || "Detail Proyek"}</span>
        </div>

        {/* Project Header Banner */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-slate-100">{project?.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {project?.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">{project?.description || "Tidak ada deskripsi tambahan."}</p>
            </div>

            <button
              onClick={() => setIsScenarioModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Tambah Skenario</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-900 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Tahun Dasar (Base Year):</span>
              <strong className="text-slate-200 text-sm">{project?.base_year}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Horizon Perencanaan:</span>
              <strong className="text-slate-200 text-sm">{project?.planning_horizon} Tahun</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tahun Akhir Analisis:</span>
              <strong className="text-slate-200 text-sm">{(project?.base_year || 2026) + (project?.planning_horizon || 20) - 1}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Jumlah Skenario:</span>
              <strong className="text-cyan-400 text-sm">{scenarios.length} Skenario</strong>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Scenario Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100">Daftar Skenario Analisis</h3>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Memuat skenario...</div>
          ) : scenarios.length === 0 ? (
            <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-8 text-center space-y-3">
              <p className="text-sm text-slate-500">Belum ada skenario analisis untuk proyek ini.</p>
              <button
                onClick={() => setIsScenarioModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition"
              >
                Buat Skenario Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((scenario) => (
                <Link
                  key={scenario.id}
                  href={`/projects/${projectId}/scenarios/${scenario.id}`}
                  className="group bg-slate-900/30 border border-slate-900 hover:border-cyan-500/50 rounded-3xl p-6 transition duration-200 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition">
                        {scenario.name}
                      </h4>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          scenario.status === "ACTIVE" || scenario.status === "DRAFT"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {scenario.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {scenario.description || "Tidak ada deskripsi skenario."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between mt-4 text-xs text-slate-500">
                    <span className="font-mono text-[11px]">
                      {scenario.parent_scenario_id ? "Diturunkan dari Skenario Parent" : "Skenario Utama (Base)"}
                    </span>
                    <span className="text-cyan-400 group-hover:translate-x-1 transition duration-200 font-semibold">
                      Masuk Ruang Kerja &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Toast message={toastMessage} />

      <NewScenarioModal
        isOpen={isScenarioModalOpen}
        name={newScenarioName}
        description={newScenarioDesc}
        parentScenarioId={parentScenarioId}
        creating={creatingScenario}
        error={scenarioError}
        scenarios={scenarios}
        onClose={() => setIsScenarioModalOpen(false)}
        setName={setNewScenarioName}
        setDescription={setNewScenarioDesc}
        setParentScenarioId={setParentScenarioId}
        onSubmit={handleCreateScenario}
      />
    </div>
  );
};
