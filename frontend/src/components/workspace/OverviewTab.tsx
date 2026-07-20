import React from "react";
import { Project } from "@/types/project";
import { Scenario } from "@/types/scenario";

interface OverviewTabProps {
  project: Project;
  scenario: Scenario;
  parentScenario: Scenario | null;
  isEditing: boolean;
  editName: string;
  editDescription: string;
  editBaseYear: number;
  editPlanningHorizon: number;
  updating: boolean;
  validationError: string | null;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  setEditName: (v: string) => void;
  setEditDescription: (v: string) => void;
  setEditBaseYear: (v: number) => void;
  setEditPlanningHorizon: (v: number) => void;
  onUpdateScenario: (e: React.FormEvent) => void;
  onOpenArchiveConfirm: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  project,
  scenario,
  parentScenario,
  isEditing,
  editName,
  editDescription,
  editBaseYear,
  editPlanningHorizon,
  updating,
  validationError,
  onStartEditing,
  onCancelEditing,
  setEditName,
  setEditDescription,
  setEditBaseYear,
  setEditPlanningHorizon,
  onUpdateScenario,
  onOpenArchiveConfirm,
}) => {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Parameters Overview Card */}
      <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-900">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Parameter Dasar Skenario</h3>
            <p className="text-xs text-slate-400">Konfigurasi dasar dan batasan waktu analisis perencanaan.</p>
          </div>
          {!isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={onStartEditing}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Edit Parameter
              </button>
              {scenario.status !== "ARCHIVED" && (
                <button
                  onClick={onOpenArchiveConfirm}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition"
                >
                  Arsipkan
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={onUpdateScenario} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nama Skenario *</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Deskripsi</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tahun Dasar (Base Year)</label>
                <input
                  type="number"
                  value={editBaseYear}
                  onChange={(e) => setEditBaseYear(parseInt(e.target.value) || 2026)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Horizon Perencanaan (Tahun)</label>
                <input
                  type="number"
                  value={editPlanningHorizon}
                  onChange={(e) => setEditPlanningHorizon(parseInt(e.target.value) || 20)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {validationError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancelEditing}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition flex items-center gap-2"
              >
                {updating && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1">Tahun Dasar (Base Year)</span>
              <span className="text-xl font-black text-cyan-400 font-mono">
                {scenario.base_year || project.base_year}
              </span>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1">Horizon Perencanaan</span>
              <span className="text-xl font-black text-slate-100 font-mono">
                {scenario.planning_horizon || project.planning_horizon} <span className="text-xs font-normal text-slate-400">Tahun</span>
              </span>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1">Tahun Akhir Analisis</span>
              <span className="text-xl font-black text-slate-100 font-mono">
                {(scenario.base_year || project.base_year) + (scenario.planning_horizon || project.planning_horizon) - 1}
              </span>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block mb-1">Status Skenario</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {scenario.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Description & Hierarchy Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs">Deskripsi &amp; Hipotesis</h4>
          <p className="text-sm text-slate-400 leading-relaxed">
            {scenario.description || "Tidak ada deskripsi spesifik untuk skenario ini."}
          </p>
        </div>

        <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider text-xs">Hirarki Skenario Parent</h4>
          {parentScenario ? (
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 block">Diturunkan dari:</span>
              <span className="text-sm font-bold text-cyan-400">{parentScenario.name}</span>
              <span className="text-[11px] text-slate-500 block">Status Parent: {parentScenario.status}</span>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Skenario ini merupakan skenario dasar (Base Scenario) tanpa skenario parent.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
