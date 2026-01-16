"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ComplaintForm from "../components/ComplaintForm";

export default function PengaduanClient({ initialData }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

  // Helper: Menentukan Warna Status Secara Dinamis
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'selesai') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'diproses') return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    return 'bg-red-50 text-red-600 border-red-100'; 
  };

  // Helper: Format Tanggal Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  const handleRefresh = () => {
    setIsFormOpen(false);
    router.refresh(); // Mengambil data terbaru dari Server Component
  };

  return (
    <main className="min-h-screen bg-slate-50">
      
      {/* === HERO SECTION === */}
      <div className="relative py-20 px-6 text-center overflow-hidden flex-shrink-0">
         <div className="absolute inset-0 z-0">
             <div className="w-full h-full bg-[url('/images/desa-adat-osing-kemiren.png')] bg-cover bg-center"></div>
             <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-[2px]"></div>
         </div>
         
         <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
             <div className="w-20 h-24 mb-6 bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-2xl border border-white/20 animate-fade-in-down">
                <img src="/images/logo.jpg" alt="Logo Desa" className="w-full h-full object-contain drop-shadow-md"/>
             </div>

             <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4">
                Layanan Masyarakat
             </span>
             <h1 className="text-3xl md:text-5xl font-bold text-white font-serif mb-4">
                Pusat Pengaduan & Aspirasi
             </h1>
             <p className="text-slate-300 text-lg mb-8 font-light leading-relaxed max-w-2xl">
                Laporan Anda langsung masuk ke database sistem desa. Identitas pelapor aman dan terjaga.
             </p>
             
             <button 
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold transition shadow-lg shadow-emerald-900/50 flex items-center gap-2 transform hover:-translate-y-1"
             >
                {isFormOpen ? '✕ Tutup Form' : '📝 Tulis Laporan Baru'}
             </button>
         </div>
      </div>

      {/* === RENDER COMPONENT FORM === */}
      {isFormOpen && (
        <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20 mb-12 animate-fade-in-down">
          <ComplaintForm onRefresh={handleRefresh} />
        </div>
      )}

      {/* === DAFTAR LAPORAN === */}
      <div className="w-full px-6 md:px-12 py-12 bg-slate-50">
         <div className="max-w-7xl mx-auto">
             <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                 <h2 className="text-3xl font-bold text-slate-800 font-serif">Laporan Terkini</h2>
                 <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                     {initialData.length} Data Masuk
                 </span>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialData.map((aduan) => (
                    <div key={aduan.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden group flex flex-col transition-all duration-300">
                        <div className="relative h-56 overflow-hidden bg-slate-100">
                            {aduan.foto_bukti_url ? (
                               <img src={aduan.foto_bukti_url} alt="Bukti" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                            ) : (
                               <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                   <div className="text-center text-slate-300">
                                       <span className="text-4xl block mb-2">📝</span>
                                       <span className="text-xs font-bold uppercase">Tanpa Foto</span>
                                   </div>
                               </div>
                            )}
                            <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                                {aduan.kategori || 'Umum'}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">
                                <span className="text-emerald-500">📅</span>
                                <span>{formatDate(aduan.created_at)}</span>
                                <span className="mx-1">•</span>
                                <span className="text-slate-600 font-bold truncate max-w-[150px]">{aduan.nama_pelapor}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-700 text-sm font-medium leading-relaxed italic line-clamp-3 mb-2">
                                    "{aduan.isi_laporan}"
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${getStatusColor(aduan.status)}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                    {aduan.status || 'Menunggu'}
                                </div>
                                <span className="text-[10px] text-slate-300 font-bold">
                                    ID: #{aduan.id.toString().slice(0,4)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </main>
  );
}