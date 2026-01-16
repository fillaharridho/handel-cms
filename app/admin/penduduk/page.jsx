// app/admin/penduduk/page.jsx
import { getPenduduk } from '../../../services/pendudukService';
import PendudukClientContent from './PendudukClientContent'; 

export default async function AdminPendudukPage({ searchParams }) {
  // 1. WAJIB: Await searchParams agar halaman berubah saat URL berubah
  const params = await searchParams; 
  const page = Number(params?.page) || 1;
  
  // 2. Ambil data berdasarkan halaman yang aktif
  const { data, count } = await getPenduduk(page, 10);

  return (
    <PendudukClientContent 
      initialData={data} 
      totalCount={count} 
      currentPage={page} 
    />
  );
}