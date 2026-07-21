import React, { useState } from "react";
import { StudyPort, StudyPortUpdate } from "@/types/studyPort";
import { studyPortService } from "@/services/studyPort.service";

interface StudyPortCardProps {
  projectId: string;
  studyPort: StudyPort | null;
  onUpdated?: (updatedPort: StudyPort) => void;
}

export const StudyPortCard: React.FC<StudyPortCardProps> = ({ projectId, studyPort, onUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(studyPort?.name || "");
  const [code, setCode] = useState(studyPort?.code || "");
  const [location, setLocation] = useState(studyPort?.location || "");
  const [latitude, setLatitude] = useState(studyPort?.latitude?.toString() || "0");
  const [longitude, setLongitude] = useState(studyPort?.longitude?.toString() || "0");
  const [description, setDescription] = useState(studyPort?.description || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: StudyPortUpdate = {
        name,
        code: code || undefined,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description || undefined,
      };
      const updated = await studyPortService.updateStudyPort(projectId, payload);
      if (onUpdated) onUpdated(updated);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui Study Port");
    } finally {
      setSaving(false);
    }
  };

  if (!studyPort && !isEditing) {
    return (
      <div className="bg-slate-900/40 border border-amber-500/20 rounded-3xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
              ⚓
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">Study Port Belum Dikonfigurasi</h4>
              <p className="text-xs text-slate-400">Setiap proyek wajib memiliki 1 Study Port utama.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-lg">
            ⚓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Primary Study Port
              </span>
              {studyPort?.code && (
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  {studyPort.code}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-100">{studyPort?.name}</h3>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
        >
          {isEditing ? "Batal" : "Edit Details"}
        </button>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Lokasi Pelabuhan</span>
            <p className="text-sm font-semibold text-slate-200">{studyPort?.location}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Koordinat (Lat / Long)</span>
            <p className="text-sm font-mono text-cyan-400 font-semibold">
              {studyPort?.latitude}&deg;, {studyPort?.longitude}&deg;
            </p>
          </div>
          <div className="space-y-1 md:col-span-1">
            <span className="text-xs text-slate-400">Keterangan / Fungsi</span>
            <p className="text-xs text-slate-300 italic">{studyPort?.description || "Tidak ada deskripsi"}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nama Pelabuhan *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Kode Pelabuhan (Opsional)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Lokasi *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Latitude (-90 s/d 90) *</label>
              <input
                type="number"
                step="any"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Longitude (-180 s/d 180) *</label>
              <input
                type="number"
                step="any"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Deskripsi</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 resize-none"
            />
          </div>

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
