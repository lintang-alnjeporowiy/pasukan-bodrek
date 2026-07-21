'use client';

import React, { useState, useEffect } from "react";
import { Route, RouteCreate, RouteDirection } from "@/types/route";
import { ExternalPort } from "@/types/externalPort";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RouteCreate) => Promise<void>;
  initialData?: Route | null;
  externalPorts: ExternalPort[];
  studyPortName?: string;
}

export const RouteModal: React.FC<RouteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  externalPorts,
  studyPortName = "Study Port",
}) => {
  const [name, setName] = useState("");
  const [direction, setDirection] = useState<RouteDirection>("INBOUND");
  const [externalPortId, setExternalPortId] = useState("");
  const [distanceNm, setDistanceNm] = useState<number | "">(100);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDirection(initialData.direction);
      setExternalPortId(initialData.external_port_id);
      setDistanceNm(initialData.distance_nm);
      setDescription(initialData.description || "");
      setIsActive(initialData.is_active);
    } else {
      setName("");
      setDirection("INBOUND");
      setExternalPortId(externalPorts[0]?.id || "");
      setDistanceNm(100);
      setDescription("");
      setIsActive(true);
    }
    setError(null);
  }, [initialData, isOpen, externalPorts]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Nama rute wajib diisi.");
    if (!externalPortId) return setError("External Port wajib dipilih.");
    if (typeof distanceNm !== "number" || distanceNm <= 0) return setError("Jarak pelayaran harus lebih besar dari 0 NM.");

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        direction,
        external_port_id: externalPortId,
        distance_nm: Number(distanceNm),
        description: description.trim() || undefined,
        is_active: isActive,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan rute.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedExtPort = externalPorts.find((p) => p.id === externalPortId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <h3 className="text-lg font-semibold text-slate-100">
            {initialData ? "Edit Rute Pelayaran" : "Tambah Rute Pelayaran"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-xl font-bold">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 text-xs bg-red-950/80 border border-red-800 text-red-300 rounded-md">{error}</div>}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Arah Rute (Direction) *</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as RouteDirection)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="INBOUND">INBOUND (External Port → Study Port)</option>
              <option value="OUTBOUND">OUTBOUND (Study Port → External Port)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">External Port *</label>
            <select
              value={externalPortId}
              onChange={(e) => setExternalPortId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="" disabled>-- Pilih External Port --</option>
              {externalPorts.map((port) => (
                <option key={port.id} value={port.id}>
                  {port.name} ({port.country})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400">
            <span className="text-slate-300 font-semibold">Skema Rute:</span>{" "}
            {direction === "INBOUND" ? (
              <span><strong className="text-cyan-400">{selectedExtPort?.name || "External Port"}</strong> → <strong className="text-emerald-400">{studyPortName}</strong></span>
            ) : (
              <span><strong className="text-emerald-400">{studyPortName}</strong> → <strong className="text-cyan-400">{selectedExtPort?.name || "External Port"}</strong></span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Nama Rute *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contoh: SG-Gresik Inbound"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Jarak Pelayaran (NM) *</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={distanceNm}
              onChange={(e) => setDistanceNm(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Deskripsi / Catatan</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="routeIsActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
            />
            <label htmlFor="routeIsActive" className="text-xs text-slate-300 cursor-pointer">Status Aktif</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200">Batal</button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Rute"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
