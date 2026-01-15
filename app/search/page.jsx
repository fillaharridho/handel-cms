"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState({ berita: [], pengaduan: [] });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchAllResults = async () => {
      if (!query) return;
      try {
        setLoading(true);

        // 1. Cari di tabel Berita
        const { data: beritaData } = await supabase
          .from("berita")
          .select("*")
          .or(`judul.ilike.%${query}%,isi_berita.ilike.%${query}%`)
          .order("created_at", { ascending: false });

        // 2. Cari di tabel Pengaduan (Fokus pada isi_laporan dan nama_pelapor)
        const { data: pengaduanData } = await supabase
          .from("pengaduan")
          .select("*")
          .or(`isi_laporan.ilike.%${query}%,nama_pelapor.ilike.%${query}%,kategori.ilike.%${query}%`)
          .order("created_at", { ascending: false });

        setResults({
          berita: beritaData || [],
          pengaduan: pengaduanData || []
        });
      } catch (error) {
        console.error("Search error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllResults();
  }, [query]);

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const isDataEmpty = results.berita.length === 0 && results.pengaduan.length === 0;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative font-sans">
      {/* HEADER */}
      <div className="relative py-16 px-8 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-[url('/images/desa-adat-osing-kemiren.png')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-md"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif mb-3">Hasil Pencarian</h1>
          <p className="text-emerald-300 text-sm uppercase tracking-[0.2em] font-bold">
            "{query}" • {(results.berita.length + results.pengaduan.length)} Hasil Ditemukan
          </p>
        </div>
      </div>

      <div className="w-full px-6 md:px-12 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : isDataEmpty ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <span className="text-6xl block mb-4">🔎</span>
            <h2 className="text-2xl font-bold text-slate-800">Tidak ada hasil</h2>
            <p className="text-slate-500 mt-2">Coba gunakan kata kunci lain seperti "lampu", "jalan", atau nama Anda.</p>
          </div>
        ) : (
          <div className="space-y-16 max-w-7xl mx-auto">
            
            {/* SECTION BERITA */}
            {results.berita.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-800 font-serif mb-8 border-l-4 border-emerald-500 pl-4">Kabar Desa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.berita.map((item) => (
                    <CardBerita key={item.id} item={item} onOpen={() => setSelectedItem({ ...item, type: 'berita' })} formatTanggal={formatTanggal} />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION PENGADUAN */}
            {results.pengaduan.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-800 font-serif mb-8 border-l-4 border-blue-500 pl-4">Laporan Warga</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.pengaduan.map((item) => (
                    <CardPengaduan key={item.id} item={item} onOpen={() => setSelectedItem({ ...item, type: 'pengaduan' })} formatTanggal={formatTanggal} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {selectedItem && (
        <ModalDetail item={selectedItem} onClose={() => setSelectedItem(null)} formatTanggal={formatTanggal} />
      )}
    </main>
  );
}

// --- KOMPONEN KECIL ---

function CardBerita({ item, onOpen, formatTanggal }) {
  return (
    <div onClick={onOpen} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer flex flex-col h-full">
      <div className="relative h-52 bg-slate-200 overflow-hidden">
        <img src={item.foto_url || "/placeholder-news.jpg"} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={item.judul} />
        <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-lg">{item.kategori}</div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-wider">📅 {formatTanggal(item.created_at)}</div>
        <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">{item.judul}</h3>
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{item.isi_berita}</p>
        <div className="text-emerald-600 font-bold text-[10px] uppercase pt-4 border-t border-slate-50">Baca Detail →</div>
      </div>
    </div>
  );
}

function CardPengaduan({ item, onOpen, formatTanggal }) {
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'selesai') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'diproses') return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    return 'bg-red-50 text-red-600 border-red-100';
  };

  return (
    <div onClick={onOpen} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 cursor-pointer h-full">
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img 
          src={item.foto_bukti_url || "/images/placeholder-report.jpg"} 
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105" 
          alt="Bukti" 
        />
        <div className="absolute top-4 left-4 bg-slate-800/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
          {item.kategori || 'Umum'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-3 font-bold uppercase tracking-wider">
          <span className="text-emerald-500">📅</span>
          <span>{formatTanggal(item.created_at)}</span>
          <span className="mx-1">•</span>
          <span className="text-slate-700 truncate max-w-[120px]">{item.nama_pelapor}</span>
        </div>
        <p className="text-slate-700 text-sm font-medium leading-relaxed italic line-clamp-4 mb-6 flex-1 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
          "{item.isi_laporan}"
        </p>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {item.status || 'Menunggu'}
          </div>
          <span className="text-[10px] text-slate-300 font-mono">ID: #{item.id?.toString().slice(0,4)}</span>
        </div>
      </div>
    </div>
  );
}

function ModalDetail({ item, onClose, formatTanggal }) {
  const isBerita = item.type === 'berita';
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center transition">✕</button>
        <div className="overflow-y-auto">
          <img src={isBerita ? item.foto_url : item.foto_bukti_url} className="w-full h-64 object-cover" alt="Detail" />
          <div className="p-8">
            <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                {isBerita ? item.kategori : `Laporan Pelapor: ${item.nama_pelapor}`}
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 font-serif">
                {isBerita ? item.judul : "Detail Laporan Masyarakat"}
            </h2>
            <div className="text-slate-400 text-xs mb-6 pb-4 border-b border-slate-100 font-medium">📅 Terbit pada {formatTanggal(item.created_at)}</div>
            <p className="text-slate-600 leading-relaxed text-justify whitespace-pre-wrap italic">
              {isBerita ? item.isi_berita : item.isi_laporan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">Memuat Hasil...</div>}>
      <SearchContent />
    </Suspense>
  );
}