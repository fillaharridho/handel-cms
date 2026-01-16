"use server";
import { supabase } from "../../lib/supabase";
import { revalidatePath } from "next/cache";

export async function verifyNIK(nik) {
  try {
    const { data, error } = await supabase
      .from('penduduk')
      .select('nama')
      .eq('nik', nik)
      .single();
    
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export async function submitAduanAction(aduanData) {
  const { error } = await supabase.from('pengaduan').insert([aduanData]);
  if (error) throw new Error(error.message);
  
  // Memaksa Next.js mengambil data terbaru di halaman pengaduan
  revalidatePath("/pengaduan");
  return { success: true };
}