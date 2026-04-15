// File: src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import komponen-komponen yang sudah kita pisah di folder lain
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ModulMateri from './pages/ModulMateri';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 font-sans">
        
        {/* Navbar akan selalu muncul di setiap halaman */}
        <Navbar />

        {/* Area di bawah Navbar yang berganti-ganti kontennya */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materi" element={<ModulMateri />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;