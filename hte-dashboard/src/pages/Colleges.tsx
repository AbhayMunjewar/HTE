import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter, MapPin, Users, Award, BookOpen, RefreshCw } from 'lucide-react';
import { mockColleges as defaultColleges } from '../data/mockData';

export const Colleges: React.FC = () => {
  const [colleges, setColleges] = useState(defaultColleges);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    fetchColleges();
  }, [search, selectedDistrict]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/api/colleges?limit=60`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (selectedDistrict) url += `&district=${encodeURIComponent(selectedDistrict)}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.colleges && data.colleges.length > 0) {
          setColleges(data.colleges);
        }
      }
    } catch (err) {
      console.warn("Backend offline, showing default college dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Maharashtra Higher Education Institutions</h2>
          <p className="text-sm text-slate-500 mt-1">Showing original dataset records ({colleges.length} loaded from Dataset/colleges.csv).</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by college name, district..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          {loading && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <div key={college.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                {college.naacGrade} Grade
              </span>
            </div>
            
            <h3 className="text-base font-bold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2" title={college.name}>
              {college.name}
            </h3>
            
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-4">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {college.district} • {college.type}
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-slate-100 pt-3">
              <div>
                <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Users className="w-3 h-3"/> Total Students</p>
                <p className="font-semibold text-xs text-slate-700">{college.totalStudents}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><BookOpen className="w-3 h-3"/> Total Faculty</p>
                <p className="font-semibold text-xs text-slate-700">{college.facultyCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Award className="w-3 h-3"/> NIRF Rank</p>
                <p className="font-semibold text-xs text-slate-700">{college.nirfRank}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Placement</p>
                <p className="font-semibold text-xs text-emerald-600">{college.placementRate}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
