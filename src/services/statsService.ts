import AsyncStorage from "@react-native-async-storage/async-storage";

const STATS_KEY = "@meditation_user_stats";

export interface UserStats {
  streak: number;
  totalMinutes: number;
  sessionsCount: number;
  lastDate: string | null;
}

const DEFAULT_STATS: UserStats = {
  streak: 3, // Default inicial para que no empiece en 0
  totalMinutes: 25,
  sessionsCount: 4,
  lastDate: null,
};

export const getStats = async (): Promise<UserStats> => {
  try {
    const data = await AsyncStorage.getItem(STATS_KEY);
    if (!data) return DEFAULT_STATS;
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer estadísticas:", error);
    return DEFAULT_STATS;
  }
};

export const recordSession = async (durationSeconds: number): Promise<UserStats> => {
  try {
    const currentStats = await getStats();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const addedMinutes = Math.round(durationSeconds / 60);
    const newTotalMinutes = currentStats.totalMinutes + addedMinutes;
    const newSessionsCount = currentStats.sessionsCount + 1;

    let newStreak = currentStats.streak;
    if (currentStats.lastDate !== today) {
      if (currentStats.lastDate) {
        const last = new Date(currentStats.lastDate);
        const now = new Date(today);
        const diffTime = Math.abs(now.getTime() - last.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1; // Se rompió la racha
        }
      } else {
        newStreak = Math.max(1, currentStats.streak);
      }
    }

    const updatedStats: UserStats = {
      streak: newStreak,
      totalMinutes: newTotalMinutes,
      sessionsCount: newSessionsCount,
      lastDate: today,
    };

    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
    return updatedStats;
  } catch (error) {
    console.error("Error al registrar sesión:", error);
    return await getStats();
  }
};
