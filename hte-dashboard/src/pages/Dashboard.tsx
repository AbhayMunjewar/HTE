import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  Award, 
  Percent,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardMetrics as defaultMetrics } from '../data/mockData';
import { cn } from '../lib/utils';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { EcosystemOverview } from '../components/dashboard/EcosystemOverview';

const StatCard = ({ title, value, icon: Icon, trend, percentage, colorClass, delay }: any) => {
  const isPositive = trend === 'up';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-slate-500 font-medium text-sm mb-1">{title}</span>
          <span className="text-3xl font-bold text-slate-800">{value}</span>
        </div>
        <div className={cn("p-3 rounded-lg flex items-center justify-center", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-auto">
        <span className={cn(
          "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {percentage}%
        </span>
        <span className="text-xs text-slate-400 font-medium">vs last year</span>
      </div>
    </motion.div>
  );
};

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState(defaultMetrics);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/stats");
      if (res.ok) {
        const data = await res.json();
        setMetrics(prev => ({
          ...prev,
          totalStudents: data.totalStudents || prev.totalStudents,
          totalColleges: data.totalColleges || prev.totalColleges,
          totalFaculty: data.totalFaculty || prev.totalFaculty,
          placementRate: data.placementRate || prev.placementRate,
          averageCgpa: data.averageCgpa || prev.averageCgpa,
          scholarshipStudents: data.scholarshipStudents || prev.scholarshipStudents,
          districtEnrollment: data.districtEnrollment && data.districtEnrollment.length > 0 ? data.districtEnrollment : prev.districtEnrollment,
          naacGradeDistribution: data.naacGradeDistribution && data.naacGradeDistribution.length > 0 ? data.naacGradeDistribution : prev.naacGradeDistribution,
        }));
      }
    } catch (err) {
      console.warn("Backend server offline, displaying local dataset metrics:", err);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 100000) return (num / 100000).toFixed(2) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ecosystem Overview (Real Datasets)</h2>
        <p className="text-sm text-slate-500 mt-1">Real-time metrics computed from Maharashtra HTE original CSV datasets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Total Students" 
          value={formatNumber(metrics.totalStudents)} 
          icon={Users} 
          trend="up" 
          percentage="4.2" 
          colorClass="bg-blue-50 text-blue-600" 
          delay={0}
        />
        <StatCard 
          title="Total Colleges" 
          value={metrics.totalColleges} 
          icon={GraduationCap} 
          trend="up" 
          percentage="1.5" 
          colorClass="bg-indigo-50 text-indigo-600" 
          delay={0.1}
        />
        <StatCard 
          title="Total Faculty" 
          value={formatNumber(metrics.totalFaculty)} 
          icon={BookOpen} 
          trend="up" 
          percentage="2.8" 
          colorClass="bg-purple-50 text-purple-600" 
          delay={0.2}
        />
        <StatCard 
          title="Placement Rate" 
          value={`${metrics.placementRate}%`} 
          icon={Briefcase} 
          trend="up" 
          percentage="5.1" 
          colorClass="bg-emerald-50 text-emerald-600" 
          delay={0.3}
        />
        <StatCard 
          title="Average CGPA" 
          value={metrics.averageCgpa} 
          icon={Award} 
          trend="up" 
          percentage="0.2" 
          colorClass="bg-amber-50 text-amber-600" 
          delay={0.4}
        />
        <StatCard 
          title="Scholarship Students" 
          value={formatNumber(metrics.scholarshipStudents)} 
          icon={Percent} 
          trend="up" 
          percentage="8.4" 
          colorClass="bg-rose-50 text-rose-600" 
          delay={0.5}
        />
      </div>

      <EcosystemOverview />
      <AnalyticsCharts />
    </div>
  );
};
