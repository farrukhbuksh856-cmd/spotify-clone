import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const res = await api.get('/music/albums');
        setAlbums(res.data.albums || []);
      } catch (err) {
        console.error('Failed to fetch albums:', err);
        setError('Failed to load albums. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero header */}
      <div
        className="relative overflow-hidden px-5 pt-10 pb-8 md:px-8 md:pt-12 md:pb-10"
        style={{ background: 'linear-gradient(180deg,#1a2e5a 0%,#0e1b36 45%,#121212 100%)' }}
      >
        <div
          className="absolute -top-8 -right-8 w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#4f6ef7 0%,transparent 70%)' }}
        />
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">Albums</h1>
        <p className="text-sm text-white/50">Browse curated music collections</p>
      </div>

      <div className="flex-1 px-4 md:px-6 pt-6 pb-32 md:pb-28">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">All Albums</h2>
          <span className="text-[11px] text-[#b3b3b3] font-semibold bg-white/5 px-3 py-1 rounded-full">
            {albums.length} {albums.length === 1 ? 'Album' : 'Albums'}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-[#b3b3b3]">
            <div className="w-7 h-7 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading albums…</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center text-sm">
            {error}
          </div>
        ) : albums.length === 0 ? (
          <div className="bg-[#181818] border border-white/5 p-10 md:p-14 rounded-2xl text-center text-[#b3b3b3]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#282828] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-base font-semibold text-white mb-1">No albums yet</p>
            <p className="text-sm">Artists can create new albums from the sidebar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {albums.map((album) => {
              const artistName = album.artist?.username || 'Unknown Artist';
              const trackCount = album.musics?.length ?? 0;
              return (
                <Link
                  key={album._id}
                  to={`/albums/${album._id}`}
                  className="album-card group bg-[#181818] hover:bg-[#232323] p-3 md:p-4 rounded-xl border border-white/5 transition-all duration-200 flex flex-col"
                >
                  {/* Cover art placeholder */}
                  <div
                    className="relative aspect-square rounded-lg mb-3 overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#1e3a2f 0%,#0f1f19 100%)' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-[#1db954]/40">
                      <svg
                        className="w-12 h-12 md:w-16 md:h-16 group-hover:scale-110 transition-transform duration-300"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                          d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2" />
                      </svg>
                    </div>
                    {/* Hover play button */}
                    <div className="play-overlay absolute bottom-2 right-2">
                      <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center shadow-lg shadow-[#1db954]/40">
                        <svg className="w-4 h-4 fill-black ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-sm truncate group-hover:text-[#1db954] transition-colors leading-tight">
                    {album.title}
                  </h3>
                  <p className="text-xs text-[#a0a0a0] truncate mt-0.5">{artistName}</p>
                  <p className="text-[11px] text-[#6a6a6a] mt-1">
                    {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
