"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Vessel } from "@/types/vessel";
import { Commodity } from "@/types/cargo";
import { vesselService } from "@/services/vessel.service";
import { cargoService } from "@/services/cargo.service";
import { vesselCompatibilityService } from "@/services/vesselCompatibility.service";

interface Props {
  onToast: (msg: string) => void;
}

export const CommodityVesselCompatibilityWorkspace: React.FC<Props> = ({ onToast }) => {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>("");
  const [compatibleVesselIds, setCompatibleVesselIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchVessel, setSearchVessel] = useState("");

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [comms, vss] = await Promise.all([
        cargoService.getCommodities(),
        vesselService.getVessels(),
      ]);
      setCommodities(comms);
      setVessels(vss);
      if (comms.length > 0) {
        setSelectedCommodityId(comms[0].id);
      }
    } catch (err: any) {
      onToast("Gagal memuat data komoditas/kapal: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const loadCompatibility = useCallback(async (commId: string) => {
    if (!commId) return;
    try {
      const compatibilities = await vesselCompatibilityService.getCompatibilities(commId);
      const vIds = new Set(compatibilities.map((c) => c.vessel_id));
      setCompatibleVesselIds(vIds);
    } catch (err: any) {
      onToast("Gagal memuat kompatibilitas komoditas: " + (err.message || ""));
    }
  }, [onToast]);

  useEffect(() => {
    if (selectedCommodityId) {
      loadCompatibility(selectedCommodityId);
    }
  }, [selectedCommodityId, loadCompatibility]);

  const toggleVessel = (vesselId: string) => {
    setCompatibleVesselIds((prev) => {
      const next = new Set(prev);
      if (next.has(vesselId)) {
        next.delete(vesselId);
      } else {
        next.add(vesselId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedCommodityId) return;
    try {
      setSaving(true);
      await vesselCompatibilityService.batchSetVesselsForCommodity(
        selectedCommodityId,
        Array.from(compatibleVesselIds)
      );
      const selectedComm = commodities.find((c) => c.id === selectedCommodityId);
      onToast(`Berhasil menyimpan ${compatibleVesselIds.size} kapal kompatibel untuk ${selectedComm?.name || "komoditas"}.`);
    } catch (err: any) {
      onToast("Gagal menyimpan kompatibilitas: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const selectedCommodity = commodities.find((c) => c.id === selectedCommodityId);

  const filteredVessels = vessels.filter(
    (v) =>
      v.name.toLowerCase().includes(searchVessel.toLowerCase()) ||
      v.ship_type.toLowerCase().includes(searchVessel.toLowerCase()) ||
      (v.code && v.code.toLowerCase().includes(searchVessel.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Selection Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span className="text-cyan-400">📦 → 🚢</span> Pilih Komoditas
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tentukan kapal kandidat mana saja secara teknis yang dapat mengangkut komoditas berikut.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedCommodityId}
              onChange={(e) => setSelectedCommodityId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-cyan-500 min-w-[220px]"
            >
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.unit})
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              disabled={saving || !selectedCommodityId}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition disabled:opacity-50 shadow-lg shadow-cyan-500/10"
            >
              {saving ? "Menyimpan..." : "Simpan Kompatibilitas"}
            </button>
          </div>
        </div>

        {selectedCommodity && (
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Komoditas Terpilih:</span>
              <span className="font-bold text-cyan-400 text-sm">{selectedCommodity.name}</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[11px] font-mono border border-slate-700">
                Satuan: {selectedCommodity.unit}
              </span>
            </div>
            <div className="text-slate-300 font-mono">
              Kompatibel: <span className="font-bold text-emerald-400">{compatibleVesselIds.size}</span> dari {vessels.length} Kapal
            </div>
          </div>
        )}
      </div>

      {/* Hierarchy Visual: Commodity ↓ Compatible Vessels */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>Daftar Kapal Teknis Kandidat</span>
            <span className="text-slate-600">({filteredVessels.length} Kapal)</span>
          </h3>

          <input
            type="text"
            value={searchVessel}
            onChange={(e) => setSearchVessel(e.target.value)}
            placeholder="Cari kapal..."
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
          />
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Memuat daftar kompatibilitas kapal...
          </div>
        ) : filteredVessels.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            Tidak ada kapal yang cocok dengan pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredVessels.map((v) => {
              const isCompatible = compatibleVesselIds.has(v.id);
              return (
                <div
                  key={v.id}
                  onClick={() => toggleVessel(v.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    isCompatible
                      ? "bg-slate-900/90 border-cyan-500/50 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/5"
                      : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        {v.name}
                      </h4>
                      {v.code && <span className="text-[10px] text-slate-500 font-mono">{v.code}</span>}
                    </div>

                    <input
                      type="checkbox"
                      checked={isCompatible}
                      onChange={() => {}} // handled by parent onClick
                      className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-slate-800/60 pt-2 text-slate-400">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tipe:</span>
                      <span className="text-slate-200 font-sans font-semibold">{v.ship_type}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Payload:</span>
                      <span className="text-cyan-400 font-bold">{v.capacity.toLocaleString("id-ID")} {v.capacity_unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Dimensi (LOA × B × d):</span>
                      <span className="text-slate-300">{v.loa}m × {v.beam}m × {v.draft}m</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">DWT:</span>
                      <span className="text-slate-300">{v.dwt.toLocaleString("id-ID")} Ton</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCompatible
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {isCompatible ? "✓ Kompatibel" : "Tidak Kompatibel"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {v.service_speed_knots} Knots
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
