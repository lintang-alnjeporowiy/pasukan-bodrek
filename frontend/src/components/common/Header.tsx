import React from "react";
import Link from "next/link";

interface HeaderProps {
  healthStatus?: "checking" | "connected" | "disconnected";
}

export const Header: React.FC<HeaderProps> = ({ healthStatus = "connected" }) => {
  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-tight leading-none group-hover:text-cyan-400 transition">
              Maritime Transportation &amp; Port Planning
            </h1>
            <span className="text-[11px] text-slate-500 font-mono">System Workspace</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 border-l border-slate-800 pl-6 text-xs font-semibold">
          <Link href="/" className="px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-cyan-400 transition">
            Proyek
          </Link>
          <Link href="/external-ports" className="px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-cyan-400 transition">
            Pelabuhan Eksternal
          </Link>
          <Link href="/vessels" className="px-3 py-1.5 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-cyan-400 transition">
            Kapal Master
          </Link>
        </nav>

      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Backend API:</span>
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                healthStatus === "connected"
                  ? "bg-emerald-400 animate-pulse"
                  : healthStatus === "checking"
                  ? "bg-amber-400 animate-pulse"
                  : "bg-rose-500"
              }`}
            />
            <span className="text-slate-200 uppercase font-mono">
              {healthStatus === "connected" ? "Connected" : healthStatus === "checking" ? "Checking" : "Disconnected"}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
};
