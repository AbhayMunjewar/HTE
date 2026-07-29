import React, { useState } from 'react';
import { useDashboardContext } from '../../contexts/DashboardContext';
import { mockColleges, dashboardMetrics } from '../../data/mockData';
import { ChevronRight, Filter, Building2, Users, BookOpen, Briefcase, Award, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

export const EcosystemOverview: React.FC = () => {
  const { filters, setFilter, resetFilters } = useDashboardContext();
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);

  const selectedCollege = mockColleges.find(c => c.id === selectedCollegeId);

  const handleSelectCollege = (id: string) => {
    setSelectedCollegeId(id);
    setFilter('collegeId', id);
  };

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Education Ecosystem Overview</h3>
          <p className="text-sm text-slate-500">Interactive view of institutions and their key metrics.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetFilters} className="text-sm px-3 py-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-md transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Reset Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 space-y-2 border-r border-slate-100 pr-4 max-h-[400px] overflow-y-auto">
          {mockColleges.map((college) => (
            <button
              key={college.id}
              onClick={() => handleSelectCollege(college.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between group",
                selectedCollegeId === college.id 
                  ? "bg-blue-50 border-blue-200 shadow-sm" 
                  : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <div>
                <div className={cn("text-sm font-semibold", selectedCollegeId === college.id ? "text-blue-700" : "text-slate-700")}>
                  {college.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">{college.district}</div>
              </div>
              <ChevronRight className={cn("w-4 h-4", selectedCollegeId === college.id ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400")} />
            </button>
          ))}
        </div>

        <div className="w-full lg:w-2/3 flex flex-col justify-center">
          {selectedCollege ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{selectedCollege.name}</h4>
                  <p className="text-sm text-slate-500">{selectedCollege.university}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative">
                <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-slate-300 hidden lg:block"></div>
                <MetricNode icon={Users} label="Total Students" value={selectedCollege.totalStudents} />
                <MetricNode icon={BookOpen} label="Faculty Members" value={selectedCollege.facultyCount} />
                <MetricNode icon={Briefcase} label="Placement Rate" value={`${selectedCollege.placementRate}%`} />
                <MetricNode icon={Award} label="Graduation Rate" value={`${selectedCollege.graduationRate || 94.2}%`} />
                <MetricNode icon={Award} label="NAAC Grade" value={selectedCollege.naacGrade} />
                <MetricNode icon={FileText} label="NIRF Rank" value={selectedCollege.nirfRank} />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Building2 className="w-12 h-12 mb-4 opacity-20" />
              <p>Select a college from the list to view its ecosystem breakdown.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricNode = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
    <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600">
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <div className="text-xs font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-lg font-bold text-slate-800">{value}</div>
    </div>
  </div>
);
