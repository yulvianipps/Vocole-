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
  Pencil
} from 'lucide-react';
import { CEFRLevel, OxfordWord, UserStats, WordProgress } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';
import { playPronunciation } from '../utils/speech';

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
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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

  // Apply filters
  const displayedWords = useMemo(() => {
    let list = allWords;
    if (activeTab === 'favorites') {
      list = favoriteWordsList;
    } else if (activeTab === 'struggled') {
      list = struggledWordsList;
    }

    return list.filter((item) => {
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
  }, [allWords, activeTab, favoriteWordsList, struggledWordsList, searchQuery, selectedLevel, selectedPos, selectedStatus, progressMap]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedPos('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters = searchQuery || selectedLevel !== 'all' || selectedPos !== 'all' || selectedStatus !== 'all';

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
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Filter Dropdowns / Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Level Filter */}
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
            <span className="text-slate-400">Level:</span>
            {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {lvl === 'all' ? 'Semua' : lvl}
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
                onClick={() => setSelectedPos(p.id)}
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
                onClick={() => setSelectedStatus(st)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {displayedWords.map((item, index) => {
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
                        onClick={() => playPronunciation(item.word, stats.voiceSpeed)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Dengarkan pengucapan American English"
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
                  <span className="text-[11px] text-slate-400">
                    {item.simpleExplanation}
                  </span>

                  <button
                    onClick={() => onSelectWordForTutor(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors shrink-0 ml-2"
                  >
                    Buka Tutor
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Print Cheatsheet Modal / View */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  📄 Cetak Cheatsheet Kosakata Oxford 3000™
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menampilkan {displayedWords.length} kata ({selectedLevel === 'all' ? 'Semua Level' : `Level ${selectedLevel}`}). Siap dicetak atau disimpan sebagai PDF.
                </p>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl p-4 bg-slate-50/50 print:bg-white print:border-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-700 font-extrabold">
                    <th className="py-2 px-2">Word</th>
                    <th className="py-2 px-2">Pos</th>
                    <th className="py-2 px-2">Level</th>
                    <th className="py-2 px-2">Phonetic</th>
                    <th className="py-2 px-2">Arti Bahasa Indonesia</th>
                    <th className="py-2 px-2">Contoh Kalimat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {displayedWords.map((w) => (
                    <tr key={w.id} className="hover:bg-indigo-50/30">
                      <td className="py-2 px-2 font-bold text-slate-900">{w.word}</td>
                      <td className="py-2 px-2 text-slate-500 italic">{w.pos}</td>
                      <td className="py-2 px-2">
                        <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                          {w.level}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-mono text-slate-600">{w.phonetic}</td>
                      <td className="py-2 px-2 font-bold text-indigo-900">{w.meaningId}</td>
                      <td className="py-2 px-2 text-slate-600 italic">“{w.example}”</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm shadow-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Cetak / Simpan PDF (Ctrl+P)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
