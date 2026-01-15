"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; 

export default function Home() {
  const [stats, setStats] = useState({ male: 0, female: 0, total: 0 });
  const [kades, setKades] = useState({ name: "", position: "Kepala Desa", img: null, sambutan: "" });
  const [perangkat, setPerangkat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMainData();
  }, []);

  const fetchMainData = async () => {
    try {
      setLoading(true);

      // Ambil data statistik, profil desa, dan perangkat secara paralel
      const [resPenduduk, resProfil, resPerangkat] = await Promise.all([
        supabase.from('penduduk').select('jk'),
        supabase.from('profil_desa').select('*').maybeSingle(),
        supabase.from('perangkat_desa').select('*').order('created_at', { ascending: true })
      ]);

      // 1. Proses Statistik Penduduk
      if (resPenduduk.data) {
        const male = resPenduduk.data.filter(item => item.jk?.toString().toLowerCase().trim() === 'laki-laki').length;
        const female = resPenduduk.data.filter(item => item.jk?.toString().toLowerCase().trim() === 'perempuan').length;
        setStats({ male, female, total: resPenduduk.data.length });
      }

      // 2. Proses Data Kepala Desa
      if (resProfil.data) {
        setKades({
          name: resProfil.data.nama_kades || "H. Ahmad Dahlan",
          position: "Kepala Desa",
          img: resProfil.data.foto_kades || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
          sambutan: resProfil.data.sambutan_kades || "Selamat datang di website resmi Desa Harmoni."
        });
      }

      // 3. Proses Data Perangkat Desa
      if (resPerangkat.data) {
        setPerangkat(resPerangkat.data);
      }

    } catch (err) {
      console.error("Kesalahan Sistem Utama:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* === SECTION 1: HERO === */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
         <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-[url('/images/desa-adat-osing-kemiren.png')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>
         </div>

         <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Portal Resmi Desa</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-serif leading-tight drop-shadow-lg">
               Desa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Harmoni</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 font-light mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
               Mewujudkan Masyarakat yang Maju, Mandiri, dan Sejahtera Berlandaskan Gotong Royong.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/profil" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-lg font-bold transition shadow-lg shadow-emerald-900/30 transform hover:-translate-y-1 text-center">
                 Jelajahi Desa
               </Link>
               <Link href="/pengaduan" className="bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white px-8 py-3.5 rounded-lg font-bold transition transform hover:-translate-y-1 text-center">
                 Layanan Warga
               </Link>
            </div>
         </div>
      </section>


      {/* === SECTION 2: STATISTIK DESA === */}
      <section className="py-20 px-4 bg-white relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">Statistik Kependudukan</h2>
               <div className="w-24 h-1.5 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
               <p className="text-slate-500 mt-3 text-sm font-medium">Data terbaru update realtime.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition hover:-translate-y-1">
                  <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4">👨</div>
                  <h3 className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.male.toLocaleString('id-ID')}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-2">Laki-laki</p>
               </div>

               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition hover:-translate-y-1">
                  <div className="w-14 h-14 mx-auto bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-2xl mb-4">👩</div>
                  <h3 className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.female.toLocaleString('id-ID')}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-2">Perempuan</p>
               </div>

               <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition hover:-translate-y-1">
                  <div className="w-14 h-14 mx-auto bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-4">👥</div>
                  <h3 className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.total.toLocaleString('id-ID')}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-2">Total Warga</p>
               </div>
            </div>
         </div>
      </section>

      {/* === SECTION 3: PEMERINTAH DESA (DATA DINAMIS) === */}
      <section className="py-24 bg-emerald-900 relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                
                {/* 1. Kartu Kepala Desa */}
                <div className="flex justify-center lg:justify-start">
                  <div className="relative group w-full max-w-sm">
                      <div className="bg-emerald-800 rounded-2xl p-8 border border-emerald-600 shadow-2xl flex flex-col items-center text-center transform hover:-translate-y-2 transition duration-300">
                          <div className="w-56 h-64 rounded-2xl p-1.5 bg-gradient-to-tr from-yellow-400 to-emerald-400 mb-6 shadow-lg">
                              <div className="w-full h-full rounded-xl overflow-hidden border-4 border-emerald-900 bg-slate-200">
                                  <img src={kades.img} alt={kades.name} className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"/>
                              </div>
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">{kades.name}</h3>
                          <p className="text-emerald-300 text-sm font-bold uppercase tracking-[0.2em] pb-2">{kades.position}</p>
                      </div>
                  </div>
                </div>

                {/* 2. Teks Sambutan */}
                <div className="text-left lg:pl-8">
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-800 border border-emerald-500 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
                        👋 Kata Sambutan
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-serif mb-6 leading-tight">
                        Kepala Desa <br/> <span className="text-emerald-400">Harmoni</span>
                    </h2>
                    <p className="text-emerald-100 text-lg leading-relaxed italic border-l-4 border-emerald-500 pl-6">
                        "{kades.sambutan}"
                    </p>
                    <div className="mt-8">
                       <h4 className="font-bold text-xl text-white">{kades.name}</h4>
                       <p className="text-emerald-400 text-sm uppercase tracking-widest font-bold">Kepala Desa</p>
                    </div>
                </div>
            </div>

            {/* === STAF DESA (DARI DATABASE) === */}
            <div className="border-t border-emerald-800 pt-16">
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-widest">Perangkat & Staf Desa</h3>
                    <div className="w-16 h-1 bg-emerald-500 mx-auto mt-3 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {perangkat.map((person, idx) => (
                        <div key={idx} className="bg-emerald-800/50 border border-emerald-700/50 rounded-xl p-6 group hover:bg-emerald-800 transition duration-300 shadow-lg flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full p-1 bg-emerald-700/50 mb-5 group-hover:bg-emerald-600 transition">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-emerald-500/30 group-hover:border-emerald-400 transition">
                                    <img src={person.foto || "https://via.placeholder.com/150"} alt={person.nama} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition duration-500"/>
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-1">{person.nama}</h4>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{person.jabatan}</p>
                            {person.nip && <p className="text-[10px] text-emerald-500/60 mt-1 italic">NIP: {person.nip}</p>}
                        </div>
                    ))}
                </div>
            </div>

         </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-10 text-center text-sm border-t border-slate-900">
        <p className="mb-2">&copy; 2026 Pemerintah Desa Harmoni. Kabupaten Banyuwangi.</p>
      </footer>
    </main>
  );
}