import { AchievementBadge, UserStats, WordProgress } from '../types';

export const BADGES_DEFINITION: Omit<AchievementBadge, 'progress' | 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'first_word',
    title: 'Langkah Pertama',
    description: 'Pelajari kosakata pertamamu di Tutor Mode',
    icon: '🌱',
    category: 'vocab',
    target: 1
  },
  {
    id: 'vocab_10',
    title: 'Antusias Kata',
    description: 'Pelajari minimal 10 kosakata Oxford 3000',
    icon: '📚',
    category: 'vocab',
    target: 10
  },
  {
    id: 'vocab_25',
    title: 'Penjelajah Oxford',
    description: 'Pelajari 25 kosakata dari berbagai level',
    icon: '🎓',
    category: 'vocab',
    target: 25
  },
  {
    id: 'vocab_mastered_5',
    title: 'Memori Tajam',
    description: 'Kuasai (Mastered) 5 kosakata melalui pengulangan berjarak',
    icon: '⭐',
    category: 'vocab',
    target: 5
  },
  {
    id: 'streak_3',
    title: 'Konsisten 3 Hari',
    description: 'Pertahankan streak belajar selama 3 hari beruntun',
    icon: '🔥',
    category: 'streak',
    target: 3
  },
  {
    id: 'streak_7',
    title: 'Juara 1 Minggu',
    description: 'Pertahankan streak belajar selama 7 hari tanpa jeda',
    icon: '🏆',
    category: 'streak',
    target: 7
  },
  {
    id: 'quiz_10',
    title: 'Penembak Jitu Kuis',
    description: 'Jawab 10 soal kuis dengan benar',
    icon: '🎯',
    category: 'quiz',
    target: 10
  },
  {
    id: 'pronounce_pro',
    title: 'Suara Amerika',
    description: 'Dapatkan skor speaking 80% ke atas pada latihan suara',
    icon: '🎤',
    category: 'speaking',
    target: 1
  },
  {
    id: 'sentence_writer',
    title: 'Arsitek Kalimat',
    description: 'Tulis kalimat sendiri menggunakan kosakata target',
    icon: '✍️',
    category: 'vocab',
    target: 3
  },
  {
    id: 'game_master',
    title: 'Juara Word Match',
    description: 'Selesaikan permainan Word Match atau Sentence Scramble',
    icon: '🎮',
    category: 'games',
    target: 1
  },
  {
    id: 'dictation_ace',
    title: 'Telinga Emas',
    description: 'Tebak ejaan kata dengan benar pada Audio Dictation',
    icon: '🎧',
    category: 'games',
    target: 3
  }
];

/**
 * Calculates badges status based on stats and progressMap
 */
export function calculateBadges(
  stats: UserStats,
  progressMap: Record<string, WordProgress>
): AchievementBadge[] {
  const wordsStudied = Object.values(progressMap).filter(
    (p) => p.status !== 'NEW' || p.timesReviewed > 0
  ).length;

  const wordsMastered = Object.values(progressMap).filter(
    (p) => p.status === 'MASTERED'
  ).length;

  const sentencesCount = Object.keys(stats.userSentences || {}).length;
  const gamesPlayed = stats.gamesPlayed || 0;
  const unlockedSet = new Set(stats.unlockedBadges || []);

  const hasGoodSpeaking = Object.values(progressMap).some(
    (p) => (p.lastScore || 0) >= 80
  );

  return BADGES_DEFINITION.map((def) => {
    let currentProgress = 0;

    switch (def.id) {
      case 'first_word':
      case 'vocab_10':
      case 'vocab_25':
        currentProgress = wordsStudied;
        break;
      case 'vocab_mastered_5':
        currentProgress = wordsMastered;
        break;
      case 'streak_3':
      case 'streak_7':
        currentProgress = stats.streak;
        break;
      case 'quiz_10':
        currentProgress = stats.todayQuizCorrect;
        break;
      case 'pronounce_pro':
        currentProgress = hasGoodSpeaking ? 1 : 0;
        break;
      case 'sentence_writer':
        currentProgress = sentencesCount;
        break;
      case 'game_master':
      case 'dictation_ace':
        currentProgress = gamesPlayed;
        break;
      default:
        currentProgress = 0;
    }

    const isUnlocked = unlockedSet.has(def.id) || currentProgress >= def.target;

    return {
      ...def,
      progress: Math.min(currentProgress, def.target),
      isUnlocked,
      unlockedAt: isUnlocked ? 'Aktif' : undefined
    };
  });
}
