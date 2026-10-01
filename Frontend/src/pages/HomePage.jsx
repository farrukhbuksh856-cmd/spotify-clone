import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function HomePage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [query, setQuery] = useState('');

  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/music/');
        setSongs(res.data.musics || []);
      } catch (err) {
        console.error('Failed to fetch songs:', err);
        setError('Failed to load songs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // Title ya artist ke naam se filter (chhote/bade harf ka farq nahi)
  const q = query.trim().toLowerCase();
  const filteredSongs = q
    ? songs.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.artist?.username?.toLowerCase().includes(q)
    )
    : songs;

  // Mobile: # + title | Desktop: # + title + artist
  const rowGrid = 'grid items-center grid-cols-[2rem_1fr] md:grid-cols-[2.5rem_1fr_1fr]';

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Hero / Greeting ── */}
      <div
        className="relative overflow-hidden px-5 pt-8 pb-6 md:px-8 md:pt-10 md:pb-7"
        style={{ background: 'linear-gradient(180deg,#2a6342 0%,#1a3d2b 45%,#121212 100%)' }}
      >
        <div
          className="absolute -top-10 -right-10 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#1db954 0%,transparent 70%)' }}
        />
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1db954] mb-2 opacity-80">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2 drop-shadow">
          {getGreeting()}{user?.username ? `, ${user.username}` : ''}
        </h1>
        <p className="text-sm text-white/60 mb-4">
          {songs.length > 0
            ? `${songs.length} track${songs.length !== 1 ? 's' : ''} ready to play`
            : 'Listen to your favourite music anytime, anywhere.'}
        </p>
        {songs.length > 0 && (
          <button
            onClick={() => playTrack(songs[0], songs)}
            className="inline-flex items-center gap-2 bg-[#1db954] hover:bg-[#1ed760] text-black text-sm font-bold px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-lg shadow-[#1db954]/30"
          >
            <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play All
          </button>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-4 md:px-6 pt-5 pb-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">All Songs</h2>
          <span className="text-[11px] text-[#b3b3b3] font-semibold bg-white/5 px-3 py-1 rounded-full">
            {filteredSongs.length} {filteredSongs.length === 1 ? 'Track' : 'Tracks'}
          </span>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-4 max-w-md">
          <svg
            className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs or artists"
            className="w-full bg-[#282828] text-white text-sm pl-11 pr-10 py-2.5 rounded-full outline-none placeholder-[#6a6a6a] focus:ring-2 focus:ring-[#1db954]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white text-lg leading-none"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-[#b3b3b3]">
            <div className="w-7 h-7 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading tracks…</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center text-sm">
            {error}
          </div>
        ) : songs.length === 0 ? (
          <div className="bg-[#181818] border border-white/5 p-10 md:p-14 rounded-2xl text-center text-[#b3b3b3]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#282828] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                  d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2" />
              </svg>
            </div>
            <p className="text-base font-semibold text-white mb-1">No songs uploaded yet</p>
            <p className="text-sm">Artists can upload music from the sidebar.</p>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="bg-[#181818] border border-white/5 p-10 rounded-2xl text-center text-[#b3b3b3]">
            <p className="text-base font-semibold text-white mb-1">No results for "{query}"</p>
            <p className="text-sm">Kisi aur naam se search karke dekhein.</p>
          </div>
        ) : (
          <div className="bg-[#181818] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">

            {/* Table header */}
            <div
              className={`${rowGrid} px-3 md:px-6 py-3 border-b border-white/6 text-[10px] font-bold uppercase tracking-widest text-[#6a6a6a]`}
            >
              <div className="text-center">#</div>
              <div>Title</div>
              <div className="hidden md:block">Artist</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/4">
              {filteredSongs.map((song, index) => {
                const isCurrent =
                  currentTrack &&
                  (currentTrack._id === song._id || currentTrack.id === song._id);
                const artistName = song.artist?.username || 'Unknown Artist';
                const isHovered = hoveredRow === song._id;

                return (
                  <div
                    key={song._id}
                    onMouseEnter={() => setHoveredRow(song._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => (isCurrent ? togglePlay() : playTrack(song, filteredSongs))}
                    className={`${rowGrid} px-3 md:px-6 py-3 cursor-pointer transition-colors duration-150 ${isCurrent ? 'bg-white/[0.07]' : 'hover:bg-[#2a2a2a]'
                      }`}
                  >
                    {/* # / icon */}
                    <div className="flex items-center justify-center w-8 h-8">
                      {isCurrent ? (
                        isPlaying ? (
                          isHovered ? (
                            <svg className="w-4 h-4 fill-[#1db954]" viewBox="0 0 24 24">
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          ) : (
                            <div className="flex items-end justify-center gap-0.5 w-4 h-4">
                              <div className="w-0.75 bg-[#1db954] rounded-full wave-bar-1" />
                              <div className="w-0.75 bg-[#1db954] rounded-full wave-bar-2" />
                              <div className="w-0.75 bg-[#1db954] rounded-full wave-bar-3" />
                            </div>
                          )
                        ) : (
                          <svg className="w-4 h-4 fill-[#1db954]" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )
                      ) : isHovered ? (
                        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      ) : (
                        <span className="text-sm font-mono text-[#6a6a6a]">{index + 1}</span>
                      )}
                    </div>

                    {/* Title + art */}
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className={`shrink-0 w-9 h-9 rounded-md flex items-center justify-center border transition-all ${isCurrent
                          ? 'bg-[#1db954]/10 border-[#1db954]/25 shadow-[0_0_12px_rgba(29,185,84,0.2)]'
                          : 'bg-[#2a2a2a] border-white/5'
                        }`}>
                        <svg
                          className={`w-4 h-4 ${isCurrent ? 'text-[#1db954]' : 'text-[#555]'}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                            d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate leading-tight ${isCurrent ? 'text-[#1db954]' : 'text-white'
                          }`}>
                          {song.title}
                        </p>
                        {/* Mobile par artist title ke neeche */}
                        <p className="md:hidden text-xs text-[#6a6a6a] truncate mt-0.5">{artistName}</p>
                      </div>
                    </div>

                    {/* Artist (desktop) */}
                    <div className="hidden md:block min-w-0 pr-3">
                      <span className="text-sm text-[#a0a0a0] truncate">{artistName}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}