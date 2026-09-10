/*
import { useState, useEffect } from 'react';
import { useAudioPlayer as useExpoAudioPlayer } from 'expo-audio';

export function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlaySound = async (uri: string) => {
    try {
      setIsLoading(true);
      if (sound) {
        await sound.unloadAsync();
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsPlaying(true);
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const seekTo = async (millis: number) => {
    if (!sound) return;
    await sound.setPositionAsync(millis);
  };

  const stopSound = async () => {
    if (!sound) return;
    await sound.stopAsync();
    setIsPlaying(false);
    setPosition(0);
  };

  return {
    loadAndPlaySound,
    togglePlayPause,
    seekTo,
    stopSound,
    isPlaying,
    position,
    duration,
    isLoading,
  };
}
*/
import {
  AudioSource,
  setAudioModeAsync,
  useAudioPlayer as useExpoAudioPlayer,
} from "expo-audio";
import { useEffect, useState } from "react";

export function useAudioPlayer() {
  const [source, setSource] = useState<AudioSource | null>(null);
  const player = useExpoAudioPlayer(source);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Configurar modo de audio global (reproducción en segundo plano y modo silencio)
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    }).catch((err) => console.error("Error al configurar AudioMode:", err));
  }, []);

  // Suscripción a eventos de estado del reproductor
  useEffect(() => {
    if (!player) return;

    // Actualizar estados reactivos según el reproductor
    setIsPlaying(player.playing);
    setDuration(player.duration ? player.duration * 1000 : 0); // Convertido a milisegundos
    setPosition(player.currentTime ? player.currentTime * 1000 : 0);

    const statusSubscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        setIsPlaying(status.playing);
        setPosition(Math.floor(status.currentTime * 1000));
        setDuration(Math.floor(status.duration * 1000));
        setIsLoading(status.isBuffering);

        if (status.didJustFinish) {
          setIsPlaying(false);
          setPosition(0);
        }
      },
    );

    return () => {
      statusSubscription.remove();
    };
  }, [player]);

  const loadAndPlaySound = (uri: string) => {
    try {
      setIsLoading(true);
      setSource({ uri });
      player.play();
    } catch (error) {
      console.error("Error al reproducir audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!player) return;
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const seekTo = (millis: number) => {
    if (!player) return;
    // expo-audio trabaja en segundos, convertimos desde milisegundos
    player.seekTo(millis / 1000);
  };

  const stopSound = () => {
    if (!player) return;
    player.pause();
    player.seekTo(0);
    setIsPlaying(false);
    setPosition(0);
  };

  return {
    loadAndPlaySound,
    togglePlayPause,
    seekTo,
    stopSound,
    isPlaying,
    position,
    duration,
    isLoading,
  };
}
