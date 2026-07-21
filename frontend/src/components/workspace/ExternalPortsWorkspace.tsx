"use client";

import React from "react";
import Link from "next/link";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Toast } from "@/components/common/Toast";
import { ExternalPortModal } from "@/components/dialogs/ExternalPortModal";
import { useExternalPorts } from "@/hooks/useExternalPorts";

export const ExternalPortsWorkspace: React.FC = () => {
  const {
    ports,
    rawPorts,
    loading,
    error,
    toastMessage,
    searchQuery,
    filterActiveOnly,
    isModalOpen,
    editingPort,
    saving,
    modalError,
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
    setSearchQuery,
    setFilterActiveOnly,
    setIsModalOpen,
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
    openCreateModal,
    openEditModal,
    handleSave,
    handleDelete,
  } = useExternalPorts();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header healthStatus="connected" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-400 transition">Daftar Proyek</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">Pelabuhan Eksternal</span>
        </div>

        {/* Top Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">Master Pelabuhan Eksternal</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {rawPorts.length} Pelabuhan Reusable
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Pelabuhan referensi operasional asal dan tujuan cargo flow yang digunakan bersama di seluruh proyek perencanaan.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Tambah Pelabuhan Eksternal</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/20 p-4 rounded-2xl border border-slate-900">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama pelabuhan, negara, atau keterangan..."
            className="w-full sm:w-96 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              onClick={() => setFilterActiveOnly(!filterActiveOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                filterActiveOnly
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {filterActiveOnly ? "Hanya Aktif" : "Semua Status"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {/* Table List */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Memuat master pelabuhan eksternal...</div>
        ) : ports.length === 0 ? (
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-12 text-center space-y-3">
            <p className="text-sm text-slate-500">Belum ada pelabuhan eksternal yang cocok dengan pencarian.</p>
            <button onClick={openCreateModal} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">
              Tambah Pelabuhan Baru
            </button>
          </div>
        ) : (
          <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="p-4">Pelabuhan / Negara</th>
                  <th className="p-4">Koordinat</th>
                  <th className="p-4">Draft &amp; LOA</th>
                  <th className="p-4">Produktivitas</th>
                  <th className="p-4">Waktu Tambahan</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {ports.map((port) => (
                  <tr key={port.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-100 text-sm">{port.name}</div>
                      <div className="text-slate-400 text-[11px]">{port.country}</div>
                      {port.description && <div className="text-[10px] text-slate-500 truncate max-w-xs mt-0.5">{port.description}</div>}
                    </td>
                    <td className="p-4 font-mono text-cyan-400 text-[11px]">
                      {port.latitude}&deg;, {port.longitude}&deg;
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200">Draft: <strong className="text-cyan-300 font-mono">{port.max_draft}m</strong></div>
                      <div className="text-slate-400 text-[11px]">LOA: <strong className="text-slate-300 font-mono">{port.max_loa}m</strong></div>
                    </td>
                    <td className="p-4 font-mono text-slate-200">
                      {port.cargo_productivity} <span className="text-[10px] text-slate-500">{port.productivity_unit}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {port.additional_port_time} jam
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        port.is_active ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-slate-800 text-slate-500"
                      }`}>
                        {port.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(port)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(port.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-medium"
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
      </main>

      <Footer />
      <Toast message={toastMessage} />

      <ExternalPortModal
        isOpen={isModalOpen}
        editingPort={editingPort}
        saving={saving}
        error={modalError}
        name={name}
        country={country}
        latitude={latitude}
        longitude={longitude}
        maxDraft={maxDraft}
        maxLoa={maxLoa}
        cargoProductivity={cargoProductivity}
        productivityUnit={productivityUnit}
        additionalPortTime={additionalPortTime}
        description={description}
        isActive={isActive}
        onClose={() => setIsModalOpen(false)}
        setName={setName}
        setCountry={setCountry}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        setMaxDraft={setMaxDraft}
        setMaxLoa={setMaxLoa}
        setCargoProductivity={setCargoProductivity}
        setProductivityUnit={setProductivityUnit}
        setAdditionalPortTime={setAdditionalPortTime}
        setDescription={setDescription}
        setIsActive={setIsActive}
        onSubmit={handleSave}
      />
    </div>
  );
};
