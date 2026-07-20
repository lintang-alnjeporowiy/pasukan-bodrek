import React from "react";

interface SubTabOption {
  id: string;
  label: string;
  description: string;
  status: string;
}

interface CargoSubNavProps {
  subTabs: SubTabOption[];
  activeSubTab: string;
  onSelectSubTab: (id: string) => void;
}

export const CargoSubNav: React.FC<CargoSubNavProps> = ({
  subTabs,
  activeSubTab,
  onSelectSubTab,
}) => {
  return (
    <div className="flex border-b border-slate-900 overflow-x-auto">
      {subTabs.map((sub) => {
        const isActive = activeSubTab === sub.id;
        return (
          <button
            key={sub.id}
            onClick={() => onSelectSubTab(sub.id)}
            className={`px-5 py-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition duration-150 ${
              isActive
                ? "border-cyan-400 text-cyan-400 bg-slate-900/50"
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/20"
            }`}
          >
            <span>{sub.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                sub.status === "Done" || sub.status === "Aktif"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {sub.status}
            </span>
          </button>
        );
      })}
    </div>
  );
};
