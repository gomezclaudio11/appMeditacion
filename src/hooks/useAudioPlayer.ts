import { AudioPlayer, AudioStatus, createAudioPlayer } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { recordSession } from "../services/statsService";
import { playTibetanBowl } from "../services/soundService";

/**
 * Hook personalizado para controlar audio en meditaciones y temporizadores.
 */
export const useAudioPlayer = () => {
  // Referencia a la instancia nativa del reproductor
  const playerRef = useRef<AudioPlayer | null>(null);

  // Estados reactivos para la interfaz
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Limpieza al salir de la pantalla
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }
    };
  }, []);

  // Intervalo para actualizar el tiempo mientras reproduce
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (isPlaying && playerRef.current) {
      intervalId = setInterval(() => {
        if (playerRef.current) {
          const currentPos = playerRef.current.currentTime || 0;
          const totalDur = playerRef.current.duration || 0;

          setCurrentTime(currentPos);
          if (totalDur > 0) {
            setDuration(totalDur);
          }
        }
      }, 500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  /**
   * Carga y reproduce una pista de audio.
   * @param uri URL o ruta del archivo de audio.
   * @param loop Opcional: define si el sonido debe repetirse en bucle (ideal para sonidos de fondo).
   */
  const loadAndPlaySound = async (
    uri: string,
    loop: boolean = false,
  ): Promise<void> => {
    try {
      setIsLoading(true);

      // Reproducir sonido de cuenco tibetano al iniciar la sesión (si no es loop)
      if (!loop) {
        playTibetanBowl();
      }

      // Si ya existía un reproductor, lo liberamos
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }

      // Creamos la instancia del reproductor
      const player = createAudioPlayer({ uri });
      playerRef.current = player;

      // Si se solicita reproducción en bucle, lo configuramos
      if (loop && "loop" in player) {
        player.loop = true;
      }

      // Escuchamos los cambios del reproductor nativo
      player.addListener("playbackStatusUpdate", (status: AudioStatus) => {
        if (typeof status.playing === "boolean") {
          setIsPlaying(status.playing);
        }
        if (typeof status.currentTime === "number") {
          setCurrentTime(status.currentTime);
        }
        if (typeof status.duration === "number" && status.duration > 0) {
          setDuration(status.duration);
        }
        if (status.didJustFinish) {
          setIsPlaying(false);
          setCurrentTime(0);
          // Si no es loop (es una meditación guiada), reproducimos cuenco de fin y registramos la sesión
          if (!loop) {
            playTibetanBowl();
            const finalDuration = status.duration && status.duration > 0 ? status.duration : 300;
            recordSession(finalDuration);
          }
        }
      });

      player.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al iniciar el audio:", error);
      setIsLoading(false);
    }
  };

  /**
   * Alterna entre reproducir y pausar.
   */
  const togglePlayPause = (): void => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  /**
   * Detiene el sonido y reinicia su posición a cero.
   */
  const stopSound = async (): Promise<void> => {
    const player = playerRef.current;
    if (!player) return;

    try {
      player.pause();
      player.seekTo(0);
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (error) {
      console.error("Error al detener el sonido con stopSound:", error);
    }
  };

  /**
   * Salta a un segundo determinado.
   */
  const seekTo = (seconds: number): void => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(seconds);
    setCurrentTime(seconds);
  };

  return {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    loadAndPlaySound,
    togglePlayPause,
    stopSound,
    seekTo,
  };
};
