import React, { useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

// Helper to format seconds into m:ss
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Slider ka chalta hua hissa green, baqi grey dikhane ke liye
const fillStyle = (percent) => ({
  background: `linear-gradient(to right, #1db954 ${percent}%, #4d4d4d ${percent}%)`,
});

// Player ki height: mobile 88px (h-22), desktop 80px (h-20)
// App.jsx ke padding (pb-35 / md:pb-20) se match hona chahiye
const PLAYER_HEIGHT = 'h-22 md:h-20';

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    playNext,
    playPrev,
  } = usePlayer();

  // Drag ke dauran local value, taake thumb jitter na kare
  const [dragValue, setDragValue] = useState(null);
  const isDragging = useRef(false);

  const commitSeek = () => {
    if (dragValue !== null) {
      seek(dragValue);
      setDragValue(null);
    }
    isDragging.current = false;
  };

  if (!currentTrack) {
    return (
      <footer
        className={`fixed bottom-0 left-0 right-0 ${PLAYER_HEIGHT} bg-[#181818] border-t border-[#282828] px-4 md:px-6 flex items-center justify-between z-40 text-[#b3b3b3] text-xs md:text-sm select-none`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#282828] rounded flex items-center justify-center">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-[#555555]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2" />
            </svg>
          </div>
          <span>Select a track to start listening</span>
        </div>
      </footer>
    );
  }

  const artistName = currentTrack.artist?.username || 'Unknown Artist';
  const shownTime = dragValue ?? currentTime;
  const progressPercent = duration > 0 && Number.isFinite(duration) ? (shownTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 ${PLAYER_HEIGHT} bg-[#181818] border-t border-[#282828] px-3 md:px-4 py-2 md:py-0 flex flex-col md:flex-row items-center justify-center md:justify-between gap-1.5 md:gap-0 z-40 select-none`}
    >
      {/* Track info (left) + mobile controls (right) */}
      <div className="flex items-center justify-between w-full md:w-1/4 min-w-0">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#282828] rounded-md flex items-center justify-center shrink-0 border border-[#383838] shadow-md relative overflow-hidden">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12 0c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-2" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs md:text-sm font-bold text-white truncate">
              {currentTrack.title}
            </span>
            <span className="text-[11px] md:text-xs text-[#b3b3b3] truncate">
              {artistName}
            </span>
          </div>
        </div>

        {/* Mobile-only controls */}
        <div className="flex items-center gap-3 shrink-0 md:hidden ml-2">
          <button
            type="button"
            onClick={playPrev}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title="Previous"
            aria-label="Previous track"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white hover:scale-105 transition-transform flex items-center justify-center text-black shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title="Next"
            aria-label="Next track"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Center: desktop controls + progress bar */}
      <div className="flex flex-col items-center gap-1 w-full md:w-2/4 md:max-w-xl">
        {/* Desktop-only controls */}
        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={playPrev}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title="Previous"
            aria-label="Previous track"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-white hover:scale-105 transition-transform flex items-center justify-center text-black shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={playNext}
            className="text-[#b3b3b3] hover:text-white transition-colors"
            title="Next"
            aria-label="Next track"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Progress bar (mobile par poori width, alag row) */}
        <div className="flex items-center gap-2 w-full text-[10px] md:text-xs text-[#b3b3b3]">
          <span className="min-w-8 text-right font-mono">{formatTime(shownTime)}</span>
          <input
            type="range"
            min="0"
            max={Number.isFinite(duration) && duration > 0 ? duration : 100}
            step="0.1"
            value={shownTime}
            aria-label="Seek"
            onPointerDown={() => { isDragging.current = true; }}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              // Mouse/touch drag: local value; keyboard: seedha seek
              if (isDragging.current) setDragValue(val);
              else seek(val);
            }}
            onPointerUp={commitSeek}
            onPointerCancel={commitSeek}
            style={fillStyle(progressPercent)}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
          />
          <span className="min-w-8 font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume (right, mobile par hidden) */}
      <div className="hidden md:flex items-center justify-end gap-2 min-w-45 w-1/4">
        <button
          type="button"
          onClick={toggleMute}
          className="text-[#b3b3b3] hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <svg className="w-5 h-5 fill-current text-red-400" viewBox="0 0 24 24">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          aria-label="Volume"
          onChange={(e) => changeVolume(parseFloat(e.target.value))}
          style={fillStyle(volumePercent)}
          className="w-24 h-1 rounded-lg appearance-none cursor-pointer accent-[#1db954]"
        />
      </div>
    </footer>
  );
}