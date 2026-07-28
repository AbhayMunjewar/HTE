import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { dashboardMetrics } from '../../data/mockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];
const PIE_COLORS = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];

const ChartCard = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col ${className}`}>
    <h3 className="text-sm font-bold text-slate-800 mb-4">{title}</h3>
    <div className="flex-1 w-full min-h-[250px]">
      {children}
    </div>
  </div>
);

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
      
      {/* 1. Student Admission Trend */}
      <ChartCard title="Student Admission Trend" className="xl:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dashboardMetrics.studentAdmissionTrend}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value / 1000}k`} />
            <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2. Students by Branch */}
      <ChartCard title="Students by Branch">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dashboardMetrics.studentsByBranch} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {dashboardMetrics.studentsByBranch.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 4. Placement Status (Stacked Bar) */}
      <ChartCard title="Placement Status by Branch" className="xl:col-span-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dashboardMetrics.placementStatus}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <RechartsTooltip cursor={{fill: '#f8fafc'}} />
            <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
            <Bar dataKey="placed" name="Placed %" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={32} />
            <Bar dataKey="notPlaced" name="Not Placed %" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 5. Average Package */}
      <ChartCard title="Avg Package by Branch (LPA)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dashboardMetrics.avgPackageByBranch} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={90} />
            <RechartsTooltip cursor={{fill: '#f8fafc'}} />
            <Bar dataKey="package" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3. Gender & 10. NAAC Grade (Combined row for space) */}
      <ChartCard title="Gender Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dashboardMetrics.genderDistribution} innerRadius={0} outerRadius={80} dataKey="value">
              <Cell fill="#3b82f6" />
              <Cell fill="#f43f5e" />
              <Cell fill="#94a3b8" />
            </Pie>
            <RechartsTooltip />
            <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="District-wise Enrollment">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dashboardMetrics.districtEnrollment}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value / 1000}k`} />
            <RechartsTooltip cursor={{fill: '#f8fafc'}} />
            <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="NAAC Grade Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dashboardMetrics.naacGradeDistribution} innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
              {dashboardMetrics.naacGradeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
            <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      
    </div>
  );
};
