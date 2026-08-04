import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Search, MapPin, Users, Award, BookOpen, RefreshCw, Filter, RotateCcw } from 'lucide-react';
import { mockColleges as defaultColleges } from '../data/mockData';

const MAHARASHTRA_DISTRICTS = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Sangli", "Thane",
  "Kolhapur", "Solapur", "Amravati", "Latur", "Nanded", "Ahmednagar",
  "Ratnagiri", "Satara", "Jalgaon", "Chandrapur", "Wardha", "Palghar", "Raigad"
];

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
      let url = `http://localhost:8000/api/colleges?limit=150`;
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
      console.warn("Backend offline, using default college dataset:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter colleges locally to guarantee strict district & search matching
  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      const matchesSearch = !search || 
        college.name.toLowerCase().includes(search.toLowerCase()) ||
        college.district.toLowerCase().includes(search.toLowerCase()) ||
        college.type.toLowerCase().includes(search.toLowerCase());

      const matchesDistrict = !selectedDistrict || 
        college.district.toLowerCase().includes(selectedDistrict.toLowerCase());

      return matchesSearch && matchesDistrict;
    });
  }, [colleges, search, selectedDistrict]);

  return (
    <div className="space-y-6">
      {/* HEADER & FILTER BAR */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              Maharashtra Higher Education Institutions
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Showing <strong className="text-blue-400 font-bold">{filteredColleges.length}</strong> institutions {selectedDistrict ? `in ${selectedDistrict} District` : 'across Maharashtra'}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* DISTRICT FILTER DROPDOWN */}
            <div className="relative flex-1 md:w-56">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none shadow-inner cursor-pointer"
              >
                <option value="">All Districts (36 Districts)</option>
                {MAHARASHTRA_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist} District</option>
                ))}
              </select>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by college name..." 
                className="pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-400 w-full focus:ring-2 focus:ring-blue-500/50 outline-none shadow-inner"
              />
            </div>

            {(selectedDistrict || search) && (
              <button
                onClick={() => { setSelectedDistrict(''); setSearch(''); }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" /> Clear
              </button>
            )}

            {loading && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />}
          </div>
        </div>
      </div>

      {/* COLLEGE CARDS GRID */}
      {filteredColleges.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Colleges Found</h3>
          <p className="text-xs text-slate-400 mt-1">No higher education institutions match the selected filter criteria for {selectedDistrict || 'this search'}.</p>
          <button onClick={() => { setSelectedDistrict(''); setSearch(''); }} className="mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) => (
            <div key={college.id} className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-blue-500/40 hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 text-blue-400 rounded-xl border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 text-xs font-extrabold rounded-full border border-emerald-500/30 shadow-sm">
                    NAAC {college.naacGrade} Grade
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-white leading-tight mb-2 group-hover:text-blue-400 transition-colors line-clamp-2" title={college.name}>
                  {college.name}
                </h3>
                
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> {college.district} • {college.type}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-2 border-t border-slate-800/80 pt-4 mt-2">
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1 font-medium"><Users className="w-3 h-3 text-blue-400"/> Total Students</p>
                  <p className="font-bold text-xs text-white">{college.totalStudents}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1 font-medium"><BookOpen className="w-3 h-3 text-purple-400"/> Total Faculty</p>
                  <p className="font-bold text-xs text-white">{college.facultyCount}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1 font-medium"><Award className="w-3 h-3 text-amber-400"/> NIRF Rank</p>
                  <p className="font-bold text-xs text-amber-300">#{college.nirfRank}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5 font-medium">Placement Rate</p>
                  <p className="font-bold text-xs text-emerald-400">{college.placementRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
