'use server'

import { supabase } from '../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function saveBeritaAction(formData, isEditMode, currentId) {
  const payload = {
    judul: formData.judul,
    kategori: formData.kategori,
    isi_berita: formData.isi_berita,
    foto_url: formData.foto_url,
  };

  if (isEditMode) {
    const { error } = await supabase
      .from('berita')
      .update(payload)
      .eq('id', currentId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('berita')
      .insert([{ ...payload, views: 0 }]);
    if (error) throw error;
  }

  revalidatePath('/admin/berita');
}

export async function deleteBeritaAction(id) {
  const { error } = await supabase.from('berita').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/berita');
}