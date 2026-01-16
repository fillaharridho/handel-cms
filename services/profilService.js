import { supabase } from '../lib/supabase';

export async function getFullProfil() {
  const [resProfil, resGeo, resPerangkat] = await Promise.all([
    supabase.from('profil_desa').select('*').maybeSingle(),
    supabase.from('geografis').select('*').maybeSingle(),
    supabase.from('perangkat_desa').select('*').order('created_at', { ascending: true })
  ]);

  return {
    profil: resProfil.data || {},
    geografis: resGeo.data || {},
    perangkat: resPerangkat.data || []
  };
}