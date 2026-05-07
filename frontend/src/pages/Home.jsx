import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { modules as staticModules } from '../data/modules';

// FIX MYSQL: Pastikan API_URL benar
const API_URL = "http://localhost:5000/api"; 

const Home = () => {
  const navigate = useNavigate();
  const [dailyTip, setDailyTip] = useState("");
  const [allModules, setAllModules] = useState(staticModules); 
  const [session, setSession] = useState(null); 
  const [userProgress, setUserProgress] = useState({
    level: 1, xp: 0, streak: 0, accuracy: 0, completedModules: [], currentModuleId: 1
  });

  useEffect(() => {
    // 1. Generate System Hint secara acak
    const tips = [
      "Gunakan huruf kapital untuk awalan nama Class (misal: class Hero).",
      "Gunakan kata kunci 'pass' jika Class masih kosong agar tidak error.",
      "Fungsi __init__ berguna untuk memasukkan atribut saat objek pertama kali dibuat.",
      "Satu blueprint (Class) bisa mencetak ribuan Object!"
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const authRes = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const authData = await authRes.json();
        const userData = authData.data || authData.user;

        if (userData) {
          setSession(userData);
          
          const res = await fetch(`${API_URL}/profiles/${userData.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const resJson = await res.json();
          const profile = resJson.data || resJson;

          // Ambil data dasar dari DB
          let currentXP = Number(profile.xp) || 0;
          let currentLevel = Number(profile.level) || 1;
          let currentStreak = Number(profile.streak) || 0;
          let currentAccuracy = Number(profile.accuracy) || 0;

          // 1. TANGGAL HARI INI (WIB / Lokal)
          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

          // 2. FIX FATAL: Parse Tanggal MySQL dengan Benar (Anti-UTC Bug)
          let lastLoginInDB = null;
          if (profile.last_login) {
            // Memasukkan tanggal dari MySQL ke Object Date agar browser mengonversinya ke WIB
            const dbDate = new Date(profile.last_login);
            const y = dbDate.getFullYear();
            const m = String(dbDate.getMonth() + 1).padStart(2, '0');
            const d = String(dbDate.getDate()).padStart(2, '0');
            lastLoginInDB = `${y}-${m}-${d}`;
          }

          let needsDbUpdate = false;

          // 3. LOGIKA STREAK & XP HARIAN
          if (lastLoginInDB !== todayStr) {
            needsDbUpdate = true; // Tandai bahwa database perlu di-update

            // Kalkulasi Streak Presisi
            if (lastLoginInDB) {
              const lastDate = new Date(lastLoginInDB);
              const currentDate = new Date(todayStr);

              const diffMs = currentDate.getTime() - lastDate.getTime();
              const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

              if (diffDays === 1) {
                currentStreak += 1;
              } else if (diffDays > 1) {
                currentStreak = 1;
              }
            } else {
              currentStreak = 1; // Jika baru pertama kali login
            }

            // Tambah XP Harian (Hanya terjadi jika hari benar-benar berganti!)
            currentXP += 10;
          }

          // --- SAFETY NET: Jika karena bug sebelumnya streak nyangkut di 0 ---
          if (currentStreak === 0) {
            currentStreak = 1;
            needsDbUpdate = true;
          }

          // 4. LOGIKA AUTO LEVEL UP
          let xpTarget = currentLevel * 100;
          while (currentXP >= xpTarget) {
            currentLevel += 1;
            currentXP -= xpTarget;
            xpTarget = currentLevel * 100; // Hitung target level berikutnya
            needsDbUpdate = true;
          }

          // 5. EKSEKUSI PENYIMPANAN KE DATABASE (HANYA JIKA ADA PERUBAHAN)
          if (needsDbUpdate) {
            await fetch(`${API_URL}/profiles/${userData.id}`, {
              method: 'PUT',
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ 
                xp: currentXP, 
                level: currentLevel,
                streak: currentStreak, 
                last_login: todayStr 
              })
            });
            // Gembok cadangan di UI
            localStorage.setItem('last_xp_claim_date', todayStr); 
          }

          // =====================================================================
          // 3. AMBIL DATA PROGRESS YANG SUDAH SINKRON DARI DATABASE
          // =====================================================================
          let completedArr = [];
          try {
            const raw = profile.completed_modules;
            completedArr = typeof raw === 'string' ? JSON.parse(raw) : (Array.isArray(raw) ? raw : []);
          } catch (e) {
            completedArr = [];
          }

          // --- FIX LOGIKA AKURASI ---
          if (currentAccuracy === 0 && completedArr.length > 0) {
            currentAccuracy = 100;
          }

          // Tentukan Modul Berikutnya untuk Roadmap dan Tombol "Mulai Misi"
          const highestCompleted = completedArr.length > 0 ? Math.max(...completedArr.map(Number)) : 0;
          const activeModuleId = profile.current_module_id || (highestCompleted + 1);

          setUserProgress({
            level: currentLevel,
            xp: currentXP,
            streak: currentStreak,
            accuracy: currentAccuracy,
            completedModules: completedArr,
            currentModuleId: activeModuleId
          });
        }
      } catch (err) {
        console.error("Gagal sinkronisasi data:", err);
      }
    };

    fetchUserData();
  }, []);

  const renderRoadmap = () => {
    return allModules.map((step, index) => {
      const isDone = userProgress.completedModules.includes(String(step.id));
      const isCurrent = String(userProgress.currentModuleId) === String(step.id);
      const isLocked = !isDone && !isCurrent;

      return (
        <React.Fragment key={step.id}>
          <button 
            onClick={() => handleRoadmapClick(step.id, isLocked)}
            className={`flex flex-col items-center gap-2 group shrink-0 min-w-[70px] transition-transform ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 ${
              isDone ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 
              isCurrent ? 'bg-slate-800 border-2 border-indigo-500 text-indigo-400 animate-pulse' : 
              'bg-slate-900 border border-slate-800 text-slate-600'
            }`}>
              {isDone ? '✓' : index + 1}
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-semibold text-center leading-tight px-2 w-full ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
              {String(step.title).split(':')[0]}
            </span>
          </button>
          
          {index < allModules.length - 1 && (
            <div className={`w-8 md:w-16 h-[2px] -mt-6 mx-1 shrink-0 ${isDone ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500' : 'bg-slate-800'}`}></div>
          )}
        </React.Fragment>
      );
    });
  };

  const xpTarget = (Number(userProgress.level) || 1) * 100;
  const xpPercentage = Math.min((Number(userProgress.xp) / xpTarget) * 100, 100);
  
  const nextModule = allModules.find(m => String(m.id) === String(userProgress.currentModuleId)) || allModules[0] || { title: "Memuat..." };

  // DINAMIS: Misi harian
  const todayStrUI = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, '0') + "-" + String(new Date().getDate()).padStart(2, '0');
  const isLoginDone = localStorage.getItem('last_xp_claim_date') === todayStrUI;

  const dailyMissions = [
    {
      id: 1,
      text: "Akses Lab hari ini",
      xp: 10,
      isDone: isLoginDone
    },
    {
      id: 2,
      text: "Selesaikan 1 Modul",
      xp: 50,
      isDone: userProgress.completedModules.length > 0 
    },
    {
      id: 3,
      text: "Capai Akurasi 100%",
      xp: 20,
      isDone: userProgress.accuracy >= 100 
    }
  ];

  const badge2Unlocked = userProgress.level >= 2;
  const badge3Unlocked = userProgress.streak >= 7;

  const handleRoadmapClick = (stepId, isLocked) => {
    if (!session && !localStorage.getItem('auth_token')) {
      alert("🔐 Silakan login atau daftar terlebih dahulu!");
      navigate('/login');
      return;
    }

    if (isLocked) {
      alert("🔒 Modul terkunci! Selesaikan modul sebelumnya terlebih dahulu.");
    } else {
      navigate(`/materi/${stepId}`); 
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
            Halo, <span className="text-indigo-400">Programmer</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Ruang kerjamu sudah siap. Mari lanjutkan misimu dan sempurnakan kodemu hari ini.
          </p>
        </div>

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
              {session ? (
                <Link to={`/materi/${nextModule.id}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95 cursor-pointer">
                  Mulai Misi <span className="text-xl leading-none">➔</span>
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-sm active:scale-95 cursor-pointer">
                  Daftar Sekarang <span className="text-xl leading-none">✨</span>
                </Link>
              )}
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

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg group hover:border-fuchsia-500/30 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Misi Harian</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {dailyMissions.map((mission) => (
                <li 
                  key={mission.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    mission.isDone ? 'bg-slate-950/80 border-emerald-500/20' : 'bg-slate-950/50 border-slate-800/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    mission.isDone 
                      ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'border-2 border-slate-600 text-transparent'
                  }`}>
                    {mission.isDone ? '✓' : ''}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${mission.isDone ? 'text-slate-200 line-through opacity-70' : 'text-white'}`}>
                      {mission.text}
                    </p>
                    <p className={`text-[10px] font-mono font-bold ${mission.isDone ? 'text-emerald-400' : 'text-fuchsia-400'}`}>
                      +{mission.xp} XP
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Badge Explorer</h3>
            </div>
            <div className="flex gap-4">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-help" title="First Blood">🏆</div>
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-help transition-all duration-500 ${badge2Unlocked ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-950 border-2 border-dashed border-slate-800 opacity-40 grayscale'}`} title="Master">📱</div>
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl cursor-help transition-all duration-500 ${badge3Unlocked ? 'bg-gradient-to-tr from-fuchsia-500 to-pink-600 shadow-[0_0_20px_rgba(217,70,239,0.4)]' : 'bg-slate-950 border-2 border-dashed border-slate-800 opacity-40 grayscale'}`} title="On Fire">🔥</div>
            </div>
          </div>
        </aside>

        {/* ROADMAP SECTION */}
        <section className="lg:col-span-3 mt-2 flex flex-col gap-4">
          <div className="w-full bg-[#0d0d12] border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
              <div className="text-fuchsia-500 animate-pulse font-bold">❯_</div>
              <p className="font-mono text-xs text-slate-400">
                <span className="text-emerald-400 font-bold">System.Hint: </span> 
                {dailyTip}
              </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-lg">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Progres Modul OOP</h3>
              <p className="text-sm text-slate-400">
                Kamu sudah menyelesaikan {userProgress.completedModules.length} dari {allModules.length} misi utama.
              </p>
            </div>
            
            <div className="flex items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {allModules.map((step, index) => {
                  const isDone = userProgress.completedModules.includes(String(step.id));
                  const isCurrent = String(userProgress.currentModuleId) === String(step.id);
                  const isLocked = !isDone && !isCurrent;

                  return (
                    <React.Fragment key={step.id}>
                      {/* FIX 3: Tambah shrink-0 pada button agar tidak gepeng */}
                      <button 
                        onClick={() => handleRoadmapClick(step.id, isLocked)}
                        className={`flex flex-col items-center gap-2 group shrink-0 min-w-[60px] transition-transform ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all z-10 ${
                          isDone ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 
                          isCurrent ? 'bg-slate-800 border-2 border-indigo-500 text-indigo-400 animate-pulse' : 
                          'bg-slate-900 border border-slate-800 text-slate-600'
                        }`}>
                          {isDone ? '✓' : index + 1}
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider font-semibold text-center leading-tight px-2 ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
                          {String(step.title).split(':')[0]}
                        </span>
                      </button>
                      
                      {/* FIX 3: Tambah shrink-0 pada garis penghubung */}
                      {index < allModules.length - 1 && (
                        <div className={`w-8 md:w-16 h-[2px] -mt-6 mx-1 shrink-0 ${isDone ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500' : 'bg-slate-800'}`}></div>
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