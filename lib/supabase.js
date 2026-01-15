import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Tambahkan proteksi agar error lebih jelas jika env hilang
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("EROR: Supabase URL atau Anon Key tidak ditemukan di .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});