import React, { useEffect, useState } from 'react';
// FIX MYSQL: Import supabase dihapus karena beralih ke MySQL via API
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // FIX: Impor SweetAlert2 untuk notifikasi profesional

// FIX MYSQL: Definisi base URL disesuaikan dengan prefix di server.js (/api/ai)
const API_URL = "http://localhost:5000/api/ai"; 

const LibrarySiswa = () => {
  const [aiModules, setAiModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    // FIX MYSQL: URL disesuaikan agar tidak 404 dan menangani struktur respons { data: [] }
    try {
      // Menghapus query params sementara untuk memastikan koneksi stabil
      const response = await fetch(`${API_URL}/modules_ai`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // FIX: Karena backend mengirim { data: [...] }, ambil result.data
      if (result && result.data) {
        setAiModules(result.data);
      } else {
        console.error("Format data tidak sesuai:", result);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    
    // FIX: Mengganti window.confirm dengan SweetAlert2 yang lebih profesional
    const result = await Swal.fire({
      title: 'Hapus Modul?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#fff'
    });
    
    if (result.isConfirmed) {
      try {
        // FIX MYSQL: Endpoint DELETE disesuaikan dengan API_URL baru
        const response = await fetch(`${API_URL}/modules_ai/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Gagal menghapus");
        }
        
        setAiModules(aiModules.filter(item => item.id !== id));

        // FIX: Notifikasi sukses setelah berhasil menghapus
        Swal.fire({
          title: 'Terhapus!',
          text: 'Modul berhasil dihapus dari library.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#6366f1',
          timer: 2000
        });
      } catch (error) {
        // FIX: Mengganti alert browser dengan SweetAlert2 error
        Swal.fire({
          title: 'Gagal!',
          text: error.message,
          icon: 'error',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#6366f1'
        });
      }
    }
  };

  // --- FUNGSI BARU: Untuk membersihkan tampilan teks dari JSON ---
  const getPreviewText = (content) => {
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      return parsed?.pages?.[0]?.narrative || parsed?.narrative || "Klik untuk membaca selengkapnya...";
    } catch (e) {
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
                  
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {getPreviewText(item.content)}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md font-mono uppercase tracking-wider">
                      Modul Terstruktur
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