import React from "react";
import { CargoConversionRule } from "@/types/cargo";

interface ConversionRuleTableProps {
  rules: CargoConversionRule[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (rule: CargoConversionRule) => void;
  onDelete: (id: string) => void;
}

export const ConversionRuleTable: React.FC<ConversionRuleTableProps> = ({
  rules,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-100">Master Cargo Conversion Rules</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {rules.length} Rule Terdaftar
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Aturan konversi satuan kargo (misal Ton &rarr; TEU atau Ton &rarr; Processed Food) untuk proyek perencanaan pelabuhan.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Tambah Conversion Rule</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Memuat daftar Conversion Rule...</div>
        ) : rules.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Belum ada Conversion Rule yang terdaftar. Klik <strong>Tambah Conversion Rule</strong> untuk membuat rule baru.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Komoditas / Scope</th>
                  <th className="px-6 py-4">Satuan Asal</th>
                  <th className="px-6 py-4">Satuan Tujuan</th>
                  <th className="px-6 py-4">Faktor Konversi</th>
                  <th className="px-6 py-4">Keterangan</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {rule.commodity_name ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                          {rule.commodity_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-xs">
                          Global Rule (Semua Komoditas)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300 font-mono">{rule.source_unit}</td>
                    <td className="px-6 py-4 text-slate-300 font-mono">{rule.target_unit}</td>
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">
                      &times; {rule.conversion_factor}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">
                      {rule.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          rule.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {rule.is_active ? "Aktif" : "Non-aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onEdit(rule)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(rule.id)}
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
