import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Award, 
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  RotateCcw,
  Building2,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  FileText,
  DollarSign,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  RefreshCw,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';
import { dashboardMetrics as defaultMetrics, mockColleges } from '../data/mockData';
import { cn } from '../lib/utils';

interface CollegeItem {
  id: string;
  name: string;
  district: string;
  naacGrade: string;
  university: string;
  totalStudents: number;
  facultyCount: number;
  placementRate: number;
  averageCgpa: number;
  nirfRank: string;
  type: string;
}

export const Dashboard: React.FC = () => {
  // Global Filter & Search States
  const [colleges, setColleges] = useState<CollegeItem[]>(
    mockColleges.map(c => ({
      ...c,
      nirfRank: String(c.nirfRank || 'Not Ranked')
    }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<CollegeItem | null>(null);

  // Filters
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterYear, setFilterYear] = useState('2025');
  const [filterNaac, setFilterNaac] = useState('');
  const [filterPlacement, setFilterPlacement] = useState('');

  // Collapsible Accordion Sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    students: true,
    faculty: true,
    placements: true,
    research: false,
    infrastructure: false,
    finance: false,
    complaints: false,
  });

  // ML Prediction Result State
  const [predicting, setPredicting] = useState(false);
  const [predResult, setPredResult] = useState<any>({
    predicted_enrollment: 117,
    admission_capacity: 120,
    seat_utilization_pct: 97.7,
    growth_rate_pct: 17.0,
    prediction_confidence_pct: 60.0,
    prediction_std_dev: 67.99,
    reason_summary: 'High capacity utilization (97.7%) driven by strong reputation, demand ratio (3.33x), placement rate (80.0%), and NAAC grade (A++).',
    top_influencing_features: [
      { feature: 'college_type', importance: 0.2802, value: 1.0, impact: 'High reputation' },
      { feature: 'total_students', importance: 0.2260, value: 3800, impact: 'High capacity' },
      { feature: 'demand_ratio', importance: 0.0850, value: 3.33, impact: '3.33x demand pressure' },
      { feature: 'placement_reputation', importance: 0.0572, value: 80.0, impact: 'High placement' },
    ]
  });

  // Fetch real colleges from backend
  useEffect(() => {
    fetchCollegesData();
  }, []);

  // Dynamic API Search on Search Query change
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const delayDebounceFn = setTimeout(() => {
        searchCollegesApi(searchQuery);
      }, 200);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  // Run prediction whenever selected college changes
  useEffect(() => {
    if (selectedCollege) {
      runPredictionForCollege(selectedCollege);
    }
  }, [selectedCollege, filterYear]);

  const fetchCollegesData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/colleges?limit=150");
      if (res.ok) {
        const data = await res.json();
        if (data.colleges && data.colleges.length > 0) {
          // Merge API colleges with default premier colleges so VJTI/COEP/ICT are always present
          const existingIds = new Set(data.colleges.map((c: any) => c.id));
          const defaults = mockColleges.map(c => ({ ...c, nirfRank: String(c.nirfRank || 'Not Ranked') }))
            .filter(c => !existingIds.has(c.id));
          setColleges([...data.colleges, ...defaults]);
        }
      }
    } catch (e) {
      console.warn("Backend colleges API offline, using dataset defaults.");
    }
  };

  const searchCollegesApi = async (query: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/colleges?search=${encodeURIComponent(query)}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        if (data.colleges && data.colleges.length > 0) {
          setColleges(prev => {
            const map = new Map(prev.map(c => [c.id, c]));
            data.colleges.forEach((c: any) => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      }
    } catch (e) {
      // ignore offline
    }
  };

  const runPredictionForCollege = async (col: CollegeItem) => {
    setPredicting(true);
    try {
      const payload = {
        college_name: col.name,
        target_year: parseInt(filterYear, 10) || 2025,
        district: col.district,
        sanctioned_seats: 120,
        filled_seats: 100,
        applications: 400,
        placement_rate: col.placementRate,
        avg_package: 12.0,
        cutoff_percentile: 90.0,
        faculty_count: col.facultyCount,
        naac_grade: col.naacGrade,
        autonomous: "Yes"
      };

      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setPredResult(data);
      }
    } catch (e) {
      console.warn("Predict API offline, using internal calculation:", e);
    } finally {
      setPredicting(false);
    }
  };

  // Autocomplete Suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return colleges.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.district.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery, colleges]);

  const handleSelectCollege = (col: CollegeItem) => {
    setSelectedCollege(col);
    setSearchQuery(col.name);
    setShowSearchDropdown(false);
  };

  const handleResetFilters = () => {
    setSelectedCollege(null);
    setSearchQuery('');
    setFilterDistrict('');
    setFilterDept('');
    setFilterYear('2025');
    setFilterNaac('');
    setFilterPlacement('');
  };

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic Metrics depending on selection
  const activeMetrics = useMemo(() => {
    if (!selectedCollege) {
      return {
        totalStudents: defaultMetrics.totalStudents,
        totalColleges: colleges.length > 0 ? colleges.length : 2000,
        totalFaculty: defaultMetrics.totalFaculty,
        placementRate: defaultMetrics.placementRate,
        averageCgpa: defaultMetrics.averageCgpa,
        scholarshipStudents: defaultMetrics.scholarshipStudents,
        complaints: 124,
        infraScore: 8.4,
      };
    }
    return {
      totalStudents: selectedCollege.totalStudents,
      totalColleges: 1,
      totalFaculty: selectedCollege.facultyCount,
      placementRate: selectedCollege.placementRate,
      averageCgpa: selectedCollege.averageCgpa,
      scholarshipStudents: Math.round(selectedCollege.totalStudents * 0.3),
      complaints: Math.floor(Math.random() * 5) + 1,
      infraScore: selectedCollege.naacGrade.includes('A') ? 9.2 : 7.8,
    };
  }, [selectedCollege, colleges]);

  // AI Generated Insights based on context
  const aiInsights = useMemo(() => {
    if (selectedCollege) {
      return [
        { type: 'positive', title: `High Applicant Demand (${selectedCollege.name.split(' ')[0]})`, text: `Applications exceed capacity by 3.3x for ${filterYear}. Projected 96%+ utilization.` },
        { type: 'positive', title: 'Placement Momentum', text: `Placement rate at ${selectedCollege.placementRate}% with strong core branch recruitment.` },
        { type: 'warning', title: 'Faculty & Lab Ratio', text: `Faculty-student ratio is 1:${Math.round(selectedCollege.totalStudents / selectedCollege.facultyCount)}. Additional smart classrooms recommended.` },
      ];
    }
    return [
      { type: 'positive', title: 'State Enrollment Growth', text: 'Admissions increased by 4.2% YoY across Pune & Mumbai technical hubs.' },
      { type: 'positive', title: 'Placement Performance', text: 'Overall recruitment improved 5.1% with Computer & IT branches leading.' },
      { type: 'warning', title: 'District Capacity Alert', text: 'Tier-2 & Rural engineering college vacancy rate at 22%. Targeted scholarship incentives active.' },
    ];
  }, [selectedCollege, filterYear]);

  const formatNum = (n: number) => n >= 100000 ? (n/100000).toFixed(2) + 'L' : (n >= 1000 ? (n/1000).toFixed(1) + 'K' : n.toString());

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP EXECUTIVE GLOBAL SEARCH BAR WITH AUTOCOMPLETE */}
      <div className="bg-slate-900 rounded-xl p-5 text-white shadow-xl relative z-30 border border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Government Executive Decision Support Mode
            </span>
            <h1 className="text-xl font-bold mt-1 text-white">
              Maharashtra Higher & Technical Education Intelligence Platform
            </h1>
          </div>

          {selectedCollege && (
            <div className="flex items-center gap-2 bg-blue-600/30 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/30 text-xs font-semibold">
              <Building2 className="w-4 h-4 text-blue-400" />
              Active Context: <span className="text-white">{selectedCollege.name.split(' (')[0]}</span>
              <button onClick={() => setSelectedCollege(null)} className="ml-2 hover:text-white font-bold">×</button>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search by College Name (e.g. VJTI, COEP), District (Pune, Mumbai), Department, University..."
              className="w-full pl-12 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCollege(null); }}
                className="absolute right-4 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSearchDropdown && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-0 right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-slate-700/50"
              >
                {searchSuggestions.map((col) => (
                  <div
                    key={col.id}
                    onClick={() => handleSelectCollege(col)}
                    className="p-3.5 hover:bg-slate-700/70 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">{col.name}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-400" /> {col.district} • {col.type}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/20">
                      {col.naacGrade} Grade
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. MODERN FILTER BAR BELOW SEARCH */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 uppercase tracking-wider text-[11px] pr-2 border-r border-slate-200">
            <Filter className="w-4 h-4 text-blue-600" /> Filters
          </div>

          {/* College Filter */}
          <select
            value={selectedCollege ? selectedCollege.id : ''}
            onChange={(e) => {
              const c = colleges.find(item => item.id === e.target.value);
              setSelectedCollege(c || null);
              if (c) setSearchQuery(c.name);
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Institutions (Overall State)</option>
            {colleges.map(c => (
              <option key={c.id} value={c.id}>{c.name.split(' (')[0]}</option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Districts</option>
            <option value="Pune">Pune</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Nashik">Nashik</option>
            <option value="Aurangabad">Aurangabad</option>
            <option value="Sangli">Sangli</option>
            <option value="Latur">Latur</option>
          </select>

          {/* Department Filter */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Departments</option>
            <option value="Computer">Computer Engineering</option>
            <option value="IT">Information Technology</option>
            <option value="Mechanical">Mechanical Engineering</option>
            <option value="Civil">Civil Engineering</option>
            <option value="Electrical">Electrical Engineering</option>
          </select>

          {/* Academic Year */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="2025">AY 2025 - 2026</option>
            <option value="2026">AY 2026 - 2027</option>
            <option value="2024">AY 2024 - 2025</option>
          </select>

          {/* NAAC Grade */}
          <select
            value={filterNaac}
            onChange={(e) => setFilterNaac(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All NAAC Grades</option>
            <option value="A++">A++</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="B++">B++</option>
          </select>
        </div>

        <button
          onClick={handleResetFilters}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reset Filters
        </button>
      </div>

      {/* 3. COLLEGE OVERVIEW BANNER (Appears when College is selected) */}
      {selectedCollege && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-inner shrink-0">
                {selectedCollege.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {selectedCollege.naacGrade} Grade
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    NIRF #{selectedCollege.nirfRank}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    {selectedCollege.type}
                  </span>
                </div>
                <h2 className="text-xl font-bold mt-1 text-white">{selectedCollege.name}</h2>
                <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> {selectedCollege.district} District • {selectedCollege.university}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold">Overall Rating</div>
              <div className="text-2xl font-bold text-amber-300 mt-0.5">★ {selectedCollege.averageCgpa} / 10</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Placement: {selectedCollege.placementRate}%</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. DYNAMIC EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Total Students</div>
          <div className="text-xl font-bold text-slate-900">{formatNum(activeMetrics.totalStudents)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/> +4.2% YoY</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Total Faculty</div>
          <div className="text-xl font-bold text-slate-900">{activeMetrics.totalFaculty}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/> +2.8% YoY</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Placement Rate</div>
          <div className="text-xl font-bold text-emerald-600">{activeMetrics.placementRate}%</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/> +5.1% YoY</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Average CGPA</div>
          <div className="text-xl font-bold text-slate-900">{activeMetrics.averageCgpa}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/> Top 10%</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Publications</div>
          <div className="text-xl font-bold text-purple-600">1,240</div>
          <div className="text-[10px] text-purple-600 font-semibold mt-1">Research Index</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Scholarship</div>
          <div className="text-xl font-bold text-slate-900">{formatNum(activeMetrics.scholarshipStudents)}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">+8.4% Beneficiaries</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Complaints</div>
          <div className="text-xl font-bold text-amber-600">{activeMetrics.complaints}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-1">Avg 3d Resolve</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold mb-1">Infra Rating</div>
          <div className="text-xl font-bold text-blue-600">{activeMetrics.infraScore}/10</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-1">Smart Ready</div>
        </div>
      </div>

      {/* 5. AI AUTOMATED INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map((insight, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 shadow-sm">
            <div className={`p-2 rounded-lg shrink-0 ${insight.type === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">{insight.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 6. ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Student Admission Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Historical Admission & Enrollment Trend
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultMetrics.studentAdmissionTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v: any) => [`${(Number(v)/1000).toFixed(1)}k Students`, 'Enrolled']} />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Branch Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            Branch Enrollment Breakdown
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultMetrics.studentsByBranch}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip formatter={(v: any) => [`${v} Students`, 'Count']} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 7. HIGHLIGHTED AI PREDICTION CARD (INTEGRATED ON DASHBOARD) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                AI Predictive Engine v3.0
              </span>
              {predicting && <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
            </div>
            <h3 className="text-2xl font-bold text-white">
              Enrollment Forecast: {selectedCollege ? selectedCollege.name : "Maharashtra State Aggregate"}
            </h3>
            <p className="text-xs text-blue-200 leading-relaxed font-medium">
              {predResult.reason_summary}
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-md shrink-0">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Predicted Enrollment</div>
              <div className="text-3xl font-bold text-white">{predResult.predicted_enrollment} <span className="text-sm font-normal text-blue-200">/ 120 Seats</span></div>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Seat Fill %</div>
              <div className="text-3xl font-bold text-emerald-400">{predResult.seat_utilization_pct}%</div>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Confidence</div>
              <div className="text-xl font-bold text-amber-300">{predResult.prediction_confidence_pct}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. COLLAPSIBLE COLLEGE INTELLIGENCE SECTIONS (SINGLE WORKSPACE) */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Institutional Intelligence Modules (Dataset/CSVs)
        </h3>

        {/* Accordion 1: Students Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('students')}
            className="w-full p-4 text-left font-bold text-slate-800 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-sm"
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Students Overview & Demographics
            </span>
            {openSections['students'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openSections['students'] && (
            <div className="p-4 border-t border-slate-200 text-xs space-y-3">
              <p className="text-slate-600">Active student statistics from <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600">students.csv</code>.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-semibold text-slate-700">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Average CGPA: <span className="text-blue-600 font-bold">{activeMetrics.averageCgpa}</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Attendance Rate: <span className="text-emerald-600 font-bold">84.5%</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Scholarship Count: <span className="text-purple-600 font-bold">{formatNum(activeMetrics.scholarshipStudents)}</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Backlog Rate: <span className="text-amber-600 font-bold">4.2%</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Faculty Overview */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('faculty')}
            className="w-full p-4 text-left font-bold text-slate-800 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-sm"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600" /> Faculty & Academic Qualifications
            </span>
            {openSections['faculty'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openSections['faculty'] && (
            <div className="p-4 border-t border-slate-200 text-xs space-y-3">
              <p className="text-slate-600">Teaching staff metrics from <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-600">faculty.csv</code>.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-semibold text-slate-700">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Total Faculty: <span className="text-purple-700 font-bold">{activeMetrics.totalFaculty}</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">PhD Qualified: <span className="text-emerald-600 font-bold">68%</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Permanent Staff: <span className="text-blue-600 font-bold">75%</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Avg Experience: <span className="text-slate-900 font-bold">12.4 Yrs</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: Placement Analytics */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('placements')}
            className="w-full p-4 text-left font-bold text-slate-800 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-sm"
          >
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" /> Placement Analytics & Salary Packages
            </span>
            {openSections['placements'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openSections['placements'] && (
            <div className="p-4 border-t border-slate-200 text-xs space-y-3">
              <p className="text-slate-600">Recruitment drive tracking from <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-600">placements.csv</code>.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-semibold text-slate-700">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Placement Rate: <span className="text-emerald-600 font-bold">{activeMetrics.placementRate}%</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Highest Package: <span className="text-slate-900 font-bold">₹42.0 LPA</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Average Package: <span className="text-blue-600 font-bold">₹8.5 LPA</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Internship Completion: <span className="text-purple-600 font-bold">82%</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 4: Infrastructure & Facilities */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => toggleSection('infrastructure')}
            className="w-full p-4 text-left font-bold text-slate-800 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-sm"
          >
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600" /> Infrastructure & Facility Ratings
            </span>
            {openSections['infrastructure'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {openSections['infrastructure'] && (
            <div className="p-4 border-t border-slate-200 text-xs space-y-3">
              <p className="text-slate-600">Facility metrics from <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-600">infrastructure.csv</code>.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-semibold text-slate-700">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Smart Classrooms: <span className="text-amber-600 font-bold">24 Rooms</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Internet Speed: <span className="text-blue-600 font-bold">500 Mbps</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Hostel Capacity: <span className="text-emerald-600 font-bold">850 Beds</span></div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">Solar Power: <span className="text-emerald-600 font-bold">Enabled</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
