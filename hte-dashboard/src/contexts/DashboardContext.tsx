import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterState {
  collegeId: string | null;
  district: string | null;
  branch: string | null;
  gender: string | null;
  graduationYear: number | null;
  placementStatus: string | null;
}

interface DashboardContextType {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string | number | null) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  collegeId: null,
  district: null,
  branch: null,
  gender: null,
  graduationYear: null,
  placementStatus: null,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const setFilter = (key: keyof FilterState, value: string | number | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(initialState);

  return (
    <DashboardContext.Provider value={{ filters, setFilter, resetFilters }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};
