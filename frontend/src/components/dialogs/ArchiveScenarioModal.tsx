import React from "react";

interface ArchiveScenarioModalProps {
  isOpen: boolean;
  scenarioName: string;
  updating: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ArchiveScenarioModal: React.FC<ArchiveScenarioModalProps> = ({
  isOpen,
  scenarioName,
  updating,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.75 7.5h16.5m-16.5 0l1.125-3.375A1.125 1.125 0 015.44 3.375h13.12a1.125 1.125 0 011.065.75L20.25 7.5" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-100">Arsipkan Skenario?</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Skenario <strong className="text-slate-200">{scenarioName}</strong> akan diubah statusnya menjadi <strong>ARCHIVED</strong>. Skenario terarsip tidak lagi menjadi opsi aktif utama namun seluruh data alur kargo tetap tersimpan.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={updating}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition flex items-center gap-2"
          >
            {updating && <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />}
            <span>Ya, Arsipkan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
