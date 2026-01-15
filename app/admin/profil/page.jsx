"use client";
import { useState, useEffect } from 'react';
import { supabase } from "../../../lib/supabase"; 

export default function AdminProfil() {
  const [loading, setLoading] = useState(true);

  // === KONFIGURASI CLOUDINARY ===
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlnlvcbdm/image/upload";
  const UPLOAD_PRESET = "tugasprojek";

  // === STATE DATA UMUM (Tabel: profil_desa) ===
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [kadesData, setKadesData] = useState({ nama: "", sambutan: "", foto: "" });
  const [previewKades, setPreviewKades] = useState(null);
  const [fileKades, setFileKades] = useState(null); // Simpan file asli kades

  // === STATE KONDISI GEOGRAFIS (Tabel: geografis) ===
  const [geografis, setGeografis] = useState({
    batas: { utara: "", selatan: "", barat: "", timur: "" },
    lahan: { pemukiman: 0, pertanian: 0, perkebunan: 0, fasum: 0 }
  });

  // === STATE PERANGKAT DESA (Tabel: perangkat_desa) ===
  const [perangkatList, setPerangkatList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({ nama: '', jabatan: '', nip: '', foto: null });

  useEffect(() => {
    fetchData();
  }, []);

  // --- HELPER: UPLOAD KE CLOUDINARY ---
  const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
      const fileData = await res.json();
      return fileData.secure_url;
    } catch (err) {
      console.error("Cloudinary Error:", err);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProfil, resGeo, resPerangkat] = await Promise.all([
        supabase.from('profil_desa').select('*').maybeSingle(),
        supabase.from('geografis').select('*').maybeSingle(),
        supabase.from('perangkat_desa').select('*').order('created_at', { ascending: true })
      ]);

      if (resProfil.data) {
        setVisi(resProfil.data.visi || "");
        setMisi(resProfil.data.misi || "");
        setKadesData({ 
          nama: resProfil.data.nama_kades || "", 
          sambutan: resProfil.data.sambutan_kades || "", 
          foto: resProfil.data.foto_kades || "" 
        });
        setPreviewKades(resProfil.data.foto_kades);
      }
      if (resGeo.data) {
        setGeografis({
          batas: { utara: resGeo.data.batas_utara, selatan: resGeo.data.batas_selatan, barat: resGeo.data.batas_barat, timur: resGeo.data.batas_timur },
          lahan: { pemukiman: resGeo.data.luas_pemukiman, pertanian: resGeo.data.luas_pertanian, perkebunan: resGeo.data.luas_perkebunan, fasum: resGeo.data.luas_fasum }
        });
      }
      if (resPerangkat.data) setPerangkatList(resPerangkat.data);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLER SAVE PROFIL & GEOGRAFIS ---
  const handleSaveUmum = async () => {
    setLoading(true);
    try {
      let finalFotoKades = kadesData.foto;

      // Jika ada file foto kades baru, upload dulu
      if (fileKades) {
        const uploadedUrl = await uploadToCloudinary(fileKades);
        if (uploadedUrl) finalFotoKades = uploadedUrl;
      }

      const { error: pErr } = await supabase.from('profil_desa').upsert({
        id: 1, 
        visi, 
        misi, 
        nama_kades: kadesData.nama, 
        sambutan_kades: kadesData.sambutan, 
        foto_kades: finalFotoKades 
      });

      const { error: gErr } = await supabase.from('geografis').upsert({
        id: 1,
        batas_utara: geografis.batas.utara,
        batas_selatan: geografis.batas.selatan,
        batas_barat: geografis.batas.barat,
        batas_timur: geografis.batas.timur,
        luas_pemukiman: geografis.lahan.pemukiman,
        luas_pertanian: geografis.lahan.pertanian,
        luas_perkebunan: geografis.lahan.perkebunan,
        luas_fasum: geografis.lahan.fasum
      });

      if (pErr || gErr) throw new Error("Gagal menyimpan data");
      alert("✅ Data Berhasil Disimpan ke Database & Cloudinary!");
      setFileKades(null); // Reset file kades setelah simpan
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeoChange = (category, field, value) => {
    setGeografis(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  // --- HANDLER PERANGKAT DESA (Insert) ---
  const handleSubmitPerangkat = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFotoPerangkat = "https://via.placeholder.com/150";

      if (formData.foto) {
        const uploadedUrl = await uploadToCloudinary(formData.foto);
        if (uploadedUrl) finalFotoPerangkat = uploadedUrl;
      }

      const payload = {
        nama: formData.nama,
        jabatan: formData.jabatan,
        nip: formData.nip,
        foto: finalFotoPerangkat 
      };

      const { data, error } = await supabase.from('perangkat_desa').insert([payload]).select();

      if (!error) {
        setPerangkatList([...perangkatList, data[0]]);
        setFormData({ nama: '', jabatan: '', nip: '', foto: null });
        setImagePreview(null);
        setIsFormOpen(false);
      } else {
        throw error;
      }
    } catch (err) {
      alert("Gagal: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePerangkat = async (id) => {
    if (confirm('Hapus perangkat ini?')) {
      const { error } = await supabase.from('perangkat_desa').delete().eq('id', id);
      if (!error) setPerangkatList(perangkatList.filter(p => p.id !== id));
    }
  };

  if (loading && !visi) return <div className="p-20 text-center font-bold">Sinkronisasi Database...</div>;

  return (
    <div className="min-h-screen bg-slate-50 md:ml-64 p-8 transition-all font-sans flex flex-col gap-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Profil Desa</h1>
          <p className="text-slate-500 text-sm">Data kepala dan jajaran staf perangkat desa.</p>
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
                        <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-2 rounded-full cursor-pointer hover:bg-slate-700 transition">
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              const file = e.target.files[0];
                              if(file) {
                                setFileKades(file);
                                setPreviewKades(URL.createObjectURL(file));
                              }
                            }} />
                            📷
                        </label>
                      </div>
                      <input type="text" placeholder="Nama Lengkap Kades" className="w-full p-2 border rounded-lg text-center font-bold text-slate-800" value={kadesData.nama} onChange={(e) => setKadesData({...kadesData, nama: e.target.value})} />
                  </div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Kata Sambutan</label>
                  <textarea placeholder="Tulis sambutan..." rows="5" className="w-full p-3 bg-slate-50 border rounded-lg text-sm" value={kadesData.sambutan} onChange={(e) => setKadesData({...kadesData, sambutan: e.target.value})} />
              </div>
          </div>

          {/* BAGIAN 2: VISI MISI & GEOGRAFIS */}
          <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest border-b pb-2">🎯 Visi & Misi</h2>
                  <div className="space-y-4">
                      <textarea placeholder="Visi Desa" className="w-full p-3 border rounded-lg font-serif italic text-lg text-emerald-900 bg-emerald-50/30" value={visi} onChange={(e) => setVisi(e.target.value)} />
                      <textarea placeholder="Misi Desa" rows="4" className="w-full p-3 border rounded-lg text-slate-700" value={misi} onChange={(e) => setMisi(e.target.value)} />
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest border-b pb-2">🗺️ Kondisi Geografis</h2>
                  <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                          <p className="text-xs font-bold text-blue-600 uppercase">Batas Wilayah</p>
                          {['utara', 'selatan', 'barat', 'timur'].map(a => (
                            <div key={a}>
                              <label className="text-[9px] text-slate-400 uppercase font-bold">{a}</label>
                              <input type="text" placeholder={`Batas ${a}`} className="w-full p-2 border rounded text-sm" value={geografis.batas[a]} onChange={(e) => handleGeoChange('batas', a, e.target.value)} />
                            </div>
                          ))}
                      </div>
                      <div className="space-y-3">
                          <p className="text-xs font-bold text-emerald-600 uppercase">Luas Lahan (Ha)</p>
                          {['pemukiman', 'pertanian', 'perkebunan', 'fasum'].map(l => (
                            <div key={l}>
                              <label className="text-[9px] text-slate-400 uppercase font-bold">{l}</label>
                              <input type="number" placeholder="0" className="w-full p-2 border rounded text-sm" value={geografis.lahan[l]} onChange={(e) => handleGeoChange('lahan', l, e.target.value)} />
                            </div>
                          ))}
                      </div>
                  </div>
              </div>

              {/* LIST PERANGKAT */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">🏛️ Perangkat Desa</h2>
                      <button onClick={() => setIsFormOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition">
                        + Tambah Baru
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {perangkatList.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 border rounded-xl bg-slate-50/50 hover:bg-white hover:shadow-md transition group">
                              <img src={item.foto} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                              <div className="flex-1">
                                  <h4 className="text-sm font-bold text-slate-800">{item.nama}</h4>
                                  <p className="text-[10px] text-emerald-600 font-bold uppercase">{item.jabatan}</p>
                                  {item.nip && <p className="text-[9px] text-slate-400 font-mono">NIP. {item.nip}</p>}
                              </div>
                              <button onClick={() => handleDeletePerangkat(item.id)} className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* MODAL PERANGKAT */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="bg-slate-50 p-4 border-b flex justify-between">
                  <h2 className="font-bold text-slate-800">Tambah Perangkat Desa</h2>
                  <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500">✕</button>
                </div>
                <form onSubmit={handleSubmitPerangkat} className="p-6 space-y-4">
                    <div className="flex justify-center">
                        <label className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-emerald-400 transition bg-slate-50">
                            {imagePreview ? 
                              <img src={imagePreview} className="w-full h-full object-cover" /> : 
                              <div className="text-center"><span className="text-2xl">📷</span><p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Upload</p></div>
                            }
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                              const file = e.target.files[0];
                              if(file) {
                                setFormData({...formData, foto: file});
                                setImagePreview(URL.createObjectURL(file));
                              }
                            }} />
                        </label>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Lengkap</label>
                      <input type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Jabatan</label>
                      <input type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={formData.jabatan} onChange={(e) => setFormData({...formData, jabatan: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">NIP (Opsional)</label>
                      <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono" value={formData.nip} onChange={(e) => setFormData({...formData, nip: e.target.value})} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">Batal</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-500 transition disabled:opacity-50">
                          {loading ? "Proses..." : "Simpan Data"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}