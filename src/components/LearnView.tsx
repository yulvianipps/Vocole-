import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Mic, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Bookmark, 
  HelpCircle, 
  Layers, 
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Pencil,
  VolumeX,
  Send
} from 'lucide-react';
import { OxfordWord, UserStats, WordProgress } from '../types';
import { CEFR_LEVEL_METADATA, WORD_FAMILIES } from '../data/oxfordWords';
import { playPronunciation, startVoiceRecognition, evaluatePronunciation } from '../utils/speech';

interface LearnViewProps {
  words: OxfordWord[];
  activeWord: OxfordWord | null;
  onSelectWord: (word: OxfordWord) => void;
  onWordStudied: (wordId: string) => void;
  onToggleFavorite: (wordId: string) => void;
  onSaveUserSentence?: (wordId: string, sentence: string) => void;
  progressMap: Record<string, WordProgress>;
  stats: UserStats;
  onSwitchTab: (tab: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  words,
  activeWord,
  onSelectWord,
  onWordStudied,
  onToggleFavorite,
  onSaveUserSentence,
  progressMap,
  stats,
  onSwitchTab
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingResult, setSpeakingResult] = useState<{ score: number; feedback: string; transcript: string } | null>(null);
  const [speakingError, setSpeakingError] = useState<string | null>(null);
  const [hasMarkedCurrentWord, setHasMarkedCurrentWord] = useState(false);
  
  // Sentence Studio State
  const [userSentenceInput, setUserSentenceInput] = useState('');
  const [sentenceFeedback, setSentenceFeedback] = useState<{ isSuccess: boolean; msg: string } | null>(null);
  const [isSentenceSaved, setIsSentenceSaved] = useState(false);

