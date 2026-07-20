import React, { useState } from "react";
import { CargoFlow, ProjectionResult } from "@/types/cargo";

interface DemandProjectionModalProps {
  flow: CargoFlow | null;
  projection: ProjectionResult | null;
  loading: boolean;
  onClose: () => void;
}

export const DemandProjectionModal: React.FC<DemandProjectionModalProps> = ({
  flow,
  projection,
  loading,
  onClose,
}) => {
  const [showTrace, setShowTrace] = useState<boolean>(false);

  if (!flow) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-4xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Calculation Engine Output
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {flow.id.slice(0, 8)}...</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              Proyeksi Demand Kargo: {flow.commodity_name || "Komoditas"}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tenant: <strong className="text-slate-300">{flow.tenant_name || flow.tenant_id}</strong> &bull; Rute: {flow.origin} &rarr; {flow.destination_port}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Menghitung proyeksi demand dengan backend engine...</p>
          </div>
        ) : projection ? (
          <div className="space-y-6">
            {/* Parameters Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div>
                <span className="text-[11px] text-slate-500 block">Base Demand</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {projection.initial_demand.toLocaleString("id-ID")} {flow.unit}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Growth Rate</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  +{projection.growth_rate}% / tahun
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Max Demand Cap</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {projection.maximum_demand > 0
                    ? `${projection.maximum_demand.toLocaleString("id-ID")} ${flow.unit}`
                    : "Tanpa Batas"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Horizon Proyeksi</span>
                <span className="text-sm font-bold text-slate-200 font-mono">
                  {projection.planning_horizon} Tahun ({projection.base_year} - {projection.base_year + projection.planning_horizon - 1})
                </span>
              </div>
            </div>

            {/* SVG Demand Trend Chart */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-400 px-1">
                <span className="font-semibold text-slate-300">Grafik Tren Demand Tahunan</span>
                <span className="font-mono text-cyan-400">Unit: {flow.unit}</span>
              </div>

              {(() => {
                const data = projection.projections;
                if (!data || data.length === 0) return null;

                const maxVal = Math.max(...data.map((d) => d.demand)) * 1.15 || 1;
                const width = 700;
                const height = 160;
                const paddingLeft = 60;
                const paddingBottom = 30;
                const paddingTop = 10;
                const paddingRight = 20;

                const chartWidth = width - paddingLeft - paddingRight;
                const chartHeight = height - paddingTop - paddingBottom;

                const points = data
                  .map((d, idx) => {
                    const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
                    const y = height - paddingBottom - (d.demand / maxVal) * chartHeight;
                    return `${x},${y}`;
                  })
                  .join(" ");

                return (
                  <div className="w-full overflow-x-auto">
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
                      {/* Grid Lines */}
                      {[0, 0.5, 1].map((ratio, i) => {
                        const y = height - paddingBottom - ratio * chartHeight;
                        const val = Math.round(ratio * maxVal);
                        return (
                          <g key={i}>
                            <line
                              x1={paddingLeft}
                              y1={y}
                              x2={width - paddingRight}
                              y2={y}
                              stroke="#1e293b"
                              strokeDasharray="3 3"
                            />
                            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fill="#64748b" fontSize="10" className="font-mono">
                              {val.toLocaleString("id-ID")}
                            </text>
                          </g>
                        );
                      })}

                      {/* Area Fill */}
                      <polygon
                        points={`${paddingLeft},${height - paddingBottom} ${points} ${width - paddingRight},${height - paddingBottom}`}
                        fill="url(#cyanGradient)"
                        opacity="0.25"
                      />

                      {/* Line */}
                      <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Data Circles */}
                      {data.map((d, idx) => {
                        const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
                        const y = height - paddingBottom - (d.demand / maxVal) * chartHeight;
                        return (
                          <g key={idx} className="group/node">
                            <circle cx={x} cy={y} r="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                            {/* X Axis Year Labels (every 5 years or first/last) */}
                            {(idx % 5 === 0 || idx === data.length - 1) && (
                              <text x={x} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="10" className="font-mono">
                                {d.calendar_year}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      <defs>
                        <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                );
              })()}
            </div>

            {/* Demand Table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-200">Tabel Rincian Hasil Proyeksi</h4>
                <button
                  onClick={() => setShowTrace(!showTrace)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  <span>{showTrace ? "Sembunyikan Formula Audit Trace" : "Tampilkan Formula Audit Trace"}</span>
                </button>
              </div>

              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40 max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5">Tahun (t)</th>
                      <th className="px-4 py-2.5">Tahun Kalender</th>
                      <th className="px-4 py-2.5 text-right">Hasil Demand ({flow.unit})</th>
                      {showTrace && <th className="px-4 py-2.5">Audit Calculation Trace</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 font-mono">
                    {projection.projections.map((p) => (
                      <tr key={p.year} className="hover:bg-slate-800/30 transition">
                        <td className="px-4 py-2 text-slate-400">t = {p.year}</td>
                        <td className="px-4 py-2 text-slate-200 font-bold">{p.calendar_year}</td>
                        <td className="px-4 py-2 text-right text-cyan-400 font-bold text-sm">
                          {p.demand.toLocaleString("id-ID")}
                        </td>
                        {showTrace && <td className="px-4 py-2 text-slate-500 text-[11px]">{p.trace}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
