"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase'; 

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    penduduk: 0,
    pengaduan: 0,
    berita: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Ambil Total Data (Hanya 3 Kategori)
      const [resPenduduk, resAduan, resBerita] = await Promise.all([
        supabase.from('penduduk').select('*', { count: 'exact', head: true }),
        supabase.from('pengaduan').select('*', { count: 'exact', head: true }),
        supabase.from('berita').select('*', { count: 'exact', head: true })
      ]);

      setCounts({
        penduduk: resPenduduk.count || 0,
        pengaduan: resAduan.count || 0,
        berita: resBerita.count || 0
      });

      // 2. Ambil 5 Aduan Terbaru
      const { data: aduanData } = await supabase
        .from('pengaduan')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (aduanData) setRecentComplaints(aduanData);

    } catch (error) {
      console.error("Gagal memuat dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // Konfigurasi Kartu Statistik (Hanya 3 Item)
  const stats = [
    { 
        label: "Total Penduduk", 
        value: counts.penduduk.toLocaleString('id-ID'), 
        desc: "Data Warga", 
        icon: "👥", 
        theme: "blue", 
        link: "/admin/penduduk" 
    },
    { 
        label: "Aduan Masuk", 
        value: counts.pengaduan, 
        desc: "Perlu Tindakan", 
        icon: "📢", 
        theme: "red", 
        link: "/admin/pengaduan" 
    },
    { 
        label: "Berita & Info", 
        value: counts.berita, 
        desc: "Telah Terbit", 
        icon: "📰", 
        theme: "emerald", 
        link: "/admin/berita" 
    }
  ];

  // Helper Warna Tema
  const getThemeClasses = (theme) => {
      const themes = {
          blue: "bg-blue-50 text-blue-600 border-blue-100 group-hover:border-blue-300",
          red: "bg-red-50 text-red-600 border-red-100 group-hover:border-red-300",
          emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:border-emerald-300",
      };
      return themes[theme] || themes.blue;
  };

  return (
    <div className="min-h-screen bg-slate-50 md:ml-64 p-8 transition-all font-sans flex flex-col gap-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Status sistem desa secara real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`}></span>
            <span className="text-xs font-bold text-slate-600">{loading ? 'Sinkronisasi...' : 'Sistem Terhubung'}</span>
        </div>
      </div>

      {/* === STATISTIK CARDS (3 KOLOM) === */}
      {/* Diubah menjadi lg:grid-cols-3 agar pas 3 kartu berjejer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <Link href={item.link} key={idx} className="group relative bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
             
             <div className="flex justify-between items-start mb-4">
                 <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                    <h3 className="text-3xl font-extrabold text-slate-800">
                        {loading ? '...' : item.value}
                    </h3>
                 </div>
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors duration-300 border ${getThemeClasses(item.theme)}`}>
                    {item.icon}
                 </div>
             </div>

             <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                 <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    {item.desc}
                 </span>
                 <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-500 transition flex items-center gap-1">
                    Lihat Detail <span>→</span>
                 </span>
             </div>

          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KOLOM KIRI: ADUAN TERBARU */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">🔔 Aduan Warga Terbaru</h3>
                  <Link href="/admin/pengaduan" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua →</Link>
              </div>
              <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-slate-50/50">
                          <tr className="text-[10px] font-bold text-slate-400 uppercase">
                              <th className="py-4 px-6">Pelapor</th>
                              <th className="py-4 px-6">Kategori</th>
                              <th className="py-4 px-6 text-center">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                          {recentComplaints.length === 0 ? (
                              <tr><td colSpan="3" className="p-10 text-center text-slate-400 text-sm italic">Belum ada aduan masuk.</td></tr>
                          ) : recentComplaints.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50 transition">
                                  <td className="py-4 px-6 font-bold text-slate-700 text-sm">{item.nama_pelapor || item.name}</td>
                                  <td className="py-4 px-6 text-xs text-slate-500 font-medium">{item.kategori || item.type}</td>
                                  <td className="py-4 px-6 text-center">
                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${item.status === 'Menunggu' ? 'bg-red-50 text-red-600 border-red-100' : item.status === 'Diproses' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                          {item.status}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* KOLOM KANAN: SHORTCUT ACTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 mb-2">⚡ Akses Cepat</h3>
              <Link href="/admin/penduduk" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition group">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">👥</div>
                  <div>
                      <p className="text-sm font-bold text-slate-700">Tambah Penduduk</p>
                      <p className="text-[10px] text-slate-400">Input data warga baru</p>
                  </div>
              </Link>
              <Link href="/admin/berita" className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition">📰</div>
                  <div>
                      <p className="text-sm font-bold text-slate-700">Tulis Berita</p>
                      <p className="text-[10px] text-slate-400">Publikasi kegiatan desa</p>
                  </div>
              </Link>
          </div>
      </div>
    </div>
  );
}