import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Profil = () => {
  const [profile, setProfile] = useState({ full_name: '', major: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        let { data, error } = await supabase
          .from('profiles')
          .select(`full_name, major`)
          .eq('id', user.id)
          .single();

        if (data) setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirm = window.confirm("Apakah kamu yakin ingin keluar?");
    if (confirm) {
      await supabase.auth.signOut();
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-fuchsia-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100-4rem)] bg-slate-950 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        {/* Card Profil */}
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
          {/* Aksesoris Ornamen */}
          <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl font-black italic">PYNARA</div>
          
          {/* Header Visual */}
          <div className="h-32 bg-gradient-to-br from-fuchsia-600 via-indigo-600 to-blue-600"></div>

          <div className="px-8 pb-10">
            {/* Avatar Section */}
            <div className="relative flex justify-center -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full bg-slate-800 border-8 border-slate-900 flex items-center justify-center text-5xl shadow-xl overflow-hidden group">
                <span className="group-hover:scale-125 transition-transform duration-500">🧑‍💻</span>
              </div>
            </div>

            {/* Info Utama */}
            <div className="text-center space-y-2 mb-10">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {profile.full_name || 'Pelajar Hebat'}
              </h1>
              <div className="inline-block px-4 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <p className="text-indigo-400 font-bold text-sm uppercase tracking-widest">
                   {profile.major || 'Informatics Engineering'}
                </p>
              </div>
            </div>

            {/* Grid Status */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Pangkat</p>
                <p className="text-white font-mono text-sm">Beta Tester</p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50 text-center">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Status</p>
                <p className="text-emerald-400 font-mono text-sm">● Online</p>
              </div>
            </div>

            {/* Area Logout */}
            <div className="space-y-3">
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-black hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20 group flex items-center justify-center gap-2"
              >
                KELUAR AKUN 
                <span className="group-hover:translate-x-1 transition-transform">➔</span>
              </button>
              <p className="text-center text-[10px] text-slate-600 font-mono uppercase tracking-tighter">
                Sinitara v1.0.4 - 2026 Academic Edition
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;