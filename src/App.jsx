// File: src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen-komponen
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ModulMateri from './pages/ModulMateri';
import UploadModul from './pages/UploadModul';
import LibrarySiswa from './pages/LibrarySiswa'; // Tambahkan import ini

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 font-sans">
        
        {/* Navbar akan selalu muncul di setiap halaman */}
        <Navbar />

        {/* Area konten dinamis */}
        <Routes>
          {/* Halaman Utama (Modul Kurikulum) */}
          <Route path="/" element={<Home />} />
          
          {/* Halaman Daftar Modul Hasil Upload PDF */}
          <Route path="/library" element={<LibrarySiswa />} />
          
          {/* Halaman Form Upload PDF */}
          <Route path="/upload" element={<UploadModul />} />

          {/* Halaman Baca Materi (Satu halaman untuk semua)
            Kita gunakan parameter :id agar bisa menangani ID angka (1, 2, 3) 
            maupun ID AI (ai-uuid-xxx)
          */}
          <Route path="/materi/:id" element={<ModulMateri />} />
          
          {/* Fallback jika user akses /materi tanpa ID, arahkan ke modul 1 */}
          <Route path="/materi" element={<ModulMateri />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;