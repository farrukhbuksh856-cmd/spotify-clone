import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function UploadMusicPage() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setError('Please enter a track title.');
      return;
    }

    if (!file) {
      setError('Please select an audio file to upload.');
      return;
    }

    // Prepare multipart/form-data object with the exact field name "music"
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('music', file); // Field name expected by backend: "music"

    try {
      setUploading(true);
      const res = await api.post('/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg(`Music "${res.data.music?.title || title}" uploaded successfully!`);
      setTitle('');
      setFile(null);
      // Optional auto navigate after 1.5s
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.message || 'Failed to upload music track. Please check file format.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 pb-28 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Upload Music</h1>
        <p className="text-sm text-[#b3b3b3] mt-1">Publish new songs for your audience</p>
      </div>

      <div className="bg-[#181818] border border-[#282828] p-8 rounded-2xl shadow-2xl">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-[#1db954]/10 border border-[#1db954]/30 rounded-xl text-[#1db954] text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Song Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Track Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midnight Waves"
              className="w-full bg-[#121212] border border-[#383838] rounded-xl px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>

          {/* Audio File Input ("music") */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Audio File (MP3, WAV, AAC)
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#383838] hover:border-[#1db954] bg-[#121212] hover:bg-[#181818] rounded-xl p-8 cursor-pointer transition-colors group">
              <svg className="w-10 h-10 text-[#555555] group-hover:text-[#1db954] mb-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="text-sm font-semibold text-white mb-1">
                {file ? file.name : 'Click to browse audio file'}
              </span>
              <span className="text-xs text-[#b3b3b3]">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Supported formats: MP3, WAV, FLAC, M4A'}
              </span>
              <input
                type="file"
                accept="audio/*"
                required
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3.5 rounded-full transition-transform active:scale-95 disabled:opacity-50 shadow-lg mt-2 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading Track...</span>
              </>
            ) : (
              'UPLOAD MUSIC'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
