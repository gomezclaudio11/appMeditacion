import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from '../../src/hooks/useAudioPlayer';
import { AMBIENT_SOUNDS } from '../../src/data/meditations';

export default function TimerScreen() {
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedAmbient, setSelectedAmbient] = useState<string | null>(null);

  const ambientPlayer = useAudioPlayer();

  const durations = [3, 5, 10, 15, 20, 30];

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(durationMinutes * 60);
    }
  }, [durationMinutes]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      ambientPlayer.stopSound();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = async () => {
    if (!isRunning) {
      setIsRunning(true);
      if (selectedAmbient) {
        const soundObj = AMBIENT_SOUNDS.find((s) => s.id === selectedAmbient);
        if (soundObj) {
          await ambientPlayer.loadAndPlaySound(soundObj.audioUrl);
        }
      }
    } else {
      setIsRunning(false);
      await ambientPlayer.stopSound();
    }
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
    await ambientPlayer.stopSound();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Temporizador de Meditación</Text>
        <Text style={styles.subtitle}>Encuentra tu propio espacio de silencio</Text>

        {/* Círculo de Tiempo */}
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>
            {isRunning ? 'Meditando...' : 'Listo para empezar'}
          </Text>
        </View>

        {/* Selector de Duración (solo si no está corriendo) */}
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
                  onPress={() => setDurationMinutes(mins)}>
                  <Text
                    style={[
                      styles.durationButtonText,
                      durationMinutes === mins && styles.durationButtonTextActive,
                    ]}>
                    {mins}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Selector de Sonido Ambiental */}
        <View style={styles.ambientSection}>
          <Text style={styles.sectionTitle}>Sonido Ambiental (Opcional)</Text>
          <View style={styles.ambientRow}>
            <TouchableOpacity
              style={[
                styles.ambientCard,
                selectedAmbient === null && styles.ambientCardActive,
              ]}
              onPress={() => setSelectedAmbient(null)}>
              <Ionicons name="volume-mute-outline" size={24} color="#f8fafc" />
              <Text style={styles.ambientText}>Silencio</Text>
            </TouchableOpacity>
            {AMBIENT_SOUNDS.map((sound) => (
              <TouchableOpacity
                key={sound.id}
                style={[
                  styles.ambientCard,
                  selectedAmbient === sound.id && styles.ambientCardActive,
                ]}
                onPress={() => setSelectedAmbient(sound.id)}>
                <Ionicons
                  name={
                    sound.id === 'rain'
                      ? 'rainy-outline'
                      : sound.id === 'forest'
                      ? 'leaf-outline'
                      : 'water-outline'
                  }
                  size={24}
                  color="#f8fafc"
                />
                <Text style={styles.ambientText}>{sound.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botones de Control */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={toggleTimer}
            activeOpacity={0.8}>
            <Ionicons
              name={isRunning ? 'pause' : 'play'}
              size={28}
              color="#ffffff"
            />
            <Text style={styles.mainButtonText}>
              {isRunning ? 'Pausar' : 'Comenzar'}
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
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 30,
    textAlign: 'center',
  },
  timerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  timerText: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timerLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 6,
  },
  durationSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  durationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  durationButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  durationButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  durationButtonTextActive: {
    color: '#ffffff',
  },
  ambientSection: {
    width: '100%',
    marginBottom: 30,
  },
  ambientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ambientCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ambientCardActive: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  ambientText: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 6,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resetButton: {
    marginLeft: 16,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#334155',
  },
});
