import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto play next track if available
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, playlist]);

  // Sync volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play a specific track
  const playTrack = (track, trackList = []) => {
    if (!track || !track.uri) return;

    if (trackList.length > 0) {
      setPlaylist(trackList);
      const index = trackList.findIndex((t) => t._id === track._id || t.id === track.id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else if (currentTrack && (currentTrack._id === track._id || currentTrack.id === track.id)) {
      // Toggle play/pause if same track clicked
      togglePlay();
      return;
    }

    setCurrentTrack(track);
    audioRef.current.src = track.uri;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error('Audio playback error:', err));
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Audio playback error:', err));
    }
  };

  // Seek audio position
  const seek = (seconds) => {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Set Volume
  const changeVolume = (val) => {
    const newVol = parseFloat(val);
    setVolumeState(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Play Next track in playlist
  const playNext = () => {
    if (playlist.length === 0 || currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIdx);
    playTrack(playlist[nextIdx], playlist);
  };

  // Play Previous track in playlist
  const playPrev = () => {
    if (playlist.length === 0 || currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIdx);
    playTrack(playlist[prevIdx], playlist);
  };

  // Reset and stop player
  const resetPlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setPlaylist([]);
    setCurrentIndex(-1);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playlist,
        currentIndex,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        togglePlay,
        seek,
        changeVolume,
        toggleMute,
        playNext,
        playPrev,
        resetPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
