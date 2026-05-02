import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  // Gunakan 'auth_token' sebagai indikator login agar sama dengan Home.jsx
  const [session, setSession] = useState(localStorage.getItem('auth_token'));
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('auth_token');
      setSession(token);
    };

    // Listen perubahan storage dari tab lain
    window.addEventListener('storage', checkSession);
    
    // Listen custom event 'authChange' untuk tab yang sama
    window.addEventListener('authChange', checkSession);

    // Cek saat pindah halaman
    checkSession();

    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('authChange', checkSession);
    };
  }, [location]);

  // Fungsi Logout Sederhana
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session'); // Hapus jika ada key lain
    window.dispatchEvent(new Event('authChange')); // Trigger update navbar
    window.location.href = '/'; 
  };

  return (
    <nav className="h-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-8 sticky top-0 z-50">
      {/* ... Logo tetap sama ... */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-fuchsia-500/20">P</div>
        <div className="font-black text-xl text-white tracking-tighter uppercase">Pynara</div>
      </div>
      
      <div className="flex gap-8 font-bold text-sm items-center">
        <Link to="/" className={`${isActive('/') ? 'text-fuchsia-400' : 'text-slate-400'} hover:text-white transition-all`}>
          Dashboard
        </Link>
        
        {session ? (
          <>
            <Link to="/materi" className={`${isActive('/materi') ? 'text-emerald-400' : 'text-slate-400'} hover:text-white`}>Modul Materi</Link>
            <Link to="/library" className={`${isActive('/library') ? 'text-indigo-400' : 'text-slate-400'} hover:text-white`}>Library</Link>
            <Link to="/upload" className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5"><span>✨</span> AI Upload</Link>
            <Link to="/profil" className="bg-slate-900 px-5 py-2 rounded-2xl border border-slate-800 text-slate-300">👤 Profil</Link>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-400 hover:text-white py-2">Masuk</Link>
            <Link to="/register" className="bg-white text-slate-950 px-5 py-2 rounded-xl font-black">DAFTAR</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;