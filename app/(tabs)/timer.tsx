import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalAudio } from "../../src/context/AudioContext";
import { recordSession } from "../../src/services/statsService";
import { fetchMeditationMusic, JamendoTrack } from "../../src/services/jamendoService";
import { playTibetanBowl } from "../../src/services/soundService";

export default function TimerScreen() {
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // ID de la pista de la API seleccionada (o null para silencio)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [jamendoTracks, setJamendoTracks] = useState<JamendoTrack[]>([]);
  const [loadingMusic, setLoadingMusic] = useState<boolean>(true);

  const router = useRouter();
  const ambientPlayer = useGlobalAudio();

  const durations = [3, 5, 10, 15, 20, 30];

  // Cargar música de la API al montar
  useEffect(() => {
    const loadMusic = async () => {
      setLoadingMusic(true);
      const tracks = await fetchMeditationMusic("ambient", 10);
      setJamendoTracks(tracks);
      setLoadingMusic(false);
    };
    loadMusic();
  }, []);

  // 1. Sincronizar el tiempo restante si cambia la duración elegida y el reloj no está activo
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(durationMinutes * 60);
    }
  }, [durationMinutes]);

  // 2. Intervalo de la cuenta regresiva del temporizador
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Al finalizar el tiempo: detenemos el estado, el audio, reproducimos cuenco y registramos la sesión
      setIsRunning(false);
      ambientPlayer.stopAudio();
      playTibetanBowl();
      recordSession(durationMinutes * 60);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // 3. Manejar la selección de silencio o pista de la API
  const handleSelectTrack = async (id: string | null, url?: string, title?: string) => {
    setSelectedTrackId(id);

    if (id === null) {
      await ambientPlayer.stopAudio();
    } else if (url && title) {
      if (isRunning) {
        await ambientPlayer.playAudio(url, title, true);
      }
    }
  };

  // 4. Iniciar o pausar el temporizador junto con el audio
  const toggleTimer = async () => {
    if (!isRunning) {
      setIsRunning(true);
      playTibetanBowl(); // Sonido de cuenco al iniciar

      // Si hay una pista seleccionada, la activamos en bucle
      if (selectedTrackId !== null) {
        const trackObj = jamendoTracks.find((t) => t.id === selectedTrackId);
        if (trackObj?.audio) {
          await ambientPlayer.playAudio(trackObj.audio, trackObj.name, true);
        }
      }
    } else {
      setIsRunning(false);
      await ambientPlayer.stopAudio();
    }
  };

  // 5. Reiniciar el temporizador
  const resetTimer = async () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
    await ambientPlayer.stopAudio();
  };

  // 6. Formatear segundos a mm:ss con dos dígitos fijos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Temporizador de Meditación</Text>
        <Text style={styles.subtitle}>
          Encuentra tu propio espacio de silencio
        </Text>

        {/* Círculo de Tiempo */}
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>
            {isRunning ? "Meditando..." : "Listo para empezar"}
          </Text>
          {ambientPlayer.currentTitle && (
            <Text style={styles.playingText} numberOfLines={1}>
              🎵 {ambientPlayer.currentTitle}
            </Text>
          )}
        </View>

        {/* Selector de Duración (visible solo cuando el temporizador no está corriendo) */}
        {!isRunning && (
          <View style={styles.durationSection}>
            <Text style={styles.sectionTitle}>Duración (minutos)</Text>
            <View style={styles.durationGrid}>
              {durations.map((mins) => (
                <TouchableOpacity
                  key={mins}
                  style={[
                    styles.durationButton,
                    durationMinutes === mins && styles.durationButtonActive,
                  ]}
                  onPress={() => setDurationMinutes(mins)}
                >
                  <Text
                    style={[
                      styles.durationButtonText,
                      durationMinutes === mins &&
                        styles.durationButtonTextActive,
                    ]}
                  >
                    {mins}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Selector de Música Ambiental (API) */}
        <View style={styles.ambientSection}>
          <Text style={styles.sectionTitle}>Música Ambiental</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ambientScroll}
          >
            {/* Silencio */}
            <TouchableOpacity
              style={[
                styles.ambientCard,
                selectedTrackId === null && styles.ambientCardActive,
              ]}
              onPress={() => handleSelectTrack(null)}
            >
              <View style={styles.cardIconContainer}>
                <Ionicons name="volume-mute-outline" size={24} color="#f8fafc" />
              </View>
              <Text style={styles.ambientText}>Silencio</Text>
            </TouchableOpacity>

            {/* Pistas de la API de Jamendo */}
            {loadingMusic ? (
              <View style={styles.loaderCard}>
                <ActivityIndicator size="small" color="#6366f1" />
              </View>
            ) : (
              jamendoTracks.map((track) => (
                <TouchableOpacity
                  key={track.id}
                  style={[
                    styles.ambientCard,
                    selectedTrackId === track.id && styles.ambientCardActive,
                  ]}
                  onPress={() => handleSelectTrack(track.id, track.audio, track.name)}
                >
                  <Image source={{ uri: track.image }} style={styles.cardImage} />
                  <Text style={styles.ambientText} numberOfLines={1}>
                    {track.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Botones de Control */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={toggleTimer}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isRunning ? "pause" : "play"}
              size={28}
              color="#ffffff"
            />
            <Text style={styles.mainButtonText}>
              {isRunning ? "Pausar" : "Comenzar"}
            </Text>
          </TouchableOpacity>

          {isRunning && (
            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
              <Ionicons name="refresh" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f8fafc",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
    marginBottom: 24,
    textAlign: "center",
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "rgba(99, 102, 241, 0.05)",
    padding: 10,
  },
  timerText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
  },
  timerLabel: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 4,
  },
  playingText: {
    fontSize: 12,
    color: "#818cf8",
    marginTop: 4,
    textAlign: "center",
    maxWidth: "90%",
  },
  durationSection: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 12,
  },
  durationGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#1e293b",
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  durationButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  durationButtonText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  durationButtonTextActive: {
    color: "#ffffff",
  },
  ambientSection: {
    width: "100%",
    marginBottom: 24,
  },
  ambientScroll: {
    paddingVertical: 4,
  },
  ambientCard: {
    width: 95,
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  ambientCardActive: {
    borderColor: "#6366f1",
    backgroundColor: "rgba(99, 102, 241, 0.15)",
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  cardImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#334155",
    marginBottom: 6,
  },
  loaderCard: {
    width: 95,
    height: 80,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    marginRight: 10,
  },
  ambientText: {
    color: "#cbd5e1",
    fontSize: 11,
    textAlign: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    flexDirection: "row",
    backgroundColor: "#6366f1",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  resetButton: {
    marginLeft: 16,
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#334155",
  },
});
