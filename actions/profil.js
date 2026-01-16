'use server'

import { supabase } from '../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function saveProfilDanGeoAction(profilData, geoData) {
  // Simpan ke profil_desa
  const { error: pErr } = await supabase.from('profil_desa').upsert({
    id: 1, ...profilData
  });

  // Simpan ke geografis
  const { error: gErr } = await supabase.from('geografis').upsert({
    id: 1, ...geoData
  });

  if (pErr || gErr) throw new Error("Gagal menyimpan ke database");
  revalidatePath('/admin/profil');
}

export async function savePerangkatAction(perangkatData) {
  const { error } = await supabase.from('perangkat_desa').insert([perangkatData]);
  if (error) throw error;
  revalidatePath('/admin/profil');
}

export async function deletePerangkatAction(id) {
  const { error } = await supabase.from('perangkat_desa').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/profil');
}