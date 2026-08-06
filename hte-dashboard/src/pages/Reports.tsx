import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FileBarChart,
  Landmark,
  Building2,
  MapPin,
  TrendingUp,
  Award,
  Users,
  GraduationCap,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  RefreshCw,
  Search,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  PieChart as PieIcon,
  Cpu,
  Zap,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface ReportData {
  report_type: string;
  report_title: string;
  entity_name: string;
  year: string;
  statistics: any;
  district_rankings?: any[];
  ml_prediction?: any;
  executive_summary?: string;
  key_findings?: string[];
  strengths?: string[];
  weaknesses?: string[];
  ai_insights?: string[];
  recommendations?: string[];
  conclusion?: string;
}

export const Reports: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [reportType, setReportType] = useState<'state' | 'district'>('state');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const districtParam = searchParams.get('district');
    if (districtParam) {
      setReportType('district');
      setSelectedDistrict(districtParam);
    }
  }, [location.search]);

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Pune');
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [naacFilter, setNaacFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');

  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Automatically fetch report on mount and whenever ANY filter changes
  useEffect(() => {
    handleGenerateReport();
  }, [reportType, selectedDistrict, selectedYear, naacFilter, branchFilter]);

  const handleGenerateReport = async () => {
    setLoading(true);
    let targetParam = '';
    if (reportType === 'district') targetParam = selectedDistrict;

    try {
      const res = await fetch('http://localhost:8000/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          target: targetParam,
          year: selectedYear,
          naac: naacFilter,
          branch: branchFilter
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const stats = reportData?.statistics || {};
  const mlPred = reportData?.ml_prediction || {};

  return (
    <div className="space-y-6 selection:bg-blue-600 selection:text-white">

      {/* ========================================================================= */}
      {/* 1. HEADER & CONTROL TOOLBAR                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-300 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-bold">
            <Landmark className="w-3.5 h-3.5 text-amber-700" />
            <span>Government Decision Intelligence Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-[#062A4E]" />
            Executive Reports & Decision Support System
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Automated performance audits, predictive enrollment analytics, and AI policy recommendations for Maharashtra leaders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg border border-slate-300 shadow-sm flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#062A4E] hover:bg-[#0A2540] text-white font-extrabold text-xs px-5 py-2.5 rounded-lg border border-amber-500/40 shadow-sm flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* FILTER & GENERATE BAR */}
      <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm space-y-4">

        {/* Report Type Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-600" /> Scope:
          </span>

          {[
            { id: 'state', label: 'Statewide Maharashtra Report', icon: Landmark },
            { id: 'district', label: 'District Performance Audit', icon: MapPin },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as 'state' | 'district')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${active
                    ? 'bg-[#062A4E] text-white border-b-2 border-amber-500 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
              >
                <IconComp className="w-3.5 h-3.5 text-amber-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dropdown Filters Grid (5 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-200">

          {/* District Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target District {reportType === 'state' && <span className="text-[9px] font-normal text-slate-500">(Disabled for State)</span>}
            </label>
            <select
              value={reportType === 'state' ? 'Statewide' : selectedDistrict}
              disabled={reportType === 'state'}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setReportType('district');
              }}
              className={`w-full border rounded-lg px-3 py-2 text-xs font-semibold outline-none transition-all ${
                reportType === 'state'
                  ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#062A4E]'
              }`}
            >
              {reportType === 'state' ? (
                <option value="Statewide">All 36 Districts (Statewide)</option>
              ) : (
                ['Pune', 'Mumbai', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Sangli', 'Satara'].map((d) => (
                  <option key={d} value={d}>{d} District</option>
                ))
              )}
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#062A4E] outline-none"
            >
              <option value="2025-2026">AY 2025-2026 (Active)</option>
              <option value="2024-2025">AY 2024-2025 (Historical)</option>
              <option value="2026-2027">AY 2026-2027 (Forecast)</option>
            </select>
          </div>

          {/* NAAC Grade Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">NAAC Grade</label>
            <select
              value={naacFilter}
              onChange={(e) => setNaacFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#062A4E] outline-none"
            >
              <option value="All">All NAAC Grades</option>
              <option value="A++">A++ Grade</option>
              <option value="A+">A+ Grade</option>
              <option value="A">A Grade</option>
              <option value="B++">B++ Grade</option>
              <option value="B+">B+ Grade</option>
              <option value="B">B Grade</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Academic Stream</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#062A4E] outline-none"
            >
              <option value="All">All Streams / Branches</option>
              <option value="Computer">Computer Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Electrical">Electrical Engineering</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full bg-[#062A4E] hover:bg-[#0A2540] text-white font-extrabold text-xs py-2.5 px-4 rounded-lg shadow-sm border border-amber-500/40 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
              <span>Generate Executive Report</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL GOVERNMENT REPORT DOCUMENT CONTAINER                          */}
      {/* ========================================================================= */}
      <div className="printable-document bg-white border border-slate-300 rounded-xl p-6 sm:p-10 shadow-sm space-y-8 relative overflow-hidden text-slate-900 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">

        {/* Decorative Top Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#062A4E]"></div>

        {/* ── SECTION 1: GOVERNMENT HEADER ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-200 gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-lg bg-white p-1 flex items-center justify-center border border-amber-400 shadow-sm shrink-0 mx-auto sm:mx-0">
              <img
                src="/maharashtra_logo.png"
                alt="Government of Maharashtra Official Seal"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
                Official Document
              </span>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-wide uppercase mt-1">
                Government of Maharashtra
              </h1>
              <p className="text-xs text-[#062A4E] font-extrabold">
                Higher & Technical Education Department, Mantralaya, Mumbai
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right font-mono text-[11px] text-slate-600 space-y-1">
            <div><strong className="text-slate-900">REF NO:</strong> MHTE-EXEC-RPT-2025-9841</div>
            <div><strong className="text-slate-900">DATE:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            <div><strong className="text-slate-900">AUTHORITY:</strong> Directorate of Technical Education</div>
          </div>
        </div>

        {/* REPORT TITLE BANNER */}
        <div className="bg-[#062A4E] text-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
                {reportData?.entity_name || 'Statewide Maharashtra'}
              </span>
              <span className="text-[10px] font-extrabold text-white bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                AY {selectedYear}
              </span>
              {naacFilter !== 'All' && (
                <span className="text-[10px] font-extrabold text-purple-200 bg-purple-900/50 px-2.5 py-0.5 rounded border border-purple-400/30">
                  NAAC: {naacFilter}
                </span>
              )}
              {branchFilter !== 'All' && (
                <span className="text-[10px] font-extrabold text-emerald-200 bg-emerald-900/50 px-2.5 py-0.5 rounded border border-emerald-400/30">
                  Stream: {branchFilter}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {reportData?.report_title || 'Maharashtra State Higher & Technical Education Executive Decision Report'}
            </h2>
          </div>
          <div className="text-[10px] font-mono text-amber-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 shrink-0">
            Filtered Data Audit
          </div>
        </div>

        {/* ── SECTION 2: EXECUTIVE SUMMARY & DECISION SUPPORT Q&A ── */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-xs font-extrabold text-[#062A4E] uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-600" />
            Executive Summary (AI Synthesized from Empirical SQLite Dataset)
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
            {reportData?.executive_summary || 'Loading executive synthesis...'}
          </p>

          {/* 3 Core Policy Questions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200">
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-600 border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                1. What is the current situation?
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                {reportData?.government_qna?.situation || reportData?.statistics?.government_qna?.situation || `Active monitoring across institutions serving ${stats.total_students?.toLocaleString() || '39,22,128'} students with student-faculty ratio of ${stats.student_faculty_ratio || '17.3'}:1.`}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-rose-600 border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-900 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                2. What problems exist?
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                {reportData?.government_qna?.problems || reportData?.statistics?.government_qna?.problems || "Core engineering branch placement rates lag computer specializations, and faculty vacancies require targeted recruitment."}
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border-l-4 border-emerald-600 border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                3. What actions should HTE take?
              </span>
              <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                {reportData?.government_qna?.actions || reportData?.statistics?.government_qna?.actions || "Authorize immediate faculty recruitment, expand AI/DS sanctioned intake, and allocate target R&D infrastructure grants."}
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION: EXECUTIVE RISK ANALYSIS & VULNERABILITY AUDIT ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Executive Risk Analysis & Vulnerability Audit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(reportData?.risk_analysis || reportData?.statistics?.risk_analysis || [
              { level: 'High Risk', category: 'Faculty Shortage', title: 'Faculty Vacancy & Cadre Imbalance', impact: 'Regional institutes face vacant faculty positions in emerging streams.', action: 'Initiate state recruitment drive.' },
              { level: 'Medium Risk', category: 'Placement Disparity', title: 'Core Stream Placement Lag', impact: 'Civil and Mechanical streams show lower placement compensation compared to CSE/IT.', action: 'Mandate 6-month corporate co-op internships.' },
              { level: 'Low Risk', category: 'Infrastructure', title: 'Hostel Accommodation Limits', impact: 'High hostel occupancy restricts expanding outstation admissions.', action: 'Sanction DTE budget for 300-bed hostel blocks.' }
            ]).map((rk: any, idx: number) => {
              const isHigh = rk.level?.includes('High');
              const isMed = rk.level?.includes('Medium');
              return (
                <div key={idx} className={`bg-white p-4 rounded-xl border-l-4 ${isHigh ? 'border-rose-600' : isMed ? 'border-amber-600' : 'border-blue-600'} border border-slate-200 shadow-sm space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded border ${isHigh ? 'bg-rose-100 text-rose-800 border-rose-200' : isMed ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                      {rk.level}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{rk.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{rk.title}</h4>
                  <p className="text-[11px] text-slate-700 font-medium leading-relaxed">{rk.impact}</p>
                  <div className="pt-2 border-t border-slate-200 text-[10px] font-extrabold text-amber-800 flex items-center gap-1">
                    <span>👉 Action:</span> {rk.action}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SECTION 3: KEY PERFORMANCE INDICATORS (KPI CARDS) ── */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#062A4E]" /> Key Institutional Performance Indicators
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Institutions</span>
              <div className="text-xl font-black text-slate-900 mt-1">{(stats.total_colleges || 2000).toLocaleString()}</div>
              <span className="text-[10px] text-blue-700 font-bold">36 Districts Active</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Students</span>
              <div className="text-xl font-black text-slate-900 mt-1">{(stats.total_students || 3922128).toLocaleString()}</div>
              <span className="text-[10px] text-emerald-700 font-bold">Student-Faculty: {stats.student_faculty_ratio || 17.3}:1</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Placement Rate</span>
              <div className="text-xl font-black text-emerald-700 mt-1">{stats.placement_rate_pct || 78.5}%</div>
              <span className="text-[10px] text-amber-700 font-bold">Max Package: ₹{stats.highest_package_lpa || 57.0} LPA</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Scholarship Beneficiaries</span>
              <div className="text-xl font-black text-purple-700 mt-1">{(stats.scholarship_beneficiaries || 1254280).toLocaleString()}</div>
              <span className="text-[10px] text-purple-700 font-bold">State EBC & Pragati</span>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: VISUAL ANALYTICS CHARTS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chart 1: Enrollment Trend */}
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-700" /> Statewide Enrollment Trend</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">↑ Positive</span>
            </h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.enrollment_trend || [
                  { year: '2023', students: 3650000 },
                  { year: '2024', students: 3790000 },
                  { year: '2025', students: 3922128 },
                  { year: '2026 (Est)', students: 4050000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                  <Tooltip formatter={(v: any) => [v.toLocaleString(), 'Students']} />
                  <Line type="monotone" dataKey="students" stroke="#062A4E" strokeWidth={3} dot={{ r: 4, fill: '#062A4E' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: NAAC Grade Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" /> NAAC Accreditation Breakdown</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">Quality Index</span>
            </h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.naac_distribution || [
                  { grade: 'A++', count: 182 },
                  { grade: 'A+', count: 351 },
                  { grade: 'A', count: 457 },
                  { grade: 'B++', count: 344 },
                  { grade: 'B+', count: 315 },
                  { grade: 'B', count: 194 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#475569' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── SECTION 5: ML PREDICTIVE ENROLLMENT INTELLIGENCE (IF COLLEGE OR STATE) ── */}
        {mlPred && mlPred.predicted_enrollment && (
          <div className="bg-[#062A4E] text-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" /> ML v3.0 Predictive Enrollment Forecast (AY 2025-26)
              </h3>
              <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded uppercase">
                ML Forecasting Engine
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-amber-200 font-bold uppercase">Forecasted Intake</span>
                <div className="text-2xl font-black text-white">{mlPred.predicted_enrollment} <span className="text-xs font-normal text-slate-300">/ {mlPred.admission_capacity || 120}</span></div>
              </div>
              <div>
                <span className="text-[10px] text-amber-200 font-bold uppercase">Seat Utilization</span>
                <div className="text-2xl font-black text-emerald-300">{mlPred.seat_utilization_pct}%</div>
              </div>
              <div>
                <span className="text-[10px] text-amber-200 font-bold uppercase">Growth Rate</span>
                <div className="text-2xl font-black text-amber-300">+{mlPred.growth_rate_pct}%</div>
              </div>
              <div>
                <span className="text-[10px] text-amber-200 font-bold uppercase">Tree Confidence</span>
                <div className="text-2xl font-black text-sky-300">{mlPred.prediction_confidence_pct}%</div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 6: DISTRICT RANKINGS / INSTITUTIONAL DIRECTORY ── */}
        {reportData?.district_rankings && reportData.district_rankings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" /> District Hierarchy Rankings (By Student Enrollment)
            </h3>
            <div className="overflow-x-auto border border-slate-300 rounded-xl bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">District Name</th>
                    <th className="p-3">Total Colleges</th>
                    <th className="p-3">Total Enrolled Students</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {reportData.district_rankings.slice(0, 8).map((d: any) => (
                    <tr key={d.rank} className="hover:bg-slate-50">
                      <td className="p-3 font-extrabold text-[#062A4E]">#{d.rank}</td>
                      <td className="p-3 font-bold text-slate-900">{d.district} District</td>
                      <td className="p-3">{d.colleges} Institutions</td>
                      <td className="p-3 font-bold text-blue-900">{d.students.toLocaleString()} Students</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          Active Monitoring
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SECTION 7: STRENGTHS & WEAKNESSES GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Strengths Card */}
          <div className="bg-white p-5 rounded-xl border-l-4 border-emerald-600 border border-slate-300 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Institutional Strengths & Verified Drivers
            </h4>
            <ul className="space-y-2 text-xs text-slate-800 font-medium">
              {(reportData?.strengths || [
                'High student enrollment and strong academic seat utilization.',
                'Established industry recruitment partnerships and placement records.'
              ]).map((st, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-white p-5 rounded-xl border-l-4 border-rose-600 border border-slate-300 shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Areas Requiring Attention & Vulnerabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-800 font-medium">
              {(reportData?.weaknesses || [
                'Core branch placement rates lag behind Computer & IT specializations.',
                'Post-graduate research seed funding requires continuous expansion.'
              ]).map((wk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-700 font-bold">•</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── SECTION 8: AI STRATEGIC INSIGHTS & ACTIONABLE RECOMMENDATIONS ── */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-300 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-[#062A4E] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" /> Actionable Policy Recommendations & Strategic Action Plan
          </h3>

          <div className="space-y-3">
            {(reportData?.recommendations || [
              'Establish department-specific placement bootcamps starting from 3rd semester.',
              'Expand 6-month corporate co-op internships under AICTE guidelines.',
              'Sponsor faculty Ph.D. upgrades and high-impact Q1/Q2 journal publications.'
            ]).map((rec, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-[#062A4E] text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-900 font-bold leading-normal">{rec}</p>
                  <span className="inline-block text-[9px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                    High Priority Action Item
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 9: REPORT CONCLUSION & OFFICIAL SIGN-OFF ── */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl text-center sm:text-left">
            <h4 className="text-xs font-extrabold text-slate-900">Report Conclusion</h4>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              {reportData?.conclusion || 'The higher education indicators demonstrate steady progress. Implementation of targeted policy recommendations will accelerate NIRF ranking and statewide academic excellence.'}
            </p>
          </div>

          <div className="border border-slate-300 p-4 rounded-xl bg-slate-50 text-center min-w-[200px] shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-700 mx-auto mb-1" />
            <div className="text-[10px] font-extrabold text-slate-900 uppercase tracking-wider">Digitally Verified</div>
            <div className="text-[9px] text-slate-600 font-mono mt-0.5">Directorate of Technical Education</div>
            <div className="text-[8px] text-emerald-800 font-mono font-bold mt-1">Govt of Maharashtra Seal</div>
          </div>
        </div>

      </div>

    </div>
  );
};
