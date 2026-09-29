import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { YOUTUBE_MEDITATIONS, YouTubeMeditation } from "../../src/data/youtubeMeditations";
import { Ionicons } from "@expo/vector-icons";

export default function YouTubeTabScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Todas" },
    { id: "beginner", label: "Principiante" },
    { id: "sleep", label: "Sueño" },
    { id: "anxiety", label: "Ansiedad" },
    { id: "focus", label: "Enfoque" },
  ];

  const filteredVideos =
    selectedCategory === "all"
      ? YOUTUBE_MEDITATIONS
      : YOUTUBE_MEDITATIONS.filter((v) => v.category === selectedCategory);

  const handlePressVideo = (video: YouTubeMeditation) => {
    router.push({
      pathname: "/youtube/[id]" as any,
      params: {
        id: video.id,
        videoId: video.videoId,
        title: video.title,
        description: video.description,
        author: video.author,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Videos de Meditación 📺</Text>
          <Text style={styles.subtitle}>Canal recomendado: Iván Donalson</Text>
        </View>

        {/* Filtros de Categoría */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                selectedCategory === cat.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Videos */}
        <View style={styles.listContainer}>
          {filteredVideos.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handlePressVideo(item)}
            >
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
                <View style={styles.playButtonOverlay}>
                  <Ionicons name="play" size={24} color="#ffffff" />
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.authorRow}>
                  <Ionicons name="videocam-outline" size={14} color="#6366f1" />
                  <Text style={styles.authorText}>{item.author}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    maxHeight: 50,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1e293b",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  thumbnailContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#000000",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#cbd5e1",
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorText: {
    fontSize: 12,
    color: "#818cf8",
    marginLeft: 6,
    fontWeight: "600",
  },
});
