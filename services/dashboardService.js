import { supabase } from '../lib/supabase';

export async function getDashboardData() {
  // Ambil Total Data secara paralel agar cepat
  const [resPenduduk, resAduan, resBerita] = await Promise.all([
    supabase.from('penduduk').select('*', { count: 'exact', head: true }),
    supabase.from('pengaduan').select('*', { count: 'exact', head: true }),
    supabase.from('berita').select('*', { count: 'exact', head: true })
  ]);

  // Ambil 5 Aduan Terbaru
  const { data: aduanData } = await supabase
    .from('pengaduan')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    counts: {
      penduduk: resPenduduk.count || 0,
      pengaduan: resAduan.count || 0,
      berita: resBerita.count || 0
    },
    recentComplaints: aduanData || []
  };
}