import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  // Proses login dilakukan di server
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Login berhasil, kembalikan response sukses
  return NextResponse.json({ user: data.user });
}