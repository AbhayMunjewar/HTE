import React from 'react';
import { dashboardMetrics } from '../data/mockData';
import { BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Faculty: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Faculty & Research</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor teaching staff and research publications across institutions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Research Publications by Department</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardMetrics.researchPublications} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="dept" type="category" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Faculty Directory Grid (Mocked)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
