"use client";
import { useState } from 'react';
import { saveProfilDanGeoAction, savePerangkatAction, deletePerangkatAction } from '../../../actions/profil';

export default function ProfilClientContent({ initialProfil, initialGeo, initialPerangkat }) {
  const [loading, setLoading] = useState(false);
  
  // State data dari Server (initial)
  const [visi, setVisi] = useState(initialProfil.visi || "");
  const [misi, setMisi] = useState(initialProfil.misi || "");
  const [kadesData, setKadesData] = useState({ 
    nama: initialProfil.nama_kades || "", 
    sambutan: initialProfil.sambutan_kades || "", 
    foto: initialProfil.foto_kades || "" 
  });
  const [previewKades, setPreviewKades] = useState(initialProfil.foto_kades);
  const [fileKades, setFileKades] = useState(null);

  const [geografis, setGeografis] = useState({
    batas: { 
      utara: initialGeo.batas_utara || "", selatan: initialGeo.batas_selatan || "", 
      barat: initialGeo.batas_barat || "", timur: initialGeo.batas_timur || "" 
    },
    lahan: { 
      pemukiman: initialGeo.luas_pemukiman || 0, pertanian: initialGeo.luas_pertanian || 0, 
      perkebunan: initialGeo.luas_perkebunan || 0, fasum: initialGeo.luas_fasum || 0 
    }
  });

  const [perangkatList, setPerangkatList] = useState(initialPerangkat);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Update State formData untuk menyertakan NIP dan Foto
  const [formData, setFormData] = useState({ nama: '', jabatan: '', nip: '', foto: null });
  const [imagePreview, setImagePreview] = useState(null);

  // Cloudinary Config
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlnlvcbdm/image/upload";
  const UPLOAD_PRESET = "tugasprojek";

  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
    const fileData = await res.json();
    return fileData.secure_url;
  };

  const handleSaveUmum = async () => {
    setLoading(true);
    try {
      let finalFotoKades = kadesData.foto;
      if (fileKades) {
        const uploadedUrl = await uploadToCloudinary(fileKades);
        if (uploadedUrl) finalFotoKades = uploadedUrl;
      }

      await saveProfilDanGeoAction({
        visi, misi, 
        nama_kades: kadesData.nama, 
        sambutan_kades: kadesData.sambutan, 
        foto_kades: finalFotoKades 
      }, {
        batas_utara: geografis.batas.utara, batas_selatan: geografis.batas.selatan,
        batas_barat: geografis.batas.barat, batas_timur: geografis.batas.timur,
        luas_pemukiman: geografis.lahan.pemukiman, luas_pertanian: geografis.lahan.pertanian,
        luas_perkebunan: geografis.lahan.perkebunan, luas_fasum: geografis.lahan.fasum
      });
      alert("✅ Profil Berhasil Disimpan!");
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleGeoChange = (category, field, value) => {
    setGeografis(prev => ({ ...prev, [category]: { ...prev[category], [field]: value } }));
  };

  const handleSubmitPerangkat = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalFoto = "https://via.placeholder.com/150";
      if (formData.foto) {
        finalFoto = await uploadToCloudinary(formData.foto);
      }
      
      // Kirim data lengkap ke Action
      await savePerangkatAction({ 
        nama: formData.nama, 
        jabatan: formData.jabatan, 
        nip: formData.nip, 
        foto: finalFoto 
      });

      setIsFormOpen(false);
      setImagePreview(null);
      setFormData({ nama: '', jabatan: '', nip: '', foto: null });
      window.location.reload(); 
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const handleDeletePerangkat = async (id) => {
    if (confirm('Hapus perangkat ini?')) {
      await deletePerangkatAction(id);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 md:ml-64 p-8 transition-all font-sans flex flex-col gap-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Profil Desa</h1>
          <p className="text-slate-500 text-sm italic">Data diproses di Server (Next.js Actions)</p>
        </div>
        <button 
          onClick={handleSaveUmum}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg disabled:opacity-50"
        >
          {loading ? "⌛ Memproses..." : "💾 Simpan Perubahan Profil"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* BAGIAN 1: KEPALA DESA */}
          <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest border-b pb-2">👤 Kepala Desa</h2>
                  <div className="flex flex-col items-center mb-6">
                      <div className="relative w-32 h-32 mb-4">
                        <img src={previewKades || "https://via.placeholder.com/150"} className="w-full h-full object-cover rounded-full border-4 border-slate-100 shadow-md" />
                        <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full cursor-pointer shadow-lg">
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              const file = e.target.files[0];
                              if(file) { setFileKades(file); setPreviewKades(URL.createObjectURL(file)); }
                            }} />
                            📷
                        </label>
                      </div>
                      <input type="text" className="w-full p-2 border rounded-lg text-center font-bold" value={kadesData.nama} onChange={(e) => setKadesData({...kadesData, nama: e.target.value})} />
                  </div>
                  <textarea rows="5" className="w-full p-3 bg-slate-50 border rounded-lg text-sm" value={kadesData.sambutan} onChange={(e) => setKadesData({...kadesData, sambutan: e.target.value})} />
              </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
              {/* VISI MISI */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest border-b pb-2">🎯 Visi & Misi</h2>
                  <div className="space-y-4">
                      <textarea className="w-full p-3 border rounded-lg font-serif italic text-lg text-emerald-900 bg-emerald-50/30" value={visi} onChange={(e) => setVisi(e.target.value)} />
                      <textarea rows="4" className="w-full p-3 border rounded-lg text-slate-700" value={misi} onChange={(e) => setMisi(e.target.value)} />
                  </div>
              </div>

              {/* GEOGRAFIS */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest border-b pb-2">🗺️ Kondisi Geografis</h2>
                  <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                          <p className="text-xs font-bold text-blue-600 uppercase">Batas Wilayah</p>
                          {['utara', 'selatan', 'barat', 'timur'].map(a => (
                            <div key={a}>
                              <label className="text-[9px] text-slate-400 uppercase font-bold">{a}</label>
                              <input type="text" className="w-full p-2 border rounded text-sm" value={geografis.batas[a]} onChange={(e) => handleGeoChange('batas', a, e.target.value)} />
                            </div>
                          ))}
                      </div>
                      <div className="space-y-3">
                          <p className="text-xs font-bold text-emerald-600 uppercase">Luas Lahan (Ha)</p>
                          {['pemukiman', 'pertanian', 'perkebunan', 'fasum'].map(l => (
                            <div key={l}>
                              <label className="text-[9px] text-slate-400 uppercase font-bold">{l}</label>
                              <input type="number" className="w-full p-2 border rounded text-sm" value={geografis.lahan[l]} onChange={(e) => handleGeoChange('lahan', l, e.target.value)} />
                            </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* PERANGKAT DESA */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">🏛️ Perangkat Desa</h2>
                      <button onClick={() => setIsFormOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-slate-700 transition">+ Tambah Baru</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {perangkatList.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 border rounded-xl bg-slate-50/50 group">
                              <img src={item.foto} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt={item.nama} />
                              <div className="flex-1">
                                  <h4 className="text-sm font-bold text-slate-800">{item.nama}</h4>
                                  <p className="text-[10px] text-emerald-600 font-bold uppercase">{item.jabatan}</p>
                                  {item.nip && <p className="text-[9px] text-slate-400">NIP: {item.nip}</p>}
                              </div>
                              <button onClick={() => handleDeletePerangkat(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
      
      {/* MODAL TAMBAH PERANGKAT (Lengkap dengan NIP dan Foto) */}
      {isFormOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in-up">
                  <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-3">Tambah Perangkat Desa</h2>
                  <form onSubmit={handleSubmitPerangkat} className="space-y-4">
                      
                      {/* Upload Foto Staf */}
                      <div className="flex flex-col items-center gap-3 mb-4">
                        <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center relative">
                          {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-slate-400 text-xs">Pilih Foto</span>
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setFormData({...formData, foto: file});
                                setImagePreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Klik kotak untuk upload foto</p>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nama Lengkap</label>
                        <input type="text" placeholder="Masukkan nama" required className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Jabatan</label>
                        <input type="text" placeholder="Masukkan jabatan" required className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={formData.jabatan} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">NIP (Opsional)</label>
                        <input type="text" placeholder="Masukkan NIP" className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} />
                      </div>

                      <div className="flex gap-3 pt-4 border-t">
                        <button type="button" onClick={() => { setIsFormOpen(false); setImagePreview(null); }} className="flex-1 p-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition text-sm">Batal</button>
                        <button type="submit" disabled={loading} className="flex-1 p-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 transition text-sm disabled:opacity-50">
                          {loading ? "Memproses..." : "Simpan Staf"}
                        </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}