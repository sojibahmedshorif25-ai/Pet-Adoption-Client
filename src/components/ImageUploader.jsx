import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import uploadToImgBB from '../api/imgbb';
import { toast } from 'react-toastify';

const ImageUploader = ({ onUpload, currentUrl = '' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [url, setUrl] = useState(currentUrl);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return toast.error('Please select a valid image (JPG, PNG, GIF, WebP)');
    }
    if (file.size > 10 * 1024 * 1024) {
      return toast.error('Image must be less than 10MB');
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);

    try {
      const uploadedUrl = await uploadToImgBB(file);
      setUrl(uploadedUrl);
      onUpload(uploadedUrl);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload image. You can paste a URL manually.');
      setPreview('');
      setUrl('');
      onUpload('');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrl(val);
    setPreview(val);
    onUpload(val);
  };

  const clearImage = () => {
    setPreview('');
    setUrl('');
    onUpload('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <FiUpload size={16} />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <span className="text-xs text-gray-400">or paste URL below</span>
      </div>
      <input
        type="file"
        ref={fileRef}
        onChange={handleFile}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />
      <div className="relative">
        <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="https://i.imgur.com/example.jpg"
          className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
        />
        {url && (
          <button type="button" onClick={clearImage} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
            <FiX size={16} />
          </button>
        )}
      </div>
      {preview && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={clearImage} className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70">
            <FiX size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
