import { supabase } from '../lib/supabase';

/**
 * Mengambil data gabungan untuk Landing Page (Halaman Utama)
 */
export async function getHomeData() {
  const [resPenduduk, resProfil, resPerangkat] = await Promise.all([
    supabase.from('penduduk').select('jk'),
    supabase.from('profil_desa').select('*').maybeSingle(),
    supabase.from('perangkat_desa').select('*').order('created_at', { ascending: true })
  ]);

  // Logika Statistik Penduduk
  const male = resPenduduk.data?.filter(item => item.jk?.toString().toLowerCase().trim() === 'laki-laki').length || 0;
  const female = resPenduduk.data?.filter(item => item.jk?.toString().toLowerCase().trim() === 'perempuan').length || 0;
  const total = resPenduduk.data?.length || 0;

  return {
    stats: { male, female, total },
    profil: resProfil.data || {
      nama_kades: "H. Ahmad Dahlan",
      foto_kades: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop",
      sambutan_kades: "Selamat datang di website resmi Desa Harmoni."
    },
    perangkat: resPerangkat.data || []
  };
}

/**
 * Mengambil data lengkap untuk Halaman Profil (Visi, Misi, dan Geografis)
 */
export async function getProfilLengkap() {
  const [resProfil, resGeografis] = await Promise.all([
    // Ambil data profil (Visi & Misi)
    supabase.from('profil_desa').select('*').maybeSingle(),
    // Ambil data geografis (Luas wilayah, batas desa, dll)
    supabase.from('geografis').select('*').maybeSingle()
  ]);

  return {
    profil: resProfil.data || {},
    geografis: resGeografis.data || {}
  };
}