import { supabase } from '../../lib/supabase';
import PengaduanClient from './PengaduanClient';

export default async function PengaduanPage() {
  // Query ini aman di server, tidak terlihat di Network browser
  const { data: initialAduan } = await supabase
    .from('pengaduan')
    .select('*')
    .order('created_at', { ascending: false });

  return <PengaduanClient initialData={initialAduan || []} />;
}