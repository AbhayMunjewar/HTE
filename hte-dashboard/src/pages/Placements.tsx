import React, { useState, useEffect } from 'react';
import { dashboardMetrics } from '../data/mockData';
import { Briefcase, Search, RefreshCw, DollarSign, Building } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlacementRecord {
  placement_id: string;
  college_id: string;
  student_id: string;
  branch: string;
  company: string;
  package_lpa: number;
  job_role: string;
  location: string;
  placement_status: string;
}

export const Placements: React.FC = () => {
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(25000);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPlacements();
  }, [search]);

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/placements?limit=50`;
      if (search) url += `&company=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPlacements(data.placements || []);
        setTotal(data.total || 25000);
      }
    } catch (err) {
      console.warn("Backend offline, using fallback placements:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Placement & Recruitment Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time drive tracking ({total.toLocaleString()} placement records in Dataset/placements.csv).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs w-full focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          {loading && <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Top Colleges by Placement Rate</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardMetrics.topCollegesPlacement} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} width={80} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="rate" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Placements Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            Recent Placement Drives & Offers (Dataset/placements.csv)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Job Role</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Package (LPA)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {placements.slice(0, 10).map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" /> {p.company}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{p.branch}</td>
                    <td className="py-2.5 px-3">{p.job_role}</td>
                    <td className="py-2.5 px-3 text-slate-500">{p.location}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">₹{p.package_lpa} LPA</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.placement_status === 'Placed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.placement_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
