// File: src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  // Fungsi untuk mengecek apakah link sedang aktif (opsional untuk styling)
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="font-black text-xl text-white tracking-tighter">🐍 PY-HUB</div>
      
      <div className="flex gap-6 font-bold text-sm">
        <Link 
          to="/" 
          className={`${isActive('/') ? 'text-fuchsia-400' : 'text-slate-300'} hover:text-fuchsia-400 transition-colors`}
        >
          Dashboard
        </Link>
        <Link 
          to="/materi" 
          className={`${isActive('/materi') ? 'text-fuchsia-400' : 'text-slate-300'} hover:text-fuchsia-400 transition-colors`}
        >
          Modul Belajar
        </Link>
        {/* Link Baru untuk Upload */}
        <Link 
          to="/upload" 
          className={`${isActive('/upload') ? 'text-indigo-400' : 'text-slate-300'} hover:text-indigo-400 transition-colors flex items-center gap-1`}
        >
          <span className="text-xs">✨</span> AI Upload
        </Link>
        <Link to="/library" className="text-slate-300 hover:text-indigo-400 transition-colors">Library</Link>
      </div>
    </nav>
  );
}

export default Navbar;