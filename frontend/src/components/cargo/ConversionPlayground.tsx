import React from "react";
import { Commodity, ConversionTestResult } from "@/types/cargo";

interface ConversionPlaygroundProps {
  commodities: Commodity[];
  testCommodityId: string;
  testSourceValue: string;
  testSourceUnit: string;
  testTargetUnit: string;
  testingConversion: boolean;
  testResult: ConversionTestResult | null;
  testError: string | null;
  setTestCommodityId: (v: string) => void;
  setTestSourceValue: (v: string) => void;
  setTestSourceUnit: (v: string) => void;
  setTestTargetUnit: (v: string) => void;
  onRunTest: () => void;
}

export const ConversionPlayground: React.FC<ConversionPlaygroundProps> = ({
  commodities,
  testCommodityId,
  testSourceValue,
  testSourceUnit,
  testTargetUnit,
  testingConversion,
  testResult,
  testError,
  setTestCommodityId,
  setTestSourceValue,
  setTestSourceUnit,
  setTestTargetUnit,
  onRunTest,
}) => {
  // Collect unique available units for dropdown suggestions
  const defaultUnits = ["Ton", "TEU", "m3", "Kg", "Box", "Container"];
  const commodityUnits = commodities.map((c) => c.unit).filter(Boolean);
  const availableUnits = Array.from(new Set([...defaultUnits, ...commodityUnits]));

  return (
    <div className="bg-slate-900/30 border border-slate-900 rounded-3xl p-6 backdrop-blur-sm space-y-6">
      {/* Shared Datalist for Unit Autocomplete / Dropdown */}
      <datalist id="playground-unit-list">
        {availableUnits.map((u) => (
          <option key={u} value={u} />
        ))}
      </datalist>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-3-9h.008v.008H12.75V9m-4.75 6.75h.008v.008H8V15.75zM12 15.75h.008v.008H12V15.75z" />
          </svg>
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-100">Pengujian Konversi Real-Time (Calculation Engine Playground)</h4>
          <p className="text-xs text-slate-400">
            Simulasikan perhitungan konversi permintaan kargo menggunakan Calculation Service backend dan periksa transparansi Calculation Trace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Komoditas (Skenario Opsional)</label>
          <select
            value={testCommodityId}
            onChange={(e) => setTestCommodityId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Global Rule (Semua Komoditas)</option>
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Nilai Demand Asal</label>
          <input
            type="number"
            value={testSourceValue}
            onChange={(e) => setTestSourceValue(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            placeholder="misal: 500000"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Satuan Asal (Source Unit)</label>
          <input
            type="text"
            list="playground-unit-list"
            value={testSourceUnit}
            onChange={(e) => setTestSourceUnit(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            placeholder="Pilih atau ketik satuan (misal: Ton)"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Satuan Tujuan (Target Unit)</label>
          <input
            type="text"
            list="playground-unit-list"
            value={testTargetUnit}
            onChange={(e) => setTestTargetUnit(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            placeholder="Pilih atau ketik satuan (misal: TEU)"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onRunTest}
          disabled={testingConversion}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-slate-950 font-semibold text-sm transition duration-200 flex items-center gap-2 shadow-lg shadow-cyan-500/10"
        >
          {testingConversion && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
          <span>Jalankan Uji Konversi</span>
        </button>
      </div>

      {testError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {testError}
        </div>
      )}

      {testResult && (
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Hasil Konversi Demand</span>
              <div className="text-2xl font-black text-cyan-400 font-mono">
                {testResult.target_value.toLocaleString("id-ID")} {testResult.target_unit}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dari {testResult.source_value.toLocaleString("id-ID")} {testResult.source_unit}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Faktor Konversi Digunakan</span>
              <span className="text-lg font-bold text-slate-200 font-mono">&times; {testResult.conversion_factor}</span>
            </div>
          </div>

          {/* Calculation Trace */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-cyan-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Calculation Trace (Langkah Perhitungan Backend)
            </h5>
            <div className="space-y-2">
              {testResult.steps.map((step, idx) => (
                <div key={`step-${idx}-${step.step_number}`} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-slate-300">
                    <span>Langkah {step.step_number}: {step.description}</span>
                    {step.value !== null && step.value !== undefined && (
                      <span className="font-mono text-cyan-400">{step.value.toLocaleString("id-ID")}</span>
                    )}
                  </div>
                  {step.formula && (
                    <div className="font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md text-[11px]">
                      {step.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
