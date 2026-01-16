import { supabase } from '../lib/supabase';

export async function getPengaduan(page = 1, limit = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from('pengaduan')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return { data, count };
}