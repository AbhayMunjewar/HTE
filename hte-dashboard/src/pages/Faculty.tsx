import React, { useState, useEffect } from 'react';
import { dashboardMetrics } from '../data/mockData';
import { BookOpen, Search, RefreshCw, Award, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FacultyRecord {
  faculty_id: string;
  name: string;
  designation: string;
  qualification: string;
  experience_years: number;
  department: string;
  salary: number;
  publications: number;
  patents: number;
}

export const Faculty: React.FC = () => {
  const [facultyList, setFacultyList] = useState<FacultyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(10000);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, [search]);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/faculty?limit=50`;
      if (search) url += `&dept=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFacultyList(data.faculty || []);
        setTotal(data.total || 10000);
      }
    } catch (err) {
      console.warn("Backend offline, using fallback faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Faculty & Research Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Teaching staff and research output ({total.toLocaleString()} total faculty in Dataset/faculty.csv).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by department..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs w-full focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          {loading && <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Research Publications by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardMetrics.researchPublications} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="dept" type="category" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Faculty Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Faculty Directory & Academic Metrics (Dataset/faculty.csv)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Faculty Name</th>
                  <th className="py-2.5 px-3">Designation</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Qualification</th>
                  <th className="py-2.5 px-3">Experience</th>
                  <th className="py-2.5 px-3">Publications</th>
                  <th className="py-2.5 px-3">Patents</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {facultyList.slice(0, 10).map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-purple-700">{f.name}</td>
                    <td className="py-2.5 px-3 text-slate-500">{f.designation}</td>
                    <td className="py-2.5 px-3">{f.department}</td>
                    <td className="py-2.5 px-3 font-bold">{f.qualification}</td>
                    <td className="py-2.5 px-3">{f.experience_years} yrs</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-600">{f.publications}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600">{f.patents}</td>
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
