import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Topbar />
        <main className="flex-1 p-5 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};
