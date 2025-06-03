'use client';

import React, { createContext, useState, useRef, useContext, useCallback, useEffect, ReactNode } from 'react';
import { MusicItem } from '@/utils/supabase/types';

interface SellerInfo {
  name: string;
  avatarUrl: string | null;
  // Add id if needed later for linking
}

interface AudioContextType {
  currentTrack: MusicItem | null;
  currentSeller: SellerInfo | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  loadTrack: (track: MusicItem, seller: SellerInfo) => void;
  togglePlayPause: () => void;
  toggleMute: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudioPlayer = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicItem | null>(null);
  const [currentSeller, setCurrentSeller] = useState<SellerInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1); // Volume 0 to 1
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const previousVolumeRef = useRef<number>(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to create and manage the audio element instance
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setVolume(audio.volume);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);

    // Cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.pause();
      audio.src = ''; // Release resource
      audioRef.current = null;
    };
  }, []); // Runs only once on mount

  const loadTrack = useCallback((track: MusicItem, seller: SellerInfo) => {
    if (!audioRef.current) return;

    // If it's a different track, load and play it
    if (!currentTrack || audioRef.current.src !== track.url) {
      audioRef.current.src = track.url;
      audioRef.current.load();

      setCurrentTrack(track);
      setCurrentSeller(seller);
      setCurrentTime(0);
      setDuration(0);

      audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
    } else {
      // If it's the same track, toggle play/pause
      if (audioRef.current.paused) {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrack]);


  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    } else {
      audioRef.current.pause();
    }
    // State update is handled by event listeners
  }, [currentTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current && isFinite(time)) {
      audioRef.current.currentTime = time;
      setCurrentTime(time); // Optimistic update
    }
  }, []);

  const setVolumeCallback = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    setVolume(clampedVolume); // Update state regardless for UI feedback
    if (clampedVolume > 0 && isMuted) {
      setIsMuted(false);
    } else if (clampedVolume === 0 && !isMuted) {
      setIsMuted(true);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      // Unmute: restore previous volume or default to 0.5 if previous was 0
      const newVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.5;
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(false);
    } else {
      // Mute: store current volume, then set to 0
      previousVolumeRef.current = audioRef.current.volume;
      audioRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted]);

  const value: AudioContextType = {
    currentTrack,
    currentSeller,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    loadTrack,
    togglePlayPause,
    toggleMute,
    seek,
    setVolume: setVolumeCallback,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}; 