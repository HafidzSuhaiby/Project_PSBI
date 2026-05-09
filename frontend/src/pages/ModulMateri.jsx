import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { modules as staticModules } from '../data/modules';
import { loadPyodide } from 'pyodide';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Draggable from 'react-draggable';
import Swal from 'sweetalert2'; // FIX: Pastikan impor Swal tersedia

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  
  const [completedModules, setCompletedModules] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [maxUnlockedIndex, setMaxUnlockedIndex] = useState(0); 
  const [expandedModuleId, setExpandedModuleId] = useState(null); 
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo! Aku Pynara. Ada yang ingin ditanyakan tentang kode Python di halaman ini?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [failCount, setFailCount] = useState(0);

  const editorRef = useRef(null);
  const chatEndRef = useRef(null);
  const nodeRefButton = useRef(null); 

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
                const profileRes = await fetch(`${API_URL}/profiles/${currentUserId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                  const pData = await profileRes.json();
                  const profile = pData.data || pData;
                  const raw = profile.completed_modules;
                  const cArr = typeof raw === 'string' ? JSON.parse(raw) : (Array.isArray(raw) ? raw : []);
                  setCompletedModules(cArr.map(String));
                }
              } catch (err) { console.error("Error get profile", err); }
              
              try {
                const progressRes = await fetch(`${API_URL}/users-progress/${currentUserId}/${cleanTargetId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (progressRes.ok) {
                    const resJson = await progressRes.json();
                    const progressData = resJson.data; 
                    if (progressData) { 
                      lastSavedPage = parseInt(progressData.last_page_index) || 0;
                      alreadyCompleted = (progressData.is_completed === 1 || progressData.is_completed === true);
                    }
                }
              } catch (err) { console.error("Gagal mengambil progres spesifik modul:", err); }
            }
          }
        } catch (err) { console.error("Error sync progress:", err); }
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
                youtubeId: page.youtubeId || page.videoUrl || null,
                answerCode: page.answerCode || page.check || ""
              }))
            };
          }
        } catch (err) { console.error("Error fetch AI module:", err); }
      } else {
        loadedModul = staticModules.find(m => String(m.id) === String(targetId)); 
      }

      if (loadedModul) {
        setCurrentModul(loadedModul);
        setExpandedModuleId(String(loadedModul.id)); 
        const validPageIndex = alreadyCompleted ? 0 : (lastSavedPage >= 0 && lastSavedPage < (loadedModul.pages?.length || 0)) ? lastSavedPage : 0;
        setCurrentPageIndex(validPageIndex);
        setMaxUnlockedIndex(alreadyCompleted ? (loadedModul.pages?.length || 0) : lastSavedPage); 
        setTaskCompleted(alreadyCompleted); 
        setIsEvaluating(false);
        setScore(null);
        setAnswers({});
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
      setFailCount(0);
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
        setFailCount(0);
        // FIX: Notifikasi sukses pengerjaan misi
        Swal.fire({
          icon: 'success',
          title: 'Misi Berhasil!',
          text: currentPage.successMsg || 'Bagus! Kamu berhasil menyelesaikan misi ini.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#6366f1'
        });
        speakExplanation(currentPage.voiceSummary || "Bagus! Kamu berhasil menyelesaikan misi ini.");
      } else {
        setTaskCompleted(false);
        setFailCount(prev => prev + 1);
        // FIX: Notifikasi jika output belum sesuai
        if (failCount >= 1) {
          Swal.fire({
            icon: 'info',
            title: 'Hampir Tepat!',
            text: 'Coba periksa kembali instruksi misi atau gunakan bantuan AI Pynara.',
            background: '#0f172a',
            color: '#fff',
            confirmButtonColor: '#f59e0b'
          });
        }
      }
    } catch (err) { 
      setOutput(`Error: ${err.message}`); 
      setTaskCompleted(false);
      setFailCount(prev => prev + 1);
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
        } catch (err) { console.error("Gagal update progress:", err); }
      }
      if (nextIdx > maxUnlockedIndex) setMaxUnlockedIndex(nextIdx); 
      setTaskCompleted(false); 
      setCurrentPageIndex(nextIdx);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentModul.evaluation && currentModul.evaluation.length > 0 && !isEvaluating) {
        setIsEvaluating(true);
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
          method: 'PUT',
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
          body: JSON.stringify({ user_id: userId, module_id: cleanModuleId, last_page_index: currentPageIndex, is_completed: true, xp_earned: 50 })
        });
        
        // FIX: Notifikasi Selesai Modul Profesional
        Swal.fire({
          icon: 'success',
          title: 'Modul Selesai! 🏆',
          text: nextModul ? 'Lanjut ke modul berikutnya untuk tantangan baru.' : 'Selamat! Kamu telah menyelesaikan semua materi.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#c026d3'
        }).then(() => {
          if (currentModul.isAI) { navigate('/'); } 
          else if (nextModul) { navigate(`/materi/${nextModul.id}`); } 
          else { navigate('/'); }
        });
      }
    } catch (error) {
      console.error("Gagal proses selesai modul:", error);
      // FIX: Notifikasi Error simpan progress
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan saat menyimpan progress.',
        background: '#0f172a',
        color: '#fff'
      });
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitEvaluation = () => {
    let correct = 0;
    currentModul.evaluation.forEach((q, idx) => { if (answers[idx] === q.answer) correct++; });
    const finalScore = Math.round((correct / currentModul.evaluation.length) * 100);
    setScore(finalScore);
    
    if (finalScore >= 70) { 
      setTaskCompleted(true);
      // FIX: Notifikasi Lulus Evaluasi
      Swal.fire({
        icon: 'success',
        title: 'Lulus Evaluasi!',
        text: `Skor kamu ${finalScore}. Hebat! Kamu sudah siap lanjut.`,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    } 
    else { 
      // FIX: Notifikasi Gagal Evaluasi
      Swal.fire({
        icon: 'error',
        title: 'Belum Lulus',
        text: `Skor kamu ${finalScore}. Minimal 70 untuk lulus. Ayo coba lagi!`,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
      setScore(null); 
      setAnswers({}); 
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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'ai', text: "🚨 API Key tidak terbaca!" }]);
        setIsTyping(false); return;
      }
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: "Anda adalah Pynara, pakar Python. Jawab singkat dan berikan bantuan logika." }] },
          contents: [{ role: "user", parts: [{ text: `Misi: ${currentPage?.mission}. Kode: \n${editorRef.current?.getValue()}\n\nPertanyaan: ${userMsg}` }] }]
        })
      });
      const data = await response.json();
      if (!response.ok) { setIsTyping(false); return; }
      const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, format balasan Gemini tidak sesuai.";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponseText }]);
    } catch (error) { setMessages(prev => [...prev, { role: 'ai', text: "🚨 Gagal mengirim." }]); } 
    finally { setIsTyping(false); }
  };

  const speakExplanation = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; utterance.rate = 1.0; utterance.pitch = 1.0; 
    const voices = window.speechSynthesis.getVoices();
    const indoVoice = voices.find(v => v.lang.includes('id'));
    if (indoVoice) utterance.voice = indoVoice;
    window.speechSynthesis.speak(utterance);
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
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-[85%] sm:w-80 bg-slate-900 border-r border-slate-800 z-[160] transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white font-black uppercase tracking-widest text-sm">Kurikulum Pynara</h3>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white p-2">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6">
            {staticModules.map((modul, mIdx) => (
              <div key={mIdx} className="flex flex-col gap-2">
                {/* // FIX: Ubah header modul menjadi tombol toggle yang interaktif */}
                <div 
                  onClick={() => setExpandedModuleId(expandedModuleId === String(modul.id) ? null : String(modul.id))}
                  className="px-2 py-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 opacity-80 cursor-pointer hover:bg-slate-800/50 rounded-lg flex justify-between items-center transition-all group"
                >
                  <span className={expandedModuleId === String(modul.id) ? 'text-white' : ''}>
                    Modul {mIdx + 1}: {modul.title}
                  </span>
                  <span className={`text-[8px] transition-transform ${expandedModuleId === String(modul.id) ? 'rotate-180 text-white' : ''}`}>▼</span>
                </div>
                
                {/* // FIX: Tampilkan list part hanya jika expandedModuleId sesuai dengan ID modul */}
                {expandedModuleId === String(modul.id) && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {modul.pages.map((page, pIdx) => {
                      const isCurrentActive = String(modul.id) === String(currentModul.id) && pIdx === currentPageIndex;
                      const isThisModuleCompleted = completedModules.includes(String(modul.id));
                      const isModulUnlocked = mIdx === 0 || completedModules.includes(String(staticModules[mIdx - 1]?.id));
                      let isLocked = String(modul.id) === String(currentModul.id) ? pIdx > maxUnlockedIndex : !(isThisModuleCompleted || (isModulUnlocked && pIdx === 0));
                      return (
                        <button key={pIdx} disabled={isLocked} onClick={() => { if (String(modul.id) !== String(currentModul.id)) { navigate(`/materi/${modul.id}`); } else { setCurrentPageIndex(pIdx); setIsEvaluating(false); } setIsSidebarOpen(false); }} className={`text-left p-3 rounded-xl transition-all border text-xs ${isCurrentActive ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : !isLocked ? 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white' : 'bg-slate-950/50 border-transparent text-slate-700 cursor-not-allowed opacity-40'}`}>
                          <span className="font-mono mr-2 opacity-50">{pIdx + 1}.</span>
                          <span className="font-bold">{page.subtitle || "Materi Utama"}</span>
                          {isLocked && <span className="ml-2">🔒</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Toggle Sidebar */}
      <button onClick={() => setIsSidebarOpen(true)} className="fixed top-20 lg:top-24 left-4 lg:left-6 z-[100] w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-lg lg:text-xl hover:bg-slate-800 transition-colors shadow-xl text-white">☰</button>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8 lg:p-10 flex flex-col gap-8 lg:gap-12 pt-32 lg:pt-36 overflow-hidden">
        {isEvaluating ? (
            <section className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem]">
                    <h1 className="text-2xl lg:text-3xl font-black text-white mb-2">Evaluasi Akhir Modul</h1>
                    <p className="text-slate-400 text-sm lg:text-base">Jawab pertanyaan berikut dengan benar untuk menyelesaikan modul ini.</p>
                </div>
                <div className="flex flex-col gap-6">
                    {currentModul.evaluation.map((q, qIdx) => (
                        <div key={qIdx} className="bg-slate-900/50 border border-slate-800 p-6 lg:p-8 rounded-2xl lg:rounded-3xl">
                            <h3 className="text-base lg:text-lg font-bold text-white mb-6"><span className="text-indigo-400 mr-2">Q{qIdx+1}.</span>{q.question}</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {q.options.map((opt, oIdx) => (
                                    <button key={oIdx} onClick={() => setAnswers({...answers, [qIdx]: oIdx})} className={`p-4 rounded-2xl border text-left text-sm transition-all ${answers[qIdx] === oIdx ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>{opt}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {score === null ? (
                    <button onClick={handleSubmitEvaluation} className="bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all">Submit Jawaban</button>
                ) : score >= 70 ? (
                    <div className="bg-emerald-500/20 border border-emerald-500/50 p-6 rounded-2xl text-center text-emerald-400">
                        <p className="text-xl lg:text-2xl font-black">Skor: {score} - LULUS! 🎉</p>
                        <p className="text-xs lg:text-sm">Silakan klik tombol di bawah untuk menyimpan modul ke Home.</p>
                    </div>
                ) : null}
            </section>
        ) : (
            <>
                <section className="flex flex-col gap-6 lg:gap-8 overflow-hidden">
                  <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-widest mb-3">Part {currentPageIndex + 1} / {currentModul.pages.length}</p>
                    <h1 className="text-2xl lg:text-4xl font-black text-white break-words">{currentModul.title}</h1>
                    {currentPage?.subtitle && (<h2 className="text-lg lg:text-xl font-bold text-indigo-300 mt-2">{currentPage.subtitle}</h2>)}
                    {currentModul.description && (<p className="text-slate-400 mt-4 text-sm lg:text-lg leading-relaxed max-w-2xl">{currentModul.description}</p>)}
                  </div>

                  <div className="flex flex-col gap-8 lg:gap-10">
                    {currentPage?.youtubeId && (
                      <div className="w-full aspect-video rounded-2xl lg:rounded-[2rem] overflow-hidden border border-slate-800 shadow-xl">
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYoutubeEmbedId(currentPage.youtubeId)}`} title="Video" frameBorder="0" allowFullScreen></iframe>
                      </div>
                    )}
                    
                    {currentPage?.content ? (
                      currentPage.content.map((item, index) => (
                        <div key={index} className="flex gap-3 lg:gap-5 group max-w-full">
                          <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-xl lg:text-2xl shrink-0 shadow-lg">🤖</div>
                          {/* // FIX: Added flex-1 min-w-0 to prevent background overflow on mobile */}
                          <div className="flex flex-col gap-4 flex-1 min-w-0"> 
                            {item.text && (
                              /* // FIX: Added overflow-x-auto to container */
                              <div className="bg-slate-900/80 border border-slate-800 p-5 lg:p-6 rounded-2xl lg:rounded-[2rem] lg:rounded-tl-sm text-slate-200 text-sm lg:text-lg shadow-xl overflow-x-auto">
                                <div className="prose prose-invert prose-sm lg:prose-base max-w-none break-words prose-ul:list-outside prose-li:my-1 prose-p:whitespace-normal"> 
                                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{item.text}</ReactMarkdown>
                                </div>
                              </div>
                            )}
                            {item.code && (
                              <div className="bg-cyan-950/20 border-l-4 border-cyan-500 p-4 lg:p-6 rounded-r-2xl lg:rounded-r-[2rem] rounded-bl-2xl lg:rounded-bl-[2rem] font-mono text-[10px] lg:text-sm relative overflow-x-auto shadow-lg">
                                <pre className="text-cyan-300 whitespace-pre"><code>{item.code}</code></pre>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-3 lg:gap-5 max-w-full">
                        <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-xl lg:text-2xl shrink-0">🤖</div>
                        {/* // FIX: Added flex-1 min-w-0 to ensure wrapper fits screen and background follows */}
                        <div className="bg-slate-900/80 border border-slate-800 p-5 lg:p-6 rounded-2xl lg:rounded-[2rem] lg:rounded-tl-sm text-slate-200 text-sm lg:text-lg flex-1 min-w-0 shadow-xl overflow-x-auto">
                            <div className="prose prose-invert prose-sm lg:prose-base max-w-none break-words prose-ul:list-outside prose-li:my-1 prose-p:whitespace-normal">
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{currentPage?.narrative || ""}</ReactMarkdown>
                            </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="flex flex-col gap-4">
                  <div className="bg-fuchsia-900/20 border border-fuchsia-500/30 p-5 lg:p-6 rounded-2xl lg:rounded-[2rem] flex items-center gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-fuchsia-600 flex items-center justify-center text-lg lg:text-xl shrink-0">🎯</div>
                    <div className="min-w-0">
                      <h4 className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px] mb-1">Misi Kamu</h4>
                      <p className="text-white font-medium text-xs lg:text-sm truncate">{currentPage?.mission || "Selesaikan tantangan"}</p>
                    </div>
                  </div>

                  <div className="h-[450px] lg:h-[550px] rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-2xl flex flex-col relative">
                    <div className="bg-[#181818] px-6 lg:px-8 py-3 lg:py-4 flex justify-between items-center border-b border-slate-800">
                        <span className="font-mono text-[10px] text-slate-500">main.py</span>
                        {taskCompleted && <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">✓ Selesai</span>}
                    </div>
                    <div className="flex-1 pt-2">
                      <Editor 
                        defaultLanguage="python" 
                        defaultValue={code} 
                        height="100%" 
                        key={`${currentModul.id}-${currentPageIndex}`}
                        onMount={(editor) => { editorRef.current = editor; }} 
                        options={{ fontSize: window.innerWidth < 768 ? 14 : 16, minimap: { enabled: false }, automaticLayout: true, padding: {top: 10} }} 
                        theme="vs-dark"
                      />
                    </div>
                    {failCount >= 5 && (
                      <button onClick={() => editorRef.current?.setValue(currentPage?.answerCode || "")} className="absolute top-14 right-4 lg:right-10 z-10 px-3 py-2 bg-amber-500 text-slate-900 rounded-lg font-bold shadow-lg text-[10px] lg:text-xs">💡 Hint</button>
                    )}
                    <button onClick={runCode} className="absolute bottom-[35%] right-6 lg:right-10 z-10 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-slate-900 shadow-2xl hover:scale-110 active:scale-95 transition-all text-xl lg:text-2xl">▶</button>
                    <div className="h-[30%] bg-[#050505] border-t border-slate-800 p-5 lg:p-8 font-mono text-[10px] lg:text-sm overflow-y-auto">
                      <pre className={taskCompleted ? 'text-emerald-400' : 'text-slate-300'}>{output || "Output muncul di sini..."}</pre>
                      {taskCompleted && <p className="mt-2 font-bold text-emerald-300 animate-pulse">{currentPage?.successMsg}</p>}
                    </div>
                  </div>
                </section>
            </>
        )}

        <div className="flex justify-center mt-4">
          <button onClick={handleNext} disabled={!taskCompleted} className={`w-full lg:w-auto px-10 lg:px-16 py-4 lg:py-5 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm uppercase tracking-[0.2em] lg:tracking-[0.3em] transition-all shadow-2xl ${taskCompleted ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white hover:-translate-y-1' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}`}>
            {currentPageIndex === currentModul.pages.length - 1 && !isEvaluating ? "Mulai Evaluasi ➔" : (currentPageIndex === currentModul.pages.length - 1 && isEvaluating ? "Selesaikan Modul 🏆" : "Selanjutnya ➔")}
          </button>
        </div>
      </main>

      {/* Floating Chat */}
      <div className="fixed inset-0 pointer-events-none z-[140]">
        <Draggable nodeRef={nodeRefButton} bounds="parent" handle=".drag-button-handle">
          <div ref={nodeRefButton} className="absolute bottom-6 right-6 pointer-events-auto flex flex-col items-end">
            {isChatOpen && (
              <div className="mb-4 w-[calc(100vw-3rem)] sm:w-80 md:w-96 h-[400px] lg:h-[450px] bg-slate-900 border border-slate-800 rounded-2xl lg:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white font-bold text-sm lg:text-base">
                  <div className="flex items-center gap-2"><span>🤖</span> <span>Pynara Chat</span></div>
                  <button onClick={() => setIsChatOpen(false)} className="px-2">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-950/40">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-3 rounded-2xl text-xs lg:text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                        <div className="prose prose-sm prose-invert max-w-none break-words">
                          <ReactMarkdown components={{ code({ node, inline, className, children, ...props }) { return ( <code className="block bg-slate-950 p-2 rounded my-1 overflow-x-auto text-[10px] lg:text-xs font-mono border border-slate-700" {...props}>{children}</code> ); } }}>{msg.text}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="p-3 lg:p-4 bg-slate-900 flex gap-2 border-t border-slate-800">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Tanya..." className="flex-1 bg-slate-800 rounded-xl px-4 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-indigo-500" />
                  <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm">➔</button>
                </form>
              </div>
            )}
            <button onClick={() => setIsChatOpen(!isChatOpen)} className="drag-button-handle w-14 h-14 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center text-2xl lg:text-3xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-grab">
              {isChatOpen ? '✕' : '💬'}
            </button>
          </div>
        </Draggable>
      </div>
    </div>
  );
};

export default ModulMateri;