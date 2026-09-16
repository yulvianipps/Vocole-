import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Pause, 
  Sparkles, 
  Check, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { MiniStory, OxfordWord, UserStats } from '../types';
import { MINI_STORIES } from '../data/stories';
import { TOPICS } from '../data/topics';
import { playPronunciation } from '../utils/speech';
import { CEFR_LEVEL_METADATA, OXFORD_WORDS } from '../data/oxfordWords';

interface StoriesViewProps {
  allWords?: OxfordWord[];
  stats: UserStats;
  onSelectWord: (word: OxfordWord) => void;
  onSwitchTab?: (tab: string) => void;
  onStartPractice?: () => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  allWords = OXFORD_WORDS,
  stats,
  onSelectWord,
  onSwitchTab,
  onStartPractice
}) => {
  const [selectedStory, setSelectedStory] = useState<MiniStory | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showTranslations, setShowTranslations] = useState(true);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [selectedWordPopup, setSelectedWordPopup] = useState<OxfordWord | null>(null);

  // Map of wordId to OxfordWord for instant lookup
  const wordsMap = React.useMemo(() => {
    const map = new Map<string, OxfordWord>();
    allWords.forEach((w) => map.set(w.id, w));
    return map;
  }, [allWords]);

  const filteredStories = MINI_STORIES.filter((s) => {
    if (selectedTopic === 'all') return true;
    return s.topic === selectedTopic;
  });

  const handlePlayLine = (lineId: string, text: string) => {
    setActiveLineId(lineId);
    playPronunciation(text, stats.voiceSpeed);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Banner */}
      {!selectedStory ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-indigo-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-white/10">
                <MessageSquare className="w-3.5 h-3.5" />
                SITUATIONAL MINI-STORIES & DIALOGUES
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Belajar Kosakata Lewat Percakapan Nyata
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                Kosakata Oxford 3000™ lebih mudah diingat ketika dipelajari dalam alur cerita dan dialog sehari-hari. Dengarkan pelafalan penutur asli dan klik kata untuk melihat artinya.
              </p>
            </div>
          </div>

          {/* Topic Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedTopic === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              Semua Topik ({MINI_STORIES.length})
            </button>
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
                  selectedTopic === t.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.nameId}</span>
              </button>
            ))}
          </div>

          {/* Story Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredStories.map((story) => {
              const topicMeta = TOPICS.find((t) => t.id === story.topic);
              const levelMeta = CEFR_LEVEL_METADATA[story.level];

              return (
                <div
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span>{topicMeta?.icon}</span>
                        <span>{topicMeta?.nameId}</span>
                      </span>
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                        {levelMeta.icon} {story.level}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {story.titleId}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 pt-1">
                      {story.situation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>{story.lines.length} Baris Dialog</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Buka Dialog <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* DETAIL DIALOGUE VIEW */
        <div className="space-y-6">
          {/* Back & Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setSelectedStory(null);
                setSelectedWordPopup(null);
              }}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Cerita
            </button>

            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              {showTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showTranslations ? 'Sembunyikan Arti' : 'Tampilkan Arti'}
            </button>
          </div>

          {/* Story Intro Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                LEVEL {selectedStory.level}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedStory.lines.length} Baris Dialog
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {selectedStory.title}
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {selectedStory.titleId}
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 mt-3">
              <strong>Situasi:</strong> {selectedStory.situation}
            </div>
          </div>

          {/* Dialogue Lines */}
          <div className="space-y-3">
            {selectedStory.lines.map((line) => {
              const isActive = activeLineId === line.id;

              return (
                <div
                  key={line.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                    isActive
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-2xs">
                        {line.avatar}
                      </span>
                      <div>
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                          {line.speaker}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Penutur
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayLine(line.id, line.textEn)}
                      className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shrink-0"
                      title="Dengarkan pelafalan kalimat ini"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* English text with clickable target words */}
                  <div className="mt-3 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    “{line.textEn}”
                  </div>

                  {/* Indonesian Translation */}
                  {showTranslations && (
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic">
                      {line.textId}
                    </p>
                  )}

                  {/* Target Oxford Words in this line */}
                  {line.targetWordIds && line.targetWordIds.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Kosakata Target:
                      </span>
                      {line.targetWordIds.map((wId) => {
                        const wordObj = wordsMap.get(wId);
                        if (!wordObj) return null;

                        return (
                          <button
                            key={wId}
                            onClick={() => setSelectedWordPopup(wordObj)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold hover:bg-indigo-100 transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            {wordObj.word}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Word Pop-up Modal when clicking target word in dialogue */}
          {selectedWordPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    KOSAKATA OXFORD 3000™
                  </span>
                  <button
                    onClick={() => setSelectedWordPopup(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedWordPopup.word}
                    </h4>
                    <button
                      onClick={() => playPronunciation(selectedWordPopup.word, stats.voiceSpeed)}
                      className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedWordPopup.pos} • {selectedWordPopup.phonetic}
                  </p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 pt-1">
                    = {selectedWordPopup.meaningId}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 italic">
                  "{selectedWordPopup.example}"
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedWordPopup(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      onSelectWord(selectedWordPopup);
                      onSwitchTab('learn');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                  >
                    Buka di Tutor Kata
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
