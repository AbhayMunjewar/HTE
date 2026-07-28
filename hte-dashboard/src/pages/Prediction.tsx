import React from 'react';
import { TrendingUp, AlertCircle, BarChart3, Users, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const predictionData = [
  { year: '2023', actual: 590000, predicted: 590000 },
  { year: '2024', actual: 612450, predicted: 610000 },
  { year: '2025', predicted: 625000 },
  { year: '2026', predicted: 638000 },
  { year: '2027', predicted: 652000 },
];

export const Prediction: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Enrollment Prediction</h2>
          <p className="text-sm text-slate-500 mt-1">AI-powered forecasting for future academic years.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            5-Year Enrollment Projection
          </h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [new Intl.NumberFormat('en-IN').format(value), 'Students']}
                />
                <Line type="monotone" dataKey="actual" name="Actual Enrollment" stroke="#0f172a" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="predicted" name="AI Prediction" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="text-blue-100 font-medium text-sm mb-2">Predicted Enrollment</h3>
            <div className="text-4xl font-bold mb-1">652,000</div>
            <p className="text-sm text-blue-200 mb-6">Academic Year: 2027</p>
            
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <Zap className="w-5 h-5 text-amber-300" />
              <div>
                <div className="text-sm font-semibold">94% Confidence</div>
                <div className="text-xs text-blue-200">Based on historical data</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Risk Indicators
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Pune District Capacity</p>
                  <p className="text-xs text-slate-500 mt-0.5">Projected demand exceeds current infrastructure capacity by 12% by 2026.</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Mechanical Engg Trend</p>
                  <p className="text-xs text-slate-500 mt-0.5">Consistent 2% YoY decline in enrollment for core branches.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