  // Sync with activeWord if passed from home
  useEffect(() => {
    if (activeWord) {
      const idx = words.findIndex((w) => w.id === activeWord.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [activeWord, words]);

  const currentWord = words[currentIndex] || words[0];

  // Reset speaking states and load saved sentence when current word changes
  useEffect(() => {
    setIsRecording(false);
    setSpeakingResult(null);
    setSpeakingError(null);
    setHasMarkedCurrentWord(false);
    if (currentWord) {
      const existing = stats.userSentences?.[currentWord.id] || '';
      setUserSentenceInput(existing);
      setIsSentenceSaved(Boolean(existing));
      setSentenceFeedback(null);
    }
  }, [currentIndex, currentWord, stats.userSentences]);

  if (!words || words.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Semua Kosakata Telah Selesai</h2>
        <p className="text-sm text-slate-600 mb-6">
          Kamu sudah menyelesaikan kosakata untuk sesi ini. Coba buka mode Review atau Kuis untuk menguji daya ingatmu!
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onSwitchTab('flashcards')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors"
          >
            Buka Flashcards
          </button>
          <button
            onClick={() => onSwitchTab('quiz')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Mulai Kuis
          </button>
        </div>
      </div>
    );
  }

  const currentProgress = progressMap[currentWord.id];
  const isFavorite = currentProgress?.isFavorite || false;
  const levelMeta = CEFR_LEVEL_METADATA[currentWord.level];

  // Find related word family if present in our database
  const wordFamilyData = WORD_FAMILIES.find((wf) => 
    wf.words.some((w) => w.word.toLowerCase() === currentWord.word.toLowerCase())
  );

  const handleNext = () => {
    if (!hasMarkedCurrentWord) {
      onWordStudied(currentWord.id);
      setHasMarkedCurrentWord(true);
    }
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Start speaking practice
  const handleStartSpeaking = () => {
    setSpeakingError(null);
    setSpeakingResult(null);
    setIsRecording(true);

    const stop = startVoiceRecognition(
      (res) => {
        setIsRecording(false);
        const evalResult = evaluatePronunciation(currentWord.speakingPrompt, res.transcript);
        setSpeakingResult({
          score: evalResult.accuracyScore,
          feedback: evalResult.feedback,
          transcript: res.transcript
        });
      },
      (err) => {
        setIsRecording(false);
        setSpeakingError(err);
      }
    );

    // Auto timeout after 6 seconds
    setTimeout(() => {
      if (isRecording) {
        stop();
        setIsRecording(false);
      }
    }, 6000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Batch Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Kata Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kata {currentIndex + 1} dari {words.length}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-extrabold text-slate-900 text-sm">
                Target Harian: Level {stats.currentLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(currentWord.id)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isFavorite
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={isFavorite ? 'Disimpan di Favorit' : 'Tambah ke Favorit'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Kata Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Tutor Learning Card: Strictly ordered STEP 1 to STEP 9 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Badges: STEP 4 & 5 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              STEP 4 • {currentWord.pos}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${levelMeta.badgeBg}`}>
              STEP 5 • Level {currentWord.level} {levelMeta.icon}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            Sumber Resmi: The Oxford 3000™
          </span>
        </div>

        {/* STEP 1: WORD & STEP 2: PRONUNCIATION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
              STEP 1 — WORD
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              {currentWord.word}
            </h1>
          </div>

          {/* STEP 2: Pronunciation */}
          <div className="flex items-center gap-3 bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 p-3 rounded-2xl">
            <button
              id="btn-listen-word"
              onClick={() => playPronunciation(currentWord.word, stats.voiceSpeed)}
              className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0"
              title="Dengarkan pengucapan American English"
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                STEP 2 — PRONUNCIATION
              </span>
              <p className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                {currentWord.phonetic}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Dibaca: <span className="font-bold text-indigo-900 dark:text-indigo-300">{currentWord.phoneticSimple}</span>
              </p>
            </div>
          </div>
        </div>

        {/* STEP 3: MEANING */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            STEP 3 — MEANING (ARTI BAHASA INDONESIA)
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-950">
            {currentWord.word} = <span className="text-indigo-600">{currentWord.meaningId}</span>
          </p>
        </div>

        {/* STEP 6: SIMPLE EXPLANATION */}
        <div className="bg-amber-50/60 rounded-2xl p-4 sm:p-5 border border-amber-200/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            STEP 6 — SIMPLE EXPLANATION (PENJELASAN SEDERHANA)
          </span>
          <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
            {currentWord.simpleExplanation}
          </p>
        </div>

        {/* STEP 7: EXAMPLE & TRANSLATION */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            STEP 7 — EXAMPLE SENTENCE
          </span>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 relative group">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base sm:text-lg font-bold text-slate-900">
                  “{currentWord.example}”
                </p>
                <p className="text-sm font-medium text-slate-600 mt-1 italic">
                  Artinya: “{currentWord.exampleId}”
                </p>
              </div>

              <button
                onClick={() => playPronunciation(currentWord.example, stats.voiceSpeed)}
                className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shrink-0"
                title="Dengarkan contoh kalimat"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* STEP 8: MORE EXAMPLES (if available) */}
        {currentWord.moreExamples && currentWord.moreExamples.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              STEP 8 — MORE EXAMPLES (CONTOH TAMBAHAN)
            </span>
            <div className="space-y-2">
              {currentWord.moreExamples.map((ex, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">“{ex.sentence}”</p>
                    <p className="text-xs text-slate-500 mt-0.5">Artinya: “{ex.translation}”</p>
                  </div>
                  <button
                    onClick={() => playPronunciation(ex.sentence, stats.voiceSpeed)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMON COLLOCATIONS (Authentic Oxford word combinations) */}
        {currentWord.collocations && currentWord.collocations.length > 0 && (
          <div className="space-y-2.5 bg-gradient-to-br from-indigo-50/70 to-blue-50/50 rounded-2xl p-4 sm:p-5 border border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                COMMON COLLOCATIONS (PASANGAN KATA ALAMI)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Gunakan agar terdengar seperti penutur asli
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {currentWord.collocations.map((col, idx) => (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl p-3 border border-indigo-100 shadow-2xs flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{col.phrase}</p>
                    <p className="text-xs text-slate-500">= {col.meaningId}</p>
                  </div>
                  <button
                    onClick={() => playPronunciation(col.phrase, stats.voiceSpeed)}
                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors shrink-0"
                    title="Dengarkan pengucapan collocation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: SPEAKING PRACTICE ("SAY IT") */}
        <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-emerald-50/40 rounded-2xl p-5 border border-indigo-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              STEP 9 — SPEAKING PRACTICE (LATIHAN PENGUCAPAN)
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Tirukan dengan lantang
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-2xs">
            <p className="text-base sm:text-lg font-black text-indigo-950">
              “{currentWord.speakingPrompt}”
            </p>
          </div>

          {/* Action buttons: Listen & Practice */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              id="btn-listen-prompt"
              onClick={() => playPronunciation(currentWord.speakingPrompt, stats.voiceSpeed)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              🔊 Listen
            </button>

            <button
              id="btn-record-prompt"
              onClick={handleStartSpeaking}
              disabled={isRecording}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-2xs transition-all ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Mic className="w-4 h-4" />
              {isRecording ? 'Mendengarkan suara...' : '🎤 Practice (Rekam Suara)'}
            </button>
          </div>

          {/* Speech Feedback Display */}
          {speakingResult && (
            <div className="mt-3 bg-white rounded-xl p-4 border border-emerald-200 shadow-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Skor Kemiripan Pengucapan:</span>
                <span className={`text-sm font-black px-2.5 py-0.5 rounded-full ${
                  speakingResult.score >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {speakingResult.score}%
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Suara terdengar: <span className="font-bold text-slate-900">"{speakingResult.transcript}"</span>
              </p>
              <p className="text-xs font-semibold text-emerald-700">
                {speakingResult.feedback}
              </p>
            </div>
          )}

          {speakingError && (
            <div className="text-xs font-medium text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
              ℹ️ {speakingError}
            </div>
          )}
        </div>

        {/* SECTION 4: "DON'T CONFUSE THESE WORDS" (If word has confusing pair) */}
        {currentWord.confusingPair && (
          <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h2 className="font-extrabold text-sm sm:text-base">
                DON'T CONFUSE THESE WORDS!
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <p className="font-black text-slate-900 text-base">{currentWord.confusingPair.targetWord}</p>
                <p className="text-xs font-medium text-slate-600">= {currentWord.confusingPair.targetMeaning}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <p className="font-black text-amber-900 text-base">{currentWord.confusingPair.confusedWith}</p>
                <p className="text-xs font-medium text-slate-600">= {currentWord.confusingPair.confusedMeaning}</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed pt-1 font-medium">
              💡 {currentWord.confusingPair.explanation}
            </p>
            <p className="text-[11px] text-slate-500 italic">
              {currentWord.confusingPair.tip}
            </p>
          </div>
        )}

        {/* SECTION 5: WORD FAMILY (Authentic Oxford 3000 links) */}
        {wordFamilyData && (
          <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h2 className="font-extrabold text-sm uppercase tracking-wide">
                WORD FAMILY (KELUARGA KATA DI OXFORD 3000)
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Memahami hubungan kata akan mempermudah kamu mengingat banyak kosakata sekaligus:
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {wordFamilyData.words.map((wf, idx) => {
                const isCurrent = wf.word.toLowerCase() === currentWord.word.toLowerCase();
                return (
                  <React.Fragment key={wf.word}>
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200'
                    }`}>
                      <span>{wf.word}</span>
                      <span className={`text-[10px] ml-1.5 opacity-75 font-normal`}>({wf.pos})</span>
                    </div>
                    {idx < wordFamilyData.words.length - 1 && (
                      <span className="text-slate-400 font-bold">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVE PRODUCTION: MAKE YOUR OWN SENTENCE */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-indigo-600" />
              LATIHAN BIKIN KALIMAT SENDIRI (ACTIVE PRODUCTION)
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Gunakan kata: <strong className="text-indigo-600">{currentWord.word}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Kunci menguasai kosakata adalah memakainya langsung. Ketik 1 kalimat bahasa Inggris buatanmu sendiri:
          </p>

          <div className="space-y-2">
            <textarea
              rows={2}
              value={userSentenceInput}
              onChange={(e) => {
                setUserSentenceInput(e.target.value);
                setSentenceFeedback(null);
              }}
              placeholder={`Contoh: I want to ${currentWord.word}...`}
              className="w-full p-3.5 text-sm font-medium rounded-xl border border-slate-200 bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const raw = userSentenceInput.trim();
                    if (!raw) {
                      setSentenceFeedback({ isSuccess: false, msg: 'Tulis kalimat bahasa Inggrismu terlebih dahulu!' });
                      return;
                    }

                    const wordsInSentence = raw.split(/\s+/).filter(Boolean);
                    if (wordsInSentence.length < 3) {
                      setSentenceFeedback({ isSuccess: false, msg: 'Kalimat terlalu singkat. Buatlah minimal 3 kata agar membentuk kalimat utuh.' });
                      return;
                    }

                    const cleanWord = currentWord.word.toLowerCase();
                    const cleanSentence = raw.toLowerCase();
                    const hasWord = cleanSentence.includes(cleanWord);

                    if (!hasWord) {
                      setSentenceFeedback({ 
                        isSuccess: false, 
                        msg: `Pastikan kalimatmu menyertakan kata "${currentWord.word}".` 
                      });
                      return;
                    }

                    const startsWithCapital = /^[A-Z]/.test(raw);
                    const endsWithPunctuation = /[.!?]$/.test(raw);

                    if (!startsWithCapital || !endsWithPunctuation) {
                      setSentenceFeedback({
                        isSuccess: true,
                        msg: `Bagus! Kata "${currentWord.word}" berhasil dipakai. Tips menulis: Awali huruf kapital (${raw[0].toUpperCase()}) dan akhiri tanda titik (.).`
                      });
                    } else {
                      setSentenceFeedback({
                        isSuccess: true,
                        msg: `Luar biasa! Kalimatmu rapi, diawali huruf kapital, dan menggunakan kata "${currentWord.word}" secara tepat.`
                      });
                    }

                    if (onSaveUserSentence) {
                      onSaveUserSentence(currentWord.id, raw);
                      setIsSentenceSaved(true);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Cek & Simpan Kalimat
                </button>

                {userSentenceInput.trim() && (
                  <button
                    type="button"
                    onClick={() => playPronunciation(userSentenceInput.trim(), stats.voiceSpeed)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors shadow-2xs"
                    title="Dengarkan pengucapan kalimat buatanmu"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isSentenceSaved && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  Tersimpan di Profil
                </span>
              )}
            </div>

            {sentenceFeedback && (
              <div className={`p-3 rounded-xl text-xs font-medium border ${
                sentenceFeedback.isSuccess 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {sentenceFeedback.msg}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Completion & Next Word Navigation */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onWordStudied(currentWord.id);
              setHasMarkedCurrentWord(true);
            }}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              hasMarkedCurrentWord || currentProgress?.status !== 'NEW'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Check className="w-4 h-4" />
            {hasMarkedCurrentWord || currentProgress?.status !== 'NEW' ? 'Sudah Dipelajari' : 'Tandai Sudah Dipahami'}
          </button>

          <div className="flex items-center gap-2">
            {currentIndex < words.length - 1 ? (
              <button
                id="btn-next-word"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-transform active:scale-98"
              >
                Kata Berikutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-finish-batch"
                onClick={() => {
                  onWordStudied(currentWord.id);
                  onSwitchTab('flashcards');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-xs transition-transform active:scale-98"
              >
                Selesai & Lanjut Review (Flashcard)
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
