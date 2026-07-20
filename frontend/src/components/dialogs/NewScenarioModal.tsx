import React from "react";
import { Scenario } from "@/types/scenario";

interface NewScenarioModalProps {
  isOpen: boolean;
  name: string;
  description: string;
  parentScenarioId: string;
  creating: boolean;
  error: string | null;
  scenarios: Scenario[];
  onClose: () => void;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setParentScenarioId: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NewScenarioModal: React.FC<NewScenarioModalProps> = ({
  isOpen,
  name,
  description,
  parentScenarioId,
  creating,
  error,
  scenarios,
  onClose,
  setName,
  setDescription,
  setParentScenarioId,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">Buat Skenario Analisis Baru</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nama Skenario *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="misal: Skenario Pertumbuhan Optimis 2026-2045"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Turunan dari Skenario Parent (Opsional)</label>
            <select
              value={parentScenarioId}
              onChange={(e) => setParentScenarioId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Skenario Dasar (Tanpa Parent) --</option>
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Deskripsi &amp; Hipotesis</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Misal: Mengasumsikan peningkatan pertumbuhan komoditas CPO sebesar +8% per tahun"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
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
              <span>Buat Skenario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
