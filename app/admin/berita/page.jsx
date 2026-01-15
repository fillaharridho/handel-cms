"use client";
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AdminBerita() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Pemerintahan',
    isi_berita: '',
    foto_file: null,
    foto_url: '' 
  });

  const CLOUD_NAME = "dlnlvcbdm"; 
  const UPLOAD_PRESET = "tugasprojek";

  const fetchBerita = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('berita')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setBeritaList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchBerita(); }, []);

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

      if (formData.foto_file) {
        const data = new FormData();
        data.append("file", formData.foto_file);
        data.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: data }
        );

        const resData = await response.json();
        if (!response.ok) throw new Error(resData.error.message);
        finalImageUrl = resData.secure_url;
      }

      if (isEditMode) {
        const { error } = await supabase
          .from('berita')
          .update({
            judul: formData.judul,
            kategori: formData.kategori,
            isi_berita: formData.isi_berita, 
            foto_url: finalImageUrl
          })
          .eq('id', currentId);
        if (error) throw error;
        alert("Berita berhasil diperbarui!");
      } else {
        const { error } = await supabase
          .from('berita')
          .insert([{
            judul: formData.judul,
            kategori: formData.kategori,
            isi_berita: formData.isi_berita, 
            foto_url: finalImageUrl,
            views: 0
          }]);
        if (error) throw error;
        alert("Berita berhasil diterbitkan!");
      }

      resetForm();
      fetchBerita();
    } catch (error) {
      alert("Gagal: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus berita ini?')) {
      const { error } = await supabase.from('berita').delete().eq('id', id);
      if (!error) {
        setBeritaList(beritaList.filter(item => item.id !== id));
      } else {
        alert("Gagal menghapus: " + error.message);
      }
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setIsFormOpen(true);
    setCurrentId(item.id);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      isi_berita: item.isi_berita,
      foto_url: item.foto_url || '',
      foto_file: null
    });
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
      <div className="bg-white p-5 rounded-xl border flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-800">Admin Portal Berita</h1>
        <button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className={`px-6 py-2 rounded-lg font-bold ${isFormOpen ? 'bg-slate-100' : 'bg-emerald-600 text-white'}`}
        >
          {isFormOpen ? 'Batal' : '+ Berita Baru'}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl border shadow-lg">
          <h2 className="font-bold mb-4">{isEditMode ? 'Update Berita' : 'Tulis Berita Baru'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <input type="text" placeholder="Judul" className="w-full p-2 border rounded" required
                value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} />
              
              <select className="w-full p-2 border rounded" value={formData.kategori}
                onChange={(e) => setFormData({...formData, kategori: e.target.value})}>
                <option value="Pemerintahan">Pemerintahan</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Ekonomi">Ekonomi</option>
              </select>

              <textarea placeholder="Isi Berita" className="w-full p-2 border rounded h-32" required
                value={formData.isi_berita} onChange={(e) => setFormData({...formData, isi_berita: e.target.value})} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="border-2 border-dashed h-48 flex items-center justify-center relative bg-slate-50 rounded-xl overflow-hidden">
                {/* PERBAIKAN: Hanya render img jika imagePreview tidak null */}
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : <span className="text-slate-400">Pilih Foto</span>}
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <button disabled={uploading} className="bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition">
                {uploading ? 'Memproses...' : isEditMode ? 'Simpan Perubahan' : 'Terbitkan Berita'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase text-slate-400">
            <tr>
              <th className="p-4">Berita</th>
              <th className="p-4">Kategori</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
                <tr><td colSpan="3" className="p-10 text-center animate-pulse">Memuat data...</td></tr>
            ) : beritaList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-slate-100 rounded overflow-hidden border">
                        {/* PERBAIKAN: Fallback jika foto_url kosong */}
                        {item.foto_url ? (
                            <img src={item.foto_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <div className="w-full h-full bg-slate-200" />
                        )}
                    </div>
                    <span className="font-bold text-slate-700">{item.judul}</span>
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-500">{item.kategori}</td>
                <td className="p-4 flex justify-center gap-4">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 font-bold hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 font-bold hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}