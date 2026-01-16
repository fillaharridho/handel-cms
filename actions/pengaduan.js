'use server'

import { supabase } from '../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updateStatusAction(id, newStatus) {
  const { error } = await supabase
    .from('pengaduan')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) throw error;
  revalidatePath('/admin/pengaduan');
}

export async function deletePengaduanAction(id) {
  const { error } = await supabase.from('pengaduan').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/pengaduan');
}