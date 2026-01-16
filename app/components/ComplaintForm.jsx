"use client";
import { useState, useRef } from 'react';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { verifyNIK, submitAduanAction } from '../pengaduan/actions';

export default function ComplaintForm({ onRefresh }) {
  const [formData, setFormData] = useState({
    nik: '', nama: '', kategori: 'Infrastruktur', laporan: '', foto: null
  });
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef(null);

  const handleValidateNIK = async () => {
    if (formData.nik.length < 5) return;
    setLoading(true);
    const data = await verifyNIK(formData.nik);
    if (data) {
      setFormData(prev => ({ ...prev, nama: data.nama }));
      setIsVerified(true);
    } else {
      setIsVerified(false);
      setFormData(prev => ({ ...prev, nama: '' }));
      alert("NIK tidak ditemukan!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-12 animate-fade-in">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-slate-800 font-serif">Tulis Laporan</h3>
        <p className="text-slate-400 text-sm mt-2">Pastikan data yang Anda masukkan sudah benar.</p>
      </div>

      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!isVerified) return alert("Verifikasi NIK dulu!");
        setLoading(true);
        try {
          let publicUrl = null;
          if (formData.foto) publicUrl = await uploadToCloudinary(formData.foto);
          
          await submitAduanAction({
            nik_pelapor: formData.nik,
            nama_pelapor: formData.nama,
            kategori: formData.kategori,
            isi_laporan: formData.laporan,
            foto_bukti_url: publicUrl,
            status: "MENUNGGU"
          });
          
          alert("Laporan terkirim!");
          onRefresh();
        } catch (err) { alert(err.message); }
        setLoading(false);
      }} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">NIK Pelapor</label>
            <input 
              type="text" required 
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.nik} 
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
              onBlur={handleValidateNIK}
              placeholder="Masukkan NIK sesuai KTP"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nama (Otomatis)</label>
            <input 
              type="text" readOnly 
              className={`w-full px-5 py-4 border-none rounded-2xl outline-none ${isVerified ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-400'}`}
              value={formData.nama || 'Belum Terverifikasi'} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Kategori Laporan</label>
          <select 
            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
            value={formData.kategori} 
            onChange={(e) => setFormData({...formData, kategori: e.target.value})}
          >
            <option value="Infrastruktur">Infrastruktur & Jalan</option>
            <option value="Pelayanan">Pelayanan Publik</option>
            <option value="Keamanan">Keamanan & Ketertiban</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Isi Pengaduan</label>
          <textarea 
            rows="4" required 
            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder="Ceritakan detail kejadian atau keluhan Anda..."
            value={formData.laporan}
            onChange={(e) => setFormData({...formData, laporan: e.target.value})}
          ></textarea>
        </div>

        <div className="p-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
          <input 
            type="file" accept="image/*" ref={fileInputRef}
            onChange={(e) => setFormData({...formData, foto: e.target.files[0]})}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-white file:text-emerald-700 shadow-sm"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !isVerified}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none"
        >
          {loading ? 'Sistem sedang memproses...' : '🚀 Kirim Laporan Sekarang'}
        </button>
      </form>
    </div>
  );
}