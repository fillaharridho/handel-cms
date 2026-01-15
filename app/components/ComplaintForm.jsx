"use client";
import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';

export default function ComplaintForm({ onRefresh }) {
  const [formData, setFormData] = useState({
    nik: '', nama: '', kategori: 'Infrastruktur', laporan: '', foto: null
  });
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef(null);

  // Verifikasi NIK otomatis
  const validateNIK = async () => {
    if (formData.nik.length < 5) return;
    const { data } = await supabase.from('penduduk').select('nama').eq('nik', formData.nik).single();
    if (data) {
      setFormData(prev => ({ ...prev, nama: data.nama }));
      setIsVerified(true);
    } else {
      setIsVerified(false);
      alert("NIK tidak ditemukan di database penduduk!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) return alert("Silakan verifikasi NIK dulu!");
    setLoading(true);

    try {
      let publicUrl = null;
      if (formData.foto) publicUrl = await uploadToCloudinary(formData.foto);

      const { error } = await supabase.from('pengaduan').insert([{
        nik_pelapor: formData.nik,
        nama_pelapor: formData.nama,
        kategori: formData.kategori,
        isi_laporan: formData.laporan,
        foto_bukti_url: publicUrl
      }]);

      if (error) throw error;

      alert("Laporan berhasil dikirim!");
      setFormData({ nik: '', nama: '', kategori: 'Infrastruktur', laporan: '', foto: null });
      setIsVerified(false);
      onRefresh(); // Memanggil fungsi refresh di halaman utama
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10 animate-fade-in">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">Formulir Pengaduan</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">NIK Anda</label>
            <input 
              type="text" required className="w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.nik} onChange={(e) => setFormData({...formData, nik: e.target.value})}
              onBlur={validateNIK} placeholder="Klik di luar kolom untuk cek"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">Nama (Otomatis)</label>
            <input type="text" readOnly className="w-full p-3 bg-slate-200 border rounded-lg text-slate-500" value={formData.nama} />
          </div>
        </div>
        
        <select 
          className="w-full p-3 bg-slate-50 border rounded-lg outline-none"
          value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})}
        >
          <option value="Infrastruktur">Infrastruktur</option>
          <option value="Pelayanan">Pelayanan Publik</option>
          <option value="Keamanan">Keamanan</option>
        </select>

        <textarea 
          rows="4" required className="w-full p-3 bg-slate-50 border rounded-lg outline-none"
          placeholder="Isi laporan Anda..." value={formData.laporan}
          onChange={(e) => setFormData({...formData, laporan: e.target.value})}
        ></textarea>

        <input 
          type="file" accept="image/*" ref={fileInputRef}
          onChange={(e) => setFormData({...formData, foto: e.target.files[0]})}
          className="block w-full text-sm text-slate-500"
        />

        <button 
          type="submit" disabled={loading}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition"
        >
          {loading ? 'Mengirim...' : '🚀 Kirim Laporan Sekarang'}
        </button>
      </form>
    </div>
  );
}