import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  Bookmark, 
  Filter, 
  AlertTriangle, 
  X, 
  Check, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Printer,
  Download,
  Pencil,
  ArrowUpDown,
  Layers
} from 'lucide-react';
import { CEFRLevel, OxfordWord, UserStats, WordProgress } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';
import { playPronunciation } from '../utils/speech';
import { PrintFlashcardsModal } from './PrintFlashcardsModal';

interface MyWordsViewProps {
  allWords: OxfordWord[];
  progressMap: Record<string, WordProgress>;
  stats: UserStats;
  onToggleFavorite: (wordId: string) => void;
  onSelectWordForTutor: (word: OxfordWord) => void;
  onStartSpecialReview: (words: OxfordWord[]) => void;
}

export const MyWordsView: React.FC<MyWordsViewProps> = ({
  allWords,
  progressMap,
  stats,
  onToggleFavorite,
  onSelectWordForTutor,
  onStartSpecialReview
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'struggled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<'az' | 'za' | 'level_asc' | 'level_desc'>('az');
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Level counts
  const levelCounts = useMemo(() => {
    return {
      A1: allWords.filter(w => w.level === 'A1').length,
      A2: allWords.filter(w => w.level === 'A2').length,
      B1: allWords.filter(w => w.level === 'B1').length,
      B2: allWords.filter(w => w.level === 'B2').length,
    };
  }, [allWords]);

  // Export to CSV for Anki / Spreadsheet
  const handleExportCSV = () => {
    const headers = ['Word', 'Part of Speech', 'CEFR Level', 'Phonetic (IPA)', 'Indonesian Meaning', 'Example Sentence', 'Example Translation'];
    const rows = displayedWords.map((w) => [
      `"${w.word.replace(/"/g, '""')}"`,
      `"${w.pos.replace(/"/g, '""')}"`,
      `"${w.level}"`,
      `"${w.phonetic.replace(/"/g, '""')}"`,
      `"${w.meaningId.replace(/"/g, '""')}"`,
      `"${w.example.replace(/"/g, '""')}"`,
      `"${w.exampleId.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `oxford_3000_${selectedLevel}_vocabulary.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Words that user struggled with (mistakes >= 2 or marked don't know)
  const struggledWordsList = useMemo(() => {
    return allWords.filter((w) => {
      const p = progressMap[w.id];
      return p && (p.isStruggled || p.mistakesCount >= 2);
    }).sort((a, b) => {
      const ma = progressMap[a.id]?.mistakesCount || 0;
      const mb = progressMap[b.id]?.mistakesCount || 0;
      return mb - ma;
    });
  }, [allWords, progressMap]);

  // Favorites list
  const favoriteWordsList = useMemo(() => {
    return allWords.filter((w) => progressMap[w.id]?.isFavorite);
  }, [allWords, progressMap]);

  // Apply filters & sort
  const displayedWords = useMemo(() => {
    let list = allWords;
    if (activeTab === 'favorites') {
      list = favoriteWordsList;
    } else if (activeTab === 'struggled') {
      list = struggledWordsList;
    }

    const filtered = list.filter((item) => {
      // Search text filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchWord = item.word.toLowerCase().includes(query);
        const matchMeaning = item.meaningId.toLowerCase().includes(query);
        const matchEx = item.example.toLowerCase().includes(query);
        if (!matchWord && !matchMeaning && !matchEx) return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }

      // Alphabet jump filter
      if (selectedLetter !== 'ALL') {
        if (!item.word.toUpperCase().startsWith(selectedLetter)) {
          return false;
        }
      }

      // POS filter
      if (selectedPos !== 'all') {
        if (!item.pos.toLowerCase().includes(selectedPos.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const status = progressMap[item.id]?.status || 'NEW';
        if (status !== selectedStatus) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortOption === 'az') return a.word.localeCompare(b.word);
      if (sortOption === 'za') return b.word.localeCompare(a.word);
      const levelRank: Record<CEFRLevel, number> = { A1: 1, A2: 2, B1: 3, B2: 4 };
      if (sortOption === 'level_asc') {
        return levelRank[a.level] - levelRank[b.level] || a.word.localeCompare(b.word);
      }
      if (sortOption === 'level_desc') {
        return levelRank[b.level] - levelRank[a.level] || a.word.localeCompare(b.word);
      }
      return 0;
    });
  }, [allWords, activeTab, favoriteWordsList, struggledWordsList, searchQuery, selectedLevel, selectedLetter, selectedPos, selectedStatus, sortOption, progressMap]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedLetter('ALL');
    setSelectedPos('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters = searchQuery || selectedLevel !== 'all' || selectedLetter !== 'ALL' || selectedPos !== 'all' || selectedStatus !== 'all';
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="space-y-6 pb-16">
      {/* Top Main Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kamus Oxford 3000 ({allWords.length})
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            Favorit ({favoriteWordsList.length})
          </button>

          <button
            onClick={() => setActiveTab('struggled')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'struggled'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Words I Struggle With ({struggledWordsList.length})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'struggled' && struggledWordsList.length > 0 && (
            <button
              onClick={() => onStartSpecialReview(struggledWordsList)}
              className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-colors"
            >
              Review Khusus Kosakata Sulit
            </button>
          )}

          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Download kosakata dalam format CSV (bisa diimport ke Anki atau Excel)"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV / Anki
          </button>

          <button
            id="btn-print-cheatsheet"
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Buka tampilan cetak cheatsheet kosakata"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Cheatsheet
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top search & sorting line */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(24);
              }}
              placeholder="Cari kata (contoh: achieve, borrow, nasihat)..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none text-sm font-medium transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Urutan:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-transparent font-extrabold text-indigo-700 focus:outline-none cursor-pointer"
              >
                <option value="az">A ke Z</option>
                <option value="za">Z ke A</option>
                <option value="level_asc">Level (A1 → B2)</option>
                <option value="level_desc">Level (B2 → A1)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alphabet Quick Jump Bar */}
        <div className="pt-1 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1 min-w-max">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Abjad:</span>
            <button
              onClick={() => {
                setSelectedLetter('ALL');
                setVisibleCount(24);
              }}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all ${
                selectedLetter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => {
                  setSelectedLetter(letter);
                  setVisibleCount(24);
                }}
                className={`w-6 h-6 rounded-md text-xs font-bold transition-all flex items-center justify-center ${
                  selectedLetter === letter
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns / Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {/* Level Filter */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 flex-wrap">
            <span className="text-slate-400">Level:</span>
            {[
              { id: 'all', label: `Semua (${allWords.length})` },
              { id: 'A1', label: `A1 (${levelCounts.A1})` },
              { id: 'A2', label: `A2 (${levelCounts.A2})` },
              { id: 'B1', label: `B1 (${levelCounts.B1})` },
              { id: 'B2', label: `B2 (${levelCounts.B2})` }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => {
                  setSelectedLevel(lvl.id);
                  setVisibleCount(24);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                  selectedLevel === lvl.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Part of Speech Filter */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
            <span className="text-slate-400">Tipe:</span>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'v.', label: 'Verb' },
              { id: 'n.', label: 'Noun' },
              { id: 'adj.', label: 'Adj' },
              { id: 'adv.', label: 'Adv' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPos(p.id);
                  setVisibleCount(24);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                  selectedPos === p.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
            <span className="text-slate-400">Status:</span>
            {['all', 'NEW', 'LEARNING', 'REVIEW', 'MASTERED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setSelectedStatus(st);
                  setVisibleCount(24);
                }}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st === 'all' ? 'Semua' : st}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 ml-auto py-1 px-2"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Struggled Words Helpful Notice (if in struggled tab) */}
      {activeTab === 'struggled' && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-950">
            <p className="font-bold text-sm text-rose-900 mb-0.5">Words I Struggle With (Daftar Kosakata Sulit)</p>
            <p className="leading-relaxed text-slate-700">
              Bagian ini otomatis mengumpulkan kosakata yang pernah salah dijawab dalam kuis atau ditandai "Don't know" di flashcard. Kosakata ini akan lebih sering muncul dalam review harian sampai kamu benar-benar menguasainya.
            </p>
          </div>
        </div>
      )}

      {/* Counter summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
        <span>
          Menampilkan {Math.min(visibleCount, displayedWords.length)} dari <strong>{displayedWords.length}</strong> kosakata
          {selectedLevel !== 'all' ? ` (Level ${selectedLevel})` : ''}
        </span>
        <span className="text-[11px] text-slate-400">
          Aksen Audio: <strong>{stats.voiceAccent === 'uk' ? '🇬🇧 British (UK)' : '🇺🇸 American (US)'}</strong>
        </span>
      </div>

      {/* Words Grid / List */}
      {displayedWords.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <p className="text-base font-extrabold text-slate-800 mb-1">
            Tidak Ada Kosakata yang Cocok
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Coba ganti kata kunci pencarian atau bersihkan filter di atas.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {displayedWords.slice(0, visibleCount).map((item) => {
              const p = progressMap[item.id];
              const isFav = p?.isFavorite || false;
              const status = p?.status || 'NEW';
              const levelMeta = CEFR_LEVEL_METADATA[item.level];

              return (
                <div
                  key={item.id}
                  id={`vocab-item-${item.id}`}
                  className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-black text-slate-900 uppercase group-hover:text-indigo-600 transition-colors">
                          {item.word}
                        </span>
                        <span className="text-xs font-medium text-slate-500 italic">
                          {item.pos}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelMeta.badgeBg}`}>
                          {item.level}
                        </span>
                        {status !== 'NEW' && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            status === 'MASTERED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : status === 'REVIEW'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {status}
                          </span>
                        )}
                        {p && p.mistakesCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            {p.mistakesCount}x salah
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => playPronunciation(item.word, stats.voiceSpeed, stats.voiceAccent || 'us')}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title={`Dengarkan pengucapan ${stats.voiceAccent === 'uk' ? 'British (UK)' : 'American (US)'}`}
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onToggleFavorite(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFav
                              ? 'text-rose-500 hover:bg-rose-50'
                              : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'
                          }`}
                          title={isFav ? 'Hapus dari favorit' : 'Simpan favorit'}
                        >
                          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-extrabold text-indigo-950">
                      = {item.meaningId}
                    </p>

                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {item.phonetic} <span className="font-sans text-slate-400">({item.phoneticSimple})</span>
                    </p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      “{item.example}”
                    </p>

                    {/* Display user sentence if written */}
                    {stats.userSentences?.[item.id] && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Kalimat Buatanmu:
                        </span>
                        <p className="font-semibold text-indigo-950 mt-0.5 italic">
                          "{stats.userSentences[item.id]}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {item.simpleExplanation}
                    </span>

                    <button
                      onClick={() => onSelectWordForTutor(item)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0 ml-2"
                    >
                      Buka di Tutor
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Pagination Buttons */}
          {displayedWords.length > visibleCount && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 24)}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all"
              >
                Muat 24 Kata Lagi (Sisa {displayedWords.length - visibleCount})
              </button>
              <button
                onClick={() => setVisibleCount(displayedWords.length)}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
              >
                Tampilkan Semua ({displayedWords.length} Kata)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Printable Flashcards & Cheatsheet Modal */}
      <PrintFlashcardsModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        words={displayedWords}
        currentLevel={stats.currentLevel}
      />
    </div>
  );
};
