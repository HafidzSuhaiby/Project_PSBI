import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function Navbar() {
  const [session, setSession] = useState(null);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-fuchsia-500/20">
          P
        </div>
        <div className="font-black text-xl text-white tracking-tighter uppercase">Pynara</div>
      </div>
      
      <div className="flex gap-8 font-bold text-sm items-center">
        <Link to="/" className={`${isActive('/') ? 'text-fuchsia-400' : 'text-slate-400'} hover:text-white transition-all`}>
          Dashboard
        </Link>
        
        {session ? (
          <>
            {/* Navigasi Utama */}
            <Link 
              to="/materi" 
              className={`${isActive('/materi') ? 'text-emerald-400' : 'text-slate-400'} hover:text-white transition-all`}
            >
              Modul Materi
            </Link>

            <Link 
              to="/library" 
              className={`${isActive('/library') ? 'text-indigo-400' : 'text-slate-400'} hover:text-white transition-all`}
            >
              Library
            </Link>

            {/* Fitur AI Upload Kembali Hadir */}
            <Link 
              to="/upload" 
              className={`${isActive('/upload') ? 'text-amber-400' : 'text-amber-400/70'} hover:text-amber-300 transition-all flex items-center gap-1.5`}
            >
              <span className="text-base">✨</span> AI Upload
            </Link>

            {/* Tombol Profil */}
            <Link 
              to="/profil" 
              className={`flex items-center gap-2 px-5 py-2 rounded-2xl transition-all ${
                isActive('/profil') 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-600'
              }`}
            >
              <span className="text-base">👤</span> Profil
            </Link>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-400 hover:text-white transition-colors py-2">Masuk</Link>
            <Link to="/register" className="bg-white text-slate-950 px-5 py-2 rounded-xl hover:bg-slate-200 transition-all font-black">DAFTAR</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;