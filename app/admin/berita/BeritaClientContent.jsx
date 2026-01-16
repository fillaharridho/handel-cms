"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBeritaAction, deleteBeritaAction } from '../../../actions/berita';

export default function BeritaClientContent({ initialData, totalCount, currentPage }) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ judul: '', kategori: 'Pemerintahan', isi_berita: '', foto_file: null, foto_url: '' });

  const CLOUD_NAME = "dlnlvcbdm"; 
  const UPLOAD_PRESET = "tugasprojek";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto_file: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = formData.foto_url;
      // Proses Cloudinary tetap di sini (Client)
      if (formData.foto_file) {
        const data = new FormData();
        data.append("file", formData.foto_file);
        data.append("upload_preset", UPLOAD_PRESET);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
        const resData = await response.json();
        finalImageUrl = resData.secure_url;
      }
      // Kirim data ke Backend Action
      await saveBeritaAction({ ...formData, foto_url: finalImageUrl }, isEditMode, currentId);
      alert("Berhasil!");
      resetForm();
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus berita ini?')) {
      await deleteBeritaAction(id);
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setIsFormOpen(true);
    setCurrentId(item.id);
    setFormData({ judul: item.judul, kategori: item.kategori, isi_berita: item.isi_berita, foto_url: item.foto_url || '', foto_file: null });
    setImagePreview(item.foto_url || null);
  };

  const resetForm = () => {
    setFormData({ judul: '', kategori: 'Pemerintahan', isi_berita: '', foto_file: null, foto_url: '' });
    setImagePreview(null);
    setIsFormOpen(false);
    setIsEditMode(false);
    setCurrentId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 md:ml-64 p-6 font-sans flex flex-col gap-6">
      {/* HEADER & FORM (Gunakan desain Tailwind kamu sebelumnya) */}
      <div className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-800">Admin Portal Berita</h1>
        <button onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)} className={`px-6 py-2 rounded-lg font-bold ${isFormOpen ? 'bg-slate-100' : 'bg-emerald-600 text-white'}`}>
          {isFormOpen ? 'Batal' : '+ Berita Baru'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* ... Input judul, kategori, textarea isi_berita ... */}
             <div className="space-y-3">
               <input type="text" className="w-full p-2 border rounded" value={formData.judul} onChange={(e)=>setFormData({...formData, judul: e.target.value})} placeholder="Judul" required />
               <select className="w-full p-2 border rounded" value={formData.kategori} onChange={(e)=>setFormData({...formData, kategori: e.target.value})}>
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Olahraga">Olahraga</option>
                  <option value="Ekonomi">Ekonomi</option>
               </select>
               <textarea className="w-full p-2 border rounded h-32" value={formData.isi_berita} onChange={(e)=>setFormData({...formData, isi_berita: e.target.value})} placeholder="Isi Berita" required />
             </div>
             <div className="flex flex-col gap-2">
               <div className="border-2 border-dashed h-48 flex items-center justify-center relative bg-slate-50 rounded-xl overflow-hidden text-center p-2">
                  {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <span>Pilih Foto</span>}
                  <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0" />
               </div>
               <button disabled={uploading} className="bg-slate-900 text-white p-3 rounded-lg font-bold">
                 {uploading ? 'Memproses...' : 'Simpan Berita'}
               </button>
             </div>
          </form>
        </div>
      )}

      {/* TABEL DATA */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
            <tr><th className="p-4">Berita</th><th className="p-4">Kategori</th><th className="p-4 text-center">Aksi</th></tr>
          </thead>
          <tbody className="divide-y">
            {initialData.map((item) => (
              <tr key={item.id}>
                <td className="p-4 flex items-center gap-3">
                  <img src={item.foto_url || '/placeholder.png'} className="w-12 h-8 rounded object-cover" />
                  <span className="font-bold">{item.judul}</span>
                </td>
                <td className="p-4">{item.kategori}</td>
                <td className="p-4 text-center space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4">
        <button disabled={currentPage <= 1} onClick={() => router.push(`?page=${currentPage - 1}`)} className="px-4 py-2 bg-white border rounded disabled:opacity-50">Sebelumnya</button>
        <span className="p-2">Halaman {currentPage}</span>
        <button disabled={initialData.length < 5} onClick={() => router.push(`?page=${currentPage + 1}`)} className="px-4 py-2 bg-white border rounded disabled:opacity-50">Selanjutnya</button>
      </div>
    </div>
  );
}