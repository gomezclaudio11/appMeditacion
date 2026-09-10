import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MEDITATIONS } from '../../src/data/meditations';
import { useAudioPlayer } from '../../src/hooks/useAudioPlayer';

export default function PlayerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const meditation = MEDITATIONS.find((m) => m.id === id) || MEDITATIONS[0];
  const {
    loadAndPlaySound,
    togglePlayPause,
    isPlaying,
    position,
    duration,
    isLoading,
  } = useAudioPlayer();

  useEffect(() => {
    if (meditation?.audioUrl) {
      loadAndPlaySound(meditation.audioUrl);
    }
  }, [id]);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón atrás */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditación Guiada</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Imagen Principal */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: meditation.imageUrl }} style={styles.image} />
      </View>

      {/* Información */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{meditation.title}</Text>
        <Text style={styles.author}>Por {meditation.author}</Text>
        <Text style={styles.description}>{meditation.description}</Text>
      </View>

      {/* Progreso de Audio */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${
                  duration > 0 ? (position / duration) * 100 : 0
                }%`,
              },
            ]}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controles de Reproducción */}
      <View style={styles.controlsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6366f1" />
        ) : (
          <TouchableOpacity
            style={styles.playButton}
            onPress={togglePlayPause}
            activeOpacity={0.8}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color="#ffffff"
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  progressContainer: {
    width: '100%',
    marginVertical: 10,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  controlsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
