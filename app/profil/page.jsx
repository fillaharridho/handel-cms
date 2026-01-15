"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 

export default function ProfilPage() {
  const [stats, setStats] = useState({
    total: 0,
    lakiLaki: 0,
    perempuan: 0,
    pekerjaan: []
  });
  
  // State baru untuk data dinamis
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [geografis, setGeografis] = useState({
    batas: { utara: "", selatan: "", barat: "", timur: "" },
    lahan: { pemukiman: 0, pertanian: 0, perkebunan: 0, fasum: 0 }
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Mengambil 3 sumber data secara paralel
      const [resPenduduk, resProfil, resGeo] = await Promise.all([
        supabase.from('penduduk').select('jk, pekerjaan'),
        supabase.from('profil_desa').select('*').maybeSingle(),
        supabase.from('geografis').select('*').maybeSingle()
      ]);

      // 1. Proses Data Profil (Visi Misi)
      if (resProfil.data) {
        setVisi(resProfil.data.visi || "");
        setMisi(resProfil.data.misi || "");
      }

      // 2. Proses Data Geografis
      if (resGeo.data) {
        setGeografis({
          batas: { 
            utara: resGeo.data.batas_utara, 
            selatan: resGeo.data.batas_selatan, 
            barat: resGeo.data.batas_barat, 
            timur: resGeo.data.batas_timur 
          },
          lahan: { 
            pemukiman: resGeo.data.luas_pemukiman || 0, 
            pertanian: resGeo.data.luas_pertanian || 0, 
            perkebunan: resGeo.data.luas_perkebunan || 0, 
            fasum: resGeo.data.luas_fasum || 0 
          }
        });
      }

      // 3. Proses Statistik Penduduk
      if (resPenduduk.data) {
        const data = resPenduduk.data;
        const total = data.length;
        const lakiLaki = data.filter(item => item.jk?.toString().toLowerCase().trim() === 'laki-laki').length;
        const perempuan = data.filter(item => item.jk?.toString().toLowerCase().trim() === 'perempuan').length;

        const jobCounts = data.reduce((acc, curr) => {
          const job = curr.pekerjaan || "Lainnya";
          acc[job] = (acc[job] || 0) + 1;
          return acc;
        }, {});

        const formattedPekerjaan = Object.keys(jobCounts).map(key => ({
          label: key,
          val: total > 0 ? ((jobCounts[key] / total) * 100).toFixed(1) + "%" : "0%",
          count: jobCounts[key]
        })).sort((a, b) => b.count - a.count).slice(0, 5);

        setStats({ total, lakiLaki, perempuan, pekerjaan: formattedPekerjaan });
      }

    } catch (error) {
      console.error("Gagal memuat data profil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk membagi teks misi menjadi list berdasarkan baris baru
  const misiList = misi ? misi.split('\n').filter(item => item.trim() !== "") : [];

  return (
    <main className="min-h-screen md:h-screen relative flex flex-col overflow-hidden">
      
      {/* === 1. BACKGROUND === */}
      <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[url('/images/desa-adat-osing-kemiren.png')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      </div>

      {/* === 2. HEADER === */}
      <div className="relative z-20 py-6 px-8 flex-shrink-0 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif tracking-wide drop-shadow-md">
                Profil Desa Harmoni
            </h1>
            <p className="text-emerald-200 text-xs mt-1 uppercase tracking-widest font-bold">
                Kec. Banyuwangi, Kab. Banyuwangi
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-bounce' : 'bg-emerald-400 animate-pulse'}`}></span>
                {loading ? 'Sinkronisasi...' : `Data Terupdate: ${new Date().getFullYear()}`}
            </div>
          </div>
      </div>

      {/* === 3. CONTENT GRID === */}
      <div className="relative z-10 flex-1 p-4 md:p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            
            {/* VISI MISI - DATA DINAMIS */}
            <div className="md:col-span-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/80">
                   <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-emerald-600">🎯</span> Visi & Misi
                   </h2>
                </div>
                <div className="p-6 overflow-y-auto flex-1 text-sm">
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Visi Desa</h3>
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg italic text-slate-700 leading-relaxed">
                            "{visi || "Memuat visi desa..."}"
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Misi Utama</h3>
                        <ul className="space-y-3 text-slate-600 list-disc pl-4 marker:text-emerald-500">
                            {misiList.length > 0 ? misiList.map((m, i) => (
                              <li key={i}>{m}</li>
                            )) : <li>Memuat misi desa...</li>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* GEOGRAFIS - DATA DINAMIS */}
            <div className="md:col-span-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/80">
                   <h2 className="font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-blue-600">🗺️</span> Kondisi Geografis
                   </h2>
                </div>
                <div className="p-6 overflow-y-auto flex-1 text-sm">
                    <p className="text-slate-500 mb-6 text-xs">Informasi kewilayahan dan penggunaan lahan desa.</p>
                    <div className="mb-6">
                        <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase border-b border-slate-100 pb-1">Batas Wilayah</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] text-slate-400 block uppercase">Utara</span>
                                <span className="font-semibold">{geografis.batas.utara || "-"}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] text-slate-400 block uppercase">Selatan</span>
                                <span className="font-semibold">{geografis.batas.selatan || "-"}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] text-slate-400 block uppercase">Barat</span>
                                <span className="font-semibold">{geografis.batas.barat || "-"}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] text-slate-400 block uppercase">Timur</span>
                                <span className="font-semibold">{geografis.batas.timur || "-"}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase border-b border-slate-100 pb-1">Penggunaan Lahan</h4>
                        <ul className="space-y-4">
                             {Object.entries(geografis.lahan).map(([key, val]) => (
                               <li key={key}>
                                 <div className="flex justify-between text-[11px] mb-1">
                                   <span className="capitalize">{key}</span><span className="font-bold">{val} Ha</span>
                                 </div>
                                 <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                    <div 
                                      className={`h-full rounded-full ${key === 'pemukiman' ? 'bg-orange-400' : 'bg-emerald-500'}`} 
                                      style={{ width: `${Math.min((val/200)*100, 100)}%` }}
                                    ></div>
                                 </div>
                               </li>
                             ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* STATISTIK - DATA TETAP DINAMIS */}
            <div className="md:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 text-white border border-white/10 flex-shrink-0 shadow-lg">
                    <p className="text-xs text-emerald-300 uppercase tracking-widest font-bold">Total Penduduk</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className="text-4xl font-bold">{loading ? "..." : stats.total.toLocaleString('id-ID')}</h3>
                        <span className="text-sm mb-1 text-slate-300">Jiwa</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                    <div className="bg-white/95 p-4 rounded-2xl border border-white/20 text-center">
                        <div className="text-2xl mb-1">👨</div>
                        <p className="text-xl font-bold text-slate-800">{loading ? "..." : stats.lakiLaki.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Laki-Laki</p>
                    </div>
                    <div className="bg-white/95 p-4 rounded-2xl border border-white/20 text-center">
                        <div className="text-2xl mb-1">👩</div>
                        <p className="text-xl font-bold text-slate-800">{loading ? "..." : stats.perempuan.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Perempuan</p>
                    </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex-1 p-5 overflow-y-auto">
                    <h2 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">💼 Pekerjaan Utama</h2>
                    <div className="space-y-4">
                        {!loading && stats.pekerjaan.map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                    <span>{item.label}</span><span>{item.val}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                    <div className="h-2 bg-emerald-500 rounded-full" style={{ width: item.val }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}