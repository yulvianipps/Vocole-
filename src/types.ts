export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type PartOfSpeech = 
  | 'noun' 
  | 'verb' 
  | 'adjective' 
  | 'adverb' 
  | 'preposition' 
  | 'conjunction' 
  | 'pronoun' 
  | 'exclamation' 
  | 'number' 
  | 'modal verb' 
  | 'indefinite article'
  | 'phrase';

export type WordStatus = 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';

export interface Collocation {
  phrase: string;
  meaningId: string;
}

export interface ConfusingPair {
  targetWord: string;
  confusedWith: string;
  targetMeaning: string;
  confusedMeaning: string;
  explanation: string;
  tip: string;
}

export interface WordFamilyItem {
  root: string;
  family: Array<{
    word: string;
    pos: string;
    level: CEFRLevel;
  }>;
}

export interface OxfordWord {
  id: string;
  word: string;
  pos: string; // e.g. "v.", "n., v.", "adj."
  level: CEFRLevel;
  meaningId: string; // Meaning in Indonesian
  phonetic: string; // IPA e.g. /əˈtʃiːv/
  phoneticSimple: string; // readable e.g. "uh-CHEEV"
  simpleExplanation: string; // Indonesian simple explanation
  example: string;
  exampleId: string;
  moreExamples?: Array<{
    sentence: string;
    translation: string;
  }>;
  collocations?: Collocation[]; // authentic common word pairs
  confusingPair?: ConfusingPair;
  wordFamily?: string[]; // list of related words in Oxford 3000
  speakingPrompt: string; // natural sentence for speaking practice
}

export interface WordProgress {
  wordId: string;
  status: WordStatus;
  timesReviewed: number;
  correctStreak: number;
  mistakesCount: number;
  lastStudiedDate?: string; // YYYY-MM-DD
  nextReviewDate?: string; // YYYY-MM-DD
  intervalDays: number;
  isFavorite: boolean;
  isStruggled: boolean;
  lastScore?: number; // for speaking practice
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'vocab' | 'quiz' | 'speaking' | 'games';
  progress: number;
  target: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  weeklyActivity: { [date: string]: boolean }; // YYYY-MM-DD -> true
  dailyTarget: number; // 5, 10, 15, 20 (default 10)
  currentLevel: CEFRLevel;
  voiceSpeed: number; // 0.8 to 1.2 (default 0.95)
  voiceAccent?: 'us' | 'uk'; // American vs British English
  soundEnabled: boolean;
  darkMode?: boolean;
  unlockedBadges?: string[]; // list of badge IDs
  gamesPlayed?: number;
  gameHighScore?: number;
  gameStats?: {
    wordMatchHighScore?: number;
    sentenceScrambleHighScore?: number;
    dictationHighScore?: number;
    speedChallengeHighScore?: number;
    totalGamesPlayed?: number;
  };
  userSentences?: { [wordId: string]: string }; // saved user sentences
  placementResult?: PlacementResult;
  todayStudiedCount: number;
  todayReviewedCount: number;
  todayQuizCorrect: number;
  todayQuizTotal: number;
}

export interface PlacementResult {
  score: number;
  totalQuestions: number;
  recommendedLevel: CEFRLevel;
  completedAt: string;
}

export type TopicCategory = 
  | 'daily_life' 
  | 'work_business' 
  | 'food_dining' 
  | 'travel' 
  | 'feelings_social' 
  | 'health_nature';

export interface TopicInfo {
  id: TopicCategory;
  name: string;
  nameId: string;
  icon: string;
  description: string;
  color: string;
  keywords: string[];
}

export interface DialogueLine {
  id: string;
  speaker: string;
  avatar: string;
  textEn: string;
  textId: string;
  targetWordIds: string[]; // references OxfordWord.id
}

export interface MiniStory {
  id: string;
  title: string;
  titleId: string;
  topic: TopicCategory;
  level: CEFRLevel;
  situation: string;
  lines: DialogueLine[];
}

export interface QuizQuestion {
  id: string;
  type: 'meaning' | 'reverse' | 'context';
  question: string;
  targetWord: OxfordWord;
  options: string[];
  correctIndex: number;
  explanation: string;
}
