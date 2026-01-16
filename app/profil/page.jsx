import { getProfilLengkap, getHomeData } from "../../services/publicService";

export default async function ProfilPage() {
  // Ambil data langsung di server side
  const { profil, geografis } = await getProfilLengkap();
  const { stats: homeStats } = await getHomeData(); // Kita ambil data penduduk dari sini

  // Proses data misi dari teks panjang menjadi array (berdasarkan baris baru)
  const misiList = profil.misi ? profil.misi.split('\n').filter(item => item.trim() !== "") : [];

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
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Data Terupdate: {new Date().getFullYear()}
            </div>
          </div>
      </div>

      {/* === 3. CONTENT GRID === */}
      <div className="relative z-10 flex-1 p-4 md:p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
            
            {/* VISI MISI */}
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
                            "{profil.visi || "Memuat visi desa..."}"
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Misi Utama</h3>
                        <ul className="space-y-3 text-slate-600 list-disc pl-4 marker:text-emerald-500">
                            {misiList.length > 0 ? misiList.map((m, i) => (
                              <li key={i}>{m}</li>
                            )) : <li>Misi belum diatur.</li>}
                        </ul>
                    </div>
                </div>
            </div>

            {/* GEOGRAFIS */}
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
                                <span className="font-semibold">{geografis.batas_utara || "-"}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] text-slate-400 block uppercase">Selatan</span>
                                <span className="font-semibold">{geografis.batas_selatan || "-"}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] text-slate-400 block uppercase">Barat</span>
                                <span className="font-semibold">{geografis.batas_barat || "-"}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <span className="text-[10px] text-slate-400 block uppercase">Timur</span>
                                <span className="font-semibold">{geografis.batas_timur || "-"}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-3 text-xs uppercase border-b border-slate-100 pb-1">Penggunaan Lahan</h4>
                        <ul className="space-y-4">
                           {[
                             { label: 'Pemukiman', val: geografis.luas_pemukiman },
                             { label: 'Pertanian', val: geografis.luas_pertanian },
                             { label: 'Perkebunan', val: geografis.luas_perkebunan },
                             { label: 'Fasilitas Umum', val: geografis.luas_fasum }
                           ].map((item) => (
                             <li key={item.label}>
                               <div className="flex justify-between text-[11px] mb-1">
                                 <span className="capitalize">{item.label}</span><span className="font-bold">{item.val || 0} Ha</span>
                               </div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                  <div 
                                    className={`h-full rounded-full ${item.label === 'Pemukiman' ? 'bg-orange-400' : 'bg-emerald-500'}`} 
                                    style={{ width: `${Math.min(((item.val || 0)/200)*100, 100)}%` }}
                                  ></div>
                               </div>
                             </li>
                           ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* STATISTIK */}
            <div className="md:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 text-white border border-white/10 flex-shrink-0 shadow-lg">
                    <p className="text-xs text-emerald-300 uppercase tracking-widest font-bold">Total Penduduk</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className="text-4xl font-bold">{homeStats.total.toLocaleString('id-ID')}</h3>
                        <span className="text-sm mb-1 text-slate-300">Jiwa</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                    <div className="bg-white/95 p-4 rounded-2xl border border-white/20 text-center">
                        <div className="text-2xl mb-1">👨</div>
                        <p className="text-xl font-bold text-slate-800">{homeStats.male.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Laki-Laki</p>
                    </div>
                    <div className="bg-white/95 p-4 rounded-2xl border border-white/20 text-center">
                        <div className="text-2xl mb-1">👩</div>
                        <p className="text-xl font-bold text-slate-800">{homeStats.female.toLocaleString('id-ID')}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Perempuan</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}