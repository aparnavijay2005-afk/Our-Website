"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  progress: number; // percentage (0 - 100)
  currentTime: number; // seconds
  duration: number; // seconds
  tracks: Track[];
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  seek: (percent: number) => void;
  muted: boolean;
  toggleMute: () => void;
}

// Add your own music files to public/audio/
// Place "Snooze" by SZA as: public/audio/snooze-sza.mp3
const PLACEHOLDER_TRACKS: Track[] = [
  {
    id: "1",
    title: "Snooze",
    artist: "SZA",
    url: asset("/audio/snooze-sza.mp3"),
    duration: "3:21",
  },
];

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolumeState] = useState(0.5); // Default 50%
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio();
    // Default to first track (paused)
    setCurrentTrack(PLACEHOLDER_TRACKS[0]);
    audioRef.current.src = PLACEHOLDER_TRACKS[0].url;
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  // Update audio volume when volume/muted states change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      audioRef.current.src = track.url;
      audioRef.current.load();
      setCurrentTrack(track);
      setIsPlaying(true);
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay block or playback issue: ", err);
        setIsPlaying(false);
      });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audioRef.current.play().catch((err) => {
        // e.g. autoplay blocked or the audio file is missing: don't show a "playing" UI with no sound
        console.warn("Playback failed or was blocked.", err);
        setIsPlaying(false);
      });
    }
  };

  const nextTrack = () => {
    const currentIndex = PLACEHOLDER_TRACKS.findIndex((t) => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % PLACEHOLDER_TRACKS.length;
    playTrack(PLACEHOLDER_TRACKS[nextIndex]);
  };

  const prevTrack = () => {
    const currentIndex = PLACEHOLDER_TRACKS.findIndex((t) => t.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? PLACEHOLDER_TRACKS.length - 1 : currentIndex - 1;
    playTrack(PLACEHOLDER_TRACKS[prevIndex]);
  };

  const setVolume = (v: number) => {
    const newVol = Math.max(0, Math.min(1, v));
    setVolumeState(newVol);
    if (newVol > 0) setMuted(false);
  };

  const seek = (percent: number) => {
    if (!audioRef.current || !duration) return;
    const seekTime = (percent / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setProgress(percent);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        volume,
        progress,
        currentTime,
        duration,
        tracks: PLACEHOLDER_TRACKS,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        setVolume,
        seek,
        muted,
        toggleMute,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
