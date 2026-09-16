import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  Zap, 
  Keyboard, 
  Headphones, 
  VolumeX,
  Eye,
  Check
} from 'lucide-react';
import { OxfordWord, UserStats, WordProgress } from '../types';
import { playPronunciation } from '../utils/speech';

interface SpellingTestViewProps {
  words: OxfordWord[];
  stats: UserStats;
  onWordComplete: (wordId: string, isCorrect: boolean) => void;
  onFinishTest: (score: number, total: number) => void;
}

export const SpellingTestView: React.FC<SpellingTestViewProps> = ({
  words,
  stats,
  onWordComplete,
  onFinishTest
}) => {
  const [testWords, setTestWords] = useState<OxfordWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [slowAudio, setSlowAudio] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize randomized 10 words test from current level or available words
  useEffect(() => {
    const levelFiltered = words.filter(w => w.level === stats.currentLevel);
    const pool = levelFiltered.length >= 10 ? levelFiltered : words;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setTestWords(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    setUserInput('');
    setIsAnswered(false);
    setShowHint(false);
  }, [words, stats.currentLevel]);

  const currentWord = testWords[currentIndex];

  // Auto-play pronunciation when question loads
  useEffect(() => {
    if (currentWord && !isCompleted && !isAnswered) {
      const timer = setTimeout(() => {
        playPronunciation(
          currentWord.word, 
          slowAudio ? 0.7 : stats.voiceSpeed, 
          stats.voiceAccent || 'us'
        );
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentWord, currentIndex, isCompleted, isAnswered, slowAudio, stats.voiceSpeed, stats.voiceAccent]);

  const handlePlaySound = (slow = false) => {
    if (!currentWord) return;
    playPronunciation(
      currentWord.word, 
      slow ? 0.65 : stats.voiceSpeed, 
      stats.voiceAccent || 'us'
    );
  };

  const handleCheckSpelling = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isAnswered || !currentWord) return;

    const cleanedUser = userInput.trim().toLowerCase();
    const target = currentWord.word.trim().toLowerCase();
    const correct = cleanedUser === target;

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      onWordComplete(currentWord.id, true);
    } else {
      onWordComplete(currentWord.id, false);
    }
  };

  const handleNextWord = () => {
    if (currentIndex + 1 < testWords.length) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setIsAnswered(false);
      setShowHint(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setIsCompleted(true);
      onFinishTest(score + (isCorrect ? 0 : 0), testWords.length);
    }
  };

  const handleRestart = () => {
    const levelFiltered = words.filter(w => w.level === stats.currentLevel);
    const pool = levelFiltered.length >= 10 ? levelFiltered : words;
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    setTestWords(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setIsCompleted(false);
    setUserInput('');
    setIsAnswered(false);
    setShowHint(false);
  };

  if (!currentWord && !isCompleted) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 font-bold">Menyiapkan sesi tes dikte...</p>
      </div>
    );
  }

  // Completed Screen
  if (isCompleted) {
    const percentage = Math.round((score / testWords.length) * 100);
    return (
      <div className="max-w-xl mx-auto py-8 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 rounded-full flex items-center justify-center mx-auto text-indigo-600">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Selesai Tes Ejaan Audio!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Kamu telah menyelesaikan 10 kata latihan listening spelling test.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-6 flex justify-around items-center border border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-3xl font-black text-indigo-600">
                {score} / {testWords.length}
              </div>
              <p className="text-xs font-bold text-slate-400 mt-0.5">Benar</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-3xl font-black text-slate-800 dark:text-slate-200">
                {percentage}%
              </div>
              <p className="text-xs font-bold text-slate-400 mt-0.5">Akurasi</p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            {percentage >= 80 
              ? 'Luar biasa! Telinga dan ejaan kosakatamu sangat tajam.' 
              : 'Terus berlatih! Kata yang keliru otomatis tersimpan di daftar review.'}
          </p>

          <button
            onClick={handleRestart}
            className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Mulai Tes 10 Kata Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-indigo-500" />
            Listening Spelling Test (Dikte)
          </span>
          <span>
            Soal {currentIndex + 1} dari {testWords.length}
          </span>
        </div>

        {/* Big Audio Speaker Button */}
        <div className="py-4 space-y-3">
          <button
            type="button"
            onClick={() => handlePlaySound(false)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white mx-auto flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all transform hover:scale-105 active:scale-95 group"
            title="Dengarkan kata"
          >
            <Volume2 className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-extrabold tracking-wider uppercase">Dengarkan</span>
          </button>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handlePlaySound(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>🐢 Kecepatan Lambat</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">
              Aksen: {stats.voiceAccent === 'uk' ? '🇬🇧 UK' : '🇺🇸 US'}
            </span>
          </div>
        </div>

        {/* Word Clues */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-1 text-center">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-indigo-600">Arti Bahasa Indonesia: </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{currentWord.meaningId}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Kelas kata: <span className="italic font-mono">{currentWord.pos}</span> | Level: <span className="font-bold">{currentWord.level}</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheckSpelling} className="space-y-4 pt-2">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isAnswered}
              placeholder="Ketik ejaan bahasa Inggris di sini..."
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              className={`w-full py-4 px-5 text-center text-lg sm:text-xl font-black rounded-2xl border-2 transition-all focus:outline-none ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-indigo-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white'
              }`}
            />
          </div>

          {!isAnswered ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHint(true)}
                disabled={showHint}
                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Hint ({currentWord.word.length} Huruf)</span>
              </button>

              <button
                type="submit"
                disabled={!userInput.trim()}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Periksa Ejaan</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              {/* Feedback Alert */}
              <div className={`p-4 rounded-2xl border text-left ${
                isCorrect 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className="font-black text-sm">
                    {isCorrect ? 'Ejaan Tepat 100%!' : `Kurang Tepat. Jawaban: "${currentWord.word}"`}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 pl-7">
                  <p className="font-mono text-slate-500">{currentWord.phonetic}</p>
                  <p className="italic mt-0.5">"{currentWord.example}"</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextWord}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{currentIndex + 1 < testWords.length ? 'Lanjut ke Kata Berikutnya' : 'Lihat Hasil Tes'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>

        {/* First Letter Hint */}
        {showHint && !isAnswered && (
          <div className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 py-2 px-3 rounded-xl border border-indigo-100">
            Petunjuk: Dimulai dengan huruf "<strong>{currentWord.word[0].toUpperCase()}</strong>", panjang {currentWord.word.length} karakter (
            {currentWord.word.split('').map((char, i) => i === 0 ? char : '_').join(' ')}
            )
          </div>
        )}
      </div>
    </div>
  );
};
