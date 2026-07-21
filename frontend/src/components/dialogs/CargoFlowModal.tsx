import React from "react";
import { CargoFlow, Tenant, Commodity } from "@/types/cargo";
import { Route } from "@/types/route";

interface CargoFlowModalProps {
  isOpen: boolean;
  editingFlow: CargoFlow | null;
  direction: string;
  tenantId: string;
  commodityId: string;
  routeId?: string;
  origin: string;
  destination: string;
  demand: string;
  unit: string;
  startYear: string;
  growthRate: string;
  maxDemand: string;
  isActive: boolean;
  error: string | null;
  saving: boolean;
  tenants: Tenant[];
  commodities: Commodity[];
  routes: Route[];
  onClose: () => void;
  setTenantId: (v: string) => void;
  setCommodityId: (v: string) => void;
  setRouteId: (v: string) => void;
  setOrigin: (v: string) => void;
  setDestination: (v: string) => void;
  setDemand: (v: string) => void;
  setUnit: (v: string) => void;
  setStartYear: (v: string) => void;
  setGrowthRate: (v: string) => void;
  setMaxDemand: (v: string) => void;
  setIsActive: (v: boolean) => void;
  onSave: (e: React.FormEvent) => void;
}

export const CargoFlowModal: React.FC<CargoFlowModalProps> = ({
  isOpen,
  editingFlow,
  direction,
  tenantId,
  commodityId,
  routeId = "",
  origin,
  destination,
  demand,
  unit,
  startYear,
  growthRate,
  maxDemand,
  isActive,
  error,
  saving,
  tenants,
  commodities,
  routes = [],
  onClose,
  setTenantId,
  setCommodityId,
  setRouteId,
  setOrigin,
  setDestination,
  setDemand,
  setUnit,
  setStartYear,
  setGrowthRate,
  setMaxDemand,
  setIsActive,
  onSave,
}) => {
  if (!isOpen) return null;

  const isOutbound = direction === "OUTBOUND";
  const availableRoutes = routes.filter((r) => r.is_active && r.direction.toUpperCase() === direction.toUpperCase());

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {editingFlow
                ? `Edit ${isOutbound ? "Outbound" : "Inbound"} Cargo Flow`
                : `Tambah ${isOutbound ? "Outbound" : "Inbound"} Cargo Flow Baru`}
            </h3>
            <span className="text-xs text-slate-500">Arah Alur: {direction}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tenant Pelabuhan *</label>
              <select
                required
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Pilih Tenant --</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Komoditas *</label>
              <select
                required
                value={commodityId}
                onChange={(e) => {
                  setCommodityId(e.target.value);
                  const selectedComm = commodities.find((c) => c.id === e.target.value);
                  if (selectedComm) setUnit(selectedComm.unit);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Pilih Komoditas --</option>
                {commodities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.unit})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Rute Pelayaran (Assign Route)
            </label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Tanpa Rute / Pilih Nanti --</option>
              {availableRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.distance_nm} NM - {r.external_port_name || "External Port"})
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Menampilkan rute aktif dengan arah {direction}.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Asal (Origin) *</label>
              <input
                type="text"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder={isOutbound ? "misal: Terminal Pelabuhan A" : "misal: Pabrik/Kebun asal"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tujuan (Destination) *</label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={isOutbound ? "misal: Pelabuhan Singapura" : "misal: Dermaga Curah Kering"}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Base Demand Tahunan *</label>
              <input
                type="number"
                step="any"
                required
                value={demand}
                onChange={(e) => setDemand(e.target.value)}
                placeholder="misal: 100000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Satuan (Unit) *</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="misal: Ton"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Start Year</label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Growth Rate (%)</label>
              <input
                type="number"
                step="any"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Max Demand (Cap)</label>
              <input
                type="number"
                step="any"
                value={maxDemand}
                onChange={(e) => setMaxDemand(e.target.value)}
                placeholder="Opsional"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="flowActiveCheck"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded border-slate-800 bg-slate-950"
            />
            <label htmlFor="flowActiveCheck" className="text-xs text-slate-300 font-medium">
              Alur Kargo Aktif
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
              <span>{editingFlow ? "Simpan Perubahan" : "Buat Cargo Flow"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
