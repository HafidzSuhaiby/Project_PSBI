import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { modules as staticModules } from '../data/modules';
import { loadPyodide } from 'pyodide';
import ReactMarkdown from 'react-markdown';

const API_URL = "http://localhost:5000/api";

const ModulMateri = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State Utama ---
  const [currentModul, setCurrentModul] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState(""); 
  const [userId, setUserId] = useState(null);
  
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

  // Helper YouTube ID untuk mengekstrak ID dari URL jika perlu
  const getYoutubeEmbedId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  // 1. LOGIKA PENGAMBILAN DATA & SYNC PROGRESS (API BACKEND)
  useEffect(() => {
    const fetchMateri = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      let lastSavedPage = 0;
      let alreadyCompleted = false;

      if (token) {
        try {
          const authRes = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const authData = await authRes.json();
          const currentUserId = authData.data?.id || authData.user?.id || authData.id;
          
          if (currentUserId) {
            setUserId(currentUserId);
            const profileRes = await fetch(`${API_URL}/profiles/${currentUserId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const profileData = await profileRes.json();
            const profile = profileData.data || profileData;

            if (profile) {
              lastSavedPage = parseInt(profile.last_page_index) || 0;
              const completedList = Array.isArray(profile.completed_modules) 
                ? profile.completed_modules 
                : JSON.parse(profile.completed_modules || "[]");
              
              alreadyCompleted = completedList.map(String).includes(String(id));
            }
          }
        } catch (err) {
          console.error("Error sync progress:", err);
        }
      }

      let loadedModul = null;
      if (id && String(id).startsWith('ai-')) {
        const realId = id.replace('ai-', '');
        try {
          const modRes = await fetch(`${API_URL}/ai/modules_ai/${realId}`);
          const resData = await modRes.json();
          const data = resData.data;
          if (data) {
            const parsedContent = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
            loadedModul = {
              id: `ai-${data.id}`,
              title: parsedContent.title || data.title,
              isAI: true,
              pages: parsedContent.pages.map(page => ({
                narrative: page.narrative,
                mission: page.mission,
                defaultCode: page.defaultCode || "# Tulis kode Python\n",
                check: page.check || "print",
                successMsg: page.successMsg || "Bagus!",
                youtubeId: page.youtubeId || page.videoUrl || null 
              }))
            };
          }
        } catch (err) { console.error("Error fetch AI module:", err); }
      } else {
        const targetId = id ? parseInt(id) : staticModules[0].id;
        loadedModul = staticModules.find(m => m.id === targetId);
      }

      if (loadedModul) {
        setCurrentModul(loadedModul);
        if (alreadyCompleted) {
          setCurrentPageIndex(0);
          setTaskCompleted(true);
        } else {
          setCurrentPageIndex(lastSavedPage < (loadedModul.pages?.length || 0) ? lastSavedPage : 0);
        }
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
      } catch (err) { console.error("Pyodide error:", err); }
    };
    initPyodide();
  }, []);

  // 3. RESET EDITOR SAAT PINDAH HALAMAN
  useEffect(() => {
    if (currentModul?.pages && currentModul.pages[currentPageIndex]) {
      setTaskCompleted(false);
      setOutput('');
      const defaultVal = currentModul.pages[currentPageIndex].defaultCode || "";
      setCode(defaultVal);
      if (editorRef.current) {
        editorRef.current.setValue(defaultVal);
      }
    }
  }, [currentPageIndex, currentModul]);

  const currentPage = currentModul?.pages ? currentModul.pages[currentPageIndex] : null;

  // 4. FUNGSI JALANKAN KODE DENGAN VALIDASI NORMALISASI
  const runCode = async () => {
    if (!pyodide || !currentPage) return;
    const userCode = editorRef.current ? editorRef.current.getValue() : code;
    setOutput('Sedang memproses kode...');
    try {
      pyodide.runPython(`import sys, io\nsys.stdout = io.StringIO()`);
      await pyodide.runPythonAsync(userCode);
      const stdout = pyodide.runPython("sys.stdout.getvalue()").trim();
      setOutput(stdout || "Program selesai dijalankan.");
      
      const normalize = (str) => {
        return (str || "").toLowerCase().replace(/\s+/g, '').replace(/['"]/g, '"');
      };

      const cleanOutput = normalize(stdout);
      const cleanUserCode = normalize(userCode);
      const cleanTarget = normalize(currentPage.check || "print");

      if (cleanOutput.includes(cleanTarget) || cleanUserCode.includes(cleanTarget)) {
        setTaskCompleted(true);
      } else {
        setTaskCompleted(false);
      }
    } catch (err) { 
      setOutput(`Error: ${err.message}`); 
      setTaskCompleted(false);
    }
  };

  // 5. LOGIKA SIMPAN KE DATABASE (API) & NAVIGASI
  const handleNext = async () => {
    if (!currentModul || !currentModul.pages) return;
    const token = localStorage.getItem('auth_token');
    
    // Jika tidak login, navigasi biasa tanpa save DB
    if (!userId || !token) {
      if (currentPageIndex < currentModul.pages.length - 1) {
        setCurrentPageIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Selesai!"); navigate('/');
      }
      return;
    }

    setIsLoading(true);
    try {
      if (currentPageIndex < currentModul.pages.length - 1) {
        const nextIdx = currentPageIndex + 1;
        await fetch(`${API_URL}/profiles/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ last_page_index: nextIdx })
        });
        setCurrentPageIndex(nextIdx);
      } else {
        // Logika Selesai Modul (Push ID ke completed_modules)
        const profileRes = await fetch(`${API_URL}/profiles/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        const currentProfile = profileData.data || profileData;

        let completedArr = [];
        try {
            completedArr = typeof currentProfile.completed_modules === 'string' 
                ? JSON.parse(currentProfile.completed_modules) 
                : (currentProfile.completed_modules || []);
        } catch (e) { completedArr = []; }

        if (!completedArr.map(String).includes(String(id))) {
          completedArr.push(String(id));
        }

        await fetch(`${API_URL}/profiles/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ 
            completed_modules: JSON.stringify(completedArr),
            xp: (currentProfile.xp || 0) + 50,
            last_page_index: 0 
          })
        });
        alert("Selamat! Progres tersimpan. 🏆");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Anda adalah Pynara, pakar Python. Jawab singkat." },
            { role: "user", content: `Misi: ${currentPage?.mission}. Tanya: ${userMsg}` }
          ]
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.choices[0].message.content }]);
    } catch (error) { console.error(error); } finally { setIsTyping(false); }
  };

  if (isLoading || !currentModul) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans pb-20">
      <main className="max-w-5xl mx-auto p-6 lg:p-10 flex flex-col gap-12">
        <section className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-3">
              Part {currentPageIndex + 1} / {currentModul.pages.length}
            </p>
            <h1 className="text-4xl font-black text-white">{currentModul.title}</h1>
          </div>

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
            <div className="absolute -top-4 left-8 bg-slate-950 border border-fuchsia-500 px-4 py-1.5 rounded-full text-[10px] font-black text-fuchsia-400 uppercase">Current Mission</div>
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
                height="100%" defaultLanguage="python" theme="vs-dark" 
                key={`${currentModul.id}-${currentPageIndex}`}
                defaultValue={code}
                onMount={(editor) => { editorRef.current = editor; }} 
                options={{ fontSize: 16, minimap: { enabled: false }, automaticLayout: true, padding: { top: 20 } }} 
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

      <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-80 md:w-96 h-[450px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white font-bold">🤖 Pynara Chat <button onClick={() => setIsChatOpen(false)}>✕</button></div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-950/40">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Tanya Pynara..." className="flex-1 bg-slate-800 rounded-xl px-4 py-2 text-white outline-none" />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl">➔</button>
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