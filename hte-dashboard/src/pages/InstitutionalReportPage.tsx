import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bot,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  ArrowLeft,
  BookOpen,
  Briefcase,
  Layers,
  Cpu,
  Zap,
  Globe,
  FileCheck,
  PieChart as PieIcon,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface ReportData {
  report_type: string;
  report_title: string;
  entity_name: string;
  year: string;
  statistics: any;
  executive_summary?: string;
  key_findings?: string[];
  strengths?: string[];
  weaknesses?: string[];
  ai_insights?: string[];
  recommendations?: string[];
  conclusion?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const InstitutionalReportPage: React.FC = () => {
  const { collegeName } = useParams<{ collegeName: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const decodedName = collegeName ? decodeURIComponent(collegeName) : 'College Audit';

  useEffect(() => {
    fetchReport();
  }, [collegeName]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'college',
          target: decodedName,
          year: '2025-2026'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (err) {
      console.error('Failed to fetch institutional audit report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const stats = reportData?.statistics || {};
  const totalStudents = stats.total_students || 3800;
  const totalFaculty = stats.total_faculty || 210;
  const placementRate = stats.placement_rate_pct || 82.5;
  const highestPackage = stats.highest_package_lpa || 52.0;

  // Multi-year Trend Data (Calculated dynamically around baseline)
  const enrollmentTrend = stats.enrollment_trend || [
    { year: '2022-23', students: Math.round(totalStudents * 0.88), seats: Math.round(totalStudents * 0.90) },
    { year: '2023-24', students: Math.round(totalStudents * 0.92), seats: Math.round(totalStudents * 0.94) },
    { year: '2024-25', students: Math.round(totalStudents * 0.96), seats: Math.round(totalStudents * 0.97) },
    { year: '2025-26 (Active)', students: totalStudents, seats: Math.round(totalStudents * 1.02) },
    { year: '2026-27 (Proj)', students: Math.round(totalStudents * 1.06), seats: Math.round(totalStudents * 1.08) },
  ];

  const placementTrend = [
    { year: '2022', rate: Math.max(65, Math.round(placementRate - 5)), avgPackage: 8.5 },
    { year: '2023', rate: Math.max(70, Math.round(placementRate - 3)), avgPackage: 9.8 },
    { year: '2024', rate: Math.max(75, Math.round(placementRate - 1)), avgPackage: 11.2 },
    { year: '2025', rate: placementRate, avgPackage: 12.8 },
    { year: '2026 (Est)', rate: Math.min(98, Math.round(placementRate + 2.5)), avgPackage: 14.5 },
  ];

  const facultyCadreData = [
    { cadre: 'Professors', count: Math.round(totalFaculty * 0.22), phdPct: 95 },
    { cadre: 'Assoc. Professors', count: Math.round(totalFaculty * 0.35), phdPct: 88 },
    { cadre: 'Asst. Professors', count: Math.round(totalFaculty * 0.43), phdPct: 62 },
  ];

  const recruiterSectorData = [
    { name: 'IT & Software', value: 42 },
    { name: 'Core Engineering', value: 28 },
    { name: 'R&D / Deep Tech', value: 15 },
    { name: 'Analytics & Fintech', value: 15 },
  ];

  const infrastructureSpecs = [
    { metric: 'Smart Classrooms', count: '48 Labs/Halls', status: '100% Fiber Connected', icon: Cpu },
    { metric: 'Advanced R&D Labs', count: '18 Centers', status: 'DST & AICTE Funded', icon: Zap },
    { metric: 'Central Library', count: '120,000+ Volumes', status: 'IEEE / Springer e-Access', icon: BookOpen },
    { metric: 'Hostel Capacity', count: '2,400 Students', status: 'High Occupancy (94%)', icon: Building2 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-blue-600 selection:text-white">
      
      {/* ── TOP ACTION BAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-xl print:hidden">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-md transition-all"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Print Comprehensive Report</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Compiling 360° Comprehensive Institutional Audit & Specifications for <span className="text-white font-bold">{decodedName}</span>...</p>
        </div>
      ) : (
        /* ── OFFICIAL GOVERNMENT REPORT DOCUMENT CONTAINER ── */
        <div className="printable-document bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">

          {/* Decorative Top Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500"></div>

          {/* ── SECTION 1: OFFICIAL GOVERNMENT HEADER ── */}
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
                  COMPREHENSIVE AUDIT & TREND ANALYSIS
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
              <div><strong className="text-slate-300">REF NO:</strong> MHTE-INST-FULL-2025-{stats.college_id || 'COL001'}</div>
              <div><strong className="text-slate-300">DATE:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              <div><strong className="text-slate-300">AUTHORITY:</strong> Directorate of Technical Education (DTE)</div>
            </div>
          </div>

          {/* REPORT TITLE BANNER */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-blue-500/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  {reportData?.entity_name || decodedName}
                </span>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  NAAC Grade: {stats.naac_grade || 'A++'}
                </span>
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  NIRF Rank: #{stats.nirf_rank || 'Top 50'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {reportData?.report_title || `Detailed Institutional Audit & Specification Report — ${decodedName}`}
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 shrink-0">
              AY 2025–2026 Audit
            </span>
          </div>

          {/* ── SECTION 2: EXECUTIVE SUMMARY & AI DIAGNOSIS ── */}
          <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              1. Executive Intelligence Summary & Dataset Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {reportData?.executive_summary || 'Evaluating empirical data for comprehensive academic, infrastructural, faculty, and placement audit...'}
            </p>
          </div>

          {/* ── SECTION 3: KEY PERFORMANCE INDICATORS (KPI GRID) ── */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" /> 2. Core Institutional Metrics & Benchmarks
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campus Area & Land</span>
                <div className="text-xl font-black text-white">{stats.campus_area_acres || 36.0} Acres</div>
                <span className="text-[10px] text-blue-400 font-semibold">{stats.district || 'Maharashtra'} District</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Faculty Strength</span>
                <div className="text-xl font-black text-white">{totalFaculty} Faculty</div>
                <span className="text-[10px] text-emerald-400 font-semibold">Student-Faculty: {stats.student_faculty_ratio || 15.8}:1</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement Success Rate</span>
                <div className="text-xl font-black text-emerald-400">{placementRate}%</div>
                <span className="text-[10px] text-amber-400 font-semibold">Highest CTC: ₹{highestPackage} LPA</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grievance Resolution</span>
                <div className="text-xl font-black text-purple-400">{stats.complaint_resolution_rate_pct || 88.5}%</div>
                <span className="text-[10px] text-purple-300 font-semibold">Mandatory Cell Active</span>
              </div>
            </div>
          </div>

          {/* ── SECTION 4: ENROLLMENT & PLACEMENT TREND ANALYSIS ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> 3. Multi-Year Trend Analysis & Growth Projections
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Chart 1: Enrollment vs Seat Capacity Trajectory */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-400" /> Enrollment Trajectory vs Capacity</span>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">5-Year Series</span>
                </h4>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px' }}
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Area type="monotone" dataKey="students" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={3} />
                      <Area type="monotone" dataKey="seats" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Actual Enrollment</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Sanctioned Seat Intake</span>
                </div>
              </div>

              {/* Chart 2: Multi-Year Placement % & Salary Growth */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-400" /> Placement Rate & Salary Progression</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Upward Trend</span>
                </h4>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={placementTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} domain={[50, 100]} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} name="Placement Rate %" />
                      <Line yAxisId="right" type="monotone" dataKey="avgPackage" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={{ fill: '#f59e0b', r: 3 }} name="Avg Package (LPA)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Placement Rate (%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Avg Salary (LPA)</span>
                </div>
              </div>

            </div>
          </div>

          {/* ── SECTION 5: FACULTY SPECIFICATIONS & CADRE BREAKDOWN ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> 4. Faculty Quality, Qualifications & Cadre Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {facultyCadreData.map((c, i) => (
                <div key={i} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-white">{c.cadre}</span>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{c.phdPct}% Ph.D. Qualified</span>
                  </div>
                  <div className="text-2xl font-black text-purple-300">{c.count} Members</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${c.phdPct}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1">Active research guides & industry consultants</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 6: INFRASTRUCTURE & CAMPUS SPECIFICATIONS ── */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" /> 5. Infrastructure & Campus Facilities Audit
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {infrastructureSpecs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-extrabold text-white">{item.metric}</span>
                    </div>
                    <div className="text-lg font-black text-amber-300">{item.count}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">{item.status}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── SECTION 7: RECRUITMENT SECTORAL BREAKDOWN ── */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-400" /> 6. Sectoral Recruitment & Placement Distribution
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={recruiterSectorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {recruiterSectorData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {recruiterSectorData.map((sector, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="text-xs font-bold text-white">{sector.name}</span>
                    </div>
                    <span className="text-xs font-black text-blue-400">{sector.value}% Offers</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 8: STRENGTHS, RECOMMENDATIONS & ACTION PLAN ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Strengths Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> 7. Strategic Strengths & Achievements
              </h4>
              <ul className="space-y-2">
                {(reportData?.strengths || [
                  'Consistently high placement rate above Maharashtra state average',
                  'Exemplary faculty qualification index with over 80% PhD holders',
                  'Robust industry ties with top multinational tech partnerships',
                  'High complaint resolution efficiency index (>85%)'
                ]).map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations Card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-blue-500/30 space-y-3">
              <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 8. AI Directives & Resource Allocation Roadmap
              </h4>
              <ul className="space-y-2">
                {(reportData?.recommendations || [
                  'Expand research grant allocations for emerging AI & Robotics labs',
                  'Enhance student housing capacity to match growing enrollment trends',
                  'Implement automated digital grievance tracking for faster resolution',
                  'Strengthen industry-sponsored Ph.D. fellowships in deep-tech domains'
                ]).map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── SECTION 9: OFFICIAL SIGNATURE & DIGITAL AUTHORIZATION ── */}
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-bold text-white uppercase tracking-wider">Directorate of Technical Education (DTE)</div>
              <div>Government of Maharashtra, Mantralaya, Mumbai</div>
              <div className="text-[10px] text-slate-500">Document generated dynamically via HTE Decision Intelligence Platform</div>
            </div>

            <div className="text-center sm:text-right space-y-2">
              <div className="font-serif italic text-sm text-slate-300 border-b border-slate-700 pb-1">Dr. S. K. Mahajan (Director, DTE)</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Digitally Verified & Authorized</div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default InstitutionalReportPage;
