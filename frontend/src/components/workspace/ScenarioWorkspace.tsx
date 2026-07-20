import React from "react";
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Toast } from "@/components/common/Toast";
import { OverviewTab } from "@/components/workspace/OverviewTab";
import { CargoTab } from "@/components/workspace/CargoTab";
import { PlaceholderTab } from "@/components/workspace/PlaceholderTab";
import { ArchiveScenarioModal } from "@/components/dialogs/ArchiveScenarioModal";
import { useScenarioWorkspace } from "@/hooks/useScenarioWorkspace";

interface ScenarioWorkspaceProps {
  projectId: string;
  scenarioId: string;
}

export const ScenarioWorkspace: React.FC<ScenarioWorkspaceProps> = ({
  projectId,
  scenarioId,
}) => {
  const {
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
  } = useScenarioWorkspace(projectId, scenarioId);

  const tabs = [
    { id: "overview", label: "Overview & Parameter", icon: "M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z", status: "Done" },
    { id: "cargo", label: "Analisis Cargo Flow", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.75 7.5h16.5m-16.5 0l1.125-3.375A1.125 1.125 0 015.44 3.375h13.12a1.125 1.125 0 011.065.75L20.25 7.5", status: "Done" },
    { id: "port", label: "Pelabuhan & Rute", icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582", status: "Soon" },
    { id: "fleet", label: "Armada Kapal", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25", status: "Soon" },
    { id: "sim", label: "Simulasi Jaringan", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", status: "Soon" },
    { id: "financial", label: "Finansial & Tarif", icon: "M12 6v12m-3-6h6", status: "Soon" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header healthStatus={healthStatus} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-400 transition">Daftar Proyek</Link>
          <span>/</span>
          <Link href={`/projects/${projectId}`} className="hover:text-cyan-400 transition">{project?.name || "Detail Proyek"}</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{scenario?.name || "Ruang Kerja Skenario"}</span>
        </div>

        {/* Top Header Banner */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-slate-100">{scenario?.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    scenario?.status === "ACTIVE" || scenario?.status === "DRAFT"
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {scenario?.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">{scenario?.description || "Tidak ada deskripsi tambahan."}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/projects/${projectId}`}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition"
              >
                &larr; Kembali ke Proyek
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-900 overflow-x-auto gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3.5 text-xs font-semibold flex items-center gap-2.5 border-b-2 whitespace-nowrap transition duration-150 ${
                  isActive
                    ? "border-cyan-400 text-cyan-400 bg-slate-900/50"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                    tab.status === "Done"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {tab.status}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex-1">Memuat ruang kerja skenario...</div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">{error}</div>
        ) : (
          <div className="flex-1 flex flex-col">
            {activeTab === "overview" && project && scenario && (
              <OverviewTab
                project={project}
                scenario={scenario}
                parentScenario={parentScenario}
                isEditing={isEditing}
                editName={editName}
                editDescription={editDescription}
                editBaseYear={editBaseYear}
                editPlanningHorizon={editPlanningHorizon}
                updating={updating}
                validationError={validationError}
                onStartEditing={() => setIsEditing(true)}
                onCancelEditing={() => setIsEditing(false)}
                setEditName={setEditName}
                setEditDescription={setEditDescription}
                setEditBaseYear={setEditBaseYear}
                setEditPlanningHorizon={setEditPlanningHorizon}
                onUpdateScenario={handleUpdateScenario}
                onOpenArchiveConfirm={() => setShowArchiveConfirm(true)}
              />
            )}

            {activeTab === "cargo" && (
              <CargoTab
                projectId={projectId}
                scenarioId={scenarioId}
                triggerToast={triggerToast}
              />
            )}

            {activeTab !== "overview" && activeTab !== "cargo" && (
              <PlaceholderTab
                label={tabs.find((t) => t.id === activeTab)?.label || "Modul"}
                onBackToOverview={() => setActiveTab("overview")}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
      <Toast message={toastMessage} />

      <ArchiveScenarioModal
        isOpen={showArchiveConfirm}
        scenarioName={scenario?.name || ""}
        updating={updating}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchiveScenario}
      />
    </div>
  );
};
