import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateAlbumPage() {
  const [title, setTitle] = useState('');
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedMusics, setSelectedMusics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSongs, setFetchingSongs] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigate = useNavigate();

  // Load available songs to pick from
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setFetchingSongs(true);
        const res = await api.get('/music/');
        setAvailableSongs(res.data.musics || []);
      } catch (err) {
        console.error('Failed to load songs:', err);
      } finally {
        setFetchingSongs(false);
      }
    };

    fetchSongs();
  }, []);

  const toggleSongSelection = (songId) => {
    setSelectedMusics((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!title.trim()) {
      setError('Please enter an album title.');
      return;
    }

    if (selectedMusics.length === 0) {
      setError('Please select at least one song for the album.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/music/album', {
        title: title.trim(),
        musics: selectedMusics,
      });

      setSuccessMsg(`Album "${res.data.album?.title || title}" created successfully!`);
      setTitle('');
      setSelectedMusics([]);

      setTimeout(() => {
        navigate('/albums');
      }, 1500);
    } catch (err) {
      console.error('Album creation failed:', err);
      setError(err.response?.data?.message || 'Failed to create album. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 pb-28 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Album</h1>
        <p className="text-sm text-[#b3b3b3] mt-1">Group songs together into a unified album</p>
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
          {/* Album Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Album Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Greatest Hits Vol. 1"
              className="w-full bg-[#121212] border border-[#383838] rounded-xl px-4 py-3 text-white placeholder-[#555555] focus:outline-none focus:border-[#1db954] transition-colors"
            />
          </div>

          {/* Select Songs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Select Songs ({selectedMusics.length} selected)
            </label>

            {fetchingSongs ? (
              <div className="p-6 bg-[#121212] border border-[#383838] rounded-xl text-center text-[#b3b3b3]">
                Loading available tracks...
              </div>
            ) : availableSongs.length === 0 ? (
              <div className="p-6 bg-[#121212] border border-[#383838] rounded-xl text-center text-[#b3b3b3]">
                No songs available. Upload songs first before creating an album.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto bg-[#121212] border border-[#383838] rounded-xl divide-y divide-[#282828] p-2">
                {availableSongs.map((song) => {
                  const isChecked = selectedMusics.includes(song._id);

                  return (
                    <label
                      key={song._id}
                      onClick={() => toggleSongSelection(song._id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        isChecked ? 'bg-[#282828] text-white' : 'hover:bg-[#1a1a1a] text-[#b3b3b3]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Controlled by label click
                          className="w-4 h-4 accent-[#1db954] rounded"
                        />
                        <span className="font-semibold text-sm text-white">{song.title}</span>
                      </div>
                      <span className="text-xs text-[#b3b3b3]">
                        {song.artist?.username || 'Artist'}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || availableSongs.length === 0}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-black font-bold py-3.5 rounded-full transition-transform active:scale-95 disabled:opacity-50 shadow-lg mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Album...</span>
              </>
            ) : (
              'CREATE ALBUM'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
