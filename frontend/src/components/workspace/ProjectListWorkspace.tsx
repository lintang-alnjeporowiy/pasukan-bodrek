import React from "react";
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Toast } from "@/components/common/Toast";
import { NewProjectModal } from "@/components/dialogs/NewProjectModal";
import { useProjects } from "@/hooks/useProjects";

export const ProjectListWorkspace: React.FC = () => {
  const {
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
  } = useProjects();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header healthStatus={healthStatus} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Top Title Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">Proyek Perencanaan Pelabuhan</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {projects.length} Proyek Terdaftar
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Kelola proyek perencanaan jaringan transportasi laut, analisis arus kargo, armada kapal, dan kebutuhan infrastruktur dermaga.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Buat Proyek Baru</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Project Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Memuat daftar proyek...</div>
        ) : projects.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12.75M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-200">Belum Ada Proyek Perencanaan</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Silakan buat proyek perencanaan pelabuhan pertama Anda untuk mulai mengonfigurasi skenario demand kargo dan simulasi jaringan armada.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-sm hover:bg-cyan-400 transition"
            >
              Buat Proyek Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group bg-slate-900/30 border border-slate-900 hover:border-cyan-500/50 rounded-3xl p-6 transition duration-200 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition">
                      {project.name}
                    </h3>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {project.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description || "Tidak ada deskripsi tambahan."}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-900/80 flex items-center justify-between mt-6 text-xs text-slate-500 font-mono">
                  <div className="flex items-center gap-4">
                    <span>Base Year: <strong className="text-slate-300">{project.base_year}</strong></span>
                    <span>Horizon: <strong className="text-slate-300">{project.planning_horizon} thn</strong></span>
                  </div>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition duration-200">
                    Buka Detail &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <Toast message={toastMessage} />

      <NewProjectModal
        isOpen={isModalOpen}
        name={newProjectName}
        description={newProjectDesc}
        baseYear={newBaseYear}
        planningHorizon={newPlanningHorizon}
        creating={creating}
        error={createError}
        onClose={() => setIsModalOpen(false)}
        setName={setNewProjectName}
        setDescription={setNewProjectDesc}
        setBaseYear={setNewBaseYear}
        setPlanningHorizon={setNewPlanningHorizon}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};
