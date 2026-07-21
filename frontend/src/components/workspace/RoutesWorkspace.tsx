'use client';

import React, { useState, useEffect } from "react";
import { Route, RouteCreate } from "@/types/route";
import { ExternalPort } from "@/types/externalPort";
import { useRoutes } from "@/hooks/useRoutes";
import { externalPortService } from "@/services/externalPort.service";
import { RouteModal } from "@/components/modal/RouteModal";

interface RoutesWorkspaceProps {
  projectId: string;
  studyPortName?: string;
}

export const RoutesWorkspace: React.FC<RoutesWorkspaceProps> = ({
  projectId,
  studyPortName = "Study Port",
}) => {
  const { routes, loading, error, createRoute, updateRoute, deleteRoute } = useRoutes(projectId);
  const [externalPorts, setExternalPorts] = useState<ExternalPort[]>([]);
  const [directionFilter, setDirectionFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  useEffect(() => {
    externalPortService
      .getAll()
      .then((data) => setExternalPorts(data.filter((p) => p.is_active)))
      .catch(() => {});
  }, []);


  const handleOpenCreate = () => {
    setEditingRoute(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: Route) => {
    setEditingRoute(route);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: RouteCreate) => {
    if (editingRoute) {
      await updateRoute(editingRoute.id, data);
    } else {
      await createRoute(data);
    }
  };

  const handleDelete = async (routeId: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus rute "${name}"?`)) {
      await deleteRoute(routeId);
    }
  };

  const filteredRoutes = routes.filter((r) => {
    const matchesDir = directionFilter === "ALL" || r.direction === directionFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.external_port_name && r.external_port_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDir && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Daftar Rute Pelayaran</h2>
          <p className="text-xs text-slate-400">Kelola rute asal dan tujuan kapal menghubungkan Study Port ({studyPortName}) dengan External Ports.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg shadow-md transition-colors"
        >
          + Tambah Rute Baru
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDirectionFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${directionFilter === "ALL" ? "bg-slate-800 text-slate-100 border border-slate-700" : "text-slate-400 hover:text-slate-200"}`}
          >
            Semua ({routes.length})
          </button>
          <button
            onClick={() => setDirectionFilter("INBOUND")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${directionFilter === "INBOUND" ? "bg-blue-950/80 text-blue-300 border border-blue-800" : "text-slate-400 hover:text-slate-200"}`}
          >
            INBOUND ({routes.filter((r) => r.direction === "INBOUND").length})
          </button>
          <button
            onClick={() => setDirectionFilter("OUTBOUND")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${directionFilter === "OUTBOUND" ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800" : "text-slate-400 hover:text-slate-200"}`}
          >
            OUTBOUND ({routes.filter((r) => r.direction === "OUTBOUND").length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari nama rute atau pelabuhan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-64"
        />
      </div>

      {error && <div className="p-3 text-xs bg-red-950/80 border border-red-800 text-red-300 rounded-lg">{error}</div>}

      {/* Routes Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Memuat rute pelayaran...</div>
        ) : filteredRoutes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">Belum ada Rute Pelayaran yang sesuai.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Rute</th>
                  <th className="py-3 px-4">Direction</th>
                  <th className="py-3 px-4">Pelabuhan Asal → Tujuan</th>
                  <th className="py-3 px-4">Jarak (NM)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100">{route.name}</td>
                    <td className="py-3 px-4">
                      {route.direction === "INBOUND" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">INBOUND</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">OUTBOUND</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {route.direction === "INBOUND" ? (
                        <span><strong className="text-cyan-400">{route.external_port_name || "External Port"}</strong> → <strong className="text-emerald-400">{studyPortName}</strong></span>
                      ) : (
                        <span><strong className="text-emerald-400">{studyPortName}</strong> → <strong className="text-cyan-400">{route.external_port_name || "External Port"}</strong></span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300 font-semibold">{route.distance_nm} NM</td>
                    <td className="py-3 px-4">
                      {route.is_active ? (
                        <span className="text-emerald-400 font-medium">Aktif</span>
                      ) : (
                        <span className="text-slate-500">Non-Aktif</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(route)}
                        className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(route.id, route.name)}
                        className="px-2 py-1 text-[11px] bg-red-950/60 hover:bg-red-900/80 text-red-300 rounded border border-red-800"
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

      <RouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingRoute}
        externalPorts={externalPorts}
        studyPortName={studyPortName}
      />
    </div>
  );
};
