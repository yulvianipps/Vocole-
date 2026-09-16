import React, { useState } from 'react';
import { 
  Volume2, 
  Mic, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OxfordWord, UserStats } from '../types';
import { playPronunciation, startVoiceRecognition, evaluatePronunciation } from '../utils/speech';

interface SpeakingViewProps {
  words: OxfordWord[];
  stats: UserStats;
}

export const SpeakingView: React.FC<SpeakingViewProps> = ({ words, stats }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [speechResult, setSpeechResult] = useState<{
    score: number;
    feedback: string;
    transcript: string;
    matchedWords: string[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);

  if (!words || words.length === 0) return null;

  const currentWord = words[currentIndex] || words[0];

  const handleStartRecording = () => {
    setErrorMessage(null);
    setSpeechResult(null);
    setIsRecording(true);

    const stop = startVoiceRecognition(
      (res) => {
        setIsRecording(false);
        const evalResult = evaluatePronunciation(currentWord.speakingPrompt, res.transcript);
        setSpeechResult({
          score: evalResult.accuracyScore,
          feedback: evalResult.feedback,
          transcript: res.transcript,
          matchedWords: evalResult.matchedWords
        });

        if (evalResult.accuracyScore >= 80) {
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.7 }
            });
          } catch (e) {
            // ignore
          }
        }
      },
      (err) => {
        setIsRecording(false);
        setErrorMessage(err);
      }
    );

    // Stop automatically after 6 seconds
    setTimeout(() => {
      if (isRecording) {
        stop();
        setIsRecording(false);
      }
    }, 6000);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSpeechResult(null);
      setErrorMessage(null);
      setIsRecording(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSpeechResult(null);
      setErrorMessage(null);
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-sm flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
            SPEAKING PRACTICE
          </span>
          <h1 className="text-2xl font-black tracking-tight">“SAY IT” — Ucapkan dengan Lantang</h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
            Membiasakan lidah dan telingamu dengan kalimat praktis bahasa Inggris American sehari-hari.
          </p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
          <Mic className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Word & Sentence Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Navigation & Progress */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-500">
              Latihan {currentIndex + 1} dari {words.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === words.length - 1}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            <button
              onClick={() => setPlaybackSpeed(0.75)}
              className={`px-2 py-1 rounded-lg transition-colors ${playbackSpeed === 0.75 ? 'bg-white text-indigo-700 shadow-2xs' : ''}`}
            >
              0.8x (Lambat)
            </button>
            <button
              onClick={() => setPlaybackSpeed(0.95)}
              className={`px-2 py-1 rounded-lg transition-colors ${playbackSpeed === 0.95 ? 'bg-white text-indigo-700 shadow-2xs' : ''}`}
            >
              1.0x (Normal)
            </button>
          </div>
        </div>

        {/* Target Vocabulary */}
        <div>
          <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider block mb-1">
            VOCABULARY
          </span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-slate-900 uppercase">
              {currentWord.word}
            </h2>
            <span className="text-sm font-semibold text-slate-500 italic">
              ({currentWord.pos})
            </span>
            <span className="text-xs font-bold text-indigo-700 ml-1">
              = {currentWord.meaningId}
            </span>
          </div>
        </div>

        {/* Practical Sentence to Mimic */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            SENTENCE TO PRACTICE
          </span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            “{currentWord.speakingPrompt}”
          </p>
          <p className="text-xs sm:text-sm font-medium text-slate-600 italic">
            Artinya: “{currentWord.exampleId}”
          </p>
        </div>

        {/* Action Controls: 🔊 Listen & 🎤 Speak */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-sayit-listen"
            onClick={() => playPronunciation(currentWord.speakingPrompt, playbackSpeed)}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-400 text-slate-800 font-extrabold text-sm transition-all shadow-xs"
          >
            <Volume2 className="w-5 h-5 text-indigo-600" />
            🔊 Listen (Dengarkan)
          </button>

          <button
            id="btn-sayit-speak"
            onClick={handleStartRecording}
            disabled={isRecording}
            className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-extrabold text-sm transition-all shadow-xs ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98'
            }`}
          >
            <Mic className="w-5 h-5" />
            {isRecording ? 'Mendengarkan...' : '🎤 Speak (Ucapkan)'}
          </button>
        </div>

        {/* Speech Evaluation Feedback Card */}
        {speechResult && (
          <div className="bg-white rounded-2xl border-2 border-emerald-200 p-5 space-y-3 shadow-xs animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hasil Evaluasi Suara
              </span>
              <span className={`text-sm font-black px-3 py-1 rounded-full ${
                speechResult.score >= 70
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Skor: {speechResult.score}%
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs sm:text-sm">
              <span className="text-slate-500 block mb-1">Teks yang kamu ucapkan:</span>
              <p className="font-bold text-slate-900">
                "{speechResult.transcript}"
              </p>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              {speechResult.feedback}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-xs font-medium space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Catatan Penggunaan Suara
            </p>
            <p>{errorMessage}</p>
            <p className="text-slate-600 mt-1">
              Jika browser belum memberi izin mikrofon, kamu tetap bisa mendengarkan tombol audio 🔊 dan menirukan secara mandiri.
            </p>
          </div>
        )}

        {/* Bottom Next Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-colors disabled:opacity-40"
          >
            Lanjut Kalimat Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
