import { CEFRLevel, OxfordWord, UserStats, WordProgress, WordStatus } from '../types';
import { OXFORD_WORDS } from '../data/oxfordWords';

const PROGRESS_STORAGE_KEY = 'oxford_3000_progress_v1';
const STATS_STORAGE_KEY = 'oxford_3000_stats_v1';

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultStats(): UserStats {
  const today = getTodayDateString();
  return {
    streak: 1,
    lastActiveDate: today,
    weeklyActivity: { [today]: true },
    dailyTarget: 10,
    currentLevel: 'A1',
    voiceSpeed: 0.9,
    soundEnabled: true,
    todayStudiedCount: 0,
    todayReviewedCount: 0,
    todayQuizCorrect: 0,
    todayQuizTotal: 0
  };
}

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return getDefaultStats();
    const stats: UserStats = JSON.parse(raw);
    const today = getTodayDateString();

    // Check if new day: reset daily counts if date changed
    if (stats.lastActiveDate !== today) {
      const lastDate = new Date(stats.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Consecutive day
        stats.streak = (stats.streak || 0) + 1;
      } else if (diffDays > 2) {
        // More than 2 days gap - gentle reset to 1
        stats.streak = 1;
      }
      // If diffDays is 2 (missed 1 day), we allow a friendly streak shield / keep current streak!

      stats.lastActiveDate = today;
      stats.weeklyActivity = { ...(stats.weeklyActivity || {}), [today]: true };
      stats.todayStudiedCount = 0;
      stats.todayReviewedCount = 0;
      stats.todayQuizCorrect = 0;
      stats.todayQuizTotal = 0;
      saveUserStats(stats);
    }
    return stats;
  } catch (e) {
    return getDefaultStats();
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function loadWordProgressMap(): Record<string, WordProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveWordProgressMap(map: Record<string, WordProgress>): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save word progress', e);
  }
}

export function getWordProgress(wordId: string, map: Record<string, WordProgress>): WordProgress {
  if (map[wordId]) return map[wordId];
  return {
    wordId,
    status: 'NEW',
    timesReviewed: 0,
    correctStreak: 0,
    mistakesCount: 0,
    intervalDays: 0,
    isFavorite: false,
    isStruggled: false
  };
}

/**
 * Update SRS intervals after rating or quiz answer
 */
export function updateWordSRS(
  wordId: string,
  result: 'dont_know' | 'learning' | 'know' | 'mastered',
  currentMap: Record<string, WordProgress>
): { updatedMap: Record<string, WordProgress>; updatedItem: WordProgress } {
  const current = getWordProgress(wordId, currentMap);
  const today = getTodayDateString();

  let nextStatus: WordStatus = current.status;
  let nextInterval = current.intervalDays;
  let correctStreak = current.correctStreak;
  let mistakesCount = current.mistakesCount;

  if (result === 'dont_know') {
    nextStatus = 'LEARNING';
    nextInterval = 0; // review today
    correctStreak = 0;
    mistakesCount += 1;
  } else if (result === 'learning') {
    nextStatus = 'LEARNING';
    nextInterval = 1;
    correctStreak = Math.max(1, correctStreak);
  } else if (result === 'know') {
    correctStreak += 1;
    if (correctStreak >= 3) {
      nextStatus = 'MASTERED';
      nextInterval = 7;
    } else {
      nextStatus = 'REVIEW';
      nextInterval = 3;
    }
  } else if (result === 'mastered') {
    correctStreak += 2;
    nextStatus = 'MASTERED';
    nextInterval = current.intervalDays > 7 ? 30 : 14;
  }

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + nextInterval);
  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(nextDate.getDate()).padStart(2, '0');
  const nextReviewDate = `${nextYear}-${nextMonth}-${nextDay}`;

  const isStruggled = mistakesCount >= 2 || (result === 'dont_know' && mistakesCount >= 1);

  const updatedItem: WordProgress = {
    ...current,
    status: nextStatus,
    timesReviewed: current.timesReviewed + 1,
    correctStreak,
    mistakesCount,
    lastStudiedDate: today,
    nextReviewDate,
    intervalDays: nextInterval,
    isStruggled
  };

  const updatedMap = {
    ...currentMap,
    [wordId]: updatedItem
  };

  saveWordProgressMap(updatedMap);
  return { updatedMap, updatedItem };
}

