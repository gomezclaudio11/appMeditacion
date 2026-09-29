import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStats, UserStats } from '../../src/services/statsService';
import { useFocusEffect } from 'expo-router';

export default function ProfileScreen() {
  const [stats, setStats] = useState<UserStats>({
    streak: 3,
    totalMinutes: 25,
    sessionsCount: 4,
    lastDate: null,
  });

  useFocusEffect(
    useCallback(() => {
      loadUserStats();
    }, [])
  );

  const loadUserStats = async () => {
    const data = await getStats();
    setStats(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#6366f1" />
          </View>
          <Text style={styles.name}>Meditador Consciente</Text>
          <Text style={styles.email}>camino.interior@app.com</Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={28} color="#f59e0b" />
            <Text style={styles.statNumber}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Días de racha</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={28} color="#3b82f6" />
            <Text style={styles.statNumber}>{stats.totalMinutes}</Text>
            <Text style={styles.statLabel}>Minutos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={28} color="#10b981" />
            <Text style={styles.statNumber}>{stats.sessionsCount}</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
        </View>

        {/* Frase del Día */}
        <View style={styles.quoteCard}>
          <Ionicons name="chatbubble-outline" size={24} color="#6366f1" style={{ marginBottom: 8 }} />
          <Text style={styles.quoteText}>
            "La paz viene de dentro. No la busques fuera."
          </Text>
          <Text style={styles.quoteAuthor}>— Buda</Text>
        </View>

        {/* Sección de Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Sobre tu App de Meditación</Text>
          <Text style={styles.infoDescription}>
            Estás utilizando la versión 1.1.0. Disfruta de tus meditaciones diarias, cultiva la calma interior y registra tu progreso automáticamente.
          </Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  email: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  quoteCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#e2e8f0',
    textAlign: 'center',
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
});
