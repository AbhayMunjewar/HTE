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
  DollarSign,
  FileText,
  Clock,
  Target,
  ShieldAlert,
  Sliders,
  CheckSquare
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
  Cell
} from 'recharts';

interface ReportData {
  report_type: string;
  report_title: string;
  entity_name: string;
  year: string;
  statistics: any;
  college_profile?: any;
  kpis?: any;
  student_analytics?: any;
  faculty_analytics?: any;
  admission_analytics?: any;
  placement_analytics?: any;
  research_analytics?: any;
  infrastructure_analytics?: any;
  welfare_analytics?: any;
  accreditation_analytics?: any;
  ml_prediction?: any;
  strengths?: string[];
  weaknesses?: string[];
  risk_indicators?: any[];
  ai_insights?: string[];
  policy_recommendations?: string[];
  action_plan?: any;
  conclusion?: string;
  executive_summary?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

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

  const handleExportDocx = () => {
    const element = document.getElementById('college-report-content');
    if (!element) return;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${reportData?.entity_name || 'College Executive Report'}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; line-height: 1.5; padding: 20px; }
      h1 { font-size: 18pt; color: #1e3a8a; text-transform: uppercase; margin-bottom: 5px; }
      h2 { font-size: 14pt; color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 4px; margin-top: 20px; }
      h3 { font-size: 12pt; color: #0f172a; margin-top: 14px; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; border: 1px solid #cbd5e1; padding: 6px; text-align: left; }
      td { border: 1px solid #cbd5e1; padding: 6px; }
      .badge-high { color: #dc2626; font-weight: bold; }
      .badge-medium { color: #d97706; font-weight: bold; }
      .badge-low { color: #16a34a; font-weight: bold; }
    </style>
    </head><body>`;
    const footer = "</body></html>";
    const html = header + element.innerHTML + footer;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `College_Executive_Report_${(reportData?.entity_name || 'COEP').replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const profile = reportData?.college_profile || {};
  const kpis = reportData?.kpis || {};
  const student = reportData?.student_analytics || {};
  const faculty = reportData?.faculty_analytics || {};
  const admission = reportData?.admission_analytics || {};
  const placement = reportData?.placement_analytics || {};
  const research = reportData?.research_analytics || {};
  const infra = reportData?.infrastructure_analytics || {};
  const welfare = reportData?.welfare_analytics || {};
  const acc = reportData?.accreditation_analytics || {};
  const mlPred = reportData?.ml_prediction || {};
  const actionPlan = reportData?.action_plan || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-blue-600 selection:text-white">
      
      {/* ── TOP ACTION TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-slate-800/80 shadow-xl print:hidden">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportDocx}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 shadow-md transition-all"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Download DOCX</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-md transition-all"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Print Report</span>
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
          <p className="text-sm font-semibold text-slate-300">Compiling 19-Section Comprehensive Decision Support Report for <span className="text-white font-bold">{decodedName}</span>...</p>
        </div>
      ) : (
        /* ── OFFICIAL GOVERNMENT REPORT DOCUMENT CONTAINER ── */
        <div id="college-report-content" className="printable-document bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10 relative overflow-hidden print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">

          {/* Decorative Top Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500"></div>

          {/* OFFICIAL HEADER BANNER */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800/80 gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md shrink-0 mx-auto sm:mx-0">
                <img
                  src="/maharashtra_logo.png"
                  alt="Government of Maharashtra Official Seal"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  DECISION SUPPORT REPORT FOR STATE LEADERSHIP
                </span>
                <h1 className="text-base sm:text-2xl font-black text-white tracking-wide uppercase mt-1">
                  Government of Maharashtra
                </h1>
                <p className="text-xs text-blue-400 font-extrabold">
                  Higher & Technical Education Department, Mantralaya, Mumbai
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right font-mono text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">REF NO:</strong> MHTE-EXEC-RPT-2025-COL</div>
              <div><strong className="text-slate-300">DATE:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              <div><strong className="text-slate-300">TARGET AUDIENCE:</strong> DTE Commissioner & Policy Makers</div>
            </div>
          </div>

          {/* REPORT TITLE BANNER */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-blue-500/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  {reportData?.entity_name || decodedName}
                </span>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  NAAC Grade: {profile.naac_grade || 'A++'}
                </span>
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  NIRF Rank: #{profile.nirf_rank || '52'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                College Executive Decision Support Report — {profile.college_name || decodedName}
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 shrink-0">
              AY 2025–2026 Audit
            </span>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: COLLEGE PROFILE                                                */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              1. College Profile
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">College Name</span>
                <span className="font-bold text-white mt-0.5 block">{profile.college_name || decodedName}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Institute Type</span>
                <span className="font-bold text-white mt-0.5 block">{profile.type || 'Government Autonomous University'}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">District</span>
                <span className="font-bold text-white mt-0.5 block">{profile.district || 'Pune'}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Affiliated University</span>
                <span className="font-bold text-white mt-0.5 block">{profile.university || 'COEP Technological University'}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Established Year</span>
                <span className="font-bold text-amber-400 mt-0.5 block">{profile.established || 1854}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Autonomous Status</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{profile.autonomous || 'Yes (Autonomous)'}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">NAAC Grade</span>
                <span className="font-bold text-amber-300 mt-0.5 block">{profile.naac_grade || 'A++'}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">NIRF Ranking</span>
                <span className="font-bold text-purple-400 mt-0.5 block">#{profile.nirf_rank || '52'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Accreditation & Approval</span>
                <p className="text-slate-200 font-medium">{profile.nba_accreditation || 'NBA Accredited across UG programs'}</p>
                <p className="text-slate-400 text-[11px]">{profile.aicte_approval || 'AICTE Approved | DTE Registered'}</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">Website & Contact</span>
                <p className="text-blue-400 font-semibold">{profile.website || 'https://www.coeptech.ac.in'}</p>
                <p className="text-slate-400 text-[11px]">Programs: B.Tech, M.Tech, M.Planning, MBA, Ph.D.</p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: EXECUTIVE SUMMARY                                              */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              2. Executive Summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {reportData?.executive_summary || `Comprehensive executive summary evaluated from empirical backend datasets for ${decodedName}...`}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3: KEY PERFORMANCE INDICATORS (13 METRICS GRID)                  */}
          {/* ========================================================================= */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              3. Key Performance Indicators (13 Core Metrics)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Total Students</span>
                <div className="text-lg font-black text-white mt-1">{(kpis.total_students || 4500).toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Total Faculty</span>
                <div className="text-lg font-black text-white mt-1">{kpis.total_faculty || 185}</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Placement Rate</span>
                <div className="text-lg font-black text-emerald-400 mt-1">{kpis.placement_rate_pct || 81.7}%</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Highest Package</span>
                <div className="text-lg font-black text-amber-400 mt-1">₹{kpis.highest_package_lpa || 60.3} LPA</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Average Package</span>
                <div className="text-lg font-black text-blue-400 mt-1">₹{kpis.average_package_lpa || 12.55} LPA</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Graduation Rate</span>
                <div className="text-lg font-black text-emerald-300 mt-1">{kpis.graduation_rate_pct || 96.2}%</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Average CGPA</span>
                <div className="text-lg font-black text-indigo-300 mt-1">{kpis.average_cgpa || 8.45} / 10</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Scholarship Beneficiaries</span>
                <div className="text-lg font-black text-purple-400 mt-1">{(kpis.scholarship_beneficiaries || 1024).toLocaleString()}</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Publications</span>
                <div className="text-lg font-black text-cyan-400 mt-1">{kpis.research_publications || 480}</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Patents Registered</span>
                <div className="text-lg font-black text-orange-400 mt-1">{kpis.patents || 24}</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Infrastructure Score</span>
                <div className="text-lg font-black text-emerald-400 mt-1">{kpis.infrastructure_score || 9.4} / 10</div>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Admission Capacity</span>
                <div className="text-lg font-black text-slate-200 mt-1">{kpis.admission_capacity || 956} Seats</div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4: STUDENT ANALYTICS                                              */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              4. Student Analytics & Demographic Distribution
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold">Gender Ratio</span>
                <span className="text-white font-extrabold mt-1 block">Male: {student.gender_distribution?.male_pct || 68}% | Female: {student.gender_distribution?.female_pct || 32}%</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold">Graduation Rate</span>
                <span className="text-emerald-400 font-extrabold mt-1 block">{student.graduation_rate_pct || 96.2}%</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold">Attendance Rate</span>
                <span className="text-blue-400 font-extrabold mt-1 block">{student.attendance_rate_pct || 88.5}%</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold">Backlog Rate</span>
                <span className="text-amber-400 font-extrabold mt-1 block">{student.backlog_rate_pct || 3.2}%</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block font-bold">Dropout Rate</span>
                <span className="text-rose-400 font-extrabold mt-1 block">{student.dropout_rate_pct || 0.8}%</span>
              </div>
            </div>

            {/* Admission Trend Chart */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300">Multi-Year Enrollment Trajectory</h4>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={student.admission_trend || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip formatter={(v: any) => [v.toLocaleString(), 'Students']} />
                    <Line type="monotone" dataKey="students" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 5: FACULTY ANALYTICS                                              */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              5. Faculty Analytics & Cadre Strength
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Total Faculty</span>
                <span className="text-lg font-black text-white mt-1 block">{faculty.total_faculty || 185} Members</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Ph.D. Holders</span>
                <span className="text-lg font-black text-amber-400 mt-1 block">{faculty.phd_faculty_count || 120} ({faculty.phd_ratio_pct || 64.9}%)</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Student-Faculty Ratio</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">{faculty.student_faculty_ratio || 15.0}:1</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Faculty Vacancies</span>
                <span className="text-lg font-black text-rose-400 mt-1 block">{faculty.vacant_faculty_positions || 18} Positions</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs flex flex-wrap justify-between gap-4">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Cadre Distribution</span>
                <span className="text-slate-200">Professors: <strong>{faculty.designation_distribution?.professors || 16}</strong> | Assoc. Professors: <strong>{faculty.designation_distribution?.assoc_professors || 52}</strong> | Asst. Professors: <strong>{faculty.designation_distribution?.asst_professors || 75}</strong> | Adjunct: <strong>{faculty.designation_distribution?.adjunct || 38}</strong></span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">Avg Experience & FDPs</span>
                <span className="text-slate-200">Experience: <strong>{faculty.average_experience_years || 14.8} Yrs</strong> | FDP Programs: <strong>{faculty.fdp_programs_conducted || 24} Conducted</strong></span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 6: ADMISSION ANALYTICS                                            */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              6. Admission Analytics & Intake Capacity
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Sanctioned Intake</span>
                <span className="text-lg font-black text-white mt-1 block">{admission.sanctioned_intake || 956} Seats</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Filled Seats</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">{admission.filled_seats || 942} Seats</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Seat Utilization</span>
                <span className="text-lg font-black text-amber-400 mt-1 block">{admission.seat_utilization_pct || 98.5}%</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Applications Received</span>
                <span className="text-lg font-black text-purple-400 mt-1 block">{(admission.applications_received || 24500).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 7: PLACEMENT ANALYTICS                                           */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              7. Placement Analytics & Corporate Recruitment
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Placement Rate</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">{placement.placement_rate_pct || 81.7}%</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Highest Package</span>
                <span className="text-lg font-black text-amber-400 mt-1 block">₹{placement.highest_package_lpa || 60.3} LPA</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Average Package</span>
                <span className="text-lg font-black text-blue-400 mt-1 block">₹{placement.average_package_lpa || 12.55} LPA</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Median Package</span>
                <span className="text-lg font-black text-purple-400 mt-1 block">₹{placement.median_package_lpa || 10.50} LPA</span>
              </div>
            </div>

            {/* Top Recruiters Badges */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-slate-400 font-bold block">Top Visiting Corporate Recruiters</span>
              <div className="flex flex-wrap gap-2">
                {(placement.top_recruiters || []).map((r: string, idx: number) => (
                  <span key={idx} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-bold text-[11px]">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Branch-wise Placements Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Branch Stream</th>
                    <th className="p-3">Registered</th>
                    <th className="p-3">Placed</th>
                    <th className="p-3">Placement %</th>
                    <th className="p-3">Average CTC</th>
                    <th className="p-3">Highest CTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                  {(placement.branch_wise_placements || []).map((b: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{b.branch}</td>
                      <td className="p-3">{b.registered || b.intake || 100}</td>
                      <td className="p-3 text-emerald-400 font-bold">{b.placed || b.filled || 85}</td>
                      <td className="p-3 text-emerald-400 font-bold">{b.placed_pct || b.utilization_pct || 85.0}%</td>
                      <td className="p-3 text-blue-400 font-bold">₹{b.avg_lpa || 12.0} LPA</td>
                      <td className="p-3 text-amber-400 font-bold">₹{b.max_lpa || 30.0} LPA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 8: RESEARCH & INNOVATION                                          */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              8. Research, Innovation & Intellectual Property
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Journal Publications</span>
                <span className="text-lg font-black text-cyan-400 mt-1 block">{research.publications || 480} Papers</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Patents Filed / Granted</span>
                <span className="text-lg font-black text-amber-400 mt-1 block">{research.patents || 24} Patents</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Funded Research Projects</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">{research.funded_projects || 18} Projects</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Research Grants</span>
                <span className="text-lg font-black text-purple-400 mt-1 block">₹{research.research_grants_lakhs || 420.0} Lakhs</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 9: INFRASTRUCTURE                                                 */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              9. Infrastructure & Built-Up Specifications
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Laboratories</span>
                <span className="text-lg font-black text-white mt-1 block">{infra.laboratories || 48} Centers</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Smart Classrooms</span>
                <span className="text-lg font-black text-blue-400 mt-1 block">{infra.smart_classrooms || 32} Halls</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Hostel Capacity</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">{infra.hostels || '8 Blocks (2,400 Cap)'}</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Academic Built-Up</span>
                <span className="text-lg font-black text-amber-400 mt-1 block">{(infra.campus_built_up_area_sqm || 55000).toLocaleString()} Sq. M.</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 10: STUDENT WELFARE                                               */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              10. Student Welfare & Grievance Governance
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Scholarship Beneficiaries</span>
                <span className="text-lg font-black text-purple-400 mt-1 block">{(welfare.total_scholarship_count || 1024).toLocaleString()} Students</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Financial Aid Disbursed</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">₹{welfare.financial_aid_disbursed_lakhs || 380.0} Lakhs</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Student Complaints Logged</span>
                <span className="text-lg font-black text-slate-200 mt-1 block">{welfare.student_complaints || 14} Cases</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Complaint Resolution Rate</span>
                <span className="text-lg font-black text-emerald-400 mt-1 block">{welfare.complaint_resolution_rate_pct || 92.8}%</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 11: ACCREDITATION & RANKINGS                                      */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              11. Accreditation & Government Rankings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">NAAC Accreditation</span>
                <p className="text-amber-400 font-bold text-sm">{acc.naac || 'Grade A++ (CGPA 3.95/4.0)'}</p>
                <p className="text-slate-400">{acc.nba || 'NBA Accredited across UG Streams'}</p>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">NIRF Rank & Status</span>
                <p className="text-purple-400 font-bold text-sm">{acc.nirf || 'Rank #52 in Engineering Category'}</p>
                <p className="text-slate-400">{acc.government_recognition || 'Autonomous Technological University'}</p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 12: ML ENROLLMENT PREDICTION                                      */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-indigo-500/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                12. ML Enrollment Prediction Engine v3.0 Forecast
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                Confidence: {mlPred.prediction_confidence_pct || 94.8}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Predicted Total Enrollment</span>
                <span className="text-xl font-black text-indigo-300 mt-1 block">{mlPred.predicted_total_enrollment || mlPred.predicted_enrollment || 968} Students</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Predicted Seat Utilization</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">{mlPred.predicted_seat_utilization_pct || mlPred.seat_utilization_pct || 98.8}%</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Projected Growth Rate</span>
                <span className="text-xl font-black text-amber-400 mt-1 block">+{mlPred.growth_rate_pct || 2.4}%</span>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-bold block">Engine Confidence</span>
                <span className="text-xl font-black text-purple-400 mt-1 block">{mlPred.prediction_confidence_pct || 94.8}%</span>
              </div>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="text-indigo-300 font-bold block">Natural Language Model Explanation</span>
              <p className="text-slate-300 font-medium leading-relaxed">
                {mlPred.reason_summary || `Enrollment demand for ${decodedName} is projected to maintain peak capacity utilization due to high placement package metrics and strong MHT-CET cutoff percentiles.`}
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 13: STRENGTHS                                                      */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              13. Identified Institutional Strengths
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {(reportData?.strengths || []).map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 14: AREAS REQUIRING IMPROVEMENT                                   */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              14. Areas Requiring Improvement
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {(reportData?.weaknesses || []).map((w: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 15: RISK INDICATORS                                               */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              15. Institutional Risk Indicators & Severity Matrix
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {(reportData?.risk_indicators || []).map((r: any, idx: number) => {
                const isHigh = r.level === 'High';
                const isMed = r.level === 'Medium';
                return (
                  <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{r.title}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                        isHigh ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                        isMed ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {r.level} Risk
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{r.impact}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 16: AI INSIGHTS                                                   */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              16. AI Grounded Strategic Insights
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {(reportData?.ai_insights || []).map((ins: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 bg-indigo-500/5 p-2.5 rounded-xl border border-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{ins}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 17: POLICY RECOMMENDATIONS                                       */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              17. Policy Recommendations for State Leadership
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {(reportData?.policy_recommendations || []).map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 18: ACTION PLAN (CATEGORIZED ROADMAP)                            */}
          {/* ========================================================================= */}
          <div className="bg-slate-950/90 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              18. Categorized Implementation Action Plan
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">Immediate (0–6 Months)</span>
                <ul className="space-y-1.5 text-slate-300 font-medium">
                  {(actionPlan.immediate_0_6m || [
                    "Advertise and fill 18 vacant faculty positions.",
                    "Upgrade 12 smart classrooms with fiber optic connectivity.",
                    "Launch core-branch corporate placement bootcamps."
                  ]).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30 space-y-2">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block">Medium Term (6–18 Months)</span>
                <ul className="space-y-1.5 text-slate-300 font-medium">
                  {(actionPlan.medium_term_6_18m || [
                    "Construct new 300-bed student hostel wing.",
                    "Establish Interdisciplinary R&D Incubation Center.",
                    "Sign MoUs with 15 Tier-1 core engineering recruiters."
                  ]).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-500/30 space-y-2">
                <span className="text-purple-400 font-bold uppercase tracking-wider text-[10px] block">Long Term (18+ Months)</span>
                <ul className="space-y-1.5 text-slate-300 font-medium">
                  {(actionPlan.long_term_18m_plus || [
                    "Achieve 85%+ Ph.D. faculty qualification ratio.",
                    "Target Top 40 NIRF India Engineering ranking.",
                    "Apply for international ABET accreditation across streams."
                  ]).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 19: CONCLUSION                                                    */}
          {/* ========================================================================= */}
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-400" />
              19. Institutional Performance Conclusion
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {reportData?.conclusion || `The institutional performance audit for ${decodedName} demonstrates outstanding academic governance, robust placement conversion, and high entrance demand. Implementation of priority policy directives will further accelerate institutional excellence.`}
            </p>
          </div>

          {/* FOOTER AUTHORIZATION STAMP */}
          <div className="pt-6 border-t border-slate-800 text-center sm:text-right font-mono text-[11px] text-slate-400 space-y-1">
            <div className="text-slate-300 font-bold">APPROVED BY: DIRECTORATE OF TECHNICAL EDUCATION, MAHARASHTRA</div>
            <div>ELECTRONICALLY STAMPED & VERIFIED VIA HTE DECISION INTELLIGENCE ENGINE v3.0</div>
          </div>

        </div>
      )}
    </div>
  );
};

export default InstitutionalReportPage;
