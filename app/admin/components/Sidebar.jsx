"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  // Helper untuk menentukan menu aktif
  const isActive = (path) => pathname === path;

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen hidden md:flex flex-col flex-shrink-0 border-r border-slate-800 fixed left-0 top-0 h-full z-10 shadow-xl">
      
      {/* === HEADER SIDEBAR (LOGO) === */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          {/* Wadah Logo Putih */}
          <div className="w-10 h-12 bg-white rounded-lg p-1 flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
              <img 
                src="/images/logo.jpg" 
                alt="Logo Desa" 
                className="w-full h-full object-contain" 
              />
          </div>
          <div className="overflow-hidden">
              <h2 className="font-bold tracking-tight text-white leading-tight whitespace-nowrap">Admin Desa</h2>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">Harmoni</p>
          </div>
      </div>
      
      {/* === MENU NAVIGASI === */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <Link 
            href="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/admin/dashboard') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
            <span>📊</span> Dashboard
        </Link>
        <Link 
            href="/admin/pengaduan" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/admin/pengaduan') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
            <span>📢</span> Aduan Warga
        </Link>
        <Link 
            href="/admin/berita" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/admin/berita') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
            <span>📰</span> Berita & Info
        </Link>
        <Link 
            href="/admin/penduduk" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/admin/penduduk') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
            <span>👥</span> Data Penduduk
        </Link>
        <Link 
            href="/admin/profil" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${isActive('/admin/profil') ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
        >
            <span>⚙️</span> Profil Desa
        </Link>
      </nav>

      {/* === FOOTER SIDEBAR (LOGOUT) === */}
      <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition text-sm font-bold shadow-sm">
              🚪 Keluar Sistem
          </button>
      </div>
    </aside>
  );
}