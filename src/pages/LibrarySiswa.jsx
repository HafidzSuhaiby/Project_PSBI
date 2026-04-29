import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const LibrarySiswa = () => {
  const [aiModules, setAiModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    const { data, error } = await supabase
      .from('modules_ai')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setAiModules(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Hapus modul ini dari library?");
    
    if (confirmDelete) {
      try {
        const { error } = await supabase
          .from('modules_ai')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setAiModules(aiModules.filter(item => item.id !== id));
      } catch (error) {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  // --- FUNGSI BARU: Untuk membersihkan tampilan teks dari JSON ---
  const getPreviewText = (content) => {
    try {
      const parsed = JSON.parse(content);
      // Ambil narasi dari halaman pertama saja untuk preview
      return parsed.pages[0].narrative;
    } catch (e) {
      // Jika bukan JSON (materi lama), tampilkan apa adanya
      return content;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8 lg:p-12 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Library Siswa</h1>
            <p className="text-slate-400">Modul hasil analisis PYNARA AI.</p>
          </div>
          <Link to="/upload" className="bg-indigo-600 px-6 py-2 rounded-xl font-bold hover:bg-indigo-500 transition-all">
            + Upload Lagi
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Memuat library...</div>
        ) : aiModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiModules.map((item) => (
              <div key={item.id} className="relative group">
                <button 
                  onClick={(e) => handleDelete(e, item.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  🗑️
                </button>

                <Link 
                  to={`/materi/ai-${item.id}`} 
                  className="block p-6 bg-slate-900 border border-slate-800 rounded-[2rem] hover:border-indigo-500 transition-all h-full"
                >
                  <div className="text-3xl mb-4">📘</div>
                  <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors mb-2 pr-8">
                    {item.title}
                  </h3>
                  
                  {/* PENYELAMAT: Menggunakan getPreviewText agar JSON tidak tampil mentah */}
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {getPreviewText(item.content)}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md font-mono uppercase tracking-wider">
                      Modul Terstruktur ✨
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
            <p className="text-slate-500">Belum ada modul. Silakan upload PDF!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarySiswa;