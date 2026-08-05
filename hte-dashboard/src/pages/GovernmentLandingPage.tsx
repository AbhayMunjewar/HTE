import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  Landmark,
  TrendingUp,
  Bot,
  FileBarChart,
  Activity,
  ArrowRight,
  Globe,
  Database,
  Cpu,
  Users,
  GraduationCap,
  Award,
  ChevronRight
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
      const eased = 1 - Math.pow(1 - progress, 3);
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

  const numericMatch = value.replace(/[₹,]/g, '').match(/[\d.]+/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const isDecimal = value.includes('.');
  const prefix = value.startsWith('₹') ? '₹' : '';
  const suffix = value.replace(/^[₹]?[\d,.]+/, '');

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      
      {/* Subtle Government Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0"></div>

      {/* ========================================================================= */}
      {/* OFFICIAL GOVERNMENT HEADER                                                */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl py-3'
            : 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Seal */}
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
                <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Official Portal
                </span>
              </div>
              <p className="text-[11px] text-blue-400 font-semibold tracking-tight">
                Higher & Technical Education Department
              </p>
            </div>
          </div>

          {/* Quick Header Launch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg border border-blue-400/30 flex items-center gap-2 transition-all duration-200"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

        </div>
      </header>

      <div className="pt-24"></div>

      {/* ========================================================================= */}
      {/* HERO SECTION — CLEAN & DIRECT                                            */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-xs font-semibold text-slate-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 font-bold">Government Digital Platform</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Higher & Technical Education Department</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Statewide Higher & Technical Education{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
              Decision Intelligence Platform
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Providing Maharashtra government leaders with real-time institutional analytics, 
            predictive student enrollment modeling, and AI-powered decision support.
          </p>

          {/* Core Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-xl shadow-xl border border-blue-400/40 flex items-center gap-2.5 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Launch Executive Workspace</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            <button
              onClick={() => navigate('/colleges')}
              className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-700 hover:border-blue-500/50 flex items-center gap-2.5 transition-all duration-200"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Colleges Directory</span>
            </button>

            <button
              onClick={() => navigate('/ai-assistant')}
              className="bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-800 flex items-center gap-2 transition-all duration-200"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span>AI Intelligence Assistant</span>
            </button>
          </div>

          {/* Key System Indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
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
      </section>

      {/* ========================================================================= */}
      {/* STATEWIDE COVERAGE NUMBERS                                                */}
      {/* ========================================================================= */}
      <section className="py-10 bg-slate-900/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Statewide Coverage
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">
              Higher & Technical Education Ecosystem Metrics
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
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
                  className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center shadow-md hover:border-blue-500/40 transition-all"
                >
                  <div className={`w-7 h-7 mx-auto rounded-lg bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-sm mb-2`}>
                    <IconComp className="w-3.5 h-3.5" />
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
      {/* CORE CAPABILITIES GRID                                                    */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Governance Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Decision Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Landmark,
                title: 'Executive Workspace',
                desc: 'Real-time monitoring across 36 districts and 2,000+ technical institutions.',
                path: '/dashboard',
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
              },
              {
                icon: Building2,
                title: 'Colleges Directory',
                desc: 'Granular institutional statistics, district filters, NAAC grades, and faculty ratios.',
                path: '/colleges',
                color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
              },
              {
                icon: Bot,
                title: 'AI Intelligence Assistant',
                desc: 'Grounded RAG document search powered by isolated college vector indices.',
                path: '/ai-assistant',
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              },
              {
                icon: FileBarChart,
                title: 'Government Reports & ML',
                desc: 'ExtraTrees ML v3.0 predictive enrollment modeling and automated report generation.',
                path: '/reports',
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              },
            ].map((mod, idx) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(mod.path)}
                  className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between hover:-translate-y-1 shadow-lg"
                >
                  <div className="space-y-3">
                    <div className={`w-11 h-11 rounded-xl border ${mod.color} flex items-center justify-center`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-white">{mod.title}</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{mod.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center text-[11px] font-extrabold text-blue-400 group-hover:text-amber-400 transition-colors">
                    <span>Open Module</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* OFFICIAL GOVERNMENT FOOTER                                                */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-900">
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
              <a href="https://www.dtemaharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">DTE Maharashtra</a>
              <span className="text-slate-700">•</span>
              <span>Official Digital Portal</span>
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
