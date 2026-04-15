import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { modules } from '../data/modules';
import { loadPyodide } from 'pyodide';

const ModulMateri = () => {
  // State Management sesuai alur ADDIE (Fase Development)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const editorRef = useRef(null);
  const currentData = modules[currentIndex];

  // --- 1. INISIALISASI MESIN PYTHON (Client-Side Interpreter) ---
  // Sesuai Spesifikasi Teknis di Proposal Poin 3.2.1 & 3.3.1
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

  // --- 2. RESET STATE SAAT PINDAH MODUL ---
  useEffect(() => {
    setTaskCompleted(false);
    setOutput('');
  }, [currentIndex]);

  // --- 3. FUNGSI JALANKAN KODE (Execution Layer) ---
  // Implementasi fitur Live-Coding & Read-to-Action (Proposal 1.4.4)
  const runCode = async () => {
    if (!pyodide) return;
    
    const userCode = editorRef.current.getValue();
    setOutput('Sedang memproses kode...');

    try {
      // Mengalihkan output print() Python ke terminal web
      pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);
      
      await pyodide.runPythonAsync(userCode);
      
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      setOutput(stdout || "Program selesai dijalankan (tidak ada output print).");

      // Validasi tugas berdasarkan keyword (Strategi Read-to-Action)
      if (userCode.includes(currentData.check)) {
        setTaskCompleted(true);
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setTaskCompleted(false);
    }
  };

  const handleNextModul = () => {
    if (currentIndex < modules.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20 selection:bg-fuchsia-500/30">
      
      {/* LOADING OVERLAY: Memastikan mesin siap sebelum digunakan */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin mx-auto mb-6 shadow-[0_0_20px_rgba(217,70,239,0.5)]"></div>
            <p className="text-fuchsia-400 font-mono text-sm tracking-[0.3em] animate-pulse uppercase">Memuat Mesin Python...</p>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 lg:p-10 flex flex-col gap-12">
        
        {/* SECTION 1: NARASI NATURAL & ANALOGI REALITAS (Proposal 3.2.2) */}
        <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Modul */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-4 p-4 opacity-5 text-[10rem] rotate-12">🐍</div>
            <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-3">Modul {currentData.id} / Capaian Pembelajaran</p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter leading-tight relative z-10">
              {currentData.title}
            </h1>
          </div>

          {/* Bubble Narasi Natural (Proposal 4.1) */}
          <div className="flex gap-5 md:pr-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-white/10">
              🤖
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 md:p-8 rounded-[2rem] rounded-tl-sm text-slate-200 text-lg leading-relaxed shadow-xl relative">
              {currentData.narrative}
            </div>
          </div>

          {/* Mission Box: Strategi Read-to-Action (Proposal 1.4.4) */}
          <div className="bg-fuchsia-950/20 border-2 border-fuchsia-500/30 p-8 rounded-[2rem] shadow-[0_0_40px_rgba(217,70,239,0.05)] relative mt-4">
            <div className="absolute -top-4 left-8 bg-slate-950 border border-fuchsia-500 px-4 py-1.5 rounded-full text-[10px] font-black text-fuchsia-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping"></span>
              Current Mission
            </div>
            <p className="text-white text-xl font-bold mt-2 tracking-tight">{currentData.mission}</p>
          </div>

        </section>

        {/* SECTION 2: LIVE-CODING LAB (Proposal 3.2.3) */}
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

            {/* Monaco Editor Integration (Proposal 3.3.1) */}
            <div className="flex-1 pt-4">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={currentData.defaultCode}
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

            {/* Terminal Output Window */}
            <div className="h-[28%] min-h-[160px] bg-[#050505] border-t border-slate-800 p-8 font-mono text-sm overflow-y-auto">
              <div className="text-slate-600 mb-4 text-[10px] uppercase tracking-widest font-black">System Terminal</div>
              {output ? (
                <div className={`${taskCompleted ? 'text-emerald-400' : 'text-slate-300'} leading-relaxed animate-in fade-in duration-300`}>
                  <span className="text-slate-700 mr-2">$</span> python main.py <br/>
                  <pre className="mt-2 whitespace-pre-wrap">{output}</pre>
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

        {/* FOOTER NAVIGATION (Model ADDIE - Fase Implementation) */}
        <div className="flex justify-center mt-4">
          <button 
            onClick={handleNextModul}
            disabled={!taskCompleted}
            className={`px-16 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-2xl ${
              taskCompleted 
              ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-fuchsia-500/20 hover:-translate-y-1' 
              : 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed'
            }`}
          >
            {currentIndex === modules.length - 1 ? "Selesaikan Kursus 🏆" : "Lanjut Modul ➔"}
          </button>
        </div>

      </main>
    </div>
  );
};

export default ModulMateri;