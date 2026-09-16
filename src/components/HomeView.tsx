import React from 'react';
import { 
  Play, 
  Volume2, 
  Layers, 
  CheckCircle, 
  Mic, 
  Flame, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Bookmark,
  Gamepad2,
  Headphones,
  GraduationCap,
  MessageSquare,
  Activity,
  Zap
} from 'lucide-react';
import { CEFRLevel, OxfordWord, UserStats, WordProgress } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';
import { playPronunciation } from '../utils/speech';

interface HomeViewProps {
  todayWords: OxfordWord[];
  dueWords: OxfordWord[];
  struggledWords: OxfordWord[];
  levelStats: Record<CEFRLevel, { total: number; mastered: number; learning: number; review: number; newCount: number; percentage: number }>;
  stats: UserStats;
  progressMap: Record<string, WordProgress>;
  onStartLearning: () => void;
  onStartReview: () => void;
  onStartQuiz: () => void;
  onStartSpeaking: () => void;
  onSelectWord: (word: OxfordWord) => void;
  onSwitchTab: (tab: string) => void;
  onToggleFavorite: (wordId: string) => void;
  onOpenAudioMode?: () => void;
  onOpenPlacementTest?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  todayWords,
  dueWords,
  struggledWords,
  levelStats,
  stats,
  progressMap,
  onStartLearning,
  onStartReview,
  onStartQuiz,
  onStartSpeaking,
  onSelectWord,
  onSwitchTab,
  onToggleFavorite,
  onOpenAudioMode,
  onOpenPlacementTest
}) => {
  // Determine time-of-day greeting
  const hour = new Date().getHours();
  let greeting = 'GOOD MORNING 👋';
  let greetingSub = 'Selamat pagi! Siap belajar kosakata baru hari ini?';
  if (hour >= 12 && hour < 17) {
    greeting = 'GOOD AFTERNOON 👋';
    greetingSub = 'Selamat siang! Luangkan 10 menit untuk memperkuat kosakatamu.';
  } else if (hour >= 17) {
    greeting = 'GOOD EVENING 👋';
    greetingSub = 'Selamat malam! Mari selesaikan target kosakata sebelum beristirahat.';
  }

  // Days of week for streak
  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  const currentLevelInfo = CEFR_LEVEL_METADATA[stats.currentLevel];
  const isDailyCompleted = stats.todayStudiedCount >= stats.dailyTarget;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Greeting & Daily Action Card */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SISTEM BELAJAR BERTAHAP
            </span>
            <span className="text-xs font-semibold text-indigo-200 bg-white/10 px-2.5 py-1 rounded-md">
              Target: {stats.dailyTarget} kata/hari
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {greeting}
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 max-w-2xl mb-6">
            {greetingSub}
          </p>

          {/* Daily Status Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                {todayWords.length}
              </div>
              <div>
                <p className="text-xs text-indigo-200 font-medium">Kata Baru Hari Ini</p>
                <p className="text-sm font-bold text-white">Level {stats.currentLevel} ({currentLevelInfo.name})</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                {dueWords.length}
              </div>
              <div>
                <p className="text-xs text-indigo-200 font-medium">Perlu Diulang (Review)</p>
                <p className="text-sm font-bold text-white">Spaced Repetition</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold">
                {struggledWords.length}
              </div>
              <div>
                <p className="text-xs text-indigo-200 font-medium">Kosakata Sulit</p>
                <p className="text-sm font-bold text-white">Words I Struggle With</p>
              </div>
            </div>
          </div>

          {/* Main Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-start-learning"
              onClick={onStartLearning}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-sm transition-transform active:scale-98"
            >
              <Play className="w-5 h-5 fill-current" />
              START LEARNING ({todayWords.length} WORDS)
            </button>

            {dueWords.length > 0 && (
              <button
                id="btn-quick-review"
                onClick={onStartReview}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                <Layers className="w-4 h-4" />
                Review {dueWords.length} Kata
              </button>
            )}

            <button
              id="btn-quick-quiz"
              onClick={onStartQuiz}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Kuis Cepat
            </button>

            <button
              id="btn-quick-games"
              onClick={() => onSwitchTab('games')}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-colors"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              Mini-Games
            </button>

            {onOpenAudioMode && (
              <button
                id="btn-quick-audio-mode"
                onClick={onOpenAudioMode}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-100 font-bold text-sm border border-indigo-400/30 transition-colors"
                title="Mode dengar santai / commute tanpa menatap layar"
              >
                <Headphones className="w-4 h-4 text-indigo-300" />
                Audio Mode
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Diagnostic Placement Test Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-amber-950/30 dark:via-indigo-950/30 dark:to-emerald-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                Tes Penempatan Level CEFR
              </h3>
              {stats.placementResult && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Terverifikasi: {stats.placementResult.recommendedLevel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {stats.placementResult
                ? `Skor diagnostik: ${stats.placementResult.score}/${stats.placementResult.totalQuestions}. Ingin menguji kembali kemampuan kosakatamu?`
                : 'Bingung mulai dari level mana? Ambil kuis diagnostik 15 soal (~3 menit) untuk menentukan level idealmu.'}
            </p>
          </div>
        </div>

        {onOpenPlacementTest && (
          <button
            id="btn-trigger-placement-test"
            onClick={onOpenPlacementTest}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{stats.placementResult ? 'Ukur Ulang Level' : 'Mulai Tes Cepat'}</span>
          </button>
        )}
      </div>

      {/* Memory Retention Health Widget (Spaced Repetition & Ebbinghaus Curve) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                Kesehatan Memori Kosakata (Spaced Repetition)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Berdasarkan kurva lupa Ebbinghaus: review tepat waktu mencegah kosakata terlupakan
              </p>
            </div>
          </div>

          {dueWords.length > 0 && (
            <button
              onClick={onStartReview}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              Review {dueWords.length} Kata Sekarang
            </button>
          )}
        </div>

        {/* Retention Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block">
                Memori Kuat (Mastered)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sudah terekam permanen</p>
            </div>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {(Object.values(progressMap) as WordProgress[]).filter((p) => p.status === 'MASTERED').length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide block">
                Mulai Pudar (Review Due)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Perlu penyegaran ingatan</p>
            </div>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {dueWords.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide block">
                Kata Sulit (Struggled)
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sering salah saat kuis</p>
            </div>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {struggledWords.length}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Progress Completion Banner (if user practiced today) */}
      {stats.todayStudiedCount > 0 && (
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">TODAY'S PROGRESS</h2>
              <p className="text-xs text-slate-600">
                {isDailyCompleted 
                  ? 'Target harianmu hari ini sudah tercapai dengan gemilang! 🎉' 
                  : `Kamu telah mempelajari ${stats.todayStudiedCount} dari target ${stats.dailyTarget} kata hari ini.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 border-t sm:border-t-0 pt-2 sm:pt-0">
            <span className="flex items-center gap-1 text-emerald-700">
              ✅ <b>{stats.todayStudiedCount}</b> new words
            </span>
            <span className="flex items-center gap-1 text-sky-700">
              🔁 <b>{stats.todayReviewedCount}</b> reviewed
            </span>
            <span className="flex items-center gap-1 text-indigo-700">
              🎯 <b>{stats.todayQuizTotal > 0 ? Math.round((stats.todayQuizCorrect / stats.todayQuizTotal) * 100) : 0}%</b> quiz accuracy
            </span>
          </div>
        </div>
      )}

      {/* 7-Day Streak & Learning Habit Visualizer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                🔥 {stats.streak} DAY STREAK
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Belajar sedikit setiap hari lebih efektif daripada menghafal sekaligus.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            Konsistensi Aktif
          </span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 pt-1">
          {daysOfWeek.map((day, idx) => {
            const isToday = idx === todayDayIndex;
            const isPast = idx < todayDayIndex;
            const isActiveDay = isPast || (isToday && stats.todayStudiedCount > 0);

            return (
              <div 
                key={day}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                  isToday 
                    ? 'border-indigo-500 bg-indigo-50/60 shadow-xs' 
                    : isActiveDay 
                    ? 'border-amber-200 bg-amber-50/40 text-amber-900' 
                    : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-bold uppercase mb-1">{day}</span>
                {isActiveDay ? (
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                ) : isToday ? (
                  <span className="text-xs font-extrabold text-indigo-600">Hari ini</span>
                ) : (
                  <span className="text-xs text-slate-300">○</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TODAY'S VOCABULARY LIST */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">TODAY'S VOCABULARY</h2>
              <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                {todayWords.length} words
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fokus hari ini: pahami arti, dengarkan pronunciation, lalu ucapkan.
            </p>
          </div>

          <button
            id="btn-learn-all"
            onClick={onStartLearning}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 group"
          >
            Mulai Tutor Interaktif
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {todayWords.map((item, index) => {
            const p = progressMap[item.id];
            const isFav = p?.isFavorite || false;
            const status = p?.status || 'NEW';

            return (
              <div
                key={item.id}
                id={`today-word-${item.id}`}
                className="group p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all flex items-start justify-between gap-3 cursor-pointer shadow-2xs"
                onClick={() => onSelectWord(item)}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.word}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic">
                        {item.pos}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.level}
                      </span>
                      {status !== 'NEW' && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          status === 'MASTERED' 
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                            : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {status}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 mt-0.5 truncate">
                      = {item.meaningId}
                    </p>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                      {item.phonetic} <span className="text-slate-400 dark:text-slate-500 font-sans">({item.phoneticSimple})</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playPronunciation(item.word, stats.voiceSpeed);
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Dengarkan pengucapan American English"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isFav 
                        ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50' 
                        : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isFav ? 'Hapus dari favorit' : 'Tambahkan ke favorit'}
                  >
                    <Bookmark className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Situational Mini-Stories & Dialogue Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                BARU
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Mini-Stories & Dialog Situasional
              </h3>
            </div>
            <p className="text-xs text-indigo-200 mt-1 max-w-xl">
              Lihat bagaimana kosakata Oxford 3000™ digunakan langsung dalam dialog nyata: memesan kopi di kafe, wawancara kerja, dan check-in hotel.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSwitchTab('stories')}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs shadow-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Buka Stories</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CEFR Learning Path Level Progress Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
              SISTEM BELAJAR BERTAHAP (CEFR PATH)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Progress dihitung berdasarkan kosakata yang telah dipelajari dan berhasil dijawab dalam kuis.
            </p>
          </div>
          <button 
            onClick={() => onSwitchTab('progress')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Lihat Detail
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['A1', 'A2', 'B1', 'B2'] as CEFRLevel[]).map((lvl) => {
            const data = levelStats[lvl];
            const meta = CEFR_LEVEL_METADATA[lvl];
            const isCurrent = stats.currentLevel === lvl;

            const filledBlocks = Math.round((data.percentage / 100) * 10);
            const emptyBlocks = 10 - filledBlocks;
            const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

            return (
              <div
                key={lvl}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-300 dark:ring-indigo-700' 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{meta.icon}</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">Level {lvl}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{meta.name}</span>
                </div>

                {/* Visual ASCII Bar & Percentage */}
                <div className="font-mono text-xs text-indigo-700 dark:text-indigo-400 tracking-wider mb-2 select-none">
                  {asciiBar} <span className="font-sans font-bold text-slate-900 dark:text-white ml-1">{data.percentage}%</span>
                </div>

                {/* Progress bar line */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>{data.mastered} Mastered</span>
                  <span>{data.learning} Learning</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
