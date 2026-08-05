import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  FileBarChart, 
  Settings,
  ShieldCheck,
  Building2,
  Sparkles,
  Landmark
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: Landmark, label: 'Government Portal Home', path: '/' },
  { icon: LayoutDashboard, label: 'Executive Workspace', path: '/dashboard' },
  { icon: Building2, label: 'Colleges Directory', path: '/colleges' },
  { icon: Bot, label: 'AI Intelligence Assistant', path: '/ai-assistant' },
  { icon: FileBarChart, label: 'Government Reports', path: '/reports' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-950/90 backdrop-blur-xl border-r border-slate-800/80 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 shadow-2xl z-30 overflow-hidden">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md shrink-0">
            <img src="/maharashtra_logo.png" alt="Govt of Maharashtra Seal" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight flex items-center gap-1.5">
              Maharashtra HTE
            </h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">
              Decision Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        <div>
          <div className="px-3 mb-2.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center justify-between">
            <span>Decision Support</span>
            <Sparkles className="w-3 h-3 text-blue-400" />
          </div>
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold group relative overflow-hidden",
                      isActive 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 border border-blue-500/30 font-bold" 
                        : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 hover:border-slate-800 border border-transparent"
                    )
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
