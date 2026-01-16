import { supabase } from '../lib/supabase';

export async function getBerita(page = 1, limit = 5) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from('berita')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return { data, count };
}