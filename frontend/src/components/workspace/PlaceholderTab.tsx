import React from "react";

interface PlaceholderTabProps {
  label: string;
  onBackToOverview: () => void;
}

export const PlaceholderTab: React.FC<PlaceholderTabProps> = ({
  label,
  onBackToOverview,
}) => {
  return (
    <div className="bg-slate-900/20 border border-slate-900/60 rounded-3xl p-12 flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-500 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-2">
        Modul {label} Sedang Dikonstruksi
      </h3>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
        Halaman pengisian parameter dan analisis **{label}** untuk skenario ini akan diimplementasikan pada langkah pengerjaan berikutnya.
      </p>
      <button
        onClick={onBackToOverview}
        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition duration-200"
      >
        Kembali ke Overview
      </button>
    </div>
  );
};
