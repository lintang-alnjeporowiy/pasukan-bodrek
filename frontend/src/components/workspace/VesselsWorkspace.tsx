"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Vessel, VesselCreateInput } from "@/types/vessel";
import { vesselService } from "@/services/vessel.service";
import { VesselModal } from "@/components/dialogs/VesselModal";
import { CommodityVesselCompatibilityWorkspace } from "@/components/workspace/CommodityVesselCompatibilityWorkspace";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Toast } from "@/components/common/Toast";

type WorkspaceTab = "VESSELS" | "COMPATIBILITY";

export const VesselsWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("VESSELS");
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchVessels = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vesselService.getVessels();
      setVessels(data);
    } catch (err: any) {
      setToastMessage("Gagal memuat data kapal: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVessels();
  }, [fetchVessels]);

  const handleOpenAdd = () => {
    setEditingVessel(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (vessel: Vessel) => {
    setEditingVessel(vessel);
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kapal "${name}"?`)) return;
    try {
      await vesselService.deleteVessel(id);
      setToastMessage(`Kapal "${name}" berhasil dihapus.`);
      fetchVessels();
    } catch (err: any) {
      setToastMessage("Gagal menghapus kapal: " + (err.message || ""));
    }
  };

  const handleSave = async (data: VesselCreateInput) => {
    if (editingVessel) {
      await vesselService.updateVessel(editingVessel.id, data);
      setToastMessage(`Kapal "${data.name}" berhasil diperbarui.`);
    } else {
      await vesselService.createVessel(data);
      setToastMessage(`Kapal "${data.name}" berhasil ditambahkan.`);
    }
    fetchVessels();
  };

  const filteredVessels = vessels.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.code && v.code.toLowerCase().includes(search.toLowerCase())) ||
      v.ship_type.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "ALL" || v.ship_type === typeFilter;
    return matchSearch && matchType;
  });

  const shipTypes = Array.from(new Set(vessels.map((v) => v.ship_type)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
                Phase 6 — Master Data Kapal &amp; Kompatibilitas
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Manajemen Armada Kapal &amp; Kompatibilitas</h1>
            <p className="text-xs text-slate-400 mt-1">
              Katalog kapal komersial dan pemetaan kelayakan teknis kapal mengangkut jenis komoditas.
            </p>
          </div>

          {activeTab === "VESSELS" && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-lg shadow-cyan-500/10"
            >
              <span>+</span> Tambah Kapal Baru
            </button>
          )}
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("VESSELS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "VESSELS"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            🚢 Katalog Master Kapal
          </button>
          <button
            onClick={() => setActiveTab("COMPATIBILITY")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "COMPATIBILITY"
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            📦 → 🚢 Kompatibilitas Komoditas – Kapal
          </button>
        </div>

        {activeTab === "COMPATIBILITY" ? (
          <CommodityVesselCompatibilityWorkspace onToast={(msg) => setToastMessage(msg)} />
        ) : (
          <>
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, kode, atau tipe kapal..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Semua Tipe Kapal</option>
                {shipTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
                  Memuat katalog armada kapal...
                </div>
              ) : filteredVessels.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-300">Belum ada kapal terdaftar.</p>
                  <p>Klik tombol "+ Tambah Kapal Baru" untuk mulai membuat master data kapal.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Nama / Kode Kapal</th>
                        <th className="py-3.5 px-4">Tipe</th>
                        <th className="py-3.5 px-4">Kapasitas</th>
                        <th className="py-3.5 px-4">Dimensi Utama (LOA × B × d)</th>
                        <th className="py-3.5 px-4">Kecepatan (Des/Op)</th>
                        <th className="py-3.5 px-4">Mesin Utama</th>
                        <th className="py-3.5 px-4">Charter Rate</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {filteredVessels.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-800/30 transition">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-100">{v.name}</div>
                            {v.code && <span className="text-[10px] text-slate-500 font-mono">{v.code}</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono border border-slate-700">
                              {v.ship_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-cyan-400">
                            {v.capacity.toLocaleString("id-ID")} {v.capacity_unit}
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                            {v.loa}m × {v.beam}m × {v.draft}m
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                            {v.service_speed_knots} / {v.operating_speed_knots || v.service_speed_knots} Knots
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                            {(v.main_engine_power_kw || 0).toLocaleString("id-ID")} kW
                          </td>
                          <td className="py-3 px-4 text-emerald-400 font-mono text-[11px]">
                            {v.charter_rate ? `${v.charter_rate.toLocaleString("id-ID")} / ${v.charter_rate_basis}` : "-"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                v.is_active
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-slate-800 text-slate-500"
                              }`}
                            >
                              {v.is_active ? "Aktif" : "Non-Aktif"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEdit(v)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(v.id, v.name)}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-medium transition border border-rose-500/20"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />

      <VesselModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        vessel={editingVessel}
      />

      <Toast message={toastMessage} />
    </div>
  );
};
