"use client";

import React, { useState, useEffect, useCallback } from "react";
import { candidateVesselService, CandidateVesselItem } from "@/services/candidateVessel.service";

interface Props {
  scenarioId: string;
  cargoFlowId: string;
  cargoFlowName?: string;
  onToast: (msg: string) => void;
}

export const ScenarioVesselSelectionWorkspace: React.FC<Props> = ({
  scenarioId,
  cargoFlowId,
  cargoFlowName,
  onToast,
}) => {
  const [candidates, setCandidates] = useState<CandidateVesselItem[]>([]);
  const [selectedVesselIds, setSelectedVesselIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"ALL" | "COMPATIBLE" | "INCOMPATIBLE">("ALL");

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await candidateVesselService.getCandidateVessels(cargoFlowId, scenarioId);
      setCandidates(res.candidates);

      const initialSelected = new Set<string>();
      res.candidates.forEach((item) => {
        if (item.is_selected_for_scenario) {
          initialSelected.add(item.vessel.id);
        }
      });
      setSelectedVesselIds(initialSelected);
    } catch (err: any) {
      onToast("Gagal memuat kandidat kapal: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }, [cargoFlowId, scenarioId, onToast]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const toggleVessel = (vesselId: string) => {
    setSelectedVesselIds((prev) => {
      const next = new Set(prev);
      if (next.has(vesselId)) {
        next.delete(vesselId);
      } else {
        next.add(vesselId);
      }
      return next;
    });
  };

  const handleSelectAllCompatible = () => {
    const next = new Set<string>();
    candidates.forEach((c) => {
      if (c.is_compatible) {
        next.add(c.vessel.id);
      }
    });
    setSelectedVesselIds(next);
  };

  const handleClearAll = () => {
    setSelectedVesselIds(new Set());
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await candidateVesselService.saveCandidateVessels(
        scenarioId,
        cargoFlowId,
        Array.from(selectedVesselIds)
      );
      onToast(`Berhasil menyimpan ${selectedVesselIds.size} kapal kandidat untuk skenario.`);
    } catch (err: any) {
      onToast("Gagal menyimpan kandidat kapal: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  const filteredCandidates = candidates.filter((item) => {
    if (activeTab === "COMPATIBLE") return item.is_compatible;
    if (activeTab === "INCOMPATIBLE") return !item.is_compatible;
    return true;
  });

  const compatibleCount = candidates.filter((c) => c.is_compatible).length;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[11px] font-mono border border-cyan-500/20">
                Phase 6.5 — Pemilihan Kapal Kandidat Manual
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100">
              Pilihan Armada Kapal Skenario {cargoFlowName ? `(${cargoFlowName})` : ""}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih kapal mana saja yang aktif dan diizinkan masuk ke dalam kalkulasi optimasi armada.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAllCompatible}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              Pilih Semua Kompatibel
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-semibold transition"
            >
              Hapus Semua Pilihan
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/10 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Kandidat Kapal"}
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === "ALL"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Semua Evaluasi ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab("COMPATIBLE")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === "COMPATIBLE"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ✓ Kompatibel ({compatibleCount})
          </button>
          <button
            onClick={() => setActiveTab("INCOMPATIBLE")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              activeTab === "INCOMPATIBLE"
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ✗ Tidak Kompatibel ({candidates.length - compatibleCount})
          </button>

          <div className="ml-auto text-xs text-slate-400 font-mono">
            Dipilih: <span className="font-bold text-cyan-400">{selectedVesselIds.size}</span> dari {candidates.length} Kapal
          </div>
        </div>
      </div>

      {/* Candidate Vessel List Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
            Mengevaluasi pipeline kompatibilitas 4-tahap...
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Tidak ada kapal yang memenuhi kategori filter ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">Pilih</th>
                  <th className="py-3.5 px-4">Nama Kapal</th>
                  <th className="py-3.5 px-4">Tipe</th>
                  <th className="py-3.5 px-4">Payload</th>
                  <th className="py-3.5 px-4">Kecepatan Desain</th>
                  <th className="py-3.5 px-4">Draft (d)</th>
                  <th className="py-3.5 px-4">LOA</th>
                  <th className="py-3.5 px-4">Charter Rate</th>
                  <th className="py-3.5 px-4">Status Kompatibilitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-sans">
                {filteredCandidates.map(({ vessel, is_compatible, rejection_reasons }) => {
                  const isChecked = selectedVesselIds.has(vessel.id);
                  return (
                    <tr
                      key={vessel.id}
                      className={`hover:bg-slate-800/30 transition ${
                        isChecked ? "bg-cyan-500/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleVessel(vessel.id)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-100">
                        {vessel.name}
                        {vessel.code && <span className="block text-[10px] text-slate-500 font-mono">{vessel.code}</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono border border-slate-700">
                          {vessel.ship_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-cyan-400 font-mono">
                        {vessel.capacity.toLocaleString("id-ID")} {vessel.capacity_unit}
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {vessel.service_speed_knots} Knots
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {vessel.draft} m
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        {vessel.loa} m
                      </td>
                      <td className="py-3 px-4 text-emerald-400 font-mono">
                        {vessel.charter_rate
                          ? `${vessel.charter_rate.toLocaleString("id-ID")} / ${vessel.charter_rate_basis}`
                          : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {is_compatible ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ Kompatibel
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 inline-block">
                              ✗ Tidak Kompatibel
                            </span>
                            {rejection_reasons.length > 0 && (
                              <p className="text-[10px] text-rose-300/80 leading-tight">
                                {rejection_reasons[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
