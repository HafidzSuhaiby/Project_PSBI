// src/pages/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/authService'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      
      // Berdasarkan JSON yang kamu kirim, key-nya adalah 'token'
      if (result && result.token) {
        // Hapus data lama jika ada untuk mencegah konflik
        localStorage.clear(); 

        // Simpan token baru
        localStorage.setItem('auth_token', result.token);
        
        // Simpan session user (id & email)
        if (result.user) {
          localStorage.setItem('session', JSON.stringify(result.user));
        }

        // Beritahu komponen lain (Navbar/Profil) bahwa auth sudah berubah
        window.dispatchEvent(new Event('authChange')); 

        // Navigasi ke home
        navigate('/');
      } else {
        alert("Gagal: Token tidak ditemukan dalam respon server.");
      }

    } catch (error) {
      alert(error.message || "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-black text-center text-white mb-8 tracking-tighter">MASUK PYNARA</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-indigo-600 rounded-xl font-black text-white hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-fuchsia-500/20"
          >
            {loading ? 'MEMPROSES...' : 'LOGIN'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Belum punya akun? <Link to="/register" className="text-fuchsia-400 hover:underline font-bold">Daftar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;