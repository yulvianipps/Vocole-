import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';
import { CEFRLevel, UserStats } from '../types';
import { PLACEMENT_QUESTIONS, calculatePlacementLevel } from '../data/placementQuestions';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';

interface PlacementTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onApplyRecommendedLevel: (level: CEFRLevel, score: number, total: number) => void;
}

export const PlacementTestModal: React.FC<PlacementTestModalProps> = ({
  isOpen,
  onClose,
  stats,
  onApplyRecommendedLevel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = PLACEMENT_QUESTIONS[currentIndex];
  const total = PLACEMENT_QUESTIONS.length;

  const handleSelect = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setIsCompleted(false);
  };

  const result = calculatePlacementLevel(score);
  const levelMeta = CEFR_LEVEL_METADATA[result.level];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Tes Penempatan Level (Diagnostic Test)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                15 Soal adaptif untuk menentukan level Oxford 3000™ yang paling ideal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCompleted ? (
          <div className="py-6 space-y-6">
            {/* Progress indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Soal {currentIndex + 1} dari {total}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Level Uji: {currentQ.level}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {currentQ.question}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium italic">
                “{currentQ.prompt}”
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800';
                if (isAnswerChecked) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                  } else {
                    btnStyle = 'border-slate-200 dark:border-slate-800 opacity-50 text-slate-400';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-200 dark:ring-indigo-800';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswerChecked}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerChecked && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerChecked && isSelected && !isCorrect && (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when checked */}
            {isAnswerChecked && (
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 space-y-1 animate-fadeIn">
                <span className="font-extrabold uppercase tracking-wider block">Penjelasan Jawaban:</span>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    selectedOption !== null
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>{currentIndex + 1 < total ? 'Soal Berikutnya' : 'Lihat Hasil Penempatan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="py-6 space-y-6 text-center animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-4xl shadow-xs">
              {levelMeta.icon}
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                HASIL DIAGNOSTIK LEVEL
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Rekomendasi Level: {result.title}
              </h2>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Skor Anda: <strong className="text-indigo-600 dark:text-indigo-400">{score} dari {total} soal</strong> ({Math.round((score / total) * 100)}%)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                {result.summary}
              </p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 block mb-0.5">
                  Langkah Pembelajaran yang Disarankan:
                </span>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                  {result.recommendation}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi Tes
              </button>

              <button
                id="btn-apply-placement-level"
                onClick={() => {
                  onApplyRecommendedLevel(result.level, score, total);
                  onClose();
                }}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Terapkan Level {result.level} & Mulai Belajar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
