import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  RotateCcw, 
  Volume2, 
  Check, 
  X, 
  HelpCircle, 
  ChevronRight, 
  Flame,
  ArrowRight,
  Lightbulb,
  Play,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CEFRLevel, OxfordWord, UserStats } from '../types';
import { playPronunciation } from '../utils/speech';

interface GamesViewProps {
  words: OxfordWord[];
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onSwitchTab: (tab: string) => void;
}

type GameMode = 'match' | 'scramble' | 'dictation';

interface MatchCard {
  id: string;
  wordId: string;
  text: string;
  type: 'en' | 'id';
  isMatched: boolean;
}

export const GamesView: React.FC<GamesViewProps> = ({
  words,
  stats,
  onUpdateStats,
  onSwitchTab
}) => {
  const [activeGame, setActiveGame] = useState<GameMode>('match');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL'>(stats.currentLevel);

  // Filter words by level
  const filteredWords = useMemo(() => {
    if (selectedLevel === 'ALL') return words;
    const list = words.filter((w) => w.level === selectedLevel);
    return list.length >= 6 ? list : words;
  }, [words, selectedLevel]);

  // ==========================================
  // GAME 1: WORD MATCH (Jodohkan Kata)
  // ==========================================
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedMatchCards, setSelectedMatchCards] = useState<MatchCard[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [matchCombo, setMatchCombo] = useState(0);
  const [matchSeconds, setMatchSeconds] = useState(0);
  const [isMatchGameOver, setIsMatchGameOver] = useState(false);
  const [isMatchTimerRunning, setIsMatchTimerRunning] = useState(false);

  // Init Match Game
  const startNewMatchGame = () => {
    // Pick 6 random words
    const shuffledPool = [...filteredWords].sort(() => 0.5 - Math.random());
    const roundWords = shuffledPool.slice(0, 6);

    const cards: MatchCard[] = [];
    roundWords.forEach((w) => {
      cards.push({
        id: `en-${w.id}`,
        wordId: w.id,
        text: w.word,
        type: 'en',
        isMatched: false
      });
      cards.push({
        id: `id-${w.id}`,
        wordId: w.id,
        text: w.meaningId,
        type: 'id',
        isMatched: false
      });
    });

    // Shuffle the 12 cards
    setMatchCards(cards.sort(() => 0.5 - Math.random()));
    setSelectedMatchCards([]);
    setMatchScore(0);
    setMatchCombo(0);
    setMatchSeconds(0);
    setIsMatchGameOver(false);
    setIsMatchTimerRunning(true);
  };

  // Timer for Match Game
  useEffect(() => {
    let interval: any = null;
    if (isMatchTimerRunning && !isMatchGameOver) {
      interval = setInterval(() => {
        setMatchSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMatchTimerRunning, isMatchGameOver]);

  // Handle Card Click
  const handleCardClick = (card: MatchCard) => {
    if (card.isMatched) return;
    if (selectedMatchCards.length >= 2) return;
    if (selectedMatchCards.some((c) => c.id === card.id)) return;

    const newSelected = [...selectedMatchCards, card];
    setSelectedMatchCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (first.wordId === second.wordId && first.type !== second.type) {
        // MATCH!
        const foundWord = filteredWords.find((w) => w.id === first.wordId);
        if (foundWord) playPronunciation(foundWord.word, stats.voiceSpeed);

        setTimeout(() => {
          setMatchCards((prev) =>
            prev.map((c) => (c.wordId === first.wordId ? { ...c, isMatched: true } : c))
          );
          setSelectedMatchCards([]);
          const comboBonus = (matchCombo + 1) * 20;
          const newScore = matchScore + 100 + comboBonus;
          setMatchScore(newScore);
          setMatchCombo((c) => c + 1);

          // Check if all matched
          const remaining = matchCards.filter((c) => !c.isMatched && c.wordId !== first.wordId);
          if (remaining.length === 0) {
            setIsMatchGameOver(true);
            setIsMatchTimerRunning(false);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

            // Update stats
            const newPlayed = (stats.gamesPlayed || 0) + 1;
            const highScore = Math.max(stats.gameHighScore || 0, newScore);
            onUpdateStats({
              ...stats,
              gamesPlayed: newPlayed,
              gameHighScore: highScore
            });
          }
        }, 350);
      } else {
        // MISMATCH
        setTimeout(() => {
          setSelectedMatchCards([]);
          setMatchCombo(0);
        }, 750);
      }
    }
  };

  // ==========================================
  // GAME 2: SENTENCE SCRAMBLE (Susun Kalimat)
  // ==========================================
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleScore, setScrambleScore] = useState(0);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [scrambleResult, setScrambleResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentScrambleWord = filteredWords[scrambleIndex % filteredWords.length];

  // Prepare tokens for current sentence
  const cleanTokens = useMemo(() => {
    if (!currentScrambleWord) return [];
    return currentScrambleWord.example
      .replace(/[.,?!]/g, '')
      .split(/\s+/)
      .filter(Boolean);
  }, [currentScrambleWord]);

  useEffect(() => {
    if (cleanTokens.length > 0) {
      setSelectedTokens([]);
      setScrambleResult('idle');
      // Shuffle tokens
      setAvailableTokens([...cleanTokens].sort(() => 0.5 - Math.random()));
    }
  }, [scrambleIndex, currentScrambleWord]);

  const handlePickToken = (wordToken: string, index: number) => {
    if (scrambleResult === 'correct') return;
    const newAvail = [...availableTokens];
    newAvail.splice(index, 1);
    setAvailableTokens(newAvail);
    setSelectedTokens([...selectedTokens, wordToken]);
    setScrambleResult('idle');
  };

  const handleRemoveToken = (wordToken: string, index: number) => {
    if (scrambleResult === 'correct') return;
    const newSel = [...selectedTokens];
    newSel.splice(index, 1);
    setSelectedTokens(newSel);
    setAvailableTokens([...availableTokens, wordToken]);
    setScrambleResult('idle');
  };

  const handleCheckScramble = () => {
    const userBuilt = selectedTokens.join(' ').toLowerCase();
    const correctTarget = cleanTokens.join(' ').toLowerCase();

    if (userBuilt === correctTarget) {
      setScrambleResult('correct');
      setScrambleScore((s) => s + 100);
      playPronunciation(currentScrambleWord.example, stats.voiceSpeed);
      confetti({ particleCount: 50, spread: 60 });
      onUpdateStats({
        ...stats,
        gamesPlayed: (stats.gamesPlayed || 0) + 1
      });
    } else {
      setScrambleResult('wrong');
    }
  };

  const handleNextScramble = () => {
    setScrambleIndex((i) => i + 1);
  };

  // ==========================================
  // GAME 3: AUDIO DICTATION (Dengar & Ketik)
  // ==========================================
  const [dictationIndex, setDictationIndex] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationStatus, setDictationStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [dictationScore, setDictationScore] = useState(0);

  const currentDictationWord = filteredWords[dictationIndex % filteredWords.length];

  useEffect(() => {
    setDictationInput('');
    setDictationStatus('idle');
    setShowHint(false);
    if (activeGame === 'dictation' && currentDictationWord) {
      playPronunciation(currentDictationWord.word, stats.voiceSpeed);
    }
  }, [dictationIndex, activeGame, currentDictationWord]);

  const handleCheckDictation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dictationInput.trim()) return;

    if (dictationInput.trim().toLowerCase() === currentDictationWord.word.toLowerCase()) {
      setDictationStatus('correct');
      setDictationScore((s) => s + 100);
      playPronunciation(currentDictationWord.word, stats.voiceSpeed);
      confetti({ particleCount: 40, spread: 50 });
      onUpdateStats({
        ...stats,
        gamesPlayed: (stats.gamesPlayed || 0) + 1
      });
    } else {
      setDictationStatus('wrong');
    }
  };

  // Start initial match game on load
  useEffect(() => {
    if (activeGame === 'match' && matchCards.length === 0) {
      startNewMatchGame();
    }
  }, [activeGame, filteredWords]);

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Mode Switcher */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Gamepad2 className="w-6 h-6" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Arena Permainan Kosakata
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Uji daya ingat, kecepatan refleks, dan kepekaan telingamu dengan mini-game interaktif Oxford 3000™.
            </p>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-500">Level:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['A1', 'A2', 'B1', 'B2', 'ALL'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    if (activeGame === 'match') {
                      setTimeout(startNewMatchGame, 50);
                    }
                  }}
                  className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                    selectedLevel === lvl
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Game Mode Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-100">
          <button
            onClick={() => {
              setActiveGame('match');
              if (matchCards.length === 0) startNewMatchGame();
            }}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              activeGame === 'match'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>1. Word Match</span>
          </button>

          <button
            onClick={() => setActiveGame('scramble')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              activeGame === 'scramble'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>2. Susun Kalimat</span>
          </button>

          <button
            onClick={() => setActiveGame('dictation')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              activeGame === 'dictation'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>3. Audio Dictation</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GAME 1: WORD MATCH CONTENT */}
      {/* ======================================================== */}
      {activeGame === 'match' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Match Score & Status Bar */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skor</span>
                <span className="text-xl font-black text-indigo-600">{matchScore}</span>
              </div>
              {matchCombo > 1 && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{matchCombo}x Combo!</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Waktu</span>
                <span className="text-base font-black text-slate-700">{matchSeconds}s</span>
              </div>
              <button
                onClick={startNewMatchGame}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-2xs"
                title="Mulai Ulang Ronde"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          {!isMatchGameOver ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {matchCards.map((card) => {
                const isSelected = selectedMatchCards.some((c) => c.id === card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={card.isMatched}
                    className={`min-h-[90px] p-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 flex flex-col items-center justify-center text-center select-none ${
                      card.isMatched
                        ? 'opacity-30 bg-emerald-50 text-emerald-800 border-2 border-emerald-300 scale-95'
                        : isSelected
                        ? 'bg-indigo-600 text-white shadow-md scale-102 ring-4 ring-indigo-200'
                        : card.type === 'en'
                        ? 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 hover:border-indigo-300 shadow-2xs active:scale-98'
                        : 'bg-indigo-50/40 hover:bg-indigo-50 text-indigo-950 border-2 border-indigo-100 hover:border-indigo-300 shadow-2xs active:scale-98'
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider opacity-60 mb-1">
                      {card.type === 'en' ? '🇺🇸 English' : '🇮🇩 Arti'}
                    </span>
                    <span className="leading-snug">{card.text}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black">
                🎉
              </div>
              <h3 className="text-2xl font-black text-slate-900">Hebat! Ronde Selesai!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Kamu berhasil mencocokkan semua kosakata dalam <span className="font-bold text-slate-900">{matchSeconds} detik</span> dengan total skor <span className="font-extrabold text-indigo-600">{matchScore}</span>!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={startNewMatchGame}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xs transition-transform active:scale-98"
                >
                  Main Lagi Ronde Baru
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* GAME 2: SENTENCE SCRAMBLE CONTENT */}
      {/* ======================================================== */}
      {activeGame === 'scramble' && currentScrambleWord && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Header info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                Level {currentScrambleWord.level}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Kata Kunci: <strong className="text-slate-900">{currentScrambleWord.word}</strong> ({currentScrambleWord.meaningId})
              </span>
            </div>
            <div className="flex items-center gap-1 font-black text-indigo-600 text-sm">
              <Trophy className="w-4 h-4" />
              <span>{scrambleScore} Poin</span>
            </div>
          </div>

          {/* Indonesian clue */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Arti Kalimat Target:
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-800 italic">
              “{currentScrambleWord.exampleId}”
            </p>
          </div>

          {/* Constructing sentence Drop Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Susun Kalimatmu di Sini:</span>
              {selectedTokens.length > 0 && scrambleResult !== 'correct' && (
                <button
                  onClick={() => {
                    setAvailableTokens([...availableTokens, ...selectedTokens]);
                    setSelectedTokens([]);
                    setScrambleResult('idle');
                  }}
                  className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
                >
                  Reset Pilihan
                </button>
              )}
            </div>

            <div className={`min-h-[80px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-colors ${
              scrambleResult === 'correct'
                ? 'border-emerald-400 bg-emerald-50/50'
                : scrambleResult === 'wrong'
                ? 'border-rose-400 bg-rose-50/30'
                : 'border-slate-300 bg-white'
            }`}>
              {selectedTokens.length === 0 ? (
                <span className="text-sm text-slate-400 italic">
                  Klik kata-kata di bawah untuk menyusun urutan kalimat yang tepat...
                </span>
              ) : (
                selectedTokens.map((t, idx) => (
                  <button
                    key={`${t}-${idx}`}
                    onClick={() => handleRemoveToken(t, idx)}
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-2xs hover:bg-rose-600 transition-colors"
                    title="Klik untuk menghapus"
                  >
                    {t}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Word Chips */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-500">Pilihan Kata:</span>
            <div className="flex flex-wrap gap-2">
              {availableTokens.map((t, idx) => (
                <button
                  key={`${t}-${idx}`}
                  onClick={() => handlePickToken(t, idx)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-800 font-bold text-sm border border-slate-200 transition-transform active:scale-95"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => playPronunciation(currentScrambleWord.example, stats.voiceSpeed)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                title="Dengarkan Contoh Pengucapan"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              {scrambleResult === 'correct' && (
                <span className="text-sm font-extrabold text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4 stroke-[3]" />
                  Tepat Sekali! Susunan kalimat benar!
                </span>
              )}
              {scrambleResult === 'wrong' && (
                <span className="text-sm font-bold text-rose-600 flex items-center gap-1.5">
                  <X className="w-4 h-4 stroke-[3]" />
                  Urutan masih belum pas. Coba atur kembali!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {scrambleResult !== 'correct' ? (
                <button
                  onClick={handleCheckScramble}
                  disabled={selectedTokens.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-extrabold text-sm transition-transform active:scale-98"
                >
                  Cek Kalimat
                </button>
              ) : (
                <button
                  onClick={handleNextScramble}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-transform active:scale-98 flex items-center gap-1.5"
                >
                  Kalimat Berikutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GAME 3: AUDIO DICTATION CONTENT */}
      {/* ======================================================== */}
      {activeGame === 'dictation' && currentDictationWord && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
              Level {currentDictationWord.level}
            </span>
            <div className="flex items-center gap-1 font-black text-indigo-600 text-sm">
              <Trophy className="w-4 h-4" />
              <span>{dictationScore} Poin</span>
            </div>
          </div>

          {/* Audio Player Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white text-center space-y-3 shadow-md shadow-indigo-200">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              Dengarkan Pengucapan Penutur Asli
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => playPronunciation(currentDictationWord.word, stats.voiceSpeed)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-700 font-extrabold text-sm shadow-md hover:bg-indigo-50 transition-transform active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                🔊 Normal (1.0x)
              </button>
              <button
                onClick={() => playPronunciation(currentDictationWord.word, 0.75)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-800/60 text-white font-bold text-xs hover:bg-indigo-800 transition-colors"
                title="Putar Lebih Lambat"
              >
                🐢 Lambat (0.75x)
              </button>
            </div>
          </div>

          {/* Hint section */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              {showHint ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk?'}
            </button>
            <span className="text-xs text-slate-400">
              Jumlah Huruf: <strong className="text-slate-700">{currentDictationWord.word.length} huruf</strong>
            </span>
          </div>

          {showHint && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
              <p className="text-xs font-bold text-amber-900">
                💡 Huruf pertama: <span className="text-base uppercase font-black text-indigo-700">{currentDictationWord.word[0]}</span>...
              </p>
              <p className="text-xs text-slate-700">
                Arti: <span className="font-semibold">{currentDictationWord.meaningId}</span> ({currentDictationWord.pos})
              </p>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleCheckDictation} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={dictationInput}
                onChange={(e) => {
                  setDictationInput(e.target.value);
                  setDictationStatus('idle');
                }}
                placeholder="Ketik kata yang kamu dengar di sini..."
                className={`w-full text-center py-4 px-4 text-xl sm:text-2xl font-black rounded-2xl border-2 outline-none transition-all ${
                  dictationStatus === 'correct'
                    ? 'border-emerald-500 bg-emerald-50/40 text-emerald-950'
                    : dictationStatus === 'wrong'
                    ? 'border-rose-500 bg-rose-50/40 text-rose-950'
                    : 'border-slate-200 focus:border-indigo-600 bg-white'
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                {dictationStatus === 'correct' && (
                  <p className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4 stroke-[3]" />
                    Ejaan Sempurna! ({currentDictationWord.phonetic})
                  </p>
                )}
                {dictationStatus === 'wrong' && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <X className="w-4 h-4 stroke-[3]" />
                    Ejaan belum cocok. Dengarkan ulang audionya!
                  </p>
                )}
              </div>

              {dictationStatus !== 'correct' ? (
                <button
                  type="submit"
                  disabled={!dictationInput.trim()}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-extrabold text-sm transition-transform active:scale-98"
                >
                  Cek Ejaan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDictationIndex((i) => i + 1)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-transform active:scale-98 flex items-center gap-1.5"
                >
                  Kata Berikutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
