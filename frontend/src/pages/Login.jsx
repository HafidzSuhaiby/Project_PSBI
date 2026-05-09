// src/pages/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/authService'; 
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // FIX: Impor icon mata
import Swal from 'sweetalert2'; // FIX: Impor SweetAlert2 untuk notifikasi profesional

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // FIX: State untuk toggle password
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser({ email, password });
      
      if (result && result.token) {
        localStorage.clear(); 
        localStorage.setItem('auth_token', result.token);
        
        if (result.user) {
          localStorage.setItem('session', JSON.stringify(result.user));
        }

        window.dispatchEvent(new Event('authChange')); 

        // FIX: Notifikasi sukses profesional
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Masuk!',
          text: 'Selamat datang kembali di PYNARA',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#c026d3',
          timer: 2000,
          showConfirmButton: false
        });

        navigate('/');
      } else {
        // FIX: Notifikasi gagal profesional
        Swal.fire({
          icon: 'error',
          title: 'Gagal Login',
          text: 'Token tidak ditemukan dalam respon server.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      }

    } catch (error) {
      // FIX: Notifikasi error profesional
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || "Email atau password salah.",
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
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
            {/* FIX: Menggunakan div relative untuk menempatkan icon mata */}
            <div className="relative"> 
              <input
                type={showPassword ? "text" : "password"} // FIX: Toggle tipe input
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* FIX: Icon Mata */}
              </button>
            </div>
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