import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] bg-grid-pattern relative overflow-x-hidden">
      {/* Background Glow Blobs */}
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="fixed bottom-1/4 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

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
