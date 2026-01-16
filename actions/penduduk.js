'use server'

import { supabase } from '../lib/supabase';
import { revalidatePath } from 'next/cache';

// Pastikan namanya savePenduduk agar sesuai dengan import di UI
export async function savePenduduk(formData, isEditMode) {
  if (isEditMode) {
    const { error } = await supabase
      .from('penduduk')
      .update({
        nama: formData.nama,
        jk: formData.jk,
        pekerjaan: formData.pekerjaan,
        alamat: formData.alamat
      })
      .eq('nik', formData.nik);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('penduduk').insert([formData]);
    if (error) throw error;
  }
  revalidatePath('/admin/penduduk');
}

// Pastikan juga fungsi delete ada
export async function deletePenduduk(nik) {
  const { error } = await supabase.from('penduduk').delete().eq('nik', nik);
  if (error) throw error;
  revalidatePath('/admin/penduduk');
}