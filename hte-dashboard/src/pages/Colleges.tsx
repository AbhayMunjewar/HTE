import React from 'react';
import { Building2, Search, Filter, MapPin, Users, Award, BookOpen } from 'lucide-react';
import { mockColleges } from '../data/mockData';

export const Colleges: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Affiliated Colleges</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and view analytics for all {mockColleges.length} institutions.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, district..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockColleges.map((college) => (
          <div key={college.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                {college.naacGrade} Grade
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {college.name}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <MapPin className="w-4 h-4" /> {college.district}
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t border-slate-100 pt-4">
              <div>
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Students</p>
                <p className="font-semibold text-slate-700">{college.totalStudents}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3"/> Faculty</p>
                <p className="font-semibold text-slate-700">{college.facultyCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Award className="w-3 h-3"/> Avg CGPA</p>
                <p className="font-semibold text-slate-700">{college.averageCgpa}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">Placement</p>
                <p className="font-semibold text-emerald-600">{college.placementRate}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
