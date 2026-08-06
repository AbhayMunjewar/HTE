import React from 'react';
import { Calendar, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { format } from 'date-fns';

export const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-[#062A4E] text-white border-b-2 border-amber-500 flex items-center justify-between px-6 sticky top-0 z-30 shadow-md">
      {/* Brand Badge */}
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-amber-400 shadow-md shrink-0">
          <img 
            src="/maharashtra_logo.png" 
            alt="Government of Maharashtra Official Seal" 
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-extrabold tracking-wide uppercase flex items-center gap-2 text-white">
            Government of Maharashtra
            <span className="text-[9px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black tracking-wider uppercase">
              Official Portal
            </span>
          </h1>
          <p className="text-[11px] text-amber-200 font-medium mt-0.5">Higher & Technical Education Department | Directorate of Technical Education</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-900/80 px-3.5 py-1.5 rounded-lg border border-slate-700">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{format(new Date(), 'dd MMMM yyyy')}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>DTE Digital Verification</span>
        </div>
      </div>
    </header>
  );
};
