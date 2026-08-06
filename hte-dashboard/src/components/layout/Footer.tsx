import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#062A4E] text-slate-200 border-t-2 border-amber-500 py-4 px-8 mt-auto text-xs font-medium">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          © {new Date().getFullYear()} Government of Maharashtra • Higher & Technical Education Department, Mantralaya, Mumbai
        </div>
        <div className="flex items-center gap-4 text-amber-300">
          <span>Official Government Portal</span>
          <span>•</span>
          <span>Directorate of Technical Education</span>
        </div>
      </div>
    </footer>
  );
};
