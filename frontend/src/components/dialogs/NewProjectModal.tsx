import React from "react";

interface NewProjectModalProps {
  isOpen: boolean;
  name: string;
  description: string;
  baseYear: number;
  planningHorizon: number;
  creating: boolean;
  error: string | null;
  onClose: () => void;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setBaseYear: (v: number) => void;
  setPlanningHorizon: (v: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  name,
  description,
  baseYear,
  planningHorizon,
  creating,
  error,
  onClose,
  setName,
  setDescription,
  setBaseYear,
  setPlanningHorizon,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">Buat Proyek Perencanaan Baru</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nama Proyek *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="misal: Pengembangan Terminal Batam 2026"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Deskripsi Proyek</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan ruang lingkup dan tujuan analisis perencanaan pelabuhan ini"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tahun Dasar (Base Year) *</label>
              <input
                type="number"
                required
                min={2000}
                max={2100}
                value={baseYear}
                onChange={(e) => setBaseYear(parseInt(e.target.value) || 2026)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Horizon Perencanaan (Tahun) *</label>
              <input
                type="number"
                required
                min={1}
                max={50}
                value={planningHorizon}
                onChange={(e) => setPlanningHorizon(parseInt(e.target.value) || 20)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition flex items-center gap-2"
            >
              {creating && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
              <span>Buat Proyek</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
