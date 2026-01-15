export const uploadToCloudinary = async (file) => {
    if (!file) return null;
  
    const formData = new FormData();
    formData.append('file', file);
    // GANTI 'nama_preset_anda' dengan preset yang Anda buat (harus UNSIGNED)
    formData.append('upload_preset', 'tugasprojek'); 
  
    try {
      // GANTI 'cloud_nama_anda' dengan Cloud Name di dashboard utama Cloudinary
      const res = await fetch('https://api.cloudinary.com/v1_1/dlnlvcbdm/image/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error?.message || "Gagal upload ke Cloudinary");
  
      // data.secure_url adalah link https yang akan kita simpan ke Supabase
      return data.secure_url; 
    } catch (error) {
      console.error("Cloudinary Error:", error);
      throw error;
    }
  };