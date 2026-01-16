import { getPengaduan } from '../../../services/pengaduanService';
import PengaduanClientContent from './PengaduanClientContent';

export default async function AdminPengaduanPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { data, count } = await getPengaduan(page, 10);

  return (
    <PengaduanClientContent 
      initialData={data} 
      totalCount={count} 
      currentPage={page} 
    />
  );
}