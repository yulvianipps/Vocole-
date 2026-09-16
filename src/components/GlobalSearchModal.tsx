import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Volume2, 
  ArrowRight, 
  Bookmark, 
  Sparkles, 
  BookOpen, 
  Command,
  CornerDownLeft
} from 'lucide-react';
import { OxfordWord, UserStats, WordProgress } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';
import { playPronunciation } from '../utils/speech';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: OxfordWord[];
  progressMap: Record<string, WordProgress>;
  stats: UserStats;
  onSelectWordForTutor: (word: OxfordWord) => void;
  onToggleFavorite: (wordId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  words,
  progressMap,
  stats,
  onSelectWordForTutor,
  onToggleFavorite
}) => {
  const [query, setQuery] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredWords = words.filter((item) => {
    if (selectedLevelFilter !== 'ALL' && item.level !== selectedLevelFilter) {
      return false;
    }
    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    return (
      item.word.toLowerCase().includes(q) ||
      item.meaningId.toLowerCase().includes(q) ||
      item.phonetic.toLowerCase().includes(q) ||
      item.example.toLowerCase().includes(q)
    );
  });

  const handlePlayAudio = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    playPronunciation(word, stats.voiceSpeed, stats.voiceAccent || 'us');
  };

  const handleChooseWord = (word: OxfordWord) => {
    onSelectWordForTutor(word);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik kata bahasa Inggris atau arti Indonesia..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Level Quick Filter Tabs */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-slate-400">Level:</span>
            {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLevelFilter === lvl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                }`}
              >
                {lvl === 'ALL' ? 'Semua' : lvl}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-medium shrink-0">
            {filteredWords.length} kata ditemukan
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredWords.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm font-bold">Tidak ada kata yang cocok dengan "{query}"</p>
              <p className="text-xs">Coba cari dengan kata kunci lain atau periksa filter level.</p>
            </div>
          ) : (
            filteredWords.slice(0, 50).map((item) => {
              const isFav = progressMap[item.id]?.isFavorite;
              const status = progressMap[item.id]?.status || 'NEW';

              return (
                <div
                  key={item.id}
                  onClick={() => handleChooseWord(item)}
                  className="p-3 rounded-2xl hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => handlePlayAudio(e, item.word)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-600 dark:text-slate-300 transition-all shrink-0 mt-0.5"
                      title="Putar pengucapan"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.word}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {item.phonetic}
                        </span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                          item.level === 'A1' ? 'bg-emerald-100 text-emerald-700' :
                          item.level === 'A2' ? 'bg-teal-100 text-teal-700' :
                          item.level === 'B1' ? 'bg-sky-100 text-sky-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {item.level}
                        </span>
                        <span className="text-[11px] text-slate-400 italic">
                          {item.pos}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate mt-0.5">
                        {item.meaningId}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate italic mt-0.5">
                        "{item.example}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className={`p-2 rounded-xl transition-colors ${
                        isFav 
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
                          : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                    >
                      <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
                      <span>Pelajari</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Command className="w-3 h-3" />
            <span>Tekan <strong>Ctrl + K</strong> kapan saja untuk membuka pencarian ini</span>
          </div>
          <span className="hidden sm:inline">Klik salah satu kata untuk langsung mulai belajar di Tutor 9-Step</span>
        </div>
      </div>
    </div>
  );
};
