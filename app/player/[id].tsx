import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MEDITATIONS } from "../../src/data/meditations";
import { useAudioPlayer } from "../../src/hooks/useAudioPlayer";
import { Ionicons } from "@expo/vector-icons";

export default function PlayerScreen() {
  const { id, title, description, audioUrl, imageUrl, author } = useLocalSearchParams();
  const router = useRouter();

  const {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    loadAndPlaySound,
    togglePlayPause,
  } = useAudioPlayer();

  const staticMeditation = MEDITATIONS.find((item) => item.id === id);

  const meditation = staticMeditation ?? {
    id: typeof id === 'string' ? id : '1',
    title: typeof title === 'string' ? title : 'Sesión de Meditación',
    description: typeof description === 'string' ? description : 'Sesión guiada',
    audioUrl: typeof audioUrl === 'string' ? audioUrl : '',
    imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
    category: 'beginner',
    author: typeof author === 'string' ? author : 'Jamendo Artist',
  };

  useEffect(() => {
    if (meditation?.audioUrl) {
      loadAndPlaySound(meditation.audioUrl);
    }
  }, [id, meditation?.audioUrl]);

  const formatTime = (timeInSeconds: number) => {
    if (!timeInSeconds || isNaN(timeInSeconds) || timeInSeconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration > 0 ? Math.min(Math.max((currentTime / duration) * 100, 0), 100) : 0;

  if (!meditation || !meditation.audioUrl) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Meditación no encontrada</Text>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-down" size={24} color="#f8fafc" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{meditation.title}</Text>
        <Text style={styles.subtitle}>
          {meditation.description ?? "Sesión de meditación guiada"}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
        ) : (
          <View style={styles.controlsContainer}>
            {/* Barra de progreso */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timerText}>{formatTime(currentTime)}</Text>
                <Text style={styles.timerText}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Botón interactivo de Play / Pausa */}
            <Pressable
              style={({ pressed }) => [
                styles.playButton,
                pressed && styles.playButtonPressed,
              ]}
              onPress={togglePlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="#ffffff"
              />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  loader: {
    marginVertical: 40,
  },
  controlsContainer: {
    width: "100%",
    alignItems: "center",
    maxWidth: 340,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 40,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#1e293b",
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timerText: {
    fontSize: 14,
    color: "#94a3b8",
    fontVariant: ["tabular-nums"],
  },
  playButton: {
    backgroundColor: "#6366f1",
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  errorText: {
    fontSize: 18,
    color: "#f87171",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
