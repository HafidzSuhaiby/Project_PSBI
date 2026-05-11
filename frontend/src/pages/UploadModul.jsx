import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

/**
 * Menggunakan URL worker lokal agar Vite tidak menyisipkan parameter ?import 
 * yang merusak pemanggilan library PDF.js.
 */
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker; // FIX: Menghubungkan workerSrc dengan pdfWorker yang diimport

// FIX: Definisikan base URL API backend Anda (Sudah mengandung /api/ai)
const API_URL = "http://localhost:5000/api/ai";

const UploadModul = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  // Menampung hasil object JSON dari AI
  const [aiMateriResult, setAiMateriResult] = useState(null);

  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false 
      });
      
      const pdf = await loadingTask.promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        fullText += strings.join(" ") + "\n";
      }
      return fullText;
    } catch (err) {
      console.error("Ekstraksi Gagal:", err);
      throw new Error("Gagal membaca dokumen PDF. Pastikan file tidak rusak.");
    }
  };

  const handleProcess = async () => {
    if (!file) return alert("Pilih file PDF terlebih dahulu!");
    
    setLoading(true);
    setStatus("Membaca isi PDF...");
    setAiMateriResult(null);

    try {
      const extractedText = await extractTextFromPDF(file);
      if (!extractedText.trim()) throw new Error("PDF kosong atau tidak terbaca.");

      setStatus("Pynara sedang membedah bab modul...");
      
      // SINKRONISASI: Menghapus /ai tambahan agar tidak terjadi double path (/api/ai/ai/analyze)
      const aiRequest = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: extractedText }) 
      });

      // Validasi respon sebelum parsing JSON
      if (!aiRequest.ok) {
        const errorText = await aiRequest.text();
        throw new Error(`Server Error (${aiRequest.status}): ${errorText}`);
      }

      const aiData = await aiRequest.json();

      if (aiData.success && aiData.data) {
        const parsedData = aiData.data; 
        setAiMateriResult(parsedData);
        
        setStatus("Menyimpan ke library...");

        // SINKRONISASI: Memanggil endpoint /modules_ai sesuai di aiRoutes.js
        const response = await fetch(`${API_URL}/modules_ai`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            title: parsedData.title || file.name.replace(".pdf", ""), 
            content: JSON.stringify(parsedData) 
          })
        });

        const result = await response.json();

        if (response.ok) {
          setStatus("✅ Modul Berhasil Dibuat!");
        } else {
          throw new Error(result.message || "Gagal menyimpan ke database MySQL.");
        }
      } else {
        throw new Error(aiData.error || "Gagal mendapatkan respon dari AI.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-12 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
          AI Modul Generator
        </h1>
        <p className="text-slate-400 mb-8">Ubah file PDF menjadi modul belajar interaktif per bab.</p>
        
        <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-[2rem] p-10 text-center mb-6 hover:border-indigo-500/50 transition-all group">
          <input 
            type="file" 
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden" 
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer block">
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📘</div>
            <p className="text-indigo-400 font-bold text-lg">
              {file ? file.name : "Pilih Modul Pembelajaran (PDF)"}
            </p>
            <p className="text-xs text-slate-500 mt-2">Pynara akan membagi materi menjadi beberapa bagian</p>
          </label>
        </div>

        <button 
          onClick={handleProcess}
          disabled={loading || !file}
          className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 disabled:grayscale transition-all flex justify-center items-center gap-3 shadow-xl"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              {status}
            </>
          ) : "Generate Modul Interaktif"}
        </button>

        {/* RENDER HASIL PER BAB/BAGIAN */}
        {aiMateriResult && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1 bg-indigo-500 rounded-full"></div>
            <h2 className="text-2xl font-bold">
                {aiMateriResult.title}
            </h2>
            </div>
            
            <div className="grid gap-6">
            {aiMateriResult.pages?.map((page, index) => (
                <div key={index} className="p-8 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="px-4 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-mono rounded-full border border-indigo-500/20">
                    {page.subtitle || `BAGIAN ${index + 1}`} {/* FIX: Menggunakan subtitle dari AI atau fallback */}
                    </span>
                </div>
                
                {/* Penjelasan Materi */}
                <div className="prose prose-invert max-w-none mb-6 text-slate-300">
                    {/* FIX: Render content yang berisi text & code secara fleksibel */}
                    {page.content && Array.isArray(page.content) ? (
                      page.content.map((item, i) => (
                        <div key={i}>
                          {item.text && <p className="leading-relaxed whitespace-pre-wrap mb-4">{item.text}</p>}
                          {item.code && (
                            <div className="bg-black/50 rounded-xl p-5 mb-4 border border-slate-800 font-mono text-sm text-green-400 overflow-x-auto">
                              <pre><code>{item.code}</code></pre>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{page.narrative}</p>
                    )}
                </div>

                {/* Contoh Kode jika ada (Legacy support) */}
                {page.defaultCode && !page.content && (
                    <div className="bg-black/50 rounded-xl p-5 mb-6 border border-slate-800 font-mono text-sm text-green-400 overflow-x-auto">
                    <pre><code>{page.defaultCode}</code></pre>
                    </div>
                )}

                {/* Kotak Misi/Tantangan */}
                <div className="bg-gradient-to-br from-indigo-600/10 to-fuchsia-600/10 p-6 rounded-2xl border border-indigo-500/20">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    🎯 Misi Tantangan:
                    </h4>
                    <p className="text-slate-300 text-sm italic">"{page.mission}"</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default UploadModul;