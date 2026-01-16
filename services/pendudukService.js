import { supabase } from '../lib/supabase';

export async function getPenduduk(page = 1, limit = 10) {
  // Logika Pagination sesuai saran Mas Yoga
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('penduduk')
    .select('*', { count: 'exact' })
    .range(from, to) // Mengambil data sesuai batas (limit)
    .order('nama', { ascending: true });

  if (error) throw new Error(error.message);
  return { data, count };
}