import { getBerita } from '../../../services/beritaService';
import BeritaClientContent from './BeritaClientContent';

export default async function AdminBeritaPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { data, count } = await getBerita(page, 5); // Limit 5 berita per halaman

  return (
    <BeritaClientContent 
      initialData={data} 
      totalCount={count} 
      currentPage={page} 
    />
  );
}