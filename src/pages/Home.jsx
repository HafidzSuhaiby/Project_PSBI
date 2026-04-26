import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { modules } from '../data/modules';

const Home = () => {
  const navigate = useNavigate(); // Untuk navigasi Roadmap (Opsi 2)
  const [dailyTip, setDailyTip] = useState(""); // Untuk Terminal Tips (Opsi 3)
  const [userProgress, setUserProgress] = useState({
    level: 1, xp: 0, streak: 1, accuracy: 100, completedModules: [], currentModuleId: 1
  });

  useEffect(() => {
    // Membaca data progres dari Local Storage
    const savedProgress = localStorage.getItem('pynara_progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      localStorage.setItem('pynara_progress', JSON.stringify(userProgress));
    }

    // --- OPSI 3: Menyiapkan Terminal Tips secara acak ---
    const tips = [
      "Gunakan huruf kapital untuk awalan nama Class (misal: class Hero).",
      "Gunakan kata kunci 'pass' jika Class masih kosong agar tidak error.",
      "Fungsi __init__ berguna untuk memasukkan atribut saat objek pertama kali dibuat.",
      "Satu blueprint (Class) bisa digunakan untuk membuat jutaan Object nyata!"
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  // Perhitungan Status Dinamis
  const xpTarget = userProgress.level * 500;
  const xpPercentage = Math.min((userProgress.xp / xpTarget) * 100, 100);
  const nextModule = modules.find(m => m.id === userProgress.currentModuleId) || modules[0];

  // --- OPSI 1: Logika Gamifikasi (Misi & Badge) ---
  // Misi 1: Login (Otomatis selesai karena membuka app)
  const isLoginDone = true; 
  // Misi 2: Menyelesaikan minimal 1 modul
  const isOneModuleDone = userProgress.completedModules.length > 0;
  
  // Badge Logic: Cek apakah level cukup untuk membuka badge
  const badge2Unlocked = userProgress.level >= 2;
  const badge3Unlocked = userProgress.streak >= 7;

  // --- OPSI 2: Logika Peta Jalan (Roadmap) Interaktif ---
  const handleRoadmapClick = (stepId, isLocked) => {
    if (isLocked) {
      alert("🔒 Modul terkunci! Selesaikan modul sebelumnya terlebih dahulu.");
    } else {
      // Jika sudah selesai atau sedang dikerjakan, izinkan masuk ke Lab
      navigate('/materi');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 font-sans selection:bg-indigo-500/30 p-6 lg:p-12">
      
      {/* HEADER / HERO SECTION */}
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in duration-700">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            PYNARA v1.0 — Lab Terbuka
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Halo, <span className="text-indigo-400">Programmer</span> 👋
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Ruang kerjamu sudah siap. Mari lanjutkan misimu dan sempurnakan kodemu hari ini.
          </p>
        </div>

        {/* User Quick Profile Dinamis */}
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl transition-all hover:bg-slate-800/50">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            👾
          </div>
          <div className="min-w-[120px]">
            <p className="text-sm font-bold text-white">Level {userProgress.level}</p>
            <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 text-right font-mono">
              {userProgress.xp} / {xpTarget} XP
            </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Modul Utama Dinamis dengan Latar Belakang Grafik Detak */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors shadow-lg min-h-[350px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity group-hover:bg-indigo-600/10"></div>
          
          <div className="absolute bottom-0 left-0 w-full h-[60%] pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700 z-0">
            <svg viewBox="0 0 1000 100" className="w-full h-full" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="fullPulse" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                   <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <path d="M0 80 L150 80 L200 20 L250 80 L450 80 L500 40 L550 80 L750 80 L800 10 L850 80 L1000 80 L1000 100 L0 100 Z" fill="url(#fullPulse)" />
               <path d="M0 80 L150 80 L200 20 L250 80 L450 80 L500 40 L550 80 L750 80 L800 10 L850 80 L1000 80" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0px 0px 6px rgba(14,165,233,0.8))" }} />
               <circle cx="1000" cy="80" r="5" fill="#fff" className="animate-pulse" style={{ filter: "drop-shadow(0px 0px 10px #ffffff)" }} />
            </svg>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg shadow-inner">🎯</span>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400">
                  Misi Selanjutnya
                </h3>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                {nextModule.title}
              </h2>
              <p className="text-slate-400 max-w-md text-base leading-relaxed">
                Lanjutkan perjalanan kodemu di modul ini untuk mendapatkan tambahan XP dan membuka kemampuan baru.
              </p>
            </div>
            
            <div className="mt-10">
              <Link to="/materi" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95 cursor-pointer">
                Mulai Misi <span className="text-xl leading-none">➔</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SIDEBAR WIDGETS */}
        <aside className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Statistik Harian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 text-xs font-medium mb-1">🔥 Streak</p>
                <p className="text-2xl font-bold text-white">{userProgress.streak} Hari</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 text-xs font-medium mb-1">🎯 Akurasi</p>
                <p className="text-2xl font-bold text-white">{userProgress.accuracy}%</p>
              </div>
            </div>
          </div>

          {/* OPSI 1: Misi Harian Dinamis */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg group hover:border-fuchsia-500/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Misi Harian</h3>
            </div>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]">✓</div>
                <div className="flex-1">
                  <p className="text-sm text-slate-200 line-through opacity-70">Akses Lab hari ini</p>
                  <p className="text-[10px] text-emerald-400 font-mono">+10 XP</p>
                </div>
              </li>
              
              <li className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isOneModuleDone ? 'bg-slate-950/80 border-emerald-500/20' : 'bg-slate-950/50 border-slate-800/50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${isOneModuleDone ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-2 border-slate-600'}`}>
                  {isOneModuleDone ? '✓' : ''}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isOneModuleDone ? 'text-slate-200 line-through opacity-70' : 'text-white'}`}>Selesaikan 1 Modul</p>
                  <p className={`text-[10px] font-mono font-bold ${isOneModuleDone ? 'text-emerald-400' : 'text-fuchsia-400'}`}>+50 XP</p>
                </div>
              </li>
            </ul>
          </div>

          {/* OPSI 1: Koleksi Badge Dinamis */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Badge Explorer</h3>
            </div>
            <div className="flex gap-4">
               {/* Selalu Terbuka */}
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-help" title="First Blood: Memulai perjalanan PBO">
                 🏆
               </div>
               {/* Badge Terbuka jika Level >= 2 */}
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-help transition-all duration-500 ${badge2Unlocked ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-950 border-2 border-dashed border-slate-800 opacity-40 grayscale'}`} title={badge2Unlocked ? "Master: Mencapai Level 2" : "Terkunci: Capai Level 2"}>
                 📱
               </div>
               {/* Badge Terbuka jika Streak >= 7 */}
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-help transition-all duration-500 ${badge3Unlocked ? 'bg-gradient-to-tr from-fuchsia-500 to-pink-600 shadow-[0_0_20px_rgba(217,70,239,0.4)]' : 'bg-slate-950 border-2 border-dashed border-slate-800 opacity-40 grayscale'}`} title={badge3Unlocked ? "On Fire: 7 Hari Streak" : "Terkunci: 7 Hari Streak"}>
                 🔥
               </div>
            </div>
          </div>
        </aside>

        {/* ROADMAP / PROGRESS SECTION */}
        <section className="lg:col-span-3 mt-2 flex flex-col gap-4">
          
          {/* OPSI 3: Terminal Tips */}
          <div className="w-full bg-[#0d0d12] border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
             <div className="text-fuchsia-500 animate-pulse">❯_</div>
             <p className="font-mono text-xs text-slate-400">
               <span className="text-emerald-400 font-bold">System.Hint: </span> 
               {dailyTip}
             </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-lg">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Progres Modul OOP</h3>
              <p className="text-sm text-slate-400">
                Kamu sudah menyelesaikan {userProgress.completedModules.length} dari {modules.length} misi utama.
              </p>
            </div>
            
            <div className="flex items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
               {modules.map((step, index) => {
                 const isDone = userProgress.completedModules.includes(step.id);
                 const isCurrent = userProgress.currentModuleId === step.id;
                 const isLocked = !isDone && !isCurrent;

                 return (
                   <React.Fragment key={step.id}>
                     {/* OPSI 2: Elemen ini sekarang bisa di-klik */}
                     <button 
                        onClick={() => handleRoadmapClick(step.id, isLocked)}
                        className={`flex flex-col items-center gap-2 group min-w-[60px] transition-transform ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                     >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 ${
                          isDone ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 
                          isCurrent ? 'bg-slate-800 border-2 border-indigo-500 text-indigo-400 animate-pulse' : 
                          'bg-slate-900 border border-slate-800 text-slate-600'
                        }`}>
                          {isDone ? '✓' : step.id}
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider font-semibold text-center leading-tight px-2 ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
                          {step.title.split(':')[0]}
                        </span>
                     </button>
                     
                     {index < modules.length - 1 && (
                       <div className={`w-12 md:w-16 h-[2px] -mt-6 mx-1 ${
                         isDone ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500' : 'bg-slate-800'
                       }`}></div>
                     )}
                   </React.Fragment>
                 );
               })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;