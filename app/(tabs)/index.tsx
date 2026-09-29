import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MEDITATIONS } from '../../src/data/meditations';
import { Meditation } from '../../src/types/meditation';
import { Ionicons } from '@expo/vector-icons';
import { fetchMeditationMusic } from '../../src/services/jamendoService';

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [meditationsList, setMeditationsList] = useState<Meditation[]>(MEDITATIONS);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    { id: 'all', label: 'Todas' },
    { id: 'beginner', label: 'Principiante' },
    { id: 'sleep', label: 'Sueño' },
    { id: 'anxiety', label: 'Ansiedad' },
    { id: 'focus', label: 'Enfoque' },
  ];

  useEffect(() => {
    const loadApiMeditations = async () => {
      setLoading(true);
      const tracks = await fetchMeditationMusic('meditation', 15);
      if (tracks && tracks.length > 0) {
        const dynamicMeditations: Meditation[] = tracks.map((track, index) => {
          const categoriesList: ("beginner" | "sleep" | "focus" | "anxiety")[] = ['beginner', 'sleep', 'focus', 'anxiety'];
          return {
            id: track.id,
            title: track.name,
            description: `Sesión guiada por ${track.artist_name}. Encuentra calma y bienestar.`,
            duration: track.duration > 0 ? track.duration : 300,
            audioUrl: track.audio,
            imageUrl: track.image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
            category: categoriesList[index % categoriesList.length],
            author: track.artist_name,
          };
        });
        setMeditationsList(dynamicMeditations);
      } else {
        setMeditationsList(MEDITATIONS);
      }
      setLoading(false);
    };

    loadApiMeditations();
  }, []);

  const filteredMeditations =
    selectedCategory === 'all'
      ? meditationsList
      : meditationsList.filter((m) => m.category === selectedCategory);

  const handlePressMeditation = (meditation: Meditation) => {
    router.push({
      pathname: '/player/[id]',
      params: {
        id: meditation.id,
        title: meditation.title,
        description: meditation.description,
        audioUrl: meditation.audioUrl,
        imageUrl: meditation.imageUrl,
        author: meditation.author,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header de Bienvenida */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Paz Interior ✨</Text>
          <Text style={styles.subtitle}>¿Qué te gustaría meditar hoy?</Text>
        </View>

        {/* Filtros de Categoría */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                selectedCategory === cat.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Meditaciones */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loaderText}>Cargando meditaciones...</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredMeditations.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => handlePressMeditation(item)}>
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardOverlay} />
                <View style={styles.cardContent}>
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>
                      {Math.round(item.duration / 60)} min
                    </Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.authorRow}>
                    <Ionicons name="mic-outline" size={14} color="#d1d5db" />
                    <Text style={styles.authorText}>{item.author}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
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
    backgroundColor: '#1e293b',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  loaderContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loaderText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#1e293b',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: '#d1d5db',
    marginLeft: 6,
  },
});
