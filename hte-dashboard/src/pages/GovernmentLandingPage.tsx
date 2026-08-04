import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Landmark,
  TrendingUp,
  Bot,
  FileBarChart,
  Layers,
  Activity,
  Sparkles,
  ChevronRight,
  Users,
  GraduationCap,
  Award,
  CheckCircle2,
  ArrowRight,
  Globe,
  Database,
  LineChart,
  BarChart3,
  Cpu
} from 'lucide-react';

/* ─── Count-Up Animation Hook ─── */
const useCountUp = (target: number, duration: number = 1800, start: boolean = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
};

const CountUpNumber: React.FC<{ value: string }> = ({ value }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Parse numeric part from value like "2,000+", "612,450", "₹450 Cr+", "95.0%", "24"
  const numericMatch = value.replace(/[₹,]/g, '').match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const isDecimal = value.includes('.');
  const prefix = value.startsWith('₹') ? '₹' : '';
  const suffix = value.replace(/^[₹]?[\d,.]+/, ''); // e.g. "+", " Cr+", "%"
  
  const animatedNum = useCountUp(Math.floor(numericValue), 1800, visible);

  const formatNumber = (n: number) => {
    if (isDecimal) return n.toFixed(1);
    return n.toLocaleString('en-IN');
  };

  return (
    <div ref={ref} className="text-base sm:text-lg font-black text-white tracking-tight">
      {visible ? `${prefix}${formatNumber(animatedNum)}${suffix}` : value}
    </div>
  );
};

