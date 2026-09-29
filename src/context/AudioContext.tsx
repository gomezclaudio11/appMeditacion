import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { setAudioModeAsync } from "expo-audio";

interface AudioContextType {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  currentTitle: string | null;
  playAudio: (uri: string, title?: string, loop?: boolean) => Promise<void>;
  togglePlayPause: () => void;
  stopAudio: () => Promise<void>;
  seekTo: (seconds: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioPlayer = useAudioPlayer();
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);

  // Configurar modo de audio global para reproducción en modo silencio
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    }).catch((err) => console.error("Error al configurar AudioMode:", err));
  }, []);

  const playAudio = async (uri: string, title?: string, loop: boolean = false) => {
    if (title) setCurrentTitle(title);
    await audioPlayer.loadAndPlaySound(uri, loop);
  };

  const stopAudio = async () => {
    setCurrentTitle(null);
    await audioPlayer.stopSound();
  };

  return (
    <AudioContext.Provider
      value={{
        ...audioPlayer,
        currentTitle,
        playAudio,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useGlobalAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useGlobalAudio must be used within an AudioProvider");
  }
  return context;
};
