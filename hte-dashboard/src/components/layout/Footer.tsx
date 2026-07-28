import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-8 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500 font-medium">
          © {new Date().getFullYear()} Government of Maharashtra
        </div>
        <div className="text-sm text-slate-500">
          Higher & Technical Education Department • AI Decision Intelligence Platform
        </div>
      </div>
    </footer>
  );
};
