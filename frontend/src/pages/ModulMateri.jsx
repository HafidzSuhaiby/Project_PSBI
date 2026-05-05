import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { modules as staticModules } from '../data/modules';
import { loadPyodide } from 'pyodide';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Draggable from 'react-draggable';

const API_URL = "http://localhost:5000/api";

const ModulMateri = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentModul, setCurrentModul] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState(""); 
  const [userId, setUserId] = useState(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState(0); 
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Aku Pynara. Ada yang ingin ditanyakan tentang kode Python di halaman ini?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const editorRef = useRef(null);
  const chatEndRef = useRef(null);
  const nodeRef = useRef(null); // FIX: Ref untuk draggable
  const nodeRefChat = useRef(null); // Ref untuk jendela chat
  const nodeRefButton = useRef(null); // Ref untuk tombol bulat

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getYoutubeEmbedId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  };

  useEffect(() => {
    const fetchMateri = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      let lastSavedPage = 0;
      let alreadyCompleted = false;

      const targetId = id || (staticModules[0] ? String(staticModules[0].id) : null); 
      const cleanTargetId = String(targetId).replace('ai-', '');

      if (token) {
        try {
          const authRes = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (authRes.ok) {
            const authData = await authRes.json();
            const currentUserId = authData.data?.id || authData.user?.id || authData.id;
            
            if (currentUserId) {
              setUserId(currentUserId);
              
              try {
                const progressRes = await fetch(`${API_URL}/users-progress/${currentUserId}/${cleanTargetId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (progressRes.ok) {
                    const resJson = await progressRes.json();
                    const progressData = resJson.data; 
                    
                    if (progressData) { 
                      lastSavedPage = parseInt(progressData.last_page_index) || 0;
                      alreadyCompleted = progressData.is_completed === 1;
                    } else { 
                      lastSavedPage = 0;
                      alreadyCompleted = false;
                    }
                } else { 
                  lastSavedPage = 0;
                  alreadyCompleted = false;
                }
              } catch (err) {
                console.error("Gagal mengambil progres spesifik modul:", err);
                lastSavedPage = 0; 
              }
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
              description: data.description || parsedContent.description || null,
              isAI: true,
              pages: parsedContent.pages.map(page => ({
                subtitle: page.subtitle || null,
                narrative: page.narrative,
                content: page.content || null,
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
        loadedModul = staticModules.find(m => String(m.id) === String(targetId)); 
      }

      if (loadedModul) {
        setCurrentModul(loadedModul);
        const validPageIndex = (lastSavedPage >= 0 && lastSavedPage < (loadedModul.pages?.length || 0)) ? lastSavedPage : 0;
        setCurrentPageIndex(validPageIndex);
        setMaxUnlockedIndex(alreadyCompleted ? (loadedModul.pages?.length || 0) : lastSavedPage); 
        setTaskCompleted(alreadyCompleted); 
      }
      setIsLoading(false);
    };
    fetchMateri();
  }, [id]);

  useEffect(() => {
    const initPyodide = async () => {
      try {
        const py = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/" });
        setPyodide(py);
      } catch (err) { console.error("Pyodide error:", err); }
    };
    initPyodide();
  }, []);

  useEffect(() => {
    if (currentModul?.pages && currentModul.pages[currentPageIndex]) {
      setOutput('');
      const defaultVal = currentModul.pages[currentPageIndex].defaultCode || "";
      setCode(defaultVal);
      if (editorRef.current) {
        editorRef.current.setValue(defaultVal);
      }
    }
  }, [currentPageIndex, currentModul]);

  const currentPage = currentModul?.pages ? currentModul.pages[currentPageIndex] : null;

  const runCode = async () => {
    if (!pyodide || !currentPage) return;
    const userCode = editorRef.current ? editorRef.current.getValue() : code;
    setOutput('Sedang memproses kode...');
    try {
      pyodide.runPython(`import sys, io\nsys.stdout = io.StringIO()`);
      await pyodide.runPythonAsync(userCode);
      const stdout = pyodide.runPython("sys.stdout.getvalue()").trim();
      setOutput(stdout || "Program selesai dijalankan.");
      
      const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, '').replace(/['"]/g, '"');
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

  const handleNext = async () => {
    if (!currentModul || !currentModul.pages) return;
    const token = localStorage.getItem('auth_token');
    const rawId = String(currentModul.id);
    const cleanModuleId = rawId.startsWith('ai-') ? rawId.replace('ai-', '') : rawId;

    if (currentPageIndex < currentModul.pages.length - 1) {
      const nextIdx = currentPageIndex + 1;
      
      if (userId && token) {
        try {
          await fetch(`${API_URL}/users-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ 
              user_id: userId,
              module_id: cleanModuleId, 
              last_page_index: nextIdx,
              is_completed: false,
              xp_earned: 0
            })
          });
        } catch (err) { 
          console.error("Gagal update progress:", err); 
        }
      }
      
      if (nextIdx > maxUnlockedIndex) setMaxUnlockedIndex(nextIdx); 
      setTaskCompleted(false); 
      setCurrentPageIndex(nextIdx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    try {
      if (userId && token) { 
        const profileRes = await fetch(`${API_URL}/profiles/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        const currentProfile = profileData.data || profileData;

        let completedArr = [];
        try {
            const raw = currentProfile.completed_modules;
            completedArr = typeof raw === 'string' ? JSON.parse(raw) : (Array.isArray(raw) ? raw : []);
        } catch (e) { completedArr = []; }

        if (!completedArr.map(String).includes(rawId)) {
          completedArr.push(rawId);
        }

        const currentIndex = staticModules.findIndex(m => String(m.id) === rawId);
        const nextModul = (currentIndex !== -1 && currentIndex < staticModules.length - 1) 
          ? staticModules[currentIndex + 1] 
          : null;

        await fetch(`${API_URL}/profiles/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ 
            completed_modules: JSON.stringify(completedArr.filter(i => i && i !== "undefined")),
            xp: (Number(currentProfile.xp) || 0) + 50,
            current_module_id: nextModul ? String(nextModul.id) : cleanModuleId 
          })
        });

        await fetch(`${API_URL}/users-progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ 
            user_id: userId,
            module_id: cleanModuleId,
            last_page_index: currentPageIndex,
            is_completed: true,
            xp_earned: 50
          })
        });
        
        if (currentModul.isAI) {
          alert("Modul AI Selesai! 🏆");
          navigate('/');
        } else if (nextModul) {
          alert("Modul Selesai! Lanjut ke modul berikutnya. 🏆");
          navigate(`/materi/${nextModul.id}`);
        } else {
          alert("Selamat! Semua modul telah diselesaikan. 🏆");
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Gagal proses selesai modul:", error);
      alert("Terjadi kesalahan saat menyimpan progress.");
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
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` 
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Anda adalah Pynara, pakar Python. Jawab singkat dan berikan bantuan logika." },
            { role: "user", content: `Misi saat ini: ${currentPage?.mission}. Kode saat ini: ${editorRef.current?.getValue()}. Pertanyaan: ${userMsg}` }
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
      {/* Sidebar Section */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-slate-900 border-r border-slate-800 z-[160] transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-black uppercase tracking-widest text-sm">Kurikulum Pynara</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6">
            {staticModules.map((modul, mIdx) => (
              <div key={mIdx} className="flex flex-col gap-2">
                <div className="px-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 opacity-80">
                  Modul {mIdx + 1}: {modul.title}
                </div>
                <div className="flex flex-col gap-2">
                  {modul.pages.map((page, pIdx) => {
                    const isCurrentActive = String(modul.id) === String(currentModul.id) && pIdx === currentPageIndex;
                    const isLocked = String(modul.id) === String(currentModul.id) ? pIdx > maxUnlockedIndex : false; 

                    return (
                      <button 
                        key={pIdx} 
                        disabled={isLocked}
                        onClick={() => { 
                          if (String(modul.id) !== String(currentModul.id)) {
                            navigate(`/materi/${modul.id}`);
                          }
                          setCurrentPageIndex(pIdx); 
                          setIsSidebarOpen(false); 
                        }}
                        className={`text-left p-3 rounded-xl transition-all border text-xs ${isCurrentActive ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : !isLocked ? 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white' : 'bg-slate-950/50 border-transparent text-slate-700 cursor-not-allowed opacity-40'}`}
                      >
                        <span className="font-mono mr-2 opacity-50">{pIdx + 1}.</span>
                        <span className="font-bold">{page.subtitle || "Materi Utama"}</span>
                        {isLocked && <span className="ml-2">🔒</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" onClick={() => setIsSidebarOpen(false)}></div>}

      <button onClick={() => setIsSidebarOpen(true)} className="fixed top-24 left-6 z-[100] w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xl hover:bg-slate-800 transition-colors shadow-xl text-white">☰</button>

      <main className="max-w-5xl mx-auto p-6 lg:p-10 flex flex-col gap-12">
        <section className="flex flex-col gap-8">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <p className="text-indigo-400 font-mono text-xs uppercase tracking-widest mb-3">
              Part {currentPageIndex + 1} / {currentModul.pages.length}
            </p>
            <h1 className="text-4xl font-black text-white">{currentModul.title}</h1>
            
            {currentPage?.subtitle && (
              <h2 className="text-xl font-bold text-indigo-300 mt-2">{currentPage.subtitle}</h2>
            )}

            {currentModul.description && (
              <p className="text-slate-400 mt-4 text-lg leading-relaxed max-w-2xl">
                {currentModul.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-10">
            {currentPage?.content ? (
              currentPage.content.map((item, index) => (
                <div key={index} className="flex gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-2xl shrink-0 shadow-lg">🤖</div>
                  <div className="flex flex-col gap-4 w-full">
                    {item.text && (
                      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] rounded-tl-sm text-slate-200 text-lg shadow-xl">
                        {/* FIX: Wrapper div untuk ReactMarkdown agar tidak error className */}
                        <div className="prose prose-invert max-w-none"> 
                          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{item.text}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                    {item.code && (
                      <div className="bg-cyan-950/20 border-l-4 border-cyan-500 p-6 rounded-r-[2rem] rounded-bl-[2rem] font-mono text-sm relative overflow-hidden">
                        <pre className="text-cyan-300 whitespace-pre-wrap"><code>{item.code}</code></pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-2xl shrink-0">🤖</div>
                <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] rounded-tl-sm text-slate-200 text-lg w-full shadow-xl">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{currentPage?.narrative || ""}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="h-[550px] rounded-[2.5rem] overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-2xl flex flex-col relative">
            <div className="bg-[#181818] px-8 py-4 flex justify-between items-center border-b border-slate-800">
                <span className="font-mono text-xs text-slate-500">main.py</span>
                {taskCompleted && <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">✓ Selesai</span>}
            </div>
            <div className="flex-1 pt-4">
              <Editor 
                defaultLanguage="python" 
                defaultValue={code} 
                height="100%" 
                key={`${currentModul.id}-${currentPageIndex}`}
                onMount={(editor) => { editorRef.current = editor; }} 
                options={{ fontSize: 16, minimap: { enabled: false }, automaticLayout: true }} 
                theme="vs-dark"
              />
            </div>
            <button onClick={runCode} className="absolute bottom-[35%] right-10 z-10 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all">▶</button>
            <div className="h-[30%] bg-[#050505] border-t border-slate-800 p-8 font-mono text-sm overflow-y-auto">
              <pre className={taskCompleted ? 'text-emerald-400' : 'text-slate-300'}>{output || "Output akan muncul di sini..."}</pre>
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

      {/* --- BAGIAN CHAT & TOMBOL DRAGGABLE (FIXED) --- */}
      <div className="fixed inset-0 pointer-events-none z-[140]">
        
        <Draggable 
          nodeRef={nodeRefButton} 
          bounds="parent"
          handle=".drag-button-handle" 
        >
          <div 
            ref={nodeRefButton} 
            className="absolute bottom-8 right-8 pointer-events-auto flex flex-col items-end"
          >
            {/* 1. Jendela Chat */}
            {isChatOpen && (
              <div 
                className="mb-4 w-80 md:w-96 h-[450px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
              >
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white font-bold">
                  <div className="flex items-center gap-2"><span>🤖</span> <span>Pynara Chat</span></div>
                  <button onClick={() => setIsChatOpen(false)} className="hover:text-slate-200 px-2">✕</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-950/40">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                        
                        {/* Kontainer Markdown dengan proteksi Overflow */}
                        <div className="prose prose-sm prose-invert max-w-none break-words overflow-hidden">
                          <ReactMarkdown
                            components={{
                              // Menangani blok kode agar otomatis bungkus baris (wrap)
                              code({ node, inline, className, children, ...props }) {
                                return (
                                  <code
                                    className={`${className} block bg-slate-950 p-3 rounded-lg my-2 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs border border-slate-700`}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              }
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-slate-900 flex gap-2 border-t border-slate-800">
                  <input 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    placeholder="Tanya Pynara..." 
                    className="flex-1 bg-slate-800 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl">➔</button>
                </form>
              </div>
            )}

            {/* 2. Tombol Chat Bulat (Handle Drag) */}
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)} 
              className="drag-button-handle w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-grab active:cursor-grabbing"
            >
              {isChatOpen ? '✕' : '💬'}
            </button>
          </div>
        </Draggable>

      </div>
    </div>
  );
};

export default ModulMateri;