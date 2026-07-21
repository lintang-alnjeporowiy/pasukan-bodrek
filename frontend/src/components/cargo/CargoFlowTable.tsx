import React from "react";
import { CargoFlow } from "@/types/cargo";

interface CargoFlowTableProps {
  direction: "INBOUND" | "OUTBOUND";
  flows: CargoFlow[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (flow: CargoFlow) => void;
  onDelete: (id: string) => void;
  onCalculateProjection: (flow: CargoFlow) => void;
}

export const CargoFlowTable: React.FC<CargoFlowTableProps> = ({
  direction,
  flows,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onCalculateProjection,
}) => {
  const isOutbound = direction === "OUTBOUND";

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-100">
              Alur Kargo {isOutbound ? "Outbound (Keluar)" : "Inbound (Masuk)"}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {flows.length} Flow
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isOutbound
              ? "Perencanaan aliran kargo yang didistribusikan/diekspor keluar dari pelabuhan menuju destinasi."
              : "Perencanaan aliran kargo yang masuk dari hinterland/kebun menuju ke tenant di dalam kawasan pelabuhan."}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Tambah {isOutbound ? "Outbound" : "Inbound"} Flow</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Memuat alur kargo...</div>
        ) : flows.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Belum ada alur kargo {isOutbound ? "outbound" : "inbound"} untuk skenario ini. Klik{" "}
            <strong>Tambah {isOutbound ? "Outbound" : "Inbound"} Flow</strong> untuk memulai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tenant</th>
                  <th className="px-6 py-4">Komoditas</th>
                  <th className="px-6 py-4">Rute Pelayaran</th>
                  <th className="px-6 py-4">Asal &rarr; Tujuan</th>
                  <th className="px-6 py-4 text-right">Base Demand</th>
                  <th className="px-6 py-4">Growth Rate</th>
                  <th className="px-6 py-4">Proyeksi Demand</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {flows.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-medium text-slate-200">{f.tenant_name || f.tenant_id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                        {f.commodity_name || f.commodity_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-300">
                      {f.route_name ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          🚢 {f.route_name} ({f.route_distance_nm} NM)
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Belum di-assign</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-300">
                      {f.origin} &rarr; {f.destination_port}
                    </td>

                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-100">
                      {f.base_annual_demand.toLocaleString("id-ID")}{" "}
                      <span className="text-xs font-normal text-slate-400">{f.unit}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-emerald-400">+{f.growth_rate}% / thn</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onCalculateProjection(f)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 transition flex items-center gap-1.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-1-1.5l-1.5-3M12 3v13.5" />
                        </svg>
                        <span>Hitung Engine</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onEdit(f)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(f.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
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
    </div>
  );
};
