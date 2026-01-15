"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminPenduduk() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendudukList, setPendudukList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Form
  const [formData, setFormData] = useState({
    nama: '', 
    nik: '', 
    jk: 'Laki-laki', 
    pekerjaan: 'Petani', 
    alamat: 'Dusun Krajan'
  });

  // 1. FUNGSI AMBIL DATA (Sederhana & Aman)
  const fetchPenduduk = async () => {
    setLoading(true);
    console.log("Mengambil data...");

    // Tanpa .order('created_at') agar tidak error
    const { data, error } = await supabase
      .from('penduduk')
      .select('*');

    if (error) {
      console.error("INFO ERROR:", error);
      alert("Supabase Error: " + error.message);
    } else {
      console.log("DATA DITEMUKAN:", data);
      setPendudukList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { 
    fetchPenduduk(); 
  }, []);

  // 2. FUNGSI SIMPAN/UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      const { error } = await supabase
        .from('penduduk')
        .update({
          nama: formData.nama,
          jk: formData.jk,
          pekerjaan: formData.pekerjaan,
          alamat: formData.alamat
        })
        .eq('nik', formData.nik);

      if (error) {
        alert("Gagal Update: " + error.message);
      } else {
        setPendudukList(prev => prev.map(item => 
          item.nik === formData.nik ? { ...item, ...formData } : item
        ));
        alert("Data berhasil diperbarui!");
        resetForm();
      }
    } else {
      const { data, error } = await supabase
        .from('penduduk')
        .insert([formData])
        .select();

      if (error) {
        alert("Gagal Simpan: " + error.message);
      } else if (data) {
        setPendudukList([data[0], ...pendudukList]);
        alert("Warga baru berhasil ditambahkan!");
        resetForm();
      }
    }
  };

  // 3. FUNGSI HAPUS
  const handleDelete = async (nik) => {
    if (confirm('Yakin ingin menghapus warga ini?')) {
      const { error } = await supabase
        .from('penduduk')
        .delete()
        .eq('nik', nik);

      if (error) {
        alert("Gagal Hapus: " + error.message);
      } else {
        setPendudukList(prev => prev.filter(item => item.nik !== nik));
        alert("Data berhasil dihapus!");
      }
    }
  };

  // 4. LOGIKA PENCARIAN (Filter otomatis di tampilan)
  const filteredPenduduk = (pendudukList || []).filter(item => {
    const search = searchTerm.toLowerCase();
    const namaMatch = item.nama?.toLowerCase().includes(search);
    const nikMatch = item.nik?.toString().includes(search);
    return namaMatch || nikMatch;
  });

  // 5. HELPER FUNCTIONS
  const startEdit = (warga) => {
    setFormData(warga);
    setIsEditMode(true);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ nama: '', nik: '', jk: 'Laki-laki', pekerjaan: 'Petani', alamat: 'Dusun Krajan' });
    setIsEditMode(false);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 md:ml-64 p-6 font-sans flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="bg-white p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Manajemen Penduduk</h1>
          <p className="text-slate-500 text-xs mt-1 font-medium italic">Data tersimpan aman di Database Desa Harmoni</p>
        </div>
        <button 
          onClick={() => { if(isFormOpen) resetForm(); else setIsFormOpen(true); }}
          className={`${isFormOpen ? 'bg-slate-500' : 'bg-emerald-600'} text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg transition hover:opacity-90`}
        >
          {isFormOpen ? '✕ Batal' : '+ Tambah Warga'}
        </button>
      </div>

      {/* FORM LENGKAP */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-xl">
          <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-widest border-b pb-2">
            {isEditMode ? '🛠️ Edit Data Warga' : '📝 Input Warga Baru'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nama Lengkap</label>
              <input type="text" required className="w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">NIK (Kunci Utama)</label>
              <input type="text" required disabled={isEditMode} 
                className={`w-full p-3 border rounded-lg outline-none font-bold text-sm ${isEditMode ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:ring-2 focus:ring-emerald-500'}`}
                value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jenis Kelamin</label>
              <select className="w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                value={formData.jk} onChange={(e) => setFormData({...formData, jk: e.target.value})}>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pekerjaan</label>
              <select className="w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                value={formData.pekerjaan} onChange={(e) => setFormData({...formData, pekerjaan: e.target.value})}>
                <option value="Petani">Petani</option>
                <option value="Wiraswasta">Wiraswasta</option>
                <option value="PNS">PNS / ASN</option>
                <option value="Guru">Guru / Dosen</option>
                <option value="Pelajar">Pelajar / Mahasiswa</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Alamat (Dusun/RT/RW)</label>
              <input type="text" required className="w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-emerald-600 transition shadow-lg uppercase tracking-widest text-xs">
                {isEditMode ? '💾 Simpan Perubahan' : '🚀 Daftarkan ke Database'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-2xl">
          <input 
            type="text" 
            placeholder="Cari berdasarkan Nama atau NIK..." 
            className="w-full pl-12 pr-10 py-4 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-emerald-500 shadow-sm text-sm font-medium transition-all"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-4 text-slate-400 hover:text-red-500 transition font-bold text-xs"
            >
              CLEAR
            </button>
          )}
      </div>

      {/* TABEL DATA */}
      <div className="w-full bg-white rounded-xl shadow-sm border overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/50 border-b text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="py-4 px-5">Nama Lengkap</th>
                <th className="py-4 px-5">NIK</th>
                <th className="py-4 px-5 text-center">L/P</th>
                <th className="py-4 px-5 text-center">Pekerjaan</th>
                <th className="py-4 px-5">Alamat</th>
                <th className="py-4 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {filteredPenduduk.map((item) => (
                <tr key={item.nik} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-5 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-4 px-5 text-slate-500 font-mono text-xs">{item.nik}</td>
                  <td className="py-4 px-5 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${item.jk === 'Laki-laki' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                      {item.jk}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center font-bold text-emerald-700 text-[10px]">
                    <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{item.pekerjaan}</span>
                  </td>
                  <td className="py-4 px-5 text-slate-600 text-xs">{item.alamat}</td>
                  <td className="py-4 px-5 text-center flex justify-center gap-1 mt-2">
                    <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-emerald-500 transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(item.nik)} className="p-2 text-slate-400 hover:text-red-500 transition">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {loading && (
            <div className="p-10 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-slate-100 animate-pulse rounded-md w-full"></div>
              ))}
            </div>
          )}
          
          {!loading && filteredPenduduk.length === 0 && (
            <div className="p-20 text-center text-slate-500 italic">
              Data tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}