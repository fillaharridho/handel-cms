"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminPengaduan() {
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [aduanList, setAduanList] = useState([]);
  const [loading, setLoading] = useState(true);

  // FUNGSI AMBIL DATA (READ) - Menggunakan urutan terbaru (id)
  const fetchPengaduan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pengaduan')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error("Error fetch:", error.message);
    } else {
      setAduanList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPengaduan(); }, []);

  // FUNGSI UPDATE STATUS (UPDATE)
  const handleStatusChange = async (id, newStatus) => {
    const originalList = [...aduanList];
    setAduanList(aduanList.map(item => item.id === id ? { ...item, status: newStatus } : item));

    const { error } = await supabase
      .from('pengaduan')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert("Gagal update ke database: " + error.message);
      setAduanList(originalList); 
    }
  };

  // FUNGSI HAPUS (DELETE)
  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus laporan ini?')) {
      const { error } = await supabase.from('pengaduan').delete().eq('id', id);
      if (!error) {
        setAduanList(aduanList.filter(item => item.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:ml-64 p-6 font-sans flex flex-col gap-6">
      
      {/* HEADER & STATS */}
      <div className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Pengaduan</h1>
          <p className="text-slate-500 text-xs font-medium">Monitoring Aspirasi Warga Realtime</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border text-center min-w-[80px]">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Masuk</span>
            <span className="text-xl font-black text-slate-800">{aduanList.length}</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-center min-w-[80px]">
            <span className="block text-[10px] font-bold text-emerald-600 uppercase">Selesai</span>
            <span className="text-xl font-black text-emerald-600">
              {aduanList.filter(i => i.status === 'Selesai').length}
            </span>
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
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-400 animate-pulse">Memuat data pengaduan...</td></tr>
              ) : aduanList.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-slate-400 italic">Belum ada laporan masuk.</td></tr>
              ) : aduanList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="text-[10px] font-bold text-emerald-600 mb-1">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                    </div>
                    {/* DISESUAIKAN: Menggunakan nama_pelapor dan nik_pelapor */}
                    <div className="font-bold text-slate-900">{item.nama_pelapor || 'Anonim'}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">NIK: {item.nik_pelapor || '-'}</div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium max-w-xs truncate md:max-w-md md:whitespace-normal">
                    {/* DISESUAIKAN: Menggunakan isi_laporan dan kategori */}
                    <div className="text-[10px] text-blue-500 font-bold uppercase mb-1">{item.kategori || 'Umum'}</div>
                    {item.isi_laporan || <span className="text-slate-300 italic">Tidak ada isi laporan</span>}
                  </td>
                  <td className="p-4 text-center">
                    {/* DISESUAIKAN: Menggunakan foto_bukti_url */}
                    {item.foto_bukti_url ? (
                      <button 
                        onClick={() => setSelectedFoto(item.foto_bukti_url)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100 hover:bg-blue-100 transition"
                      >
                        📷 LIHAT
                      </button>
                    ) : <span className="text-slate-300 italic text-[10px]">Nil</span>}
                  </td>
                  <td className="p-4">
                    <select 
                      value={item.status || 'Menunggu'}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`w-full p-2 rounded text-[10px] font-bold border uppercase tracking-wider outline-none cursor-pointer
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
                    <button onClick={() => handleDelete(item.id)} className="text-slate-300 hover:text-red-500 transition">
                      <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FOTO */}
      {selectedFoto && (
        <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedFoto(null)}>
          <div className="max-w-4xl w-full flex flex-col items-center">
            <img src={selectedFoto} alt="Bukti" className="max-h-[80vh] rounded-lg shadow-2xl border-4 border-white/10" />
            <button className="mt-4 text-white font-bold text-sm bg-white/10 px-6 py-2 rounded-full border border-white/20">✕ TUTUP</button>
          </div>
        </div>
      )}
    </div>
  );
}