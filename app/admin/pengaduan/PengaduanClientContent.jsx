"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateStatusAction, deletePengaduanAction } from '../../../actions/pengaduan';

export default function PengaduanClientContent({ initialData, totalCount, currentPage }) {
  const router = useRouter();
  const [selectedFoto, setSelectedFoto] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatusAction(id, newStatus);
    } catch (error) {
      alert("Gagal update status: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus laporan ini?')) {
      try {
        await deletePengaduanAction(id);
      } catch (error) {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:ml-64 p-6 font-sans flex flex-col gap-6">
      {/* HEADER & STATS */}
      <div className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Pengaduan</h1>
          <p className="text-slate-500 text-xs font-medium italic">Data Aman di Backend (Halaman {currentPage})</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border text-center min-w-[80px]">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Total</span>
            <span className="text-xl font-black text-slate-800">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* TABEL */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="p-4">Tanggal & Pelapor</th>
                <th className="p-4">Isi Laporan</th>
                <th className="p-4 text-center">Bukti</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {initialData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="text-[10px] font-bold text-emerald-600 mb-1">
                      {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </div>
                    <div className="font-bold text-slate-900">{item.nama_pelapor || 'Anonim'}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">NIK: {item.nik_pelapor}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[10px] text-blue-500 font-bold uppercase mb-1">{item.kategori}</div>
                    <p className="text-slate-600 font-medium">{item.isi_laporan}</p>
                  </td>
                  <td className="p-4 text-center">
                    {item.foto_bukti_url ? (
                      <button onClick={() => setSelectedFoto(item.foto_bukti_url)} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100">📷 LIHAT</button>
                    ) : <span className="text-slate-300 italic text-[10px]">Nil</span>}
                  </td>
                  <td className="p-4">
                    <select 
                      value={item.status || 'Menunggu'}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`w-full p-2 rounded text-[10px] font-bold border uppercase
                        ${item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                          item.status === 'Diproses' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          'bg-red-50 text-red-600 border-red-100'}`}
                    >
                      <option value="Menunggu">⏳ Menunggu</option>
                      <option value="Diproses">🚧 Diproses</option>
                      <option value="Selesai">✅ Selesai</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 py-4">
        <button disabled={currentPage <= 1} onClick={() => router.push(`?page=${currentPage - 1}`)} className="px-4 py-2 bg-white border rounded disabled:opacity-30">Sebelumnya</button>
        <span className="text-sm font-bold">Halaman {currentPage}</span>
        <button disabled={initialData.length < 10} onClick={() => router.push(`?page=${currentPage + 1}`)} className="px-4 py-2 bg-white border rounded disabled:opacity-30">Selanjutnya</button>
      </div>

      {/* MODAL FOTO (Gunakan desain asli kamu) */}
      {selectedFoto && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedFoto(null)}>
            <img src={selectedFoto} alt="Bukti" className="max-h-[80vh] rounded-lg shadow-2xl border-4 border-white/10" />
        </div>
      )}
    </div>
  );
}