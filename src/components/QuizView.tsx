import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  HelpCircle, 
  Sparkles,
  BookOpen,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CEFRLevel, OxfordWord, QuizQuestion, UserStats, WordProgress } from '../types';
import { playPronunciation } from '../utils/speech';

interface QuizViewProps {
  words: OxfordWord[];
  progressMap: Record<string, WordProgress>;
  stats: UserStats;
  onRecordQuizResult: (wordId: string, isCorrect: boolean) => void;
  onSwitchTab: (tab: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  words,
  progressMap,
  stats,
  onRecordQuizResult,
  onSwitchTab
}) => {
  const [quizMode, setQuizMode] = useState<'recall' | 'context' | 'checkpoint'>('recall');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Generate quiz questions
  const generateQuestions = (mode: 'recall' | 'context' | 'checkpoint') => {
    // Pick words pool
    let pool = [...words];
    if (mode === 'checkpoint') {
      pool = words.filter((w) => w.level === stats.currentLevel);
    }
    if (pool.length < 4) {
      pool = [...words];
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const count = mode === 'checkpoint' ? Math.min(20, shuffled.length) : Math.min(10, shuffled.length);
    const selectedWords = shuffled.slice(0, count);

    const generated: QuizQuestion[] = selectedWords.map((target, idx) => {
      // Determine question type
      let qType: 'meaning' | 'reverse' | 'context' = 'meaning';
      if (mode === 'context') {
        qType = 'context';
      } else if (mode === 'recall') {
        qType = idx % 2 === 0 ? 'meaning' : 'reverse';
      } else {
        // checkpoint mixes all
        const types: ('meaning' | 'reverse' | 'context')[] = ['meaning', 'reverse', 'context'];
        qType = types[idx % 3];
      }

      // Generate 3 distractors from other words
      const otherWords = words.filter((w) => w.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3);

      let questionText = '';
      let options: string[] = [];
      let explanation = '';

      if (qType === 'meaning') {
        questionText = `What does "${target.word.toUpperCase()}" mean?`;
        options = [target.meaningId, ...otherWords.map((o) => o.meaningId)].sort(() => 0.5 - Math.random());
        explanation = `"${target.word}" (${target.pos}) berarti "${target.meaningId}". ${target.simpleExplanation}`;
      } else if (qType === 'reverse') {
        questionText = `Apa bahasa Inggris dari "${target.meaningId}"?`;
        options = [target.word, ...otherWords.map((o) => o.word)].sort(() => 0.5 - Math.random());
        explanation = `Bahasa Inggris yang tepat adalah "${target.word}" (${target.pos}, Level ${target.level}).`;
      } else {
        // Context question: blank out the target word in its example
        const regex = new RegExp(`\\b${target.word}\\b`, 'i');
        const blankedExample = target.example.replace(regex, '_______');
        questionText = `Lengkapi kalimat berikut:\n"${blankedExample}"`;
        options = [target.word, ...otherWords.map((o) => o.word)].sort(() => 0.5 - Math.random());
        explanation = `Jawaban yang benar adalah "${target.word}" (${target.meaningId}). Kalimat lengkap: "${target.example}" yang artinya "${target.exampleId}".`;
      }

      const correctIndex = options.indexOf(qType === 'meaning' ? target.meaningId : target.word);

      return {
        id: `q_${target.id}_${idx}`,
        type: qType,
        question: questionText,
        targetWord: target,
        options,
        correctIndex,
        explanation
      };
    });

    setQuestions(generated);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  useEffect(() => {
    generateQuestions(quizMode);
  }, [quizMode]);

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    onRecordQuizResult(currentQ.targetWord.id, isCorrect);
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  };

  if (!currentQ || questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto my-8">
        <p className="text-sm text-slate-600">Menyiapkan soal kuis...</p>
      </div>
    );
  }

  // Finished Results Screen
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-xl mx-auto py-8 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {quizMode === 'checkpoint' ? `${stats.currentLevel} CHECKPOINT RESULT` : 'KUIS SELESAI!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Hasil evaluasi pemahaman kosakata Oxford 3000™
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Skor Kamu</span>
              <span className="text-3xl font-black text-indigo-600">{accuracy}%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{score} dari {questions.length} benar</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Evaluasi</span>
              <span className="text-2xl font-black text-emerald-600">
                {accuracy >= 80 ? 'Hebat! 🔥' : accuracy >= 60 ? 'Bagus 👍' : 'Terus Belajar 💪'}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Spaced Repetition Active</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            {accuracy >= 80
              ? 'Luar biasa! Kosakata ini telah berpindah ke memori jangka panjangmu. Terus pertahankan konsistensi belajarmu!'
              : 'Jawaban yang salah akan otomatis diprioritaskan pada sesi review berikutnya.'}
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => generateQuestions(quizMode)}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 shadow-xs transition-transform active:scale-98"
            >
              Coba Kuis Lagi
            </button>
            <button
              onClick={() => onSwitchTab('flashcards')}
              className="px-5 py-3 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-sm hover:bg-slate-200 transition-colors"
            >
              Review Kosakata di Flashcard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Quiz Mode Selector */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 grid grid-cols-3 gap-1.5 shadow-xs">
        <button
          onClick={() => setQuizMode('recall')}
          className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            quizMode === 'recall'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Recall
        </button>

        <button
          onClick={() => setQuizMode('context')}
          className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            quizMode === 'context'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Context Quiz
        </button>

        <button
          onClick={() => setQuizMode('checkpoint')}
          className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1 ${
            quizMode === 'checkpoint'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Level Checkpoint
        </button>
      </div>

      {/* Progress Counter & Audio */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          Soal <b>{currentQIndex + 1}</b> dari <b>{questions.length}</b>
        </span>
        <span>
          Skor: <b>{score}</b> benar
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {currentQ.type === 'meaning' ? 'Arti Kata' : currentQ.type === 'reverse' ? 'Bahasa Inggris' : 'Konteks Kalimat'}
            </span>

            <button
              onClick={() => playPronunciation(currentQ.targetWord.word, stats.voiceSpeed)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              title="Dengarkan pengucapan kata target"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 whitespace-pre-line leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt, idx) => {
            let btnClass = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-800';

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-400 font-bold';
              } else if (selectedOption === idx) {
                btnClass = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-400 font-bold';
              } else {
                btnClass = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                id={`quiz-opt-${idx}`}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left font-semibold text-sm transition-all duration-200 flex items-center justify-between gap-2 ${btnClass}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && selectedOption === idx && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback & Detailed Explanation */}
        {isAnswered && (
          <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
            selectedOption === currentQ.correctIndex
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}>
            <div className="flex items-center gap-2">
              {selectedOption === currentQ.correctIndex ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base text-emerald-900">
                    ✅ Benar sekali! (Correct!)
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="font-extrabold text-sm sm:text-base text-rose-900">
                    ❌ Kurang tepat.
                  </span>
                </>
              )}
            </div>

            {/* In-depth context explanation */}
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 pt-1">
              💡 <b>Penjelasan:</b> {currentQ.explanation}
            </p>

            {/* Quick action: re-listen audio */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => playPronunciation(currentQ.targetWord.example, stats.voiceSpeed)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Dengarkan contoh kalimat lengkap
              </button>

              <button
                id="btn-next-question"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95"
              >
                {currentQIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
