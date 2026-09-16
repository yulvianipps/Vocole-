import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Headphones, 
  Repeat, 
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { OxfordWord, UserStats } from '../types';
import { playPronunciation } from '../utils/speech';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';

interface AudioModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: OxfordWord[];
  stats: UserStats;
}

export const AudioModeModal: React.FC<AudioModeModalProps> = ({
  isOpen,
  onClose,
  words,
  stats
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(stats.voiceSpeed || 0.95);
  const [includeExample, setIncludeExample] = useState(true);
  const [currentStage, setCurrentStage] = useState<'idle' | 'word' | 'meaning' | 'example' | 'pause'>('idle');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentWord = words[currentIndex] || words[0];

  // Stop playback when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentStage('idle');
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    }
  }, [isOpen]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Main audio sequence player
  const playWordSequence = (index: number) => {
    if (!words || words.length === 0) return;
    const word = words[index];
    if (!word) return;

    window.speechSynthesis?.cancel();

    // Stage 1: Play English Word
    setCurrentStage('word');
    playPronunciation(word.word, playbackSpeed);

    // After word pronunciation (~1.4s), say meaning visually / with pause
    timerRef.current = setTimeout(() => {
      if (!isPlayingRef.current) return;
      setCurrentStage('meaning');

      // If user enabled examples, transition to example
      const nextDelay = includeExample ? 1800 : 2500;
      timerRef.current = setTimeout(() => {
        if (!isPlayingRef.current) return;

        if (includeExample && word.example) {
          setCurrentStage('example');
          playPronunciation(word.example, playbackSpeed * 0.95);

          // After example finishes (~3.5s), transition to next word
          timerRef.current = setTimeout(() => {
            if (!isPlayingRef.current) return;
            advanceToNextWord(index);
          }, 4000);
        } else {
          advanceToNextWord(index);
        }
      }, nextDelay);
    }, 1600);
  };

  const advanceToNextWord = (fromIndex: number) => {
    setCurrentStage('pause');
    timerRef.current = setTimeout(() => {
      if (!isPlayingRef.current) return;
      const nextIdx = (fromIndex + 1) % words.length;
      setCurrentIndex(nextIdx);
      playWordSequence(nextIdx);
    }, 1200);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentStage('idle');
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
    } else {
      setIsPlaying(true);
      playWordSequence(currentIndex);
    }
  };

  const handleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    window.speechSynthesis?.cancel();
    const nextIdx = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIdx);
    if (isPlaying) {
      playWordSequence(nextIdx);
    }
  };

  const handlePrev = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    window.speechSynthesis?.cancel();
    const prevIdx = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIdx);
    if (isPlaying) {
      playWordSequence(prevIdx);
    }
  };

  if (!isOpen || !currentWord) return null;

  const levelMeta = CEFR_LEVEL_METADATA[currentWord.level];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between min-h-[500px]">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white tracking-tight">
                  Commute Audio Mode
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Hands-Free
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Belajar sambil beraktivitas, tanpa perlu menatap layar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display & Audio Stage Visualizer */}
        <div className="my-auto py-8 text-center space-y-6 relative z-10">
          {/* Track counter & Level badge */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-400">
              Kata {currentIndex + 1} dari {words.length}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Level {currentWord.level}
            </span>
          </div>

          {/* Target Word */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white transition-all">
              {currentWord.word}
            </h1>
            <div className="flex items-center justify-center gap-2 text-slate-400 font-mono text-sm">
              <span>{currentWord.pos}</span>
              <span>•</span>
              <span className="text-indigo-400">{currentWord.phonetic}</span>
            </div>
          </div>

          {/* Meaning (Indonesian) */}
          <div className={`p-4 rounded-2xl transition-all ${
            currentStage === 'meaning'
              ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 scale-102'
              : 'bg-slate-800/40 border border-slate-800 text-slate-300'
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
              Arti Bahasa Indonesia
            </span>
            <p className="text-lg sm:text-xl font-bold">
              {currentWord.meaningId}
            </p>
          </div>

          {/* Example Sentence */}
          {includeExample && (
            <div className={`p-4 rounded-2xl text-left transition-all ${
              currentStage === 'example'
                ? 'bg-emerald-500/20 border border-emerald-500/40 scale-102'
                : 'bg-slate-800/30 border border-slate-800/60'
            }`}>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block mb-1">
                Contoh Kalimat Autentik:
              </span>
              <p className="text-sm font-semibold text-slate-200">
                “{currentWord.example}”
              </p>
              <p className="text-xs text-slate-400 mt-1 italic">
                {currentWord.exampleId}
              </p>
            </div>
          )}

          {/* Sound Wave Animation when playing */}
          {isPlaying && (
            <div className="flex items-center justify-center gap-1.5 h-6">
              {[40, 75, 100, 60, 90, 45, 80, 50, 95, 60].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 120}ms`,
                    animationDuration: '800ms'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Player Controls */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80 relative z-10">
          {/* Quick Settings: Speed & Example Toggle */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => setIncludeExample(!includeExample)}
              className={`px-3 py-1.5 rounded-xl border transition-colors ${
                includeExample 
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold' 
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Contoh Kalimat: {includeExample ? 'ON' : 'OFF'}
            </button>

            <div className="flex items-center gap-1.5">
              <span>Kecepatan:</span>
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                    playbackSpeed === spd
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Main Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              id="audio-mode-prev"
              onClick={handlePrev}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Kata Sebelumnya"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              id="audio-mode-toggle-play"
              onClick={handleTogglePlay}
              className={`p-5 rounded-3xl font-bold shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-4 ring-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white ring-4 ring-indigo-500/30'
              }`}
              title={isPlaying ? 'Jeda' : 'Putar Otomatis'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              id="audio-mode-next"
              onClick={handleNext}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Kata Berikutnya"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
