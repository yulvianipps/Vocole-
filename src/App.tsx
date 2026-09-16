import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { LearnView } from './components/LearnView';
import { FlashcardView } from './components/FlashcardView';
import { QuizView } from './components/QuizView';
import { SpeakingView } from './components/SpeakingView';
import { MyWordsView } from './components/MyWordsView';
import { ProgressView } from './components/ProgressView';
import { GamesView } from './components/GamesView';
import { StoriesView } from './components/StoriesView';
import { AudioModeModal } from './components/AudioModeModal';
import { PlacementTestModal } from './components/PlacementTestModal';
import { SettingsModal } from './components/SettingsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SpellingTestView } from './components/SpellingTestView';
import { SpeedChallengeModal } from './components/SpeedChallengeModal';
import { OXFORD_WORDS } from './data/oxfordWords';
import { 
  loadUserStats, 
  saveUserStats, 
  loadWordProgressMap, 
  saveWordProgressMap, 
  updateWordSRS, 
  toggleFavoriteWord, 
  getDailyWordsBatch, 
  getDueReviewWords, 
  getStruggledWords, 
  calculateLevelStats,
  getDefaultStats
} from './utils/storage';
import { CEFRLevel, OxfordWord, UserStats, WordProgress, PlacementResult } from './types';

export default function App() {
  const [stats, setStats] = useState<UserStats>(getDefaultStats);
  const [progressMap, setProgressMap] = useState<Record<string, WordProgress>>({});
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeWord, setActiveWord] = useState<OxfordWord | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isAudioModeOpen, setIsAudioModeOpen] = useState<boolean>(false);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState<boolean>(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [isSpeedChallengeOpen, setIsSpeedChallengeOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load persistence on initial mount
  useEffect(() => {
    const loadedStats = loadUserStats();
    const loadedProgress = loadWordProgressMap();
    setStats(loadedStats);
    setProgressMap(loadedProgress);
    setIsLoaded(true);
  }, []);

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open Search Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync dark mode class on document element
  useEffect(() => {
    if (stats.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [stats.darkMode]);

  const handleToggleDarkMode = () => {
    const updated = {
      ...stats,
      darkMode: !stats.darkMode
    };
    handleUpdateStats(updated);
  };

  const handleSaveUserSentence = (wordId: string, sentence: string) => {
    const updatedSentences = {
      ...(stats.userSentences || {}),
      [wordId]: sentence
    };
    handleUpdateStats({
      ...stats,
      userSentences: updatedSentences
    });
  };

  const handleUpdateGameStats = (gameType: 'word_match' | 'sentence_scramble' | 'dictation', score: number) => {
    const gameStats = stats.gameStats || {
      wordMatchHighScore: 0,
      sentenceScrambleHighScore: 0,
      dictationHighScore: 0,
      totalGamesPlayed: 0
    };
    const updatedGameStats = {
      ...gameStats,
      totalGamesPlayed: (gameStats.totalGamesPlayed || 0) + 1,
      wordMatchHighScore: gameType === 'word_match' ? Math.max(gameStats.wordMatchHighScore || 0, score) : (gameStats.wordMatchHighScore || 0),
      sentenceScrambleHighScore: gameType === 'sentence_scramble' ? Math.max(gameStats.sentenceScrambleHighScore || 0, score) : (gameStats.sentenceScrambleHighScore || 0),
      dictationHighScore: gameType === 'dictation' ? Math.max(gameStats.dictationHighScore || 0, score) : (gameStats.dictationHighScore || 0)
    };
    handleUpdateStats({
      ...stats,
      gameStats: updatedGameStats
    });
  };

  // Compute current level words and daily batch
  const todayWords = useMemo(() => {
    return getDailyWordsBatch(OXFORD_WORDS, progressMap, stats.currentLevel, stats.dailyTarget);
  }, [progressMap, stats.currentLevel, stats.dailyTarget]);

  const dueWords = useMemo(() => {
    return getDueReviewWords(OXFORD_WORDS, progressMap);
  }, [progressMap]);

  const struggledWords = useMemo(() => {
    return getStruggledWords(OXFORD_WORDS, progressMap);
  }, [progressMap]);

  const levelStats = useMemo(() => {
    return calculateLevelStats(OXFORD_WORDS, progressMap);
  }, [progressMap]);

  // Update stats helper
  const handleUpdateStats = (newStats: UserStats) => {
    setStats(newStats);
    saveUserStats(newStats);
  };

  // Toggle word favorite
  const handleToggleFavorite = (wordId: string) => {
    const updated = toggleFavoriteWord(wordId, progressMap);
    setProgressMap(updated);
  };

  // Mark word studied in tutor mode
  const handleWordStudied = (wordId: string) => {
    const current = progressMap[wordId];
    if (!current || current.status === 'NEW') {
      const { updatedMap } = updateWordSRS(wordId, 'learning', progressMap);
      setProgressMap(updatedMap);
      const newStats = {
        ...stats,
        todayStudiedCount: stats.todayStudiedCount + 1
      };
      handleUpdateStats(newStats);
    }
  };

  // Rating in flashcards
  const handleRateWord = (wordId: string, rating: 'dont_know' | 'learning' | 'know' | 'mastered') => {
    const { updatedMap } = updateWordSRS(wordId, rating, progressMap);
    setProgressMap(updatedMap);
    const newStats = {
      ...stats,
      todayReviewedCount: stats.todayReviewedCount + 1
    };
    handleUpdateStats(newStats);
  };

  // Record quiz answer
  const handleQuizResult = (wordId: string, isCorrect: boolean) => {
    const rating = isCorrect ? 'know' : 'dont_know';
    const { updatedMap } = updateWordSRS(wordId, rating, progressMap);
    setProgressMap(updatedMap);

    const newStats = {
      ...stats,
      todayQuizTotal: stats.todayQuizTotal + 1,
      todayQuizCorrect: isCorrect ? stats.todayQuizCorrect + 1 : stats.todayQuizCorrect,
      todayReviewedCount: stats.todayReviewedCount + 1
    };
    handleUpdateStats(newStats);
  };

  // Record spelling test answer
  const handleSpellingWordComplete = (wordId: string, isCorrect: boolean) => {
    const rating = isCorrect ? 'know' : 'dont_know';
    const { updatedMap } = updateWordSRS(wordId, rating, progressMap);
    setProgressMap(updatedMap);

    const newStats = {
      ...stats,
      todayQuizTotal: stats.todayQuizTotal + 1,
      todayQuizCorrect: isCorrect ? stats.todayQuizCorrect + 1 : stats.todayQuizCorrect,
      todayReviewedCount: stats.todayReviewedCount + 1
    };
    handleUpdateStats(newStats);
  };

  // Speed challenge high score
  const handleSpeedHighScore = (newHighScore: number) => {
    const currentHigh = stats.gameStats?.wordMatchHighScore || 0;
    if (newHighScore > currentHigh) {
      handleUpdateGameStats('word_match', newHighScore);
    }
  };

  // Reset entire progress
  const handleResetProgress = () => {
    localStorage.clear();
    const defaultSt = getDefaultStats();
    setStats(defaultSt);
    setProgressMap({});
    setActiveTab('home');
  };

  // Select word from list to open in tutor mode
  const handleSelectWord = (word: OxfordWord) => {
    setActiveWord(word);
    setActiveTab('learn');
  };

  // Select level
  const handleSelectLevel = (level: CEFRLevel) => {
    const newStats = { ...stats, currentLevel: level };
    handleUpdateStats(newStats);
  };

  // Special review for struggled words
  const handleStartSpecialReview = (wordsToReview: OxfordWord[]) => {
    setActiveTab('flashcards');
  };

  // Handle placement test completion
  const handlePlacementComplete = (result: PlacementResult) => {
    const updatedStats: UserStats = {
      ...stats,
      currentLevel: result.recommendedLevel,
      placementResult: result
    };
    handleUpdateStats(updatedStats);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Menyiapkan Oxford 3000™ Tutor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAudioMode={() => setIsAudioModeOpen(true)}
        onOpenPlacementTest={() => setIsPlacementTestOpen(true)}
        onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
        onOpenSpeedChallenge={() => setIsSpeedChallengeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-20 lg:pb-12">
        {activeTab === 'home' && (
          <HomeView
            todayWords={todayWords}
            dueWords={dueWords}
            struggledWords={struggledWords}
            levelStats={levelStats}
            stats={stats}
            progressMap={progressMap}
            onStartLearning={() => {
              if (todayWords.length > 0) {
                setActiveWord(todayWords[0]);
              }
              setActiveTab('learn');
            }}
            onStartReview={() => setActiveTab('flashcards')}
            onStartQuiz={() => setActiveTab('quiz')}
            onStartSpeaking={() => setActiveTab('say_it')}
            onSelectWord={handleSelectWord}
            onSwitchTab={setActiveTab}
            onToggleFavorite={handleToggleFavorite}
            onOpenAudioMode={() => setIsAudioModeOpen(true)}
            onOpenPlacementTest={() => setIsPlacementTestOpen(true)}
            onOpenSpeedChallenge={() => setIsSpeedChallengeOpen(true)}
            onStartSpellingTest={() => setActiveTab('spelling')}
          />
        )}

        {activeTab === 'learn' && (
          <LearnView
            words={todayWords}
            activeWord={activeWord}
            onSelectWord={handleSelectWord}
            onWordStudied={handleWordStudied}
            onToggleFavorite={handleToggleFavorite}
            onSaveUserSentence={handleSaveUserSentence}
            progressMap={progressMap}
            stats={stats}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardView
            words={dueWords.length > 0 ? dueWords : todayWords}
            progressMap={progressMap}
            stats={stats}
            onRateWord={handleRateWord}
            onToggleFavorite={handleToggleFavorite}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'spelling' && (
          <SpellingTestView
            words={todayWords.length > 0 ? todayWords : OXFORD_WORDS.filter(w => w.level === stats.currentLevel)}
            stats={stats}
            onWordComplete={handleSpellingWordComplete}
            onFinishTest={() => {}}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            words={OXFORD_WORDS}
            progressMap={progressMap}
            stats={stats}
            onRecordQuizResult={handleQuizResult}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'games' && (
          <GamesView
            words={OXFORD_WORDS}
            stats={stats}
            onUpdateGameStats={handleUpdateGameStats}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'stories' && (
          <StoriesView
            allWords={OXFORD_WORDS}
            stats={stats}
            onSelectWord={(word) => {
              handleSelectWord(word);
              setActiveTab('learn');
            }}
            onSwitchTab={setActiveTab}
            onStartPractice={() => setActiveTab('learn')}
          />
        )}

        {activeTab === 'say_it' && (
          <SpeakingView
            words={todayWords.length > 0 ? todayWords : OXFORD_WORDS.slice(0, 10)}
            stats={stats}
          />
        )}

        {activeTab === 'my_words' && (
          <MyWordsView
            allWords={OXFORD_WORDS}
            progressMap={progressMap}
            stats={stats}
            onToggleFavorite={handleToggleFavorite}
            onSelectWordForTutor={handleSelectWord}
            onStartSpecialReview={handleStartSpecialReview}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            allWords={OXFORD_WORDS}
            progressMap={progressMap}
            stats={stats}
            levelStats={levelStats}
            onSelectLevel={handleSelectLevel}
            onStartCheckpointTest={() => setActiveTab('quiz')}
            onSwitchTab={setActiveTab}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        stats={stats}
        onUpdateStats={handleUpdateStats}
        onResetProgress={handleResetProgress}
      />

      {/* Commute Audio Mode Modal */}
      <AudioModeModal
        isOpen={isAudioModeOpen}
        onClose={() => setIsAudioModeOpen(false)}
        words={todayWords.length > 0 ? todayWords : OXFORD_WORDS.filter(w => w.level === stats.currentLevel)}
        stats={stats}
      />

      {/* Diagnostic Placement Test Modal */}
      <PlacementTestModal
        isOpen={isPlacementTestOpen}
        onClose={() => setIsPlacementTestOpen(false)}
        onComplete={handlePlacementComplete}
        currentLevel={stats.currentLevel}
      />

      {/* Global Command Palette / Search Modal (Ctrl + K) */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        words={OXFORD_WORDS}
        progressMap={progressMap}
        stats={stats}
        onSelectWordForTutor={handleSelectWord}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Daily 60-Second Speed Quiz Challenge */}
      <SpeedChallengeModal
        isOpen={isSpeedChallengeOpen}
        onClose={() => setIsSpeedChallengeOpen(false)}
        words={OXFORD_WORDS}
        stats={stats}
        onUpdateHighScore={handleSpeedHighScore}
      />
    </div>
  );
}
