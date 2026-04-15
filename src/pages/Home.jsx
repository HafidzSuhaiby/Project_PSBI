import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
            Halo, <span className="text-indigo-400">Explorer</span> 👋
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Ruang kerjamu sudah siap. Mari lanjutkan modul Object-Oriented Programming dan sempurnakan kodemu hari ini.
          </p>
        </div>

        {/* User Quick Profile */}
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-inner">
            👾
          </div>
          <div>
            <p className="text-sm font-medium text-white">Level 12</p>
            <div className="w-32 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 text-right">1,250 / 1,500 XP</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Modul Utama (Lanjutkan Belajar) */}
        <section className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-opacity group-hover:bg-indigo-600/10"></div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  📚
                </span>
                <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400">
                  Misi Selanjutnya
                </h3>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                Pewarisan (Inheritance)
              </h2>
              <p className="text-slate-400 max-w-md text-base leading-relaxed">
                Pelajari bagaimana sebuah Class dapat mewariskan atribut dan metode ke Class lainnya untuk menghindari penulisan kode berulang.
              </p>
            </div>
            
            <div className="mt-10">
              <Link 
                to="/materi" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-semibold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
              >
                Lanjutkan Modul
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* SIDEBAR WIDGETS */}
        <aside className="flex flex-col gap-6">
          
          {/* Stats Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">Statistik Harian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 text-xs font-medium mb-1">🔥 Streak</p>
                <p className="text-2xl font-bold text-white">5 Hari</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 text-xs font-medium mb-1">🎯 Akurasi Kuis</p>
                <p className="text-2xl font-bold text-white">92%</p>
              </div>
            </div>
          </div>

          {/* Community Note */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
              👥
            </div>
            <div>
              <p className="text-white font-medium text-sm">Lab Sedang Ramai</p>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Ada <span className="text-indigo-400 font-medium">14 temanmu</span> yang sedang mengerjakan modul Python saat ini.
              </p>
            </div>
          </div>

        </aside>

        {/* ROADMAP / PROGRESS SECTION */}
        <section className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mt-2">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Progres Modul Python</h3>
            <p className="text-sm text-slate-400">Kamu sudah menyelesaikan 2 dari 4 materi dasar.</p>
          </div>
          
          <div className="flex items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             {[
               { id: 1, title: 'Variabel', status: 'done' },
               { id: 2, title: 'Looping', status: 'done' },
               { id: 3, title: 'OOP', status: 'current' },
               { id: 4, title: 'API', status: 'locked' },
             ].map((step, index) => (
               <React.Fragment key={step.id}>
                 <div className="flex flex-col items-center gap-2 group cursor-default">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors z-10 ${
                      step.status === 'done' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 
                      step.status === 'current' ? 'bg-slate-800 border-2 border-indigo-500 text-indigo-400' : 
                      'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}>
                      {step.status === 'done' ? '✓' : step.id}
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${step.status === 'locked' ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step.title}
                    </span>
                 </div>
                 {index < 3 && (
                   <div className={`w-12 md:w-16 h-[2px] -mt-6 mx-2 ${
                     step.status === 'done' ? 'bg-indigo-500' : 'bg-slate-800'
                   }`}></div>
                 )}
               </React.Fragment>
             ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;