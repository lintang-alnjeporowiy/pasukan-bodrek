import React from "react";
import { Tenant } from "@/types/cargo";

interface TenantTableProps {
  tenants: Tenant[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (t: Tenant) => void;
  onDelete: (id: string) => void;
}

export const TenantTable: React.FC<TenantTableProps> = ({
  tenants,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-100">Daftar Tenant Pelabuhan</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {tenants.length} Tenant
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Perusahaan/Tenant yang beroperasi di wilayah pelabuhan dan memiliki alur kargo masuk atau keluar.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Tambah Tenant</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-900/30 border border-slate-900 rounded-3xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Memuat daftar tenant...</div>
        ) : tenants.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Belum ada tenant terdaftar. Klik <strong>Tambah Tenant</strong> untuk membuat data tenant.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Nama Tenant</th>
                  <th className="px-6 py-4">Komoditas Utama</th>
                  <th className="px-6 py-4">Deskripsi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-semibold text-slate-100">{t.name}</td>
                    <td className="px-6 py-4">
                      {t.commodity_name ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                          {t.commodity_name}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs max-w-xs truncate">{t.description || "-"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        {t.is_active ? "Aktif" : "Non-aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => onEdit(t)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
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
