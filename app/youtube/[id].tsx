import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

export default function YouTubePlayerScreen() {
  const { videoId, title, description, author } = useLocalSearchParams();
  const router = useRouter();
  const [playing, setPlaying] = useState(true);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const videoIdStr = typeof videoId === "string" ? videoId : "86YLhUGdSWg";
  const titleStr = typeof title === "string" ? title : "Meditación Guiada";
  const descStr = typeof description === "string" ? description : "Sesión de bienestar y relajación.";
  const authorStr = typeof author === "string" ? author : "Iván Donalson";

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón para volver */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-down" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Video Meditación</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Reproductor de YouTube */}
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={width * 0.5625} // Relación de aspecto 16:9
            play={playing}
            videoId={videoIdStr}
            onChangeState={onStateChange}
          />
        </View>

        {/* Información del Video */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{titleStr}</Text>
          <View style={styles.authorRow}>
            <Ionicons name="videocam" size={16} color="#6366f1" />
            <Text style={styles.authorText}>{authorStr}</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionHeading}>Acerca de esta sesión</Text>
          <Text style={styles.description}>{descStr}</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  content: {
    paddingBottom: 40,
  },
  playerContainer: {
    width: "100%",
    backgroundColor: "#000000",
    marginBottom: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  authorText: {
    fontSize: 14,
    color: "#94a3b8",
    marginLeft: 6,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#1e293b",
    marginVertical: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e2e8f0",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 22,
  },
});
