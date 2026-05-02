// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen-komponen layout & security
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import halaman-halaman (Pages)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LibrarySiswa from './pages/LibrarySiswa';
import UploadModul from './pages/UploadModul';
import ModulMateri from './pages/ModulMateri';
import Profil from './pages/Profil'; // Pastikan file Profil.jsx sudah ada di folder pages

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 font-sans text-slate-300">
        
        {/* Navbar akan selalu muncul di setiap halaman */}
        <Navbar />

        {/* Area konten dinamis */}
        <Routes>
          {/* Halaman Publik: Bisa diakses siapa saja */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Halaman Terproteksi: Hanya bisa diakses jika sudah login */}
          <Route 
            path="/library" 
            element={<ProtectedRoute><LibrarySiswa /></ProtectedRoute>} 
          />
          <Route 
            path="/upload" 
            element={<ProtectedRoute><UploadModul /></ProtectedRoute>} 
          />
          <Route 
            path="/materi/:id" 
            element={<ProtectedRoute><ModulMateri /></ProtectedRoute>} 
          />
          <Route 
            path="/materi" 
            element={<ProtectedRoute><ModulMateri /></ProtectedRoute>} 
          />
          <Route 
            path="/profil" 
            element={<ProtectedRoute><Profil /></ProtectedRoute>} 
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;