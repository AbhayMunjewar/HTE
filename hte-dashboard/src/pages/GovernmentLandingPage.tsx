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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* OFFICIAL GOVERNMENT HEADER                                                */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#062A4E] text-white border-b-2 border-amber-500 shadow-md py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Seal */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-amber-400 shadow-md shrink-0">
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
                <span className="text-[9px] font-black text-slate-950 bg-amber-500 px-2 py-0.5 rounded uppercase tracking-wider">
                  Official Portal
                </span>
              </div>
              <p className="text-[11px] text-amber-200 font-medium tracking-tight">
                Higher & Technical Education Department | Mantralaya, Mumbai
              </p>
            </div>
          </div>

          {/* Quick Header Launch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#0A2540] hover:bg-[#061F38] text-white text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-lg border border-amber-500/40 shadow-sm flex items-center gap-2 transition-all duration-200"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

        </div>
      </header>

      <div className="pt-20"></div>

      {/* ========================================================================= */}
      {/* HERO SECTION — CLEAN & DIRECT                                            */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-16 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-slate-900 shadow-sm">
            <Landmark className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-amber-900 font-extrabold">Government Digital Platform</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-700">Higher & Technical Education Department</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Statewide Higher & Technical Education{' '}
            <span className="text-[#062A4E]">
              Decision Intelligence Platform
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
            Providing Maharashtra government leaders with real-time institutional analytics, 
            predictive student enrollment modeling, and AI-powered decision support.
          </p>

          {/* Core Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#062A4E] hover:bg-[#0A2540] text-white font-extrabold text-xs sm:text-sm px-6 sm:px-8 py-3.5 rounded-lg shadow-sm border border-amber-500/40 flex items-center gap-2.5 transition-all duration-200"
            >
              <span>Launch Executive Workspace</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => navigate('/colleges')}
              className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-lg border border-slate-300 flex items-center gap-2.5 transition-all duration-200 shadow-sm"
            >
              <Building2 className="w-4 h-4 text-[#062A4E]" />
              <span>Colleges Directory</span>
            </button>

            <button
              onClick={() => navigate('/ai-assistant')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-lg border border-slate-300 flex items-center gap-2 transition-all duration-200"
            >
              <Bot className="w-4 h-4 text-[#062A4E]" />
              <span>AI Intelligence Assistant</span>
            </button>
          </div>

          {/* Key System Indicators */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-100 px-3 py-1 rounded border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Grounded RAG Intelligence
            </span>
            <span className="flex items-center gap-1.5 text-blue-900 bg-blue-100 px-3 py-1 rounded border border-blue-300">
              <Database className="w-3.5 h-3.5 text-blue-700" /> 2,000+ Colleges SQLite Sync
            </span>
            <span className="flex items-center gap-1.5 text-amber-900 bg-amber-100 px-3 py-1 rounded border border-amber-300">
              <Cpu className="w-3.5 h-3.5 text-amber-700" /> ML v3.0 Predictive Engine
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* STATEWIDE COVERAGE NUMBERS                                                */}
      {/* ========================================================================= */}
      <section className="py-10 bg-slate-50 border-b border-slate-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-500/20 px-3 py-1 rounded border border-amber-500/30">
              Statewide Coverage
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5">
              Higher & Technical Education Ecosystem Metrics
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Total Colleges', value: '3,726+', icon: Building2 },
              { label: 'State Universities', value: '24', icon: Landmark },
              { label: 'Enrolled Students', value: '39,22,128', icon: Users },
              { label: 'Approved Faculty', value: '226,713', icon: GraduationCap },
              { label: 'Districts Covered', value: '36', icon: Globe },
              { label: 'Scholarships', value: '₹450 Cr+', icon: Award },
              { label: 'Placement Rate', value: '95.0%', icon: TrendingUp },
              { label: 'Annual Admissions', value: '185,000', icon: Activity },
            ].map((kpi, idx) => {
              const IconComp = kpi.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-lg border border-slate-300 text-center shadow-sm text-slate-900"
                >
                  <div className="w-7 h-7 mx-auto rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-[#062A4E] mb-2">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <CountUpNumber value={kpi.value} />
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">{kpi.label}</div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* CORE CAPABILITIES GRID                                                    */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 bg-slate-200 px-3 py-1 rounded border border-slate-300">
              Governance Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Decision Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Landmark,
                title: 'Executive Workspace',
                desc: 'Real-time monitoring across 36 districts and 2,000+ technical institutions.',
                path: '/dashboard'
              },
              {
                icon: Building2,
                title: 'Colleges Directory',
                desc: 'Granular institutional statistics, district filters, NAAC grades, and faculty ratios.',
                path: '/colleges'
              },
              {
                icon: Bot,
                title: 'AI Intelligence Assistant',
                desc: 'Grounded RAG document search powered by isolated college vector indices.',
                path: '/ai-assistant'
              },
              {
                icon: FileBarChart,
                title: 'Government Reports & ML',
                desc: 'ExtraTrees ML v3.0 predictive enrollment modeling and automated report generation.',
                path: '/reports'
              },
            ].map((mod, idx) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(mod.path)}
                  className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm hover:border-[#062A4E] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center text-[#062A4E]">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">{mod.title}</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{mod.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200 flex items-center text-[11px] font-extrabold text-[#062A4E] group-hover:text-amber-600 transition-colors">
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
      <footer className="bg-[#062A4E] text-slate-200 border-t-2 border-amber-500 py-10 text-xs font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-700">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-amber-400 shadow-sm shrink-0">
                <img
                  src="/maharashtra_logo.png"
                  alt="Government of Maharashtra Official Seal"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Higher & Technical Education Department</h3>
                <p className="text-[11px] text-amber-200">Government of Maharashtra | Mantralaya, Mumbai - 400032</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11px] font-semibold text-amber-300">
              <a href="https://www.dtemaharashtra.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">DTE Maharashtra</a>
              <span className="text-slate-400">•</span>
              <span>Official Digital Portal</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-300">
            <p>© 2026 Higher & Technical Education Department, Government of Maharashtra. All Rights Reserved.</p>
            <p className="text-amber-300 font-bold bg-amber-500/20 px-3 py-1 rounded border border-amber-500/30">
              Directorate of Technical Education Verification
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};
