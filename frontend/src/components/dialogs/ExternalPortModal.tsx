import React from "react";
import { ExternalPort } from "@/types/externalPort";

interface ExternalPortModalProps {
  isOpen: boolean;
  editingPort: ExternalPort | null;
  saving: boolean;
  error: string | null;
  name: string;
  country: string;
  latitude: string;
  longitude: string;
  maxDraft: string;
  maxLoa: string;
  cargoProductivity: string;
  productivityUnit: string;
  additionalPortTime: string;
  description: string;
  isActive: boolean;
  onClose: () => void;
  setName: (v: string) => void;
  setCountry: (v: string) => void;
  setLatitude: (v: string) => void;
  setLongitude: (v: string) => void;
  setMaxDraft: (v: string) => void;
  setMaxLoa: (v: string) => void;
  setCargoProductivity: (v: string) => void;
  setProductivityUnit: (v: string) => void;
  setAdditionalPortTime: (v: string) => void;
  setDescription: (v: string) => void;
  setIsActive: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ExternalPortModal: React.FC<ExternalPortModalProps> = ({
  isOpen,
  editingPort,
  saving,
  error,
  name,
  country,
  latitude,
  longitude,
  maxDraft,
  maxLoa,
  cargoProductivity,
  productivityUnit,
  additionalPortTime,
  description,
  isActive,
  onClose,
  setName,
  setCountry,
  setLatitude,
  setLongitude,
  setMaxDraft,
  setMaxLoa,
  setCargoProductivity,
  setProductivityUnit,
  setAdditionalPortTime,
  setDescription,
  setIsActive,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {editingPort ? "Edit Pelabuhan Eksternal" : "Tambah Pelabuhan Eksternal"}
            </h3>
            <p className="text-xs text-slate-400">
              Pelabuhan asal atau tujuan untuk operasi transportasi laut.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Section 1: Informasi Pelabuhan */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">1. Informasi Umum</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Pelabuhan *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="misal: Pelabuhan Singapore"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Negara / Lokasi *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="misal: Singapore / China"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Latitude (-90 s/d 90) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Longitude (-180 s/d 180) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Batasan Fisik & Produktivitas */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">2. Batasan Fisik & Operasional</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Max Draft (meter) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  min="0.1"
                  value={maxDraft}
                  onChange={(e) => setMaxDraft(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Max LOA (meter) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  min="1"
                  value={maxLoa}
                  onChange={(e) => setMaxLoa(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Produktivitas Bongkar *</label>
                <input
                  type="number"
                  step="any"
                  required
                  min="0"
                  value={cargoProductivity}
                  onChange={(e) => setCargoProductivity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Satuan Produktivitas *</label>
                <input
                  type="text"
                  required
                  value={productivityUnit}
                  onChange={(e) => setProductivityUnit(e.target.value)}
                  placeholder="ton/hour, TEU/hour"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Waktu Tambahan (jam) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  min="0"
                  value={additionalPortTime}
                  onChange={(e) => setAdditionalPortTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Keterangan / Deskripsi</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Catatan spesifik fasilitas atau hambatan pelabuhan eksternal"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active_check"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-800 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="is_active_check" className="text-xs font-medium text-slate-300">
                Aktif (Dapat dipilih pada Cargo Flow dan Rute Pelayaran)
              </label>
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
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition flex items-center gap-2"
            >
              {saving && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
              <span>{editingPort ? "Simpan Perubahan" : "Tambah Pelabuhan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
