import React from 'react';
import { Settings as SettingsIcon, Database, Cpu, Lock, Bell, CheckCircle2 } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          Decision Platform Settings & ML Model Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure API endpoints, model confidence thresholds, and dataset synchronization.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">ML Predictive Engine Endpoint</h3>
              <p className="text-xs text-slate-500">FastAPI backend prediction API server</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded text-slate-700">
            http://localhost:8000/api/predict
          </span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Dataset Sync Status</h3>
              <p className="text-xs text-slate-500">Original CSV Datasets (colleges, students, faculty, admissions, placements)</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> 11 CSV Files Loaded
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Security & Access Control</h3>
              <p className="text-xs text-slate-500">Role-based executive access (State Minister, HTE Director, District Officer)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Government Executive Mode
          </span>
        </div>
      </div>
    </div>
  );
};
