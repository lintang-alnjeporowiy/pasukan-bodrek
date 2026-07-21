import React from "react";
import { StudyPort } from "@/types/studyPort";

interface NewProjectModalProps {
  isOpen: boolean;
  name: string;
  description: string;
  baseYear: number;
  planningHorizon: number;
  portMode: "new" | "copy";
  portName: string;
  portCode: string;
  portLocation: string;
  portLat: string;
  portLong: string;
  portDesc: string;
  copySourceProjectId: string;
  samplePorts: StudyPort[];
  creating: boolean;
  error: string | null;
  onClose: () => void;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setBaseYear: (v: number) => void;
  setPlanningHorizon: (v: number) => void;
  setPortMode: (v: "new" | "copy") => void;
  setPortName: (v: string) => void;
  setPortCode: (v: string) => void;
  setPortLocation: (v: string) => void;
  setPortLat: (v: string) => void;
  setPortLong: (v: string) => void;
  setPortDesc: (v: string) => void;
  setCopySourceProjectId: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  name,
  description,
  baseYear,
  planningHorizon,
  portMode,
  portName,
  portCode,
  portLocation,
  portLat,
  portLong,
  portDesc,
  copySourceProjectId,
  samplePorts,
  creating,
  error,
  onClose,
  setName,
  setDescription,
  setBaseYear,
  setPlanningHorizon,
  setPortMode,
  setPortName,
  setPortCode,
  setPortLocation,
  setPortLat,
  setPortLong,
  setPortDesc,
  setCopySourceProjectId,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Buat Proyek Perencanaan & Study Port Baru</h3>
            <p className="text-xs text-slate-400">Setiap proyek harus memiliki tepat satu Study Port utama.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-sm font-semibold">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Project Details */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">1. Parameter Proyek</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nama Proyek *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="misal: Pengembangan Terminal Tanjung Priok"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Deskripsi Proyek</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ruang lingkup studi pelabuhan"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tahun Dasar (Base Year) *</label>
                <input
                  type="number"
                  required
                  min={2000}
                  max={2100}
                  value={baseYear}
                  onChange={(e) => setBaseYear(parseInt(e.target.value) || 2026)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Horizon Perencanaan (Tahun) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={50}
                  value={planningHorizon}
                  onChange={(e) => setPlanningHorizon(parseInt(e.target.value) || 20)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Study Port Selection Mode */}
          <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">2. Konfigurasi Study Port Utama</h4>
              <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setPortMode("new")}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${portMode === "new" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Buat Port Baru
                </button>
                <button
                  type="button"
                  onClick={() => setPortMode("copy")}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition ${portMode === "copy" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Salin dari Proyek Lain
                </button>
              </div>
            </div>

            {portMode === "new" ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Nama Pelabuhan *</label>
                    <input
                      type="text"
                      required
                      value={portName}
                      onChange={(e) => setPortName(e.target.value)}
                      placeholder="misal: Pelabuhan Utama Tanjung Priok"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Kode Pelabuhan (Opsional)</label>
                    <input
                      type="text"
                      value={portCode}
                      onChange={(e) => setPortCode(e.target.value)}
                      placeholder="misal: IDTPP"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Lokasi Pelabuhan *</label>
                  <input
                    type="text"
                    required
                    value={portLocation}
                    onChange={(e) => setPortLocation(e.target.value)}
                    placeholder="misal: Tanjung Priok, Jakarta Utara"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Latitude (-90 s/d 90) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={portLat}
                      onChange={(e) => setPortLat(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Longitude (-180 s/d 180) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={portLong}
                      onChange={(e) => setPortLong(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-medium text-slate-400">Pilih Study Port dari Proyek Sampel</label>
                {samplePorts.length > 0 ? (
                  <select
                    value={copySourceProjectId}
                    onChange={(e) => setCopySourceProjectId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {samplePorts.map((sp) => (
                      <option key={sp.id} value={sp.project_id}>
                        {sp.name} ({sp.location}) - Lat: {sp.latitude}, Long: {sp.longitude}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-500 italic">Belum ada proyek sampel yang memiliki Study Port.</p>
                )}
              </div>
            )}
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
              <span>Buat Proyek & Study Port</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
