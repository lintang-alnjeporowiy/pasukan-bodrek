import React from "react";
import { CargoConversionRule, Commodity } from "@/types/cargo";

interface ConversionRuleModalProps {
  isOpen: boolean;
  editingRule: CargoConversionRule | null;
  commodityId: string;
  sourceUnit: string;
  targetUnit: string;
  conversionFactor: string;
  description: string;
  isActive: boolean;
  error: string | null;
  saving: boolean;
  commodities: Commodity[];
  onClose: () => void;
  setCommodityId: (v: string) => void;
  setSourceUnit: (v: string) => void;
  setTargetUnit: (v: string) => void;
  setConversionFactor: (v: string) => void;
  setDescription: (v: string) => void;
  setIsActive: (v: boolean) => void;
  onSave: (e: React.FormEvent) => void;
}

export const ConversionRuleModal: React.FC<ConversionRuleModalProps> = ({
  isOpen,
  editingRule,
  commodityId,
  sourceUnit,
  targetUnit,
  conversionFactor,
  description,
  isActive,
  error,
  saving,
  commodities,
  onClose,
  setCommodityId,
  setSourceUnit,
  setTargetUnit,
  setConversionFactor,
  setDescription,
  setIsActive,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">
            {editingRule ? "Edit Cargo Conversion Rule" : "Tambah Cargo Conversion Rule"}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-semibold transition">
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Komoditas / Scope Rule</label>
            <select
              value={commodityId}
              onChange={(e) => setCommodityId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">Global Rule (Berlaku Semua Komoditas)</option>
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Rule spesifik komoditas akan diprioritaskan melebihi Rule Global.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Satuan Asal (Source Unit) *</label>
              <input
                type="text"
                required
                value={sourceUnit}
                onChange={(e) => setSourceUnit(e.target.value)}
                placeholder="misal: Ton"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Satuan Tujuan (Target Unit) *</label>
              <input
                type="text"
                required
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                placeholder="misal: TEU"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Faktor Konversi (Conversion Factor) *</label>
            <input
              type="number"
              step="any"
              required
              value={conversionFactor}
              onChange={(e) => setConversionFactor(e.target.value)}
              placeholder="misal: 0.55"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Rumus konversi: Nilai Target = Nilai Asal &times; Faktor Konversi.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Keterangan / Deskripsi</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="misal: 1 ton gandum menghasilkan 0.55 TEU kontainer standar"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ruleActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded border-slate-800 bg-slate-950"
            />
            <label htmlFor="ruleActiveCheck" className="text-xs text-slate-300 font-medium">
              Rule Aktif (Dapat Digunakan Mesin Konversi)
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
              <span>{editingRule ? "Simpan Perubahan" : "Buat Rule"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
