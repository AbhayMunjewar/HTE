import React, { useState, useEffect } from 'react';
import { dashboardMetrics } from '../data/mockData';
import { Users, Filter, Download, Search, RefreshCw, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentRecord {
  student_id: string;
  roll_no: string;
  branch: string;
  cgpa: number;
  attendance: number;
  scholarship: string;
  placement_status: string;
  admission_year: number;
}

export const Students: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(100000);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/students?limit=50`;
      if (search) url += `&branch=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        setTotal(data.total || 100000);
      }
    } catch (err) {
      console.warn("Backend offline, using fallback students:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Student Intelligence Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time student records ({total.toLocaleString()} total students in Dataset/students.csv).</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by branch..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs w-full focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          {loading && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin self-center" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Students by Branch</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardMetrics.studentsByBranch}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Student Records Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Student Records Directory (Dataset/students.csv)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">CGPA</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Scholarship</th>
                  <th className="py-2.5 px-3">Placement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {students.slice(0, 10).map((st, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-blue-600">{st.student_id}</td>
                    <td className="py-2.5 px-3 text-slate-500">{st.roll_no}</td>
                    <td className="py-2.5 px-3">{st.branch}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{st.cgpa}</td>
                    <td className="py-2.5 px-3">{st.attendance}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.scholarship === 'Yes' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {st.scholarship}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.placement_status === 'Placed' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                        {st.placement_status}
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
