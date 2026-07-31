import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950/90 border-t border-slate-800/80 py-5 px-8 mt-auto text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-medium">
        <div>
          © {new Date().getFullYear()} Government of Maharashtra • Higher & Technical Education Department
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>ExtraTrees ML v3.0</span>
          <span>•</span>
          <span>Groq Llama-3.3-70B AI</span>
          <span>•</span>
          <span>SQLite ORM</span>
        </div>
      </div>
    </footer>
  );
};