export function toggleFavoriteWord(wordId: string, currentMap: Record<string, WordProgress>): Record<string, WordProgress> {
  const item = getWordProgress(wordId, currentMap);
  const updatedItem = { ...item, isFavorite: !item.isFavorite };
  const updatedMap = { ...currentMap, [wordId]: updatedItem };
  saveWordProgressMap(updatedMap);
  return updatedMap;
}

/**
 * Returns today's vocabulary batch based on user level and daily target.
 */
export function getDailyWordsBatch(
  allWords: OxfordWord[],
  progressMap: Record<string, WordProgress>,
  level: CEFRLevel,
  targetCount: number = 10
): OxfordWord[] {
  // First, get words in current level
  const levelWords = allWords.filter((w) => w.level === level);

  // Filter words that are already NEW or in LEARNING
  const newWords = levelWords.filter((w) => {
    const p = progressMap[w.id];
    return !p || p.status === 'NEW';
  });

  const learningWords = levelWords.filter((w) => {
    const p = progressMap[w.id];
    return p && p.status === 'LEARNING';
  });

  // Combine to fill target count
  const batch: OxfordWord[] = [];

  // Take learning words first to reinforce
  for (const w of learningWords) {
    if (batch.length < Math.min(3, targetCount)) {
      batch.push(w);
    }
  }

  // Then fill with new words
  for (const w of newWords) {
    if (batch.length < targetCount && !batch.some((b) => b.id === w.id)) {
      batch.push(w);
    }
  }

  // If still not full, include others in level
  if (batch.length < targetCount) {
    for (const w of levelWords) {
      if (batch.length < targetCount && !batch.some((b) => b.id === w.id)) {
        batch.push(w);
      }
    }
  }

  return batch;
}

/**
 * Get words that are due for review today according to spaced repetition
 */
export function getDueReviewWords(allWords: OxfordWord[], progressMap: Record<string, WordProgress>): OxfordWord[] {
  const today = getTodayDateString();
  return allWords.filter((w) => {
    const p = progressMap[w.id];
    if (!p) return false;
    if (p.status === 'REVIEW' || p.status === 'LEARNING') {
      if (!p.nextReviewDate || p.nextReviewDate <= today) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Get words that the user struggled with (high mistake count or marked don't know)
 */
export function getStruggledWords(allWords: OxfordWord[], progressMap: Record<string, WordProgress>): OxfordWord[] {
  return allWords.filter((w) => {
    const p = progressMap[w.id];
    return p && (p.isStruggled || p.mistakesCount >= 2);
  }).sort((a, b) => {
    const ma = progressMap[a.id]?.mistakesCount || 0;
    const mb = progressMap[b.id]?.mistakesCount || 0;
    return mb - ma;
  });
}

/**
 * Calculate level mastery progress accurately
 * Not just opened count, but learned and verified via review/quiz.
 */
export function calculateLevelStats(words: OxfordWord[], progressMap: Record<string, WordProgress>) {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];
  const stats: Record<CEFRLevel, { total: number; mastered: number; learning: number; review: number; newCount: number; percentage: number }> = {
    A1: { total: 0, mastered: 0, learning: 0, review: 0, newCount: 0, percentage: 0 },
    A2: { total: 0, mastered: 0, learning: 0, review: 0, newCount: 0, percentage: 0 },
    B1: { total: 0, mastered: 0, learning: 0, review: 0, newCount: 0, percentage: 0 },
    B2: { total: 0, mastered: 0, learning: 0, review: 0, newCount: 0, percentage: 0 }
  };

  levels.forEach((lvl) => {
    const lvlWords = words.filter((w) => w.level === lvl);
    stats[lvl].total = lvlWords.length;

    lvlWords.forEach((w) => {
      const p = progressMap[w.id];
      if (!p || p.status === 'NEW') {
        stats[lvl].newCount++;
      } else if (p.status === 'MASTERED') {
        stats[lvl].mastered++;
      } else if (p.status === 'REVIEW') {
        stats[lvl].review++;
      } else if (p.status === 'LEARNING') {
        stats[lvl].learning++;
      }
    });

    if (stats[lvl].total > 0) {
      // Meaningful weighted progress formula:
      // Mastered counts for 100%, Review counts for 75%, Learning counts for 40%
      const points = stats[lvl].mastered * 1.0 + stats[lvl].review * 0.75 + stats[lvl].learning * 0.4;
      stats[lvl].percentage = Math.min(100, Math.round((points / stats[lvl].total) * 100));
    }
  });

  return stats;
}
