const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const uploadToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', file);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Image upload failed');
  return data.data.url;
};

export default uploadToImgBB;
