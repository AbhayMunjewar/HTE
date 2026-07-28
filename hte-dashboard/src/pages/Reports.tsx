import React, { useState } from 'react';
import { FileBarChart, Download, FileText, CheckCircle2, Shield, Calendar, Filter } from 'lucide-react';

export const Reports: React.FC = () => {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (reportType: string, format: string) => {
    setExporting(`${reportType}-${format}`);
    setTimeout(() => {
      setExporting(null);
      alert(`Successfully exported ${reportType} in ${format.toUpperCase()} format.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-600" />
            Government & Institutional Intelligence Reports
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export official decision-support reports for Higher & Technical Education Department.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 text-xs font-semibold">
          <Shield className="w-4 h-4 text-blue-600" />
          Official Govt Audit Verified
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1: Government Master Report */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg w-fit mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Statewide Government Master Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comprehensive state-level audit covering 2,000 engineering colleges, enrollment trends, NAAC distribution, and placement equity.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => handleExport("Statewide Government Master Report", "pdf")}
              disabled={exporting === "Statewide Government Master Report-pdf"}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={() => handleExport("Statewide Government Master Report", "excel")}
              disabled={exporting === "Statewide Government Master Report-excel"}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>

        {/* Report 2: College Performance Report */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg w-fit mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">College Accreditation & Quality Audit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Institutional breakdown of faculty quality, research publications, NIRF ranks, and infrastructure ratings.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => handleExport("College Accreditation & Quality Audit", "pdf")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={() => handleExport("College Accreditation & Quality Audit", "excel")}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>

        {/* Report 3: Regional District Demand & Predictive Forecast */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg w-fit mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">District Demand & Predictive Enrollment Report</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Regional analysis across 36 districts of Maharashtra including seat demand ratios, capacity bottlenecks, and 2025-2027 forecasts.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => handleExport("District Demand & Predictive Enrollment Report", "pdf")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
            <button
              onClick={() => handleExport("District Demand & Predictive Enrollment Report", "excel")}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
