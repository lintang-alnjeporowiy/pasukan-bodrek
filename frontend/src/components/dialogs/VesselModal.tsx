import React, { useState, useEffect } from "react";
import { Vessel, VesselCreateInput } from "@/types/vessel";

interface VesselModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VesselCreateInput) => Promise<void>;
  vessel?: Vessel | null;
}

const SHIP_TYPES = [
  "CONTAINER_SHIP",
  "BULK_CARRIER",
  "TANKER",
  "GENERAL_CARGO",
  "TUG_BARGE",
  "RO_RO",
  "LNG_CARRIER",
];

export const VesselModal: React.FC<VesselModalProps> = ({ isOpen, onClose, onSave, vessel }) => {
  const [formData, setFormData] = useState<VesselCreateInput>({
    name: "", code: "", ship_type: "CONTAINER_SHIP", is_active: true, description: "",
    loa: 150.0, beam: 22.0, draft: 8.0, depth: 12.0, dwt: 15000.0, gt: 10000.0,
    capacity: 1000.0, capacity_unit: "TEU",
    service_speed_knots: 15.0, operating_speed_knots: 14.0,
    main_engine_power_kw: 5000.0, aux_engine_power_kw: 500.0,
    me_sfoc: 180.0, me_sea_load_factor: 0.85, me_port_load_factor: 0.10,
    ae_sfoc: 220.0, ae_sea_load_factor: 0.70, ae_port_load_factor: 0.50,
    charter_rate: 0.0, charter_rate_basis: "PER_DAY",
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sec1: true, sec2: true, sec3: true, sec4: false, sec5: false, sec6: false, sec7: false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vessel) {
      setFormData({
        name: vessel.name, code: vessel.code || "", ship_type: vessel.ship_type, is_active: vessel.is_active, description: vessel.description || "",
        loa: vessel.loa, beam: vessel.beam, draft: vessel.draft, depth: vessel.depth, dwt: vessel.dwt, gt: vessel.gt || undefined,
        capacity: vessel.capacity, capacity_unit: vessel.capacity_unit,
        service_speed_knots: vessel.service_speed_knots, operating_speed_knots: vessel.operating_speed_knots || 14.0,
        main_engine_power_kw: vessel.main_engine_power_kw || 5000.0, aux_engine_power_kw: vessel.aux_engine_power_kw || 500.0,
        me_sfoc: vessel.me_sfoc || 180.0, me_sea_load_factor: vessel.me_sea_load_factor || 0.85, me_port_load_factor: vessel.me_port_load_factor || 0.10,
        ae_sfoc: vessel.ae_sfoc || 220.0, ae_sea_load_factor: vessel.ae_sea_load_factor || 0.70, ae_port_load_factor: vessel.ae_port_load_factor || 0.50,
        charter_rate: vessel.charter_rate || 0.0, charter_rate_basis: vessel.charter_rate_basis || "PER_DAY",
      });
    } else {
      setFormData({
        name: "", code: "", ship_type: "CONTAINER_SHIP", is_active: true, description: "",
        loa: 150.0, beam: 22.0, draft: 8.0, depth: 12.0, dwt: 15000.0, gt: 10000.0,
        capacity: 1000.0, capacity_unit: "TEU",
        service_speed_knots: 15.0, operating_speed_knots: 14.0,
        main_engine_power_kw: 5000.0, aux_engine_power_kw: 500.0,
        me_sfoc: 180.0, me_sea_load_factor: 0.85, me_port_load_factor: 0.10,
        ae_sfoc: 220.0, ae_sea_load_factor: 0.70, ae_port_load_factor: 0.50,
        charter_rate: 0.0, charter_rate_basis: "PER_DAY",
      });
    }
    setError(null);
  }, [vessel, isOpen]);

  if (!isOpen) return null;

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("Nama kapal wajib diisi");
    try {
      setSaving(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data kapal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="text-cyan-400">🚢</span> {vessel ? "Edit Kapal Master" : "Tambah Kapal Baru"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm font-semibold">✕</button>
        </div>

        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-2 rounded-xl text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Section 1: General Information */}
          <Accordion title="1. General Information" isOpen={openSections.sec1} onToggle={() => toggleSection("sec1")}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-[11px] text-slate-400 block mb-1">Nama Kapal *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Kode Kapal</label>
                <input type="text" value={formData.code || ""} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tipe Kapal *</label>
                <select value={formData.ship_type} onChange={(e) => setFormData({ ...formData, ship_type: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100">
                  {SHIP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="rounded border-slate-800 text-cyan-500" />
                <label htmlFor="is_active" className="text-xs text-slate-300">Status Aktif</label>
              </div>
            </div>
          </Accordion>

          {/* Section 2: Principal Dimensions */}
          <Accordion title="2. Principal Dimensions" isOpen={openSections.sec2} onToggle={() => toggleSection("sec2")}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><label className="text-[11px] text-slate-400 block mb-1">LOA (m) *</label><input type="number" step="0.1" value={formData.loa} onChange={(e) => setFormData({ ...formData, loa: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">Beam (m) *</label><input type="number" step="0.1" value={formData.beam} onChange={(e) => setFormData({ ...formData, beam: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">Draft (m) *</label><input type="number" step="0.1" value={formData.draft} onChange={(e) => setFormData({ ...formData, draft: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">Depth (m) *</label><input type="number" step="0.1" value={formData.depth} onChange={(e) => setFormData({ ...formData, depth: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">DWT (Ton) *</label><input type="number" step="1" value={formData.dwt} onChange={(e) => setFormData({ ...formData, dwt: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">GT (Gross Tonnage)</label><input type="number" step="1" value={formData.gt || ""} onChange={(e) => setFormData({ ...formData, gt: parseFloat(e.target.value) || undefined })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100" /></div>
            </div>
          </Accordion>

          {/* Section 3: Cargo Characteristics */}
          <Accordion title="3. Cargo Characteristics" isOpen={openSections.sec3} onToggle={() => toggleSection("sec3")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-[11px] text-slate-400 block mb-1">Payload Capacity *</label><input type="number" step="1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">Payload Unit *</label><input type="text" value={formData.capacity_unit} onChange={(e) => setFormData({ ...formData, capacity_unit: e.target.value })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" /></div>
            </div>
          </Accordion>

          {/* Section 4: Operational Characteristics */}
          <Accordion title="4. Operational Characteristics" isOpen={openSections.sec4} onToggle={() => toggleSection("sec4")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-[11px] text-slate-400 block mb-1">Design Speed (Knots) *</label><input type="number" step="0.1" value={formData.service_speed_knots} onChange={(e) => setFormData({ ...formData, service_speed_knots: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">Default Operating Speed (Knots) *</label><input type="number" step="0.1" value={formData.operating_speed_knots} onChange={(e) => setFormData({ ...formData, operating_speed_knots: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" /></div>
            </div>
          </Accordion>

          {/* Section 5: Machinery */}
          <Accordion title="5. Machinery" isOpen={openSections.sec5} onToggle={() => toggleSection("sec5")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-[11px] text-slate-400 block mb-1">Main Engine Power (kW) *</label><input type="number" step="1" value={formData.main_engine_power_kw} onChange={(e) => setFormData({ ...formData, main_engine_power_kw: parseFloat(e.target.value) || 0 })} required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" /></div>
              <div><label className="text-[11px] text-slate-400 block mb-1">Auxiliary Engine Power (kW)</label><input type="number" step="1" value={formData.aux_engine_power_kw} onChange={(e) => setFormData({ ...formData, aux_engine_power_kw: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" /></div>
            </div>
          </Accordion>

          {/* Section 6: Fuel Characteristics */}
          <Accordion title="6. Fuel Characteristics" isOpen={openSections.sec6} onToggle={() => toggleSection("sec6")}>
            <div className="space-y-3">
              <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-[11px] font-bold text-cyan-400 block mb-2">Main Engine Fuel</span>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="text-[10px] text-slate-400 block mb-1">ME SFOC (g/kWh)</label><input type="number" step="0.1" value={formData.me_sfoc} onChange={(e) => setFormData({ ...formData, me_sfoc: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100" /></div>
                  <div><label className="text-[10px] text-slate-400 block mb-1">Sea Load Factor</label><input type="number" step="0.01" value={formData.me_sea_load_factor} onChange={(e) => setFormData({ ...formData, me_sea_load_factor: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100" /></div>
                  <div><label className="text-[10px] text-slate-400 block mb-1">Port Load Factor</label><input type="number" step="0.01" value={formData.me_port_load_factor} onChange={(e) => setFormData({ ...formData, me_port_load_factor: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100" /></div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-[11px] font-bold text-cyan-400 block mb-2">Auxiliary Engine Fuel</span>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="text-[10px] text-slate-400 block mb-1">AE SFOC (g/kWh)</label><input type="number" step="0.1" value={formData.ae_sfoc} onChange={(e) => setFormData({ ...formData, ae_sfoc: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100" /></div>
                  <div><label className="text-[10px] text-slate-400 block mb-1">Sea Load Factor</label><input type="number" step="0.01" value={formData.ae_sea_load_factor} onChange={(e) => setFormData({ ...formData, ae_sea_load_factor: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100" /></div>
                  <div><label className="text-[10px] text-slate-400 block mb-1">Port Load Factor</label><input type="number" step="0.01" value={formData.ae_port_load_factor} onChange={(e) => setFormData({ ...formData, ae_port_load_factor: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100" /></div>
                </div>
              </div>
            </div>
          </Accordion>

          {/* Section 7: Commercial Characteristics */}
          <Accordion title="7. Commercial Characteristics" isOpen={openSections.sec7} onToggle={() => toggleSection("sec7")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="text-[11px] text-slate-400 block mb-1">Charter Rate</label><input type="number" step="1" value={formData.charter_rate} onChange={(e) => setFormData({ ...formData, charter_rate: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100" /></div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Charter Rate Basis</label>
                <select value={formData.charter_rate_basis} onChange={(e) => setFormData({ ...formData, charter_rate_basis: e.target.value as any })} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100">
                  <option value="PER_DAY">PER_DAY</option>
                  <option value="PER_MONTH">PER_MONTH</option>
                  <option value="PER_YEAR">PER_YEAR</option>
                </select>
              </div>
            </div>
          </Accordion>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Batal</button>
            <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan Data Kapal"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Accordion: React.FC<{ title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, isOpen, onToggle, children }) => (
  <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
    <button type="button" onClick={onToggle} className="w-full px-4 py-2.5 flex justify-between items-center text-xs font-bold text-slate-200 hover:bg-slate-800/40 transition">
      <span>{title}</span>
      <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && <div className="p-3 border-t border-slate-800/60 bg-slate-950/40 space-y-2">{children}</div>}
  </div>
);
