import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  FileBarChart, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Executive Workspace', path: '/' },
  { icon: Bot, label: 'AI Assistant', path: '/ai-assistant' },
  { icon: FileBarChart, label: 'Government Reports', path: '/reports' },
  { icon: Settings, label: 'Platform Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 shadow-xl z-20">
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 rounded-lg text-white font-bold text-sm shadow-md">
            HTE
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
              Maharashtra HTE
            </h2>
            <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
              Decision Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Decision Support
        </div>
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 text-xs font-semibold",
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">Higher & Tech Edu Dept</span>
            <span className="text-[10px] text-emerald-400 font-medium">Govt of Maharashtra</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
