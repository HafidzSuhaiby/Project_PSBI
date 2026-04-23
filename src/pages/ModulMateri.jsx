import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { modules } from '../data/modules';
import { loadPyodide } from 'pyodide';

const ModulMateri = () => {
  // State Management (Modul dan Halaman)
  const [currentModulIndex, setCurrentModulIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // Tambahan state untuk halaman
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const editorRef = useRef(null);
  const currentModul = modules[currentModulIndex];
  const currentPage = currentModul.pages[currentPageIndex]; // Data spesifik per halaman

  // 1. INISIALISASI MESIN PYTHON
  useEffect(() => {
    const initPyodide = async () => {
      try {
        const py = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/"
        });
        setPyodide(py);
        setIsLoading(false);
      } catch (err) {
        console.error("Gagal memuat Pyodide:", err);
        setIsLoading(false);
      }
    };
    initPyodide();
  }, []);

  // 2. RESET STATE SAAT PINDAH HALAMAN / MODUL
  useEffect(() => {
    setTaskCompleted(false);
    setOutput('');
    // Update isi editor jika halaman berpindah
    if (editorRef.current && currentPage) {
      editorRef.current.setValue(currentPage.defaultCode);
    }
  }, [currentModulIndex, currentPageIndex, currentPage]);

  // 3. FUNGSI JALANKAN KODE
  const runCode = async () => {
    if (!pyodide) return;
    
    const userCode = editorRef.current.getValue();
    setOutput('Sedang memproses kode...');

    try {
      pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);
      
      await pyodide.runPythonAsync(userCode);
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      setOutput(stdout || "Program selesai dijalankan (tidak ada output print).");

      // ====== SMART VALIDATOR BARU ======
      // 1. Ubah semua petik ganda (") menjadi petik tunggal (')
      // 2. Hapus semua spasi kosong agar pengecekan lebih fleksibel
      const normalizedUserCode = userCode.replace(/"/g, "'").replace(/\s+/g, '');
      const normalizedCheck = currentPage.check.replace(/"/g, "'").replace(/\s+/g, '');

      // Validasi: Cek apakah kode user (yang sudah dirapikan) mengandung syarat lulus
      if (normalizedUserCode.includes(normalizedCheck)) {
        setTaskCompleted(true);
      }
      // ==================================

    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setTaskCompleted(false);
    }
  };

  // 4. NAVIGASI NEXT (Halaman & Modul)
  const handleNext = () => {
    if (currentPageIndex < currentModul.pages.length - 1) {
      // Jika masih ada halaman di modul ini, lanjut ke halaman berikutnya
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentModulIndex < modules.length - 1) {
      // Jika halaman habis, pindah ke modul berikutnya, reset halaman ke 0
      setCurrentModulIndex(currentModulIndex + 1);
      setCurrentPageIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20 selection:bg-fuchsia-500/30">
      
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_20px_rgba(217,70,239,0.5)]"></div>
            <p className="text-fuchsia-400 font-mono text-sm tracking-[0.3em] animate-pulse uppercase">Memuat Mesin Python...</p>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 lg:p-10 flex flex-col gap-12">
        
        {/* SECTION 1: NARASI NATURAL & ANALOGI REALITAS */}
        <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-4 p-4 opacity-5 text-[10rem] rotate-12">🐍</div>
            <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-3">
              Modul {currentModul.id} - Bagian {currentPageIndex + 1} / {currentModul.pages.length}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter leading-tight relative z-10">
              {currentModul.title}
            </h1>
          </div>

          {/* RENDER YOUTUBE VIDEO JIKA ADA */}
          {currentPage.youtubeId && (
            <div className="w-full aspect-video bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${currentPage.youtubeId}`}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Bubble Narasi */}
          <div className="flex gap-5 md:pr-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-white/10">
              🤖
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 md:p-8 rounded-[2rem] rounded-tl-sm text-slate-200 text-lg leading-relaxed shadow-xl relative">
              {currentPage.narrative}
            </div>
          </div>

          {/* Mission Box */}
          <div className="bg-fuchsia-950/20 border-2 border-fuchsia-500/30 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(217,70,239,0.05)] relative mt-4">
            <div className="absolute -top-4 left-8 bg-slate-950 border border-fuchsia-500 px-4 py-1.5 rounded-full text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping"></span>
              Current Mission
            </div>
            <p className="text-white text-xl font-bold mt-2 tracking-tight">{currentPage.mission}</p>
          </div>

        </section>

        {/* SECTION 2: LIVE-CODING LAB */}
        <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          
          <div className="flex items-center gap-3 text-cyan-400 uppercase text-[10px] font-black tracking-[0.3em] ml-4">
            <span className="bg-cyan-400 w-2 h-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
            Python Execution Layer
          </div>

          <div className="h-[600px] rounded-[2.5rem] overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-2xl flex flex-col relative group">
            
            {/* Editor Header */}
            <div className="bg-[#181818] px-8 py-4 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                </div>
                <span className="ml-4 font-mono text-xs text-slate-500 tracking-widest">main.py</span>
              </div>
              {taskCompleted && (
                <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-emerald-500/20 animate-pulse">
                  ✓ Task Completed
                </span>
              )}
            </div>

            <div className="flex-1 pt-4">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={currentPage.defaultCode}
                onMount={(editor) => (editorRef.current = editor)}
                options={{ 
                  fontSize: 16, 
                  fontFamily: "'Fira Code', monospace",
                  minimap: { enabled: false }, 
                  scrollBeyondLastLine: false,
                  padding: { top: 20 },
                  lineHeight: 25,
                  cursorBlinking: "smooth",
                  smoothScrolling: true
                }}
              />
            </div>

            {/* Floating Run Button */}
            <button 
              onClick={runCode}
              className="absolute bottom-[30%] right-10 z-10 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-[0_10px_30px_rgba(6,182,212,0.3)] transition-all hover:scale-110 active:scale-95 group"
              title="Jalankan Kode"
            >
              <span className="text-2xl group-hover:translate-x-0.5 transition-transform">▶</span>
            </button>

            {/* Terminal Output */}
            <div className="h-[28%] min-h-[160px] bg-[#050505] border-t border-slate-800 p-8 font-mono text-sm overflow-y-auto">
              <div className="text-slate-600 mb-4 text-[10px] uppercase tracking-widest font-black">System Terminal</div>
              {output ? (
                <div className={`${taskCompleted ? 'text-emerald-400' : 'text-slate-300'} leading-relaxed animate-in fade-in duration-300`}>
                  <span className="text-slate-700 mr-2">$</span> python main.py <br/>
                  <pre className="mt-2 whitespace-pre-wrap">{output}</pre>
                  {taskCompleted && <p className="mt-4 font-bold animate-pulse text-emerald-300">{currentPage.successMsg}</p>}
                </div>
              ) : (
                <div className="text-slate-700 italic flex items-center gap-2">
                  <span className="w-1 h-4 bg-slate-800 animate-pulse"></span>
                  Menunggu eksekusi kode...
                </div>
              )}
            </div>
          </div>

        </section>

        {/* FOOTER NAVIGATION */}
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleNext}
            disabled={!taskCompleted}
            className={`px-16 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-2xl ${
              taskCompleted 
              ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-fuchsia-500/20 hover:-translate-y-1' 
              : 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed'
            }`}
          >
            {currentPageIndex === currentModul.pages.length - 1 && currentModulIndex === modules.length - 1 
              ? "Selesaikan Kursus 🏆" 
              : "Selanjutnya ➔"}
          </button>
        </div>

      </main>
    </div>
  );
};

export default ModulMateri;