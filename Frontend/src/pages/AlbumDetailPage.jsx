import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumDetailPage() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { currentTrack, isPlaying, playTrack } = usePlayer();

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/music/albums/${albumId}`);
        setAlbum(res.data.album);
      } catch (err) {
        console.error('Failed to fetch album detail:', err);
        setError('Album not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    if (albumId) {
      fetchAlbumDetails();
    }
  }, [albumId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#b3b3b3]">
        <div className="w-8 h-8 border-4 border-[#1db954] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center mb-4">
          {error || 'Album not found.'}
        </div>
        <Link to="/albums" className="text-[#1db954] hover:underline font-semibold text-sm">
          &larr; Back to Albums
        </Link>
      </div>
    );
  }

  const artistName = album.artist?.username || 'Unknown Artist';
  const songs = album.musics || [];

  const handlePlayAlbum = () => {
    if (songs.length > 0) {
      playTrack(songs[0], songs);
    }
  };

  return (
    <div className="p-4 md:p-6 pb-32 md:pb-28">
      {/* Back button */}
      <Link to="/albums" className="inline-flex items-center gap-2 text-sm text-[#b3b3b3] hover:text-white mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Albums
      </Link>

      {/* Album Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 bg-linear-to-b from-[#282828] to-[#121212] p-8 rounded-2xl mb-8 shadow-xl">
        <div className="w-40 h-40 bg-[#242424] rounded-xl flex items-center justify-center text-[#1db954] shrink-0 border border-[#383838] shadow-2xl">
          <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2" />
          </svg>
        </div>

        <div className="flex flex-col text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#b3b3b3] mb-1">Album</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">{album.title}</h1>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-[#b3b3b3]">
            <span className="font-semibold text-white">{artistName}</span>
            <span>&bull;</span>
            <span>{songs.length} tracks</span>
          </div>

          {songs.length > 0 && (
            <button
              onClick={handlePlayAlbum}
              className="mt-6 w-fit mx-auto sm:mx-0 flex items-center gap-3 bg-[#1db954] hover:bg-[#1ed760] text-black font-bold px-6 py-3 rounded-full transition-transform active:scale-95 shadow-lg"
            >
              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              PLAY ALBUM
            </button>
          )}
        </div>
      </div>

      {/* Album Tracks Table */}
      {songs.length === 0 ? (
        <div className="bg-[#181818] p-8 rounded-xl text-center text-[#b3b3b3]">
          No tracks in this album yet.
        </div>
      ) : (
        <div className="bg-[#181818] rounded-2xl border border-[#282828] overflow-hidden shadow-xl">
          <div className="grid grid-cols-12 px-6 py-3 border-b border-[#282828] text-xs font-bold uppercase tracking-wider text-[#b3b3b3]">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-10">Title</div>
            <div className="col-span-1 text-right">Play</div>
          </div>

          <div className="divide-y divide-[#282828]">
            {songs.map((song, idx) => {
              const isCurrent = currentTrack && (currentTrack._id === song._id || currentTrack.id === song._id);

              return (
                <div
                  key={song._id}
                  onClick={() => playTrack(song, songs)}
                  className={`grid grid-cols-12 px-6 py-4 items-center group hover:bg-[#282828]/60 cursor-pointer transition-colors ${
                    isCurrent ? 'bg-[#282828]' : ''
                  }`}
                >
                  <div className="col-span-1 text-center text-sm font-bold text-[#b3b3b3] group-hover:text-white">
                    {idx + 1}
                  </div>

                  <div className="col-span-10 font-semibold text-white flex items-center gap-3">
                    <span className={isCurrent ? 'text-[#1db954]' : 'text-white'}>
                      {song.title}
                    </span>
                  </div>

                  <div className="col-span-1 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTrack(song, songs);
                      }}
                      className="w-9 h-9 rounded-full bg-[#1db954] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-black shadow-md hover:scale-105 ml-auto"
                    >
                      {isCurrent && isPlaying ? (
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}