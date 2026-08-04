import React from 'react';
import { Calendar, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { format } from 'date-fns';

export const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-6 sticky top-0 z-20 shadow-md">
      {/* Brand Badge */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md">
          <img 
            src="/maharashtra_logo.png" 
            alt="Government of Maharashtra Official Seal" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-xs font-extrabold text-white tracking-wide uppercase flex items-center gap-2">
            Government of Maharashtra
            <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
              Official Portal
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Higher & Technical Education Department</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/90 px-3.5 py-1.5 rounded-full border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{format(new Date(), 'dd MMMM yyyy')}</span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Live SQLite Sync Active</span>
        </div>
      </div>
    </header>
  );
};
