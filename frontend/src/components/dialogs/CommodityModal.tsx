import React from "react";
import { Commodity } from "@/types/cargo";

interface CommodityModalProps {
  isOpen: boolean;
  editingCommodity: Commodity | null;
  name: string;
  code: string;
  unit: string;
  description: string;
  isActive: boolean;
  error: string | null;
  saving: boolean;
  onClose: () => void;
  setName: (v: string) => void;
  setCode: (v: string) => void;
  setUnit: (v: string) => void;
  setDescription: (v: string) => void;
  setIsActive: (v: boolean) => void;
  onSave: (e: React.FormEvent) => void;
}

export const CommodityModal: React.FC<CommodityModalProps> = ({
  isOpen,
  editingCommodity,
  name,
  code,
  unit,
  description,
  isActive,
  error,
  saving,
  onClose,
  setName,
  setCode,
  setUnit,
  setDescription,
  setIsActive,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">
            {editingCommodity ? "Edit Komoditas" : "Tambah Komoditas Baru"}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nama Komoditas *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="misal: Crude Palm Oil (CPO)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Kode Komoditas</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="misal: CPO-01"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Satuan Dasar *</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="misal: Ton, TEU, m3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Deskripsi</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Catatan tambahan mengenai komoditas ini"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="commActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded border-slate-800 bg-slate-950"
            />
            <label htmlFor="commActiveCheck" className="text-xs text-slate-300 font-medium">
              Status Aktif (Tersedia untuk Alur Kargo)
            </label>
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
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition flex items-center gap-2"
            >
              {saving && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
              <span>{editingCommodity ? "Simpan Perubahan" : "Buat Komoditas"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
