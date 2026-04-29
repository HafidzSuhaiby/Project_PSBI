import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { modules as staticModules } from '../data/modules';
import { loadPyodide } from 'pyodide';
import { supabase } from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

const ModulMateri = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management
  const [currentModul, setCurrentModul] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState(""); 
  
  // --- State Fitur Chat ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Aku Pynara. Ada yang ingin ditanyakan tentang kode Python di halaman ini?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const editorRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. LOGIKA PENGAMBILAN DATA (STATIS vs AI)
  useEffect(() => {
    const fetchMateri = async () => {
      setIsLoading(true);
      if (id && id.startsWith('ai-')) {
        const realId = id.replace('ai-', '');
        const { data } = await supabase.from('modules_ai').select('*').eq('id', realId).single();

        if (data) {
          try {
            const parsedContent = JSON.parse(data.content);
            setCurrentModul({
              id: `ai-${data.id}`,
              title: parsedContent.title || data.title,
              isAI: true,
              pages: parsedContent.pages.map(page => ({
                narrative: page.narrative,
                mission: page.mission,
                defaultCode: page.defaultCode || "# Tulis kode Python\n",
                check: page.check || "print",
                successMsg: page.successMsg || "Bagus!",
                // Menangani kemungkinan perbedaan nama key youtubeId atau videoUrl
                youtubeId: page.youtubeId || page.videoUrl || null 
              }))
            });
          } catch (e) {
            setCurrentModul({
              id: `ai-${data.id}`, title: data.title, isAI: true,
              pages: [{ narrative: data.content, mission: "Pelajari materi AI.", defaultCode: "print('Halo!')", check: "print", successMsg: "Selesai!" }]
            });
          }
        }
      } else {
        const targetId = id ? parseInt(id) : staticModules[0].id;
        const localModul = staticModules.find(m => m.id === targetId);
        setCurrentModul(localModul);
      }
      setIsLoading(false);
    };
    fetchMateri();
  }, [id]);

  // 2. INISIALISASI PYODIDE
  useEffect(() => {
    const initPyodide = async () => {
      try {
        const py = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/" });
        setPyodide(py);
      } catch (err) { console.error("Gagal memuat Pyodide:", err); }
    };
    initPyodide();
  }, []);

  // 3. RESET STATE SAAT PINDAH HALAMAN
  useEffect(() => {
    if (currentModul?.pages[currentPageIndex]) {
      setTaskCompleted(false);
      setOutput('');
      const defaultVal = currentModul.pages[currentPageIndex].defaultCode || "";
      setCode(defaultVal);
      if (editorRef.current) {
        editorRef.current.setValue(defaultVal);
      }
    }
  }, [currentModul, currentPageIndex]);

  const currentPage = currentModul?.pages[currentPageIndex];

  // Helper untuk mendapatkan Embed ID yang bersih
  const getYoutubeEmbedId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  // 4. FUNGSI JALANKAN KODE 
  const runCode = async () => {
    if (!pyodide || !currentPage) return;
    
    const userCode = editorRef.current ? editorRef.current.getValue() : code;
    setOutput('Sedang memproses kode...');
    
    try {
      pyodide.runPython(`import sys, io\nsys.stdout = io.StringIO()`);
      await pyodide.runPythonAsync(userCode);
      const stdout = pyodide.runPython("sys.stdout.getvalue()").trim();
      
      setOutput(stdout || "Program selesai dijalankan.");
      
      // --- PERBAIKAN LOGIKA VALIDASI ---
      const targetCheck = (currentPage.check || "").toLowerCase().trim();
      
      // Fungsi helper untuk menghapus spasi dan menormalisasi petik
      const normalize = (str) => {
        return str
          .toLowerCase()
          .replace(/\s+/g, '')     // Hapus semua spasi/enter
          .replace(/['"]/g, '"');  // Ubah semua petik satu (') menjadi petik dua (")
      };

      const cleanOutput = normalize(stdout);
      const cleanUserCode = normalize(userCode);
      const cleanTarget = normalize(targetCheck);

      // Cek apakah target ada di output atau di dalam kode
      const isOutputValid = cleanOutput.includes(cleanTarget) && cleanOutput !== "";
      const isCodeValid = cleanUserCode.includes(cleanTarget);

      if (isOutputValid || isCodeValid) {
        setTaskCompleted(true);
      } else {
        setTaskCompleted(false);
      }

    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setTaskCompleted(false);
    }
  };
  // 5. NAVIGASI
  const handleNext = () => {
    if (currentPageIndex < currentModul.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const savedProgress = localStorage.getItem('pynara_progress');
      let progress = savedProgress ? JSON.parse(savedProgress) : { level: 1, xp: 0, completedModules: [] };
      progress.xp += 50;
      if (!progress.completedModules.includes(currentModul.id)) {
        progress.completedModules.push(currentModul.id);
      }
      localStorage.setItem('pynara_progress', JSON.stringify(progress));
      alert("Selamat! Modul telah selesai! 🏆");
      navigate('/dashboard'); 
    }
  };

  // --- FUNGSI CHAT AI ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Anda adalah Pynara, asisten AI pakar Python." },
            { role: "user", content: `Materi: ${currentPage?.mission}. Tanya: ${userMsg}` }
          ]
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.choices[0].message.content }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Koneksi bermasalah." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!currentModul) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20">
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 lg:p-10 flex flex-col gap-12">
        <section className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-3">
              Part {currentPageIndex + 1} / {currentModul.pages.length}
            </p>
            <h1 className="text-4xl font-black text-white">{currentModul.title}</h1>
          </div>

          {/* VIDEO RENDERER - PERBAIKAN: Menggunakan youtubeId */}
          {currentPage?.youtubeId && (
            <div className="w-full aspect-video bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${getYoutubeEmbedId(currentPage.youtubeId)}`}
                title="Materi Video" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="flex gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-2xl shrink-0 shadow-lg">🤖</div>
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] rounded-tl-sm text-slate-200 text-lg w-full shadow-xl">
              {currentModul.isAI ? (
                <div className="prose prose-invert max-w-none"><ReactMarkdown>{currentPage?.narrative}</ReactMarkdown></div>
              ) : (
                <div className="whitespace-pre-line">{currentPage?.narrative}</div>
              )}
            </div>
          </div>

          <div className="bg-fuchsia-950/20 border-2 border-fuchsia-500/30 p-8 rounded-[2rem] relative">
            <div className="absolute -top-4 left-8 bg-slate-950 border border-fuchsia-500 px-4 py-1.5 rounded-full text-[10px] font-black text-fuchsia-400 uppercase">
              Current Mission
            </div>
            <p className="text-white text-xl font-bold mt-2">{currentPage?.mission}</p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="h-[550px] rounded-[2.5rem] overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-2xl flex flex-col relative">
            <div className="bg-[#181818] px-8 py-4 flex justify-between items-center border-b border-slate-800">
               <span className="font-mono text-xs text-slate-500">main.py</span>
               {taskCompleted && <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">✓ Task Completed</span>}
            </div>
            <div className="flex-1 pt-4">
              <Editor 
                height="100%" 
                defaultLanguage="python" 
                theme="vs-dark" 
                key={`${currentModul.id}-${currentPageIndex}`} 
                defaultValue={currentPage?.defaultCode || "# Tulis kode Python\n"}
                onMount={(editor) => { editorRef.current = editor; }} 
                options={{ 
                    fontSize: 16, 
                    minimap: { enabled: false },
                    automaticLayout: true,
                    padding: { top: 20 }
                }} 
              />
            </div>
            <button onClick={runCode} className="absolute bottom-[35%] right-10 z-10 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all">▶</button>
            <div className="h-[30%] bg-[#050505] border-t border-slate-800 p-8 font-mono text-sm overflow-y-auto">
              <pre className={taskCompleted ? 'text-emerald-400' : 'text-slate-300'}>{output || "Menunggu eksekusi kode..."}</pre>
              {taskCompleted && <p className="mt-4 font-bold text-emerald-300 animate-pulse">{currentPage?.successMsg}</p>}
            </div>
          </div>
        </section>

        <div className="flex justify-center mt-4">
          <button onClick={handleNext} disabled={!taskCompleted} className={`px-16 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl ${taskCompleted ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:-translate-y-1' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}`}>
            {currentPageIndex === currentModul.pages.length - 1 ? "Selesaikan Modul 🏆" : "Selanjutnya ➔"}
          </button>
        </div>
      </main>

      {/* --- CHAT AI SIDEBAR/POPUP --- */}
      <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-80 md:w-96 h-[450px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="bg-indigo-600 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-white font-bold">🤖 Pynara Chat</div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-950/40">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 shadow-md'}`}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-xs text-slate-500 animate-pulse">Pynara sedang mengetik...</div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Tanya Pynara..." className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-sm text-white focus:ring-1 ring-indigo-500 outline-none" />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-500 transition-colors">➔</button>
            </form>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-xl hover:scale-105 transition-transform">
          {isChatOpen ? '✕' : '💬'}
        </button>
      </div>
    </div>
  );
};

export default ModulMateri;