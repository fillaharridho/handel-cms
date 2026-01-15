"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase'; // Pastikan path ke config supabase sudah benar
import Sidebar from './components/Sidebar';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Jika di halaman login, beri akses tanpa cek session
      if (pathname === '/admin/login') {
        setIsAuthorized(true);
        setLoading(false);
        return;
      }

      // 2. Cek session dari Supabase (Gantikan localStorage)
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Jika tidak ada session aktif, arahkan ke login
        router.push('/admin/login');
      } else {
        // Jika ada session, izinkan akses ke dashboard
        setIsAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Tampilkan blank/loading sebentar saat pengecekan auth agar tidak ada "flicker" UI
  if (loading) return null; 

  // PENGECUALIAN: Halaman Login Admin JANGAN pakai Sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // TAMPILAN DASHBOARD (Tetap mempertahankan UI asli Anda)
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* 1. Sidebar (Fixed kiri) */}
      <Sidebar />

      {/* 2. Konten Utama (Disebelah kanan sidebar) */}
      <main className="flex-1 ml-0 md:ml-0 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}