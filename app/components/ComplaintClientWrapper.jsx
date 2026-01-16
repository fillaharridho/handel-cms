"use client";
import { useState } from "react";
import ComplaintForm from "../components/ComplaintForm";

export default function ComplaintClientWrapper({ initialData }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <button 
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold mb-10"
      >
        {isFormOpen ? '✕ Tutup Form' : '📝 Tulis Laporan Baru'}
      </button>

      {isFormOpen && (
        <div className="mb-20">
          {/* Kompoment Anda akan dipanggil di sini */}
          <ComplaintForm onSuccess={() => setIsFormOpen(false)} />
        </div>
      )}

      {/* Tampilan List (Gunakan data dari server) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {initialData.map((aduan) => (
          <div key={aduan.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <p className="text-slate-700 italic">"{aduan.isi_laporan}"</p>
             <div className="mt-4 font-bold text-slate-900">{aduan.nama_pelapor}</div>
          </div>
        ))}
      </div>
    </div>
  );
}