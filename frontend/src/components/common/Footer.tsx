import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/40 text-center py-6 px-6 z-10">
      <p className="text-xs text-slate-600">
        Maritime Transportation Planner &copy; {new Date().getFullYear()} &bull; Built under NixOS Environment
      </p>
    </footer>
  );
};
