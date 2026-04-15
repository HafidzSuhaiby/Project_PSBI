// File: src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
      <div className="font-black text-xl text-white tracking-tighter">🐍 PY-HUB</div>
      <div className="flex gap-6 font-bold text-sm">
        <Link to="/" className="text-slate-300 hover:text-fuchsia-400 transition-colors">Dashboard</Link>
        <Link to="/materi" className="text-slate-300 hover:text-fuchsia-400 transition-colors">Modul Belajar</Link>
      </div>
    </nav>
  );
}

export default Navbar;