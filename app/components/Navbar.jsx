"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Tambahkan useRouter
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter(); // Inisialisasi router
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State untuk input pencarian

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('id-ID', options));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Arahkan ke halaman search dengan query string
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return null; 
  }

  return (
    <header className="w-full z-50 shadow-lg bg-white relative">
      
      {/* 1. RUNNING TEXT */}
      <div className="bg-slate-900 text-white text-sm py-2 relative overflow-hidden flex items-center border-b border-slate-700 z-30">
         <div className="bg-red-600 px-4 py-2 font-bold uppercase tracking-widest z-20 shadow-md absolute left-0 h-full flex items-center">
            Info Terkini
         </div>
         <div className="whitespace-nowrap animate-marquee flex items-center gap-10 px-4 w-full pl-32 md:pl-40">
            <span>📢 Pelayanan Kantor Desa buka setiap hari Senin - Jumat pukul 08.00 - 15.00 WIB.</span>
            <span>💉 Jadwal Posyandu Balita dilaksanakan tanggal 15 setiap bulannya di Balai Desa.</span>
            <span>🚧 Mohon maaf ada perbaikan jalan di Dusun Krajan, harap berhati-hati saat melintas.</span>
            <span>🌾 Panen Raya Padi akan dilaksanakan serentak minggu depan di Sektor Selatan.</span>
         </div>
      </div>

      {/* 2. HEADER GAMBAR */}
      <div className="relative py-6 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-[url('/images/desa-adat-osing-kemiren.png')] bg-cover bg-center"></div>
        </div>
        <div className="absolute inset-0 bg-slate-900/80 z-0 backdrop-blur-[2px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          <Link href="/" className="flex items-center gap-5 group">
             <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-105 transition border-2 border-white/50 p-1">
                <img 
                    src="/images/logo.jpg" 
                    alt="Logo Desa" 
                    className="w-full h-full object-contain"
                />
             </div>
             <div className="flex flex-col text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none drop-shadow-lg font-serif">
                  DESA HARMONI
                </h1>
                <p className="text-xs md:text-sm text-emerald-300 font-bold uppercase tracking-[0.2em] mt-1 drop-shadow-sm">
                  Kabupaten Banyuwangi
                </p>
             </div>
          </Link>

          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
             <div className="hidden md:flex items-center gap-6 text-sm">
                <span className="font-medium text-slate-300 flex items-center gap-2">
                    🗓️ {currentDate}
                </span>
                <Link href="/admin/login" className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 hover:text-white transition border-l border-white/20 pl-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Login Admin
                </Link>
             </div>

             {/* === FORM PENCARIAN (UPDATE) === */}
             <form onSubmit={handleSearch} className="relative w-full md:w-96">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari layanan atau berita..." 
                  className="w-full pl-5 pr-12 py-3 rounded-full border border-white/20 bg-white/10 text-white placeholder:text-slate-400 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white/20 outline-none transition backdrop-blur-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-500 transition shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* 3. MENU NAVIGASI */}
      <div className="bg-emerald-700 text-white border-t border-emerald-600/50 shadow-inner relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
           <div className="flex items-center justify-center overflow-x-auto no-scrollbar">
              <Link href="/" className="p-4 bg-emerald-800 hover:bg-emerald-900 transition border-r border-emerald-600 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </Link>
              <nav className="flex items-center">
                  {[
                    { label: 'Profil Desa', href: '/profil' },
                    { label: 'Laporkan', href: '/pengaduan' },
                    { label: 'Kabar Desa', href: '/berita' },
                  ].map((item, idx) => (
                    <Link 
                      key={idx} 
                      href={item.href}
                      className={`px-6 py-4 text-sm font-bold uppercase tracking-wide hover:bg-emerald-600 transition whitespace-nowrap border-r border-emerald-600/50 flex items-center gap-2 ${pathname === item.href ? 'bg-emerald-600' : ''}`}
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>
           </div>
        </div>
      </div>
    </header>
  );
}