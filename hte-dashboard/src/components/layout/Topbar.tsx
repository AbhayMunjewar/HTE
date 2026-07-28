import React from 'react';
import { Search, Bell, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Seal_of_Maharashtra.svg/1024px-Seal_of_Maharashtra.svg.png" 
          alt="Govt of Maharashtra" 
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Government of Maharashtra</h1>
          <p className="text-xs text-slate-500 font-medium">Higher & Technical Education Department</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search colleges, students..." 
            className="pl-9 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4" />
            {format(new Date(), 'dd MMM yyyy')}
          </div>
          
          <button className="relative p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-dashboard-destructive rounded-full border border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
