"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // MENGIRIM LOGIN KE SERVER (API ROUTE)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Email atau Password salah!');
      }

      // Jika berhasil, arahkan ke dashboard
      router.push('/admin/dashboard'); 
      router.refresh(); 
      
    } catch (err) {
      setError(err.message);
      console.error("Login Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* BACKGROUND IMAGE (Tetap Sama) */}
        <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-[url('/images/desa-adat-osing-kemiren.png')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        </div>

        {/* KARTU LOGIN */}
        <div className="relative z-10 w-full max-w-md px-6">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 animate-fade-in-up">
                
                <div className="text-center mb-8">
                    <div className="w-20 h-24 mx-auto mb-4 bg-white p-2 rounded-xl shadow-md border border-slate-100 flex items-center justify-center">
                        <img src="/images/logo.jpg" alt="Logo Desa" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 font-serif tracking-tight">Login Administrator</h1>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-1 font-bold">Sistem Informasi Desa Harmoni</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 text-center font-bold flex items-center justify-center gap-2 animate-pulse">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Admin</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <input
                              type="email" required
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition font-bold text-slate-700"
                              placeholder="Masukkan email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </div>
                            <input
                              type="password" required
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition font-bold text-slate-700"
                              placeholder="Masukkan password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-1 mt-4 disabled:opacity-50"
                    >
                        {loading ? '⌛ Memverifikasi...' : '🔐 Masuk Dashboard'}
                    </button>
                </form>

                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                        &copy; 2026 Pemerintah Desa Harmoni<br/>Kabupaten Banyuwangi
                    </p>
                </div>
            </div>
        </div>
    </main>
  );
}