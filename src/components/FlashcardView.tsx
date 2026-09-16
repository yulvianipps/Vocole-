import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  RotateCw, 
  Check, 
  Sparkles, 
  Bookmark, 
  Layers, 
  ChevronRight,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OxfordWord, UserStats, WordProgress } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';
import { playPronunciation } from '../utils/speech';

interface FlashcardViewProps {
  words: OxfordWord[];
  progressMap: Record<string, WordProgress>;
  stats: UserStats;
  onRateWord: (wordId: string, rating: 'dont_know' | 'learning' | 'know' | 'mastered') => void;
  onToggleFavorite: (wordId: string) => void;
  onSwitchTab: (tab: string) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  words,
  progressMap,
  stats,
  onRateWord,
  onToggleFavorite,
  onSwitchTab
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'due' | 'struggled'>('all');
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Filter words based on selected mode
  const filteredWords = React.useMemo(() => {
    if (filterMode === 'due') {
      const today = new Date().toISOString().split('T')[0];
      return words.filter((w) => {
        const p = progressMap[w.id];
        return p && (p.status === 'REVIEW' || p.status === 'LEARNING') && (!p.nextReviewDate || p.nextReviewDate <= today);
      });
    }
    if (filterMode === 'struggled') {
      return words.filter((w) => {
        const p = progressMap[w.id];
        return p && (p.isStruggled || p.mistakesCount >= 2);
      });
    }
    return words;
  }, [words, filterMode, progressMap]);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  }, [filterMode]);

  const currentWord = filteredWords[currentIndex] || filteredWords[0];
  const currentProgress = currentWord ? progressMap[currentWord.id] : null;
  const isFavorite = currentProgress?.isFavorite || false;

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleRating = (rating: 'dont_know' | 'learning' | 'know' | 'mastered') => {
    if (!currentWord) return;

    onRateWord(currentWord.id, rating);

    if (currentIndex >= filteredWords.length - 1) {
      setSessionCompleted(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    } else {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!filteredWords || filteredWords.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Tidak Ada Flashcard Menunggu Review
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Semua kartu untuk kategori ini sudah kamu pelajari dengan baik atau belum jatuh tempo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setFilterMode('all')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 transition-colors"
            >
              Lihat Semua Kosakata ({words.length})
            </button>
            <button
              onClick={() => onSwitchTab('quiz')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-200 transition-colors"
            >
              Uji Kemampuan di Kuis
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Sesi Flashcard Selesai! 🎉
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Bagus sekali! Pengulangan berjarak (Spaced Repetition) membantu memindahkan kosakata ini ke memori jangka panjangmu.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSessionCompleted(false);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 shadow-xs transition-transform active:scale-98"
            >
              Ulangi Sesi Flashcard
            </button>
            <button
              onClick={() => onSwitchTab('quiz')}
              className="px-5 py-3 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-sm hover:bg-slate-200 transition-colors"
            >
              Lanjut ke Mode Kuis
            </button>
          </div>
        </div>
      </div>
    );
  }

  const levelMeta = CEFR_LEVEL_METADATA[currentWord.level];

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-16">
      {/* Mode Filters */}
      <div className="flex items-center justify-between gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setFilterMode('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            filterMode === 'all'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua ({words.length})
        </button>
        <button
          onClick={() => setFilterMode('due')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            filterMode === 'due'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Jatuh Tempo (Review)
        </button>
        <button
          onClick={() => setFilterMode('struggled')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            filterMode === 'struggled'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sulit (Struggled)
        </button>
      </div>

      {/* Progress Counter & Favorite */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
        <span>
          Kartu <b>{currentIndex + 1}</b> dari <b>{filteredWords.length}</b>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(currentWord.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFavorite
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title="Tandai favorit"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Interactive 3D Flip Card Container */}
      <div
        id="flashcard-container"
        onClick={handleFlip}
        className="min-h-[380px] bg-white border-2 border-slate-200 hover:border-indigo-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden select-none"
      >
        {/* Top Tag Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${levelMeta.badgeBg}`}>
              {currentWord.level} {levelMeta.icon}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 italic bg-slate-100 px-2 py-0.5 rounded-md">
              {currentWord.pos}
            </span>
          </div>

          <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" />
            {isFlipped ? 'Klik untuk balik kartu' : 'Klik untuk lihat arti'}
          </span>
        </div>

        {/* Card Body: FRONT vs BACK */}
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="my-auto py-8 text-center space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              FRONT • COBA INGAT ARTINYA DULU
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              {currentWord.word}
            </h2>
            <p className="font-mono text-sm font-semibold text-slate-500">
              {currentWord.phonetic}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playPronunciation(currentWord.word, stats.voiceSpeed);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Dengarkan Pengucapan
              </button>
            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="my-auto py-4 space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                BACK • ARTI & CONTOH
              </span>
              <div className="flex items-baseline gap-2 flex-wrap">
                <h3 className="text-3xl font-black text-slate-900 uppercase">
                  {currentWord.word}
                </h3>
                <span className="text-xs font-bold text-slate-400 italic">
                  ({currentWord.pos})
                </span>
                <span className="text-xs font-bold text-indigo-700">
                  [{currentWord.level}]
                </span>
              </div>
            </div>

            {/* Meaning */}
            <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100">
              <p className="text-xl font-black text-indigo-950">
                = {currentWord.meaningId}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {currentWord.simpleExplanation}
              </p>
            </div>

            {/* Audio & Phonetic */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playPronunciation(currentWord.word, stats.voiceSpeed);
                }}
                className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs"
                title="Dengarkan lagi"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div className="text-xs">
                <span className="font-mono font-semibold text-slate-800">{currentWord.phonetic}</span>
                <span className="text-slate-500 ml-2">({currentWord.phoneticSimple})</span>
              </div>
            </div>

            {/* Example sentence */}
            <div className="border-t border-slate-100 pt-3 text-xs sm:text-sm">
              <p className="font-bold text-slate-900">
                Example: “{currentWord.example}”
              </p>
              <p className="text-slate-600 italic mt-0.5">
                Artinya: “{currentWord.exampleId}”
              </p>
            </div>
          </div>
        )}

        {/* Bottom Hint */}
        <div className="text-center text-[11px] text-slate-400 font-medium">
          The Oxford 3000™ • American English
        </div>
      </div>

      {/* The 4 Spaced Repetition Rating Buttons */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          SEBERAPA BAIK KAMU MENGINGAT KATA INI?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* 😵 Don't know */}
          <button
            id="btn-rate-dont-know"
            onClick={() => handleRating('dont_know')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold transition-transform active:scale-95 group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">😵</span>
            <span className="text-xs">Don't know</span>
            <span className="text-[10px] text-rose-600 font-normal">Review hari ini</span>
          </button>

          {/* 🤔 Still learning */}
          <button
            id="btn-rate-learning"
            onClick={() => handleRating('learning')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold transition-transform active:scale-95 group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🤔</span>
            <span className="text-xs">Still learning</span>
            <span className="text-[10px] text-amber-600 font-normal">Review besok</span>
          </button>

          {/* 🙂 I know */}
          <button
            id="btn-rate-know"
            onClick={() => handleRating('know')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold transition-transform active:scale-95 group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🙂</span>
            <span className="text-xs">I know</span>
            <span className="text-[10px] text-sky-600 font-normal">+3 hari lagi</span>
          </button>

          {/* 🔥 Mastered */}
          <button
            id="btn-rate-mastered"
            onClick={() => handleRating('mastered')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold transition-transform active:scale-95 group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔥</span>
            <span className="text-xs">Mastered</span>
            <span className="text-[10px] text-emerald-600 font-normal">+7 s/d 14 hari</span>
          </button>
        </div>
      </div>
    </div>
  );
};