export const GovernmentLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activePreviewTab, setActivePreviewTab] = useState<'state' | 'college' | 'ai' | 'reports'>('state');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchDashboard = () => {
    navigate('/dashboard');
  };

  const handleLaunchAiAssistant = () => {
    navigate('/ai-assistant');
  };

  const handleLaunchColleges = () => {
    navigate('/colleges');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Background Decorative Glow Blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="fixed top-1/3 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      {/* ========================================================================= */}
      {/* SECTION 1: GOVERNMENT HEADER                                             */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl py-3'
            : 'bg-slate-950/70 backdrop-blur-md border-b border-slate-800/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Government Logo & Department Name */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md shrink-0">
              <img
                src="/maharashtra_logo.png"
                alt="Government of Maharashtra Official Seal"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-wide uppercase">
                  Government of Maharashtra
                </h1>
                <span className="hidden sm:inline-block text-[9px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Official Portal
                </span>
              </div>
              <p className="text-[11px] text-blue-400 font-semibold tracking-tight">
                Higher & Technical Education Department
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#home" className="hover:text-amber-400 transition-colors py-1">Home</a>
            <a href="#stats" className="hover:text-amber-400 transition-colors py-1">Statistics</a>
            <a href="#features" className="hover:text-amber-400 transition-colors py-1">Features</a>
            <a href="#workflow" className="hover:text-amber-400 transition-colors py-1">Workflow</a>
            <a href="#preview" className="hover:text-amber-400 transition-colors py-1">Dashboard Preview</a>
            <a href="#why" className="hover:text-amber-400 transition-colors py-1">Why This Platform</a>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLaunchDashboard}
              className="relative group bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 border border-blue-400/40 flex items-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      <div className="pt-24" id="home"></div>

      {/* ========================================================================= */}
      {/* SECTION 2: HERO SECTION                                                   */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Government Emblem Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300 font-bold">Government Digital Platform</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">Higher & Technical Education Department</span>
            </div>

            {/* Large Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              AI-Powered Higher & Technical Education{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
                Decision Intelligence Platform
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-medium leading-relaxed max-w-3xl mx-auto">
              Empowering Government Officials with Real-Time Analytics, Predictive Enrollment Modeling, 
              AI-Powered Decision Support, and Smart Educational Governance across Maharashtra.
            </p>

            {/* Large CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleLaunchDashboard}
                className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl shadow-xl shadow-blue-600/35 border border-blue-400/40 flex items-center gap-2.5 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <LayoutDashboardIcon />
                <span>Launch Executive Dashboard</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={handleLaunchAiAssistant}
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-700/80 hover:border-blue-500/50 flex items-center gap-2.5 transition-all duration-200 shadow-lg backdrop-blur-md"
              >
                <Bot className="w-4 h-4 text-blue-400" />
                <span>Try AI Assistant</span>
              </button>

              <button
                onClick={handleLaunchColleges}
                className="bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-800 flex items-center gap-2 transition-all duration-200"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>View Colleges Directory</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Grounded RAG Intelligence
              </span>
              <span className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <Database className="w-3.5 h-3.5 text-blue-400" /> 2,000+ Colleges SQLite Sync
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Cpu className="w-3.5 h-3.5 text-amber-400" /> ML v3.0 Predictive Engine
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: PLATFORM STATISTICS (KPI COUNT-UP CARDS)                      */}
      {/* ========================================================================= */}
      <section className="py-12 bg-slate-900/60 border-y border-slate-800/80 relative" id="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Statewide Coverage
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Higher & Technical Education Ecosystem in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {[
              { label: 'Total Colleges', value: '3,726+', icon: Building2, color: 'from-blue-600 to-indigo-600' },
              { label: 'State Universities', value: '24', icon: Landmark, color: 'from-indigo-600 to-purple-600' },
              { label: 'Enrolled Students', value: '39,22,128', icon: Users, color: 'from-emerald-600 to-teal-600' },
              { label: 'Approved Faculty', value: '226,713', icon: GraduationCap, color: 'from-amber-600 to-orange-600' },
              { label: 'Districts Covered', value: '36', icon: Globe, color: 'from-cyan-600 to-blue-600' },
              { label: 'Scholarships', value: '₹450 Cr+', icon: Award, color: 'from-purple-600 to-pink-600' },
              { label: 'Placement Rate', value: '95.0%', icon: TrendingUp, color: 'from-blue-600 to-emerald-600' },
              { label: 'Annual Admissions', value: '185,000', icon: Activity, color: 'from-orange-600 to-amber-600' },
            ].map((kpi, idx) => {
              const IconComp = kpi.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-950/80 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-800/90 hover:border-blue-500/40 transition-all duration-200 text-center shadow-lg group"
                >
                  <div className={`w-8 h-8 mx-auto rounded-xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-md mb-2 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <CountUpNumber value={kpi.value} />
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{kpi.label}</div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PLATFORM FEATURES                                             */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 relative" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Governance Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Purpose-built tools empowering decision-makers across the Directorate of Technical Education and Ministry officials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layers,
                title: 'Unified State Dashboard',
                desc: 'Real-time monitoring and holistic aggregation across all 36 districts and 2,000+ technical institutions.',
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
              },
              {
                icon: Building2,
                title: 'College Intelligence',
                desc: 'Granular analytics for individual colleges including enrollment trends, faculty ratios, packages, and NAAC grades.',
                color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
              },
              {
                icon: Cpu,
                title: 'Enrollment Prediction Engine',
                desc: 'Machine Learning v3.0 predictive model forecasting student intake and seat vacancy risks before CAP rounds.',
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              },
              {
                icon: Bot,
                title: 'AI Decision Assistant',
                desc: 'Grounded document intelligence powered by Llama-3.3-70B and isolated FAISS indexes for instant RAG search.',
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              },
              {
                icon: FileBarChart,
                title: 'Policy Reports & Exports',
                desc: 'Automated executive summary generation and instant Excel / PDF downloads for ministry meetings.',
                color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
              },
              {
                icon: ShieldCheck,
                title: 'Decision Support System',
                desc: 'Evidence-based frameworks assisting resource allocation, grant distribution, and capacity planning.',
                color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
              },
              {
                icon: BarChart3,
                title: 'Interactive Analytics',
                desc: 'Multi-dimensional drill-down filters by academic year, district, branch, college type, and gender intake.',
                color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
              },
              {
                icon: Sparkles,
                title: 'Real-Time Insights',
                desc: 'Automated root-cause diagnostics and strategic actionable recommendations for placement & enrollment boost.',
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              },
            ].map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-xl group flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl border ${feat.color} flex items-center justify-center shadow-inner`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-extrabold text-white tracking-tight">{feat.title}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center text-[11px] font-extrabold text-blue-400 group-hover:text-amber-400 transition-colors">
                    <span>Explore Feature</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: PLATFORM WORKFLOW (HORIZONTAL TIMELINE)                       */}
      {/* ========================================================================= */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800/80 relative" id="workflow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              End-to-End Decision Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              From raw institutional data ingestion to evidence-based policy formulation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Collect Data', desc: 'Ingests records from 2,000+ colleges, DTE CAP rounds, and institutional PDFs.', icon: Database },
              { step: '02', title: 'Analyze', desc: 'Cleans, aggregates, and computes composite KPI metrics across 36 districts.', icon: BarChart3 },
              { step: '03', title: 'Predict', desc: 'Runs ML v3.0 predictive pipeline forecasting enrollment and seat utilization.', icon: Cpu },
              { step: '04', title: 'Generate Insights', desc: 'Retrieves RAG document context and generates root-cause diagnostics.', icon: Sparkles },
              { step: '05', title: 'Support Policy', desc: 'Provides ministry leaders with evidence-based policy frameworks.', icon: Landmark },
            ].map((wk, idx) => {
              const IconComp = wk.icon;
              return (
                <div key={idx} className="relative bg-slate-950/80 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all duration-200 text-center shadow-lg group">
                  <div className="text-[10px] font-black text-amber-400 bg-amber-500/10 w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                    {wk.step}
                  </div>
                  <div className="w-10 h-10 mx-auto rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400 mb-3 group-hover:text-amber-400 transition-colors">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold text-white mb-1">{wk.title}</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal">{wk.desc}</p>

                  {idx < 4 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: DASHBOARD PREVIEW (MOCK CONTAINERS)                            */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 relative" id="preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Interactive Preview
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              State-of-the-Art Decision Support Interface
            </h2>
          </div>

          {/* Preview Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 flex gap-2 text-xs font-bold shadow-xl">
              {[
                { id: 'state', label: 'State Overview Dashboard', icon: LayoutDashboardIcon },
                { id: 'college', label: 'College Directory & RAG', icon: Building2 },
                { id: 'ai', label: 'AI Intelligence Assistant', icon: Bot },
                { id: 'reports', label: 'Policy Reports & ML', icon: FileBarChart },
              ].map((tab) => {
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePreviewTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activePreviewTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mock Screen Container */}
          <div className="bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                <span className="text-xs font-bold text-slate-400 ml-2 font-mono">https://hte.maharashtra.gov.in/portal/dashboard</span>
              </div>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Live Preview
              </span>
            </div>

            {activePreviewTab === 'state' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Active Students</span>
                    <div className="text-xl font-extrabold text-white mt-1">3,922,128</div>
                    <span className="text-[10px] text-emerald-400 font-bold">↑ +4.2% YoY Growth</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Monitored Colleges</span>
                    <div className="text-xl font-extrabold text-white mt-1">3,726</div>
                    <span className="text-[10px] text-blue-400 font-bold">36 Districts Active</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Average Placement</span>
                    <div className="text-xl font-extrabold text-white mt-1">95.0%</div>
                    <span className="text-[10px] text-emerald-400 font-bold">High Demand in IT/CSE</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">NAAC A++ Colleges</span>
                    <div className="text-xl font-extrabold text-white mt-1">182</div>
                    <span className="text-[10px] text-amber-400 font-bold">Autonomous Category</span>
                  </div>
                </div>
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center py-12">
                  <LineChart className="w-12 h-12 text-blue-500 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-sm font-extrabold text-white">Interactive State Overview Workspace Loaded</h4>
                  <p className="text-xs text-slate-400 mt-1">Full chart controls, district maps, and college filters available in live workspace.</p>
                  <button onClick={handleLaunchDashboard} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-lg">
                    Open Full Dashboard →
                  </button>
                </div>
              </div>
            )}

            {activePreviewTab === 'college' && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Veermata Jijabai Technological Institute (VJTI)</h4>
                    <p className="text-xs text-slate-400">Isolated FAISS RAG Store Active (documents/VJTI/)</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    57.00 LPA Highest CTC
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">College of Engineering Pune (COEP)</h4>
                    <p className="text-xs text-slate-400">Isolated FAISS RAG Store Active (documents/COEP/)</p>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    60.30 LPA Highest CTC
                  </span>
                </div>
                <div className="text-center py-6">
                  <button onClick={handleLaunchColleges} className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-lg">
                    View All 2,000+ Colleges →
                  </button>
                </div>
              </div>
            )}

            {activePreviewTab === 'ai' && (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
                <div className="text-slate-400">USER: "Why is placement rate low and tips to increase it?"</div>
                <div className="text-blue-300 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                  AI ASSISTANT (Llama-3.3-70B RAG):
                  <br />- **Diagnostic Root Causes**: Core branch vs. tech sector hiring mismatch.
                  <br />- **Actionable Tips**: NEP 2020 curriculum updates, 6-month corporate co-op internships, TPO skill bootcamps.
                </div>
                <div className="text-center pt-2">
                  <button onClick={handleLaunchAiAssistant} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-5 py-2 rounded-lg">
                    Launch AI Chatbot →
                  </button>
                </div>
              </div>
            )}

            {activePreviewTab === 'reports' && (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center py-10 space-y-3">
                <FileBarChart className="w-10 h-10 text-purple-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">ML Enrollment Prediction & Ministry Reports</h4>
                <p className="text-xs text-slate-400">Forecasting 2025-26 admissions with 20+ composite features.</p>
                <button onClick={() => navigate('/prediction')} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-5 py-2 rounded-lg">
                  Run ML Prediction Engine →
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: WHY THIS PLATFORM (KEY BENEFITS)                              */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-slate-900/40 border-t border-slate-800/80 relative" id="why">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Strategic Value
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Transforming State Educational Governance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: 'Better Governance', desc: 'Transparent data-driven oversight across 36 district offices and technical directorates.', icon: ShieldCheck, color: 'text-blue-400' },
              { title: 'Evidence-Based Decisions', desc: 'Eliminates guesswork with verified empirical datasets and live SQLite synchronization.', icon: CheckCircle2, color: 'text-emerald-400' },
              { title: 'AI-Powered Insights', desc: 'Natural language queries grounded in official government PDFs with zero hallucination.', icon: Bot, color: 'text-indigo-400' },
              { title: 'Future Enrollment Forecasting', desc: 'Machine Learning v3.0 models predicting seat vacancies before CAP option form filling.', icon: TrendingUp, color: 'text-amber-400' },
              { title: 'Centralized Analytics', desc: 'Single source of truth for DTE, Directorate, and Ministry decision-makers.', icon: Database, color: 'text-purple-400' },
            ].map((ben, idx) => {
              const IconComp = ben.icon;
              return (
                <div key={idx} className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all duration-200 shadow-xl space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${ben.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-extrabold text-white">{ben.title}</h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{ben.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: CALL TO ACTION (CTA BANNER)                                   */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-8 sm:p-14 border border-blue-400/30 shadow-2xl overflow-hidden text-center">
            
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                Government Officials Access
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Launch Decision Intelligence Platform
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
                Access real-time state analytics, predictive enrollment modeling, and AI document intelligence for Maharashtra higher education.
              </p>
              <div>
                <button
                  onClick={handleLaunchDashboard}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm px-8 py-4 rounded-xl shadow-2xl shadow-orange-500/30 border border-amber-300/40 inline-flex items-center gap-2.5 transition-all duration-200 transform hover:scale-105"
                >
                  <span>Launch Platform Now</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: GOVERNMENT FOOTER                                              */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-slate-700 shadow-md shrink-0">
                <img
                  src="/maharashtra_logo.png"
                  alt="Government of Maharashtra Official Seal"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Higher & Technical Education Department</h3>
                <p className="text-[11px] text-slate-400">Government of Maharashtra | Mantralaya, Mumbai - 400032</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Governance</a>
              <a href="https://www.dtemaharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">DTE Maharashtra</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Contact Support</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-400">
            <p>© 2026 Higher & Technical Education Department, Government of Maharashtra. All Rights Reserved.</p>
            <p className="text-amber-400/90 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Developed for VJTI AI Hackathon 2026
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};

const LayoutDashboardIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

