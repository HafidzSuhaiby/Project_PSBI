// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // FIX: Menggunakan SweetAlert2 untuk notifikasi profesional
import { Eye, EyeOff } from 'lucide-react'; // FIX: Menambahkan icon mata

// FIX MYSQL: Pastikan endpoint mencakup /auth sesuai route di server.js
const API_URL = "http://localhost:5000/api/auth/register"; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // FIX: State untuk lihat/tutup password
  const [fullName, setFullName] = useState('');
  // Menambahkan field major agar sesuai dengan kebutuhan database (profiles)
  const [major, setMajor] = useState('Pendidikan Teknik Informatika'); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: fullName,
          major: major // Mengirim data major untuk tabel profiles
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // FIX: Notifikasi Error yang lebih bagus
        Swal.fire({
          icon: 'error',
          title: 'Registrasi Gagal',
          text: result.error || result.message || 'Terjadi kesalahan saat registrasi.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#4f46e5'
        });
      } else {
        // FIX: Notifikasi Berhasil (Pop-up bagus)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Registrasi berhasil! Silakan login dengan akun baru Anda.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#4f46e5'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      console.error('Error:', error);
      // FIX: Notifikasi Kesalahan Jaringan
      Swal.fire({
        icon: 'warning',
        title: 'Koneksi Terputus',
        text: 'Gagal terhubung ke server. Pastikan backend sudah menyala.',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-black text-center text-white mb-8 tracking-tighter">DAFTAR PYNARA</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
            <div className="relative"> {/* FIX: Container relatif untuk posisi icon */}
              <input
                type={showPassword ? "text" : "password"} // FIX: Toggle tipe input
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {/* FIX: Render icon mata berdasarkan state */}
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 rounded-xl font-black text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'MEMPROSES...' : 'BUAT AKUN'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Sudah punya akun? <Link to="/login" className="text-indigo-400 hover:underline font-bold">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;