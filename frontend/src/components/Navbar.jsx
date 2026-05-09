import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [session, setSession] = useState(localStorage.getItem('auth_token'));
  const [isOpen, setIsOpen] = useState(false); 
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('auth_token');
      setSession(token);
    };
    window.addEventListener('storage', checkSession);
    window.addEventListener('authChange', checkSession);
    checkSession();
    return () => {
      window.removeEventListener('storage', checkSession);
      window.removeEventListener('authChange', checkSession);
    };
  }, [location]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session'); 
    window.dispatchEvent(new Event('authChange')); 
    window.location.href = '/'; 
  };

  return (
    // Navbar utama menggunakan bg-slate-950 solid (Tanpa /90 atau /80)
    <nav className="h-20 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 md:px-8 sticky top-0 z-[200]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-fuchsia-500/20">P</div>
        <div className="font-black text-xl text-white tracking-tighter uppercase">Pynara</div>
      </div>
      
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2 z-[210] outline-none">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Overlay tetap menggunakan transparansi agar user tahu menu bisa ditutup dengan klik luar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 md:hidden z-[190]" onClick={() => setIsOpen(false)} />
      )}

      {/* FIXED: Drawer Menu SOLID dari Kanan ke Kiri */}
      <div className={`
        fixed top-0 right-0 h-full w-[65%] bg-slate-950 border-l border-slate-800 p-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out z-[200]
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:static md:h-auto md:w-auto md:bg-transparent md:border-none md:p-0 md:flex-row md:translate-x-0 md:gap-8 font-bold text-sm items-center md:flex
      `}>
        {/* Header Drawer */}
        <div className="flex items-center justify-between mb-8 md:hidden">
          <span className="text-white uppercase tracking-widest text-xs font-black opacity-60">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">✕</button>
        </div>

        <Link to="/" className={`${isActive('/') ? 'text-fuchsia-400' : 'text-slate-400'} hover:text-white transition-all py-2 md:py-0`}>Dashboard</Link>
        
        {session ? (
          <>
            <Link to="/materi" className={`${isActive('/materi') ? 'text-emerald-400' : 'text-slate-400'} hover:text-white py-2 md:py-0`}>Modul Materi</Link>
            <Link to="/library" className={`${isActive('/library') ? 'text-indigo-400' : 'text-slate-400'} hover:text-white py-2 md:py-0`}>Library</Link>
            <Link to="/upload" className="text-amber-400 hover:text-amber-300 py-2 md:py-0">AI Upload</Link>
            
            <div className="mt-auto md:mt-0 flex flex-col gap-4 border-t border-slate-800 pt-6 md:border-none md:pt-0">
              <Link to="/profil" className="bg-slate-900 px-5 py-3 rounded-2xl border border-slate-800 text-slate-300 text-center flex items-center justify-center gap-2">👤 Profil</Link>
              <button onClick={handleLogout} className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] md:hidden text-center">Logout</button>
            </div>
          </>
        ) : (
          /* // FIX: Menghilangkan pt-6 pada desktop dan memastikan kontainer guest sejajar dengan item drawer lainnya */
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mt-auto md:mt-0 pt-6 md:pt-0 border-t border-slate-800 md:border-none">
            {/* // FIX: Menghapus h-11 agar "Masuk" memiliki perilaku teks yang sama dengan "Dashboard" */}
            <Link to="/login" className="text-slate-400 hover:text-white transition-all py-2 md:py-0">Masuk</Link>
            {/* // FIX: Menggunakan py-2 agar tombol "DAFTAR" tidak terlalu tinggi namun tetap terlihat seperti tombol yang rapi */}
            <Link to="/register" className="bg-white text-slate-950 px-5 py-2 rounded-xl font-black text-center shadow-lg shadow-white/10 transition-transform active:scale-95">DAFTAR</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;