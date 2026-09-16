import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Flame, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CEFRLevel, OxfordWord, UserStats, WordProgress } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';
import { calculateBadges } from '../data/achievements';

interface ProgressViewProps {
  allWords: OxfordWord[];
  progressMap: Record<string, WordProgress>;
  stats: UserStats;
  levelStats: Record<CEFRLevel, { total: number; mastered: number; learning: number; review: number; newCount: number; percentage: number }>;
  onSelectLevel: (level: CEFRLevel) => void;
  onStartCheckpointTest: () => void;
  onSwitchTab: (tab: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  allWords,
  progressMap,
  stats,
  levelStats,
  onSelectLevel,
  onStartCheckpointTest,
  onSwitchTab
}) => {
  // Aggregate stats across all words
  let totalMastered = 0;
  let totalLearning = 0;
  let totalReview = 0;
  let totalNew = 0;

  allWords.forEach((w) => {
    const p = progressMap[w.id];
    if (!p || p.status === 'NEW') {
      totalNew++;
    } else if (p.status === 'MASTERED') {
      totalMastered++;
    } else if (p.status === 'REVIEW') {
      totalReview++;
    } else if (p.status === 'LEARNING') {
      totalLearning++;
    }
  });

  const totalLearnedOverall = totalMastered + totalLearning + totalReview;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Overview Dashboard Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-indigo-100">
              VOCABULARY DASHBOARD
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Perkembangan Kosakata Anda
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pantau penguasaan 3.000 kata Oxford 3000™ dari tingkat A1 hingga B2.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
            <span className="text-xs font-bold text-slate-500">Level Aktif:</span>
            <span className="text-sm font-extrabold text-indigo-700 flex items-center gap-1">
              {CEFR_LEVEL_METADATA[stats.currentLevel].icon} Level {stats.currentLevel}
            </span>
          </div>
        </div>

        {/* 4 Stat Metric Cards (Flattened, no nested clutter) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <span className="text-xs font-semibold text-slate-500 block">Total Oxford 3000</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
              3,000
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Standard Acuan Resmi</span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
            <span className="text-xs font-semibold text-emerald-800 block">Mastered (Dikuasai)</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block mt-1">
              {totalMastered}
            </span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">Konsisten Benar</span>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4">
            <span className="text-xs font-semibold text-amber-800 block">Need Review</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700 block mt-1">
              {totalReview + totalLearning}
            </span>
            <span className="text-[11px] text-amber-600 block mt-0.5">Spaced Repetition</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <span className="text-xs font-semibold text-slate-500 block">Belum Dipelajari</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-700 block mt-1">
              {totalNew}+
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Menanti di Jalur Belajar</span>
          </div>
        </div>
      </div>

      {/* CEFR Level Progress Breakdown (A1 -> A2 -> B1 -> B2) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              JALUR PEMBELAJARAN BERTAHAP (A1 → A2 → B1 → B2)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik pada level untuk beralih fokus belajar atau melihat kesiapan level checkpoint.
            </p>
          </div>

          <button
            onClick={onStartCheckpointTest}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-transform active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            Ambil Checkpoint Test
          </button>
        </div>

        <div className="space-y-4">
          {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => {
            const data = levelStats[lvl];
            const meta = CEFR_LEVEL_METADATA[lvl];
            const isSelected = stats.currentLevel === lvl;

            // Generate ascii progress bar representation for authentic prompt compliance:
            // A1 ████████░░
            const filledBlocks = Math.round((data.percentage / 100) * 10);
            const emptyBlocks = 10 - filledBlocks;
            const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

            return (
              <div
                key={lvl}
                className={`p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-300 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{meta.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">
                          Level {lvl} — {meta.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                            Aktif Sekarang
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {meta.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isSelected && (
                      <button
                        onClick={() => onSelectLevel(lvl)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors"
                      >
                        Pilih Level Ini
                      </button>
                    )}
                  </div>
                </div>

                {/* ASCII Representation matching prompt */}
                <div className="font-mono text-xs sm:text-sm text-indigo-800 tracking-wider mb-2 flex items-center justify-between select-none">
                  <span>{lvl} {asciiBar}</span>
                  <span className="font-sans font-black text-slate-900 text-sm">{data.percentage}% Mastered</span>
                </div>

                {/* Smooth Progress bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-3">
                    <span><b>{data.mastered}</b> Mastered</span>
                    <span><b>{data.learning}</b> Learning</span>
                    <span><b>{data.review}</b> Need Review</span>
                  </div>

                  {data.percentage >= 70 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Siap untuk level berikutnya!
                    </span>
                  ) : (
                    <span className="text-slate-400 font-medium">
                      Butuh 70% penguasaan sebelum naik level
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Difficulty Explanation Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 space-y-1 leading-relaxed">
          <p className="font-bold text-slate-900">
            Sistem Personalized Difficulty & Spaced Repetition
          </p>
          <p>
            Platform tidak membanjiri kamu dengan 3.000 kata sekaligus. Pembelajaran dimulai dari Level A1 (Beginner). Kosakata yang sering salah akan otomatis diulang lebih sering dalam review harian, sedangkan kata yang telah kamu kuasai akan muncul dengan jeda waktu lebih lama (3, 7, hingga 30 hari).
          </p>
        </div>
      </div>

      {/* Lencana & Pencapaian Belajar (Badges & Gamification) */}
      {(() => {
        const badges = calculateBadges(stats, progressMap);
        const unlockedCount = badges.filter((b) => b.isUnlocked).length;
        return (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block mb-1.5 border border-amber-100">
                  ACHIEVEMENTS & BADGES
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" />
                  Galeri Lencana Prestasi
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Buka lencana khusus seiring kemajuan belajarmu di Oxford 3000™.
                </p>
              </div>

              <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs sm:text-sm font-extrabold flex items-center gap-1.5">
                <span>⭐ {unlockedCount} dari {badges.length} Terbuka</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    b.isUnlocked
                      ? 'bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-amber-200 shadow-2xs'
                      : 'bg-slate-50/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl p-2 rounded-xl bg-white shadow-2xs border border-slate-100 shrink-0">
                      {b.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-black text-slate-900 truncate">
                          {b.title}
                        </h3>
                        {b.isUnlocked && (
                          <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {b.description}
                      </p>

                      {/* Progress bar for locked badge */}
                      {!b.isUnlocked && (
                        <div className="mt-2.5 space-y-1">
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${Math.min(100, (b.progress / b.target) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 block">
                            Progres: {b.progress}/{b.target}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
