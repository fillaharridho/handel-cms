"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 

export default function BeritaPage() {
  const [listBerita, setListBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  // State untuk Modal
  const [selectedNews, setSelectedNews] = useState(null);

  const fetchBerita = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("berita")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListBerita(data || []);
    } catch (error) {
      console.error("Error fetching news:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  const formatTanggal = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative">
      
      {/* === HEADER === */}
      <div className="relative py-20 px-8 flex items-center justify-center overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0">
          {/* Pastikan file gambar background ada di folder public/images */}
          <div className="w-full h-full bg-[url('/images/desa-adat-osing-kemiren.png')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif tracking-wide mb-2">
            Kabar Desa Harmoni
          </h1>
          <p className="text-emerald-200 text-sm uppercase tracking-widest font-bold">
            Berita Terkini, Pengumuman, dan Agenda Kegiatan
          </p>
        </div>
      </div>

      {/* === KONTEN BERITA === */}
      <div className="w-full px-6 md:px-12 py-12 relative z-10"> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
             // Skeleton Loading
             [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-[450px] animate-pulse border border-slate-200"></div>
            ))
          ) : listBerita.length > 0 ? (
            listBerita.map((item) => (
              // KARTU BERITA (Klik di mana saja membuka modal)
              <div 
                key={item.id} 
                onClick={() => setSelectedNews(item)} 
                className="group bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer relative"
              >
                {/* Bagian Gambar */}
                <div className="relative h-64 overflow-hidden bg-slate-200">
                  <img
                    src={item.foto_url || "/placeholder-news.jpg"}
                    alt={item.judul}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow-lg uppercase z-10">
                    {item.kategori}
                  </div>
                </div>

                {/* Bagian Konten Teks */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-2">
                    <span>📅 {formatTanggal(item.created_at)}</span>
                  </div>

                  <h3 className="text-xl font-bold text-emerald-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {item.judul}
                  </h3>

                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                    {item.isi_berita}
                  </p>

                  <div className="mt-auto text-emerald-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-t border-slate-100 pt-4 group-hover:underline">
                    Baca Detail <span>→</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-400">Belum ada berita yang dipublikasikan.</div>
          )}
        </div>
      </div>

      {/* === MODAL POPUP BERITA === */}
      {selectedNews && (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedNews(null)} // Klik background untuk tutup
        >
            
            {/* CARD MODAL (TETAP SOLID/PUTIH) */}
            <div 
                className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden relative animate-scale-up my-8 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area putih diklik
            >
                
                {/* Tombol Close */}
                <button 
                    onClick={() => setSelectedNews(null)}
                    className="absolute top-4 right-4 z-50 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition font-bold backdrop-blur-md"
                >
                    ✕
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto custom-scrollbar">
                    
                    {/* Gambar Header Modal */}
                    <div className="relative h-64 md:h-80 w-full flex-shrink-0">
                        <img 
                            src={selectedNews.foto_url || "/placeholder-news.jpg"} 
                            alt={selectedNews.judul} 
                            className="w-full h-full object-cover"
                        />
                        {/* Gradasi hitam di bawah gambar agar teks judul terbaca */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded mb-3 inline-block uppercase tracking-wider">
                                {selectedNews.kategori}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold leading-tight font-serif text-shadow-md">
                                {selectedNews.judul}
                            </h2>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-300 font-medium">
                                <span className="flex items-center gap-1">📅 {formatTanggal(selectedNews.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Isi Berita Lengkap */}
                    <div className="p-8 md:p-12">
                        <div className="prose prose-slate max-w-none text-slate-600 leading-loose text-justify whitespace-pre-wrap">
                            {selectedNews.isi_berita}
                        </div>

                        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedNews(null)}
                                className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition"
                            >
                                Tutup Berita
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      )}

    </main>
  );
}