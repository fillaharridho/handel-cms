import { supabase } from '../../lib/supabase';
import SearchClient from './SearchClient';

// Tambahkan async di fungsi page
export default async function SearchPage({ searchParams }) {
  // PERBAIKAN UTAMA: Unwrapping searchParams menggunakan await
  const params = await searchParams; 
  const query = params.q || '';
  
  let beritaData = [];
  let pengaduanData = [];

  if (query.trim() !== '') {
    // Jalankan query ke Supabase
    const { data: bData } = await supabase
      .from("berita")
      .select("*")
      .or(`judul.ilike.%${query}%,isi_berita.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    const { data: pData } = await supabase
      .from("pengaduan")
      .select("*")
      .or(`isi_laporan.ilike.%${query}%,nama_pelapor.ilike.%${query}%,kategori.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    beritaData = bData || [];
    pengaduanData = pData || [];
  }

  const results = {
    berita: beritaData,
    pengaduan: pengaduanData
  };

  return <SearchClient query={query} initialResults={results} />;
}