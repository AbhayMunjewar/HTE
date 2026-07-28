import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Bot, 
  FileBarChart, 
  Settings 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: GraduationCap, label: 'Colleges', path: '/colleges' },
  { icon: BookOpen, label: 'Faculty', path: '/faculty' },
  { icon: Briefcase, label: 'Placements', path: '/placements' },
  { icon: TrendingUp, label: 'Enrollment Prediction', path: '/prediction' },
  { icon: Bot, label: 'AI Assistant', path: '/ai-assistant' },
  { icon: FileBarChart, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-dashboard-primary text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 shadow-xl z-20">
      <div className="p-6 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-white tracking-tight leading-tight">
          HTE Decision<br/>Intelligence
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm font-medium",
                    isActive 
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                      : "hover:bg-slate-800/50 hover:text-slate-100"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-white">John Doe</span>
            <span className="text-[10px] text-slate-400">System Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
