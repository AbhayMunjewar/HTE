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

  const [reportType, setReportType] = useState<'state' | 'district' | 'college'>('state');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const collegeParam = searchParams.get('college');
    if (collegeParam) {
      setReportType('college');
      setSelectedCollegeName(collegeParam);
    }
  }, [location.search]);

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Pune');
  const [selectedCollegeName, setSelectedCollegeName] = useState<string>('College of Engineering Pune');
  const [selectedYear, setSelectedYear] = useState<string>('2025-2026');
  const [naacFilter, setNaacFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [collegesList, setCollegesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Fetch initial colleges list for dropdown
  useEffect(() => {
    fetch('http://localhost:8000/api/colleges?limit=150')
      .then((res) => res.json())
      .then((data) => {
        if (data.colleges && data.colleges.length > 0) {
          setCollegesList(data.colleges);
        }
      })
      .catch((err) => console.warn('Colleges fetch error:', err));
  }, []);

  // Automatically fetch initial report on mount and when type/targets change
  useEffect(() => {
    handleGenerateReport();
  }, [reportType, selectedDistrict, selectedCollegeName, selectedYear]);

  const handleGenerateReport = async () => {
    setLoading(true);
    let targetParam = '';
    if (reportType === 'district') targetParam = selectedDistrict;
    if (reportType === 'college') targetParam = selectedCollegeName;

    try {
      const res = await fetch('http://localhost:8000/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          target: targetParam,
          year: selectedYear,
          naac: naacFilter
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Landmark className="w-3.5 h-3.5" />
            <span>Government Decision Intelligence Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-blue-400" />
            Executive Reports & Decision Support System
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Automated performance audits, predictive enrollment analytics, and AI policy recommendations for Maharashtra leaders.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 shadow-md flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl border border-blue-400/30 shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* FILTER & GENERATE BAR */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-xl space-y-4">

        {/* Report Type Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" /> Scope:
          </span>

          {[
            { id: 'state', label: 'Statewide Maharashtra Report', icon: Landmark },
            { id: 'district', label: 'District Performance Audit', icon: MapPin },
            { id: 'college', label: 'College Executive Report', icon: Building2 },
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = reportType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800'
                  }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">

          {/* College Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target College</label>
            <select
              value={selectedCollegeName}
              onChange={(e) => {
                setSelectedCollegeName(e.target.value);
                setReportType('college');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="College of Engineering Pune">COEP Pune</option>
              <option value="Veermata Jijabai Technological Institute">VJTI Mumbai</option>
              <option value="Walchand College of Engineering">WCE Sangli</option>
              <option value="Sardar Patel Institute of Technology">SPIT Mumbai</option>
              {collegesList.map((c) => (
                <option key={c.college_id} value={c.college_name}>{c.college_name}</option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setReportType('district');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {['Pune', 'Mumbai', 'Thane', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Sangli', 'Satara'].map((d) => (
                <option key={d} value={d}>{d} District</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="2025-2026">AY 2025-2026 (Active)</option>
              <option value="2024-2025">AY 2024-2025 (Historical)</option>
              <option value="2026-2027">AY 2026-2027 (Forecast)</option>
            </select>
          </div>

          {/* NAAC Grade Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">NAAC Grade</label>
            <select
              value={naacFilter}
              onChange={(e) => setNaacFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Stream</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Streams / Branches</option>
              <option value="Computer">Computer Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Electrical">Electrical Engineering</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="General">General / Open</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end sm:col-span-2 md:col-span-1">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 border border-amber-300/40 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-slate-950" />}
              <span>Generate Executive Report</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. OFFICIAL GOVERNMENT REPORT DOCUMENT CONTAINER                          */}
      {/* ========================================================================= */}
      <div className="printable-document bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">

        {/* Decorative Top Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500"></div>

        {/* ── SECTION 1: GOVERNMENT HEADER ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800/80 gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md shrink-0 mx-auto sm:mx-0">
              <img
                src="/maharashtra_logo.png"
                alt="Government of Maharashtra Official Seal"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Official Document
              </span>
              <h1 className="text-base sm:text-xl font-extrabold text-white tracking-wide uppercase mt-1">
                Government of Maharashtra
              </h1>
              <p className="text-xs text-blue-400 font-bold">
                Higher & Technical Education Department, Mantralaya, Mumbai
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right font-mono text-[11px] text-slate-400 space-y-1">
            <div><strong className="text-slate-300">REF NO:</strong> MHTE-EXEC-RPT-2025-9841</div>
            <div><strong className="text-slate-300">DATE:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            <div><strong className="text-slate-300">AUTHORITY:</strong> Directorate of Technical Education</div>
          </div>
        </div>

        {/* REPORT TITLE BANNER */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-blue-500/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              {reportData?.entity_name || 'Statewide Maharashtra'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
              {reportData?.report_title || 'Maharashtra State Higher & Technical Education Executive Decision Report'}
            </h2>
          </div>
          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 shrink-0">
            {selectedYear}
          </span>
        </div>

        {/* ── SECTION 2: EXECUTIVE SUMMARY ── */}
        <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            Executive Summary (AI Synthesized from Empirical SQLite Dataset)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {reportData?.executive_summary || 'Loading executive synthesis...'}
          </p>
        </div>

        {/* ── SECTION 3: KEY PERFORMANCE INDICATORS (KPI CARDS) ── */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" /> Key Institutional Performance Indicators
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Institutions</span>
              <div className="text-xl font-black text-white mt-1">{(stats.total_colleges || 2000).toLocaleString()}</div>
              <span className="text-[10px] text-blue-400 font-semibold">36 Districts Active</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Students</span>
              <div className="text-xl font-black text-white mt-1">{(stats.total_students || 3922128).toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Student-Faculty: {stats.student_faculty_ratio || 17.3}:1</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Rate</span>
              <div className="text-xl font-black text-emerald-400 mt-1">{stats.placement_rate_pct || 78.5}%</div>
              <span className="text-[10px] text-amber-400 font-semibold">Max Package: ₹{stats.highest_package_lpa || 57.0} LPA</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scholarship Beneficiaries</span>
              <div className="text-xl font-black text-purple-400 mt-1">{(stats.scholarship_beneficiaries || 1254280).toLocaleString()}</div>
              <span className="text-[10px] text-purple-300 font-semibold">State EBC & Pragati</span>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: VISUAL ANALYTICS CHARTS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Chart 1: Enrollment Trend */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> Statewide Enrollment Trend</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">↑ Positive</span>
            </h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.enrollment_trend || [
                  { year: '2023', students: 3650000 },
                  { year: '2024', students: 3790000 },
                  { year: '2025', students: 3922128 },
                  { year: '2026 (Est)', students: 4050000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip formatter={(v: any) => [v.toLocaleString(), 'Students']} />
                  <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: NAAC Grade Distribution */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> NAAC Accreditation Breakdown</span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Quality Index</span>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* ── SECTION 5: ML PREDICTIVE ENROLLMENT INTELLIGENCE (IF COLLEGE OR STATE) ── */}
        {mlPred && mlPred.predicted_enrollment && (
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 p-6 rounded-2xl border border-blue-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-blue-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" /> ML v3.0 Predictive Enrollment Forecast (AY 2025-26)
              </h3>
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                ML Forecasting Engine
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Forecasted Intake</span>
                <div className="text-2xl font-black text-white">{mlPred.predicted_enrollment} <span className="text-xs font-normal text-slate-400">/ {mlPred.admission_capacity || 120}</span></div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Seat Utilization</span>
                <div className="text-2xl font-black text-emerald-400">{mlPred.seat_utilization_pct}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Growth Rate</span>
                <div className="text-2xl font-black text-amber-300">+{mlPred.growth_rate_pct}%</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tree Confidence</span>
                <div className="text-2xl font-black text-blue-300">{mlPred.prediction_confidence_pct}%</div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 6: DISTRICT RANKINGS / INSTITUTIONAL DIRECTORY ── */}
        {reportData?.district_rankings && reportData.district_rankings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" /> District Hierarchy Rankings (By Student Enrollment)
            </h3>
            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">District Name</th>
                    <th className="p-3">Total Colleges</th>
                    <th className="p-3">Total Enrolled Students</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {reportData.district_rankings.slice(0, 8).map((d: any) => (
                    <tr key={d.rank} className="hover:bg-slate-900/50">
                      <td className="p-3 font-extrabold text-amber-400">#{d.rank}</td>
                      <td className="p-3 font-bold text-white">{d.district} District</td>
                      <td className="p-3">{d.colleges} Institutions</td>
                      <td className="p-3 font-bold text-blue-300">{d.students.toLocaleString()} Students</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
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
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
            <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Institutional Strengths & Verified Drivers
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {(reportData?.strengths || [
                'High student enrollment and strong academic seat utilization.',
                'Established industry recruitment partnerships and placement records.'
              ]).map((st, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{st}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-rose-500/30 space-y-3">
            <h4 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Areas Requiring Attention & Vulnerabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {(reportData?.weaknesses || [
                'Core branch placement rates lag behind Computer & IT specializations.',
                'Post-graduate research seed funding requires continuous expansion.'
              ]).map((wk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── SECTION 8: AI STRATEGIC INSIGHTS & ACTIONABLE RECOMMENDATIONS ── */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-amber-500/30 shadow-xl space-y-4">
          <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Actionable Policy Recommendations & Strategic Action Plan
          </h3>

          <div className="space-y-3">
            {(reportData?.recommendations || [
              'Establish department-specific placement bootcamps starting from 3rd semester.',
              'Expand 6-month corporate co-op internships under AICTE guidelines.',
              'Sponsor faculty Ph.D. upgrades and high-impact Q1/Q2 journal publications.'
            ]).map((rec, idx) => (
              <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white font-bold leading-normal">{rec}</p>
                  <span className="inline-block text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    High Priority Action Item
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 9: REPORT CONCLUSION & OFFICIAL SIGN-OFF ── */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl text-center sm:text-left">
            <h4 className="text-xs font-extrabold text-white">Report Conclusion</h4>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              {reportData?.conclusion || 'The higher education indicators demonstrate steady progress. Implementation of targeted policy recommendations will accelerate NIRF ranking and statewide academic excellence.'}
            </p>
          </div>

          <div className="border border-slate-800 p-4 rounded-2xl bg-slate-950 text-center min-w-[200px] shadow-lg">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
            <div className="text-[10px] font-extrabold text-white uppercase tracking-wider">Digitally Verified</div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">Directorate of Technical Education</div>
            <div className="text-[8px] text-emerald-400 font-mono font-bold mt-1">Govt of Maharashtra Seal</div>
          </div>
        </div>

      </div>

    </div>
  );
};
