"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [latency, setLatency] = useState<number | null>(null);

  const checkBackendHealth = async () => {
    setHealthStatus("checking");
    const startTime = performance.now();
    try {
      // In development, the backend is running at http://localhost:8000
      const response = await fetch("http://localhost:8000/health", {
        mode: "cors",
        cache: "no-store",
      });
      const data = await response.json();
      const endTime = performance.now();
      
      if (data.status === "ok") {
        setHealthStatus("connected");
        setLatency(Math.round(endTime - startTime));
      } else {
        setHealthStatus("disconnected");
        setLatency(null);
      }
    } catch (error) {
      setHealthStatus("disconnected");
      setLatency(null);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-cyan-500/20">
            M
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Maritime Planner
          </span>
        </div>
        
        <div>
          <button
            onClick={checkBackendHealth}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-800/80 transition duration-300 flex items-center gap-2 group active:scale-95"
          >
            <span className={`w-2 h-2 rounded-full ${
              healthStatus === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" :
              healthStatus === "disconnected" ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-amber-500 animate-spin"
            }`} />
            {healthStatus === "connected" ? "API Connected" :
             healthStatus === "disconnected" ? "API Disconnected" : "Checking Connection..."}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full z-10">
        <div className="text-center space-y-6 max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
            Phase 0 — Repository Bootstrap Complete
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-slate-50 to-slate-300 bg-clip-text text-transparent">
            Maritime Transportation Planner
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl font-normal leading-relaxed">
            Decision Support System (DSS) profesional untuk perencanaan transportasi laut terintegrasi, kapasitas pelabuhan, optimalisasi armada, dan analisis biaya.
          </p>
        </div>

        {/* Dashboard Status Widget */}
        <div className="w-full bg-slate-900/40 border border-slate-900 rounded-2xl p-8 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl shadow-black/20">
          
          {/* Connection Panel */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-200 mb-2">Backend Connection Status</h2>
              <p className="text-sm text-slate-400">
                Memverifikasi komunikasi real-time antara Next.js client dan FastAPI core calculation engine.
              </p>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-6 border border-slate-900/60 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Gateway Endpoint</span>
                <p className="text-sm font-mono text-slate-300">GET http://localhost:8000/health</p>
              </div>
              
              <div className="text-right">
                {healthStatus === "connected" && latency !== null ? (
                  <span className="text-xs text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded-full">
                    {latency} ms
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={checkBackendHealth}
                disabled={healthStatus === "checking"}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition duration-300 shadow-lg shadow-cyan-500/10 active:scale-98 disabled:opacity-50"
              >
                Cek Koneksi Ulang
              </button>
            </div>
          </div>

          {/* System Info Panel */}
          <div className="space-y-6 border-t md:border-t-0 md:border-l border-slate-900/60 pt-6 md:pt-0 md:pl-8">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Spesifikasi Lingkungan Nix</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">API Framework</span>
                <span className="font-mono text-slate-300">FastAPI (Python 3.12)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Optimization Modeling</span>
                <span className="font-mono text-slate-300">Pyomo (MILP formulation)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Mathematical Solver</span>
                <span className="font-mono text-slate-300">HiGHS (v1.14.0)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Database Engine</span>
                <span className="font-mono text-slate-300">PostgreSQL (Local / Nix)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Frontend Stack</span>
                <span className="font-mono text-slate-300">Next.js + Tailwind CSS</span>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              healthStatus === "connected" ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400" :
              healthStatus === "disconnected" ? "bg-rose-950/20 border-rose-900/30 text-rose-400" :
              "bg-amber-950/20 border-amber-900/30 text-amber-400"
            }`}>
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-xs ${
                healthStatus === "connected" ? "bg-emerald-500 text-slate-950" :
                healthStatus === "disconnected" ? "bg-rose-500 text-slate-950" : "bg-amber-500 text-slate-950"
              }`}>
                {healthStatus === "connected" ? "✓" : healthStatus === "disconnected" ? "!" : "i"}
              </span>
              <p className="text-xs leading-relaxed">
                {healthStatus === "connected" ? "Sistem siap. Gateway backend terdeteksi berjalan dengan benar." :
                 healthStatus === "disconnected" ? "Koneksi gagal. Pastikan API backend berjalan pada port 8000." :
                 "Sedang memeriksa status respons server backend..."}
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 text-center py-6 px-6 z-10">
        <p className="text-xs text-slate-600">
          Maritime Transportation Planner &copy; {new Date().getFullYear()} &bull; Built under NixOS Environment
        </p>
      </footer>
    </div>
  );
}
