import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Timer, 
  Trophy, 
  RotateCcw, 
  X, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  Flame,
  Volume2
} from 'lucide-react';
import { OxfordWord, UserStats } from '../types';
import { playPronunciation } from '../utils/speech';

interface SpeedChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: OxfordWord[];
  stats: UserStats;
  onUpdateHighScore: (newHighScore: number) => void;
}

export const SpeedChallengeModal: React.FC<SpeedChallengeModalProps> = ({
  isOpen,
  onClose,
  words,
  stats,
  onUpdateHighScore
}) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [currentWord, setCurrentWord] = useState<OxfordWord | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const timerRef = useRef<any>(null);

  // Generate a question
  const generateQuestion = () => {
    if (words.length < 4) return;
    const target = words[Math.floor(Math.random() * words.length)];
    const others = words.filter(w => w.id !== target.id);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [target.meaningId, ...shuffledOthers.map(o => o.meaningId)].sort(() => 0.5 - Math.random());

    setCurrentWord(target);
    setOptions(allOptions);
    setFeedback(null);
  };

  const handleStartGame = () => {
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setGameState('playing');
    generateQuestion();
  };

  // Timer loop
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameState('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Check game over high score
  useEffect(() => {
    if (gameState === 'gameover') {
      const currentHigh = stats.speedChallengeHighScore || 0;
      if (score > currentHigh) {
        onUpdateHighScore(score);
      }
    }
  }, [gameState, score, stats.speedChallengeHighScore, onUpdateHighScore]);

  const handleSelectOption = (meaning: string) => {
    if (!currentWord || feedback !== null) return;

    if (meaning === currentWord.meaningId) {
      const multiplier = combo >= 5 ? 3 : combo >= 2 ? 2 : 1;
      const points = 10 * multiplier;
      setScore(prev => prev + points);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setFeedback('correct');
      setTimeout(() => {
        generateQuestion();
      }, 350);
    } else {
      setCombo(0);
      setFeedback('wrong');
      setTimeout(() => {
        generateQuestion();
      }, 600);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Top bar with close */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Speed Challenge 60 Detik
              </h3>
              <p className="text-[11px] text-slate-400">
                Uji kecepatan refleks kosa kata bahasa Inggrismu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State: Intro Screen */}
        {gameState === 'intro' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Timer className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                Siap untuk 60 Detik Kuis Kilat?
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Jawab sebanyak mungkin arti kata sebelum waktu 60 detik habis. Raih combo beruntun untuk melipatgandakan poin skor!
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 flex justify-around items-center border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400">Skor Tertinggimu</span>
                <p className="text-2xl font-black text-amber-500 mt-0.5">
                  {stats.speedChallengeHighScore || 0} Poin
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-xs font-bold text-slate-400">Durasi Game</span>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-0.5">
                  60s
                </p>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-base shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              Mulai Challenge Sekarang! ⚡
            </button>
          </div>
        )}

        {/* State: Playing Screen */}
        {gameState === 'playing' && currentWord && (
          <div className="space-y-6">
            {/* Header: Timer and Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-xl font-black text-sm flex items-center gap-1.5 transition-colors ${
                  timeLeft <= 10 
                    ? 'bg-rose-100 text-rose-700 animate-bounce' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  <Timer className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>

                {combo >= 2 && (
                  <div className="px-2.5 py-1 rounded-xl bg-amber-500 text-white text-xs font-black flex items-center gap-1 animate-pulse">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{combo}x Combo!</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skor</span>
                <p className="text-xl font-black text-indigo-600">{score}</p>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>

            {/* Current Target Word */}
            <div className="text-center py-5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-3xl border border-indigo-100 dark:border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-wide">
                  {currentWord.word}
                </h2>
                <button
                  onClick={() => playPronunciation(currentWord.word, 1, stats.voiceAccent || 'us')}
                  className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded-lg"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs font-mono text-slate-500">
                {currentWord.phonetic} • <span className="italic">{currentWord.pos}</span>
              </p>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {options.map((opt, idx) => {
                const isSelected = feedback !== null;
                const isThisCorrect = opt === currentWord.meaningId;

                let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40";
                if (feedback === 'correct' && isThisCorrect) {
                  btnStyle = "bg-emerald-500 border-emerald-500 text-white shadow-md";
                } else if (feedback === 'wrong' && isThisCorrect) {
                  btnStyle = "bg-emerald-500 border-emerald-500 text-white";
                }

                return (
                  <button
                    key={idx}
                    disabled={feedback !== null}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-3.5 rounded-2xl border-2 font-bold text-xs sm:text-sm text-left transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* State: Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                Waktu 60s Habis!
              </h4>
              <p className="text-xs text-slate-400">
                Latihan refleks kilat yang sangat memuaskan.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 flex justify-around items-center border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400">Skor Akhir</span>
                <p className="text-3xl font-black text-indigo-600 mt-0.5">
                  {score}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-xs font-bold text-slate-400">Max Combo</span>
                <p className="text-3xl font-black text-amber-500 mt-0.5">
                  {maxCombo}x 🔥
                </p>
              </div>
            </div>

            {score > (stats.speedChallengeHighScore || 0) && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Rekor Baru Tercipta! Selamat!</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50"
              >
                Selesai
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Main Lagi
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
