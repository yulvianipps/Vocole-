import React, { useState } from 'react';
import { X, Printer, Check, BookOpen, Layers, Sparkles } from 'lucide-react';
import { OxfordWord, CEFRLevel } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';

interface PrintFlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: OxfordWord[];
  currentLevel: CEFRLevel;
}

export const PrintFlashcardsModal: React.FC<PrintFlashcardsModalProps> = ({
  isOpen,
  onClose,
  words,
  currentLevel
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [printLayout, setPrintLayout] = useState<'cards' | 'table'>('cards');

  if (!isOpen) return null;

  const printableWords = selectedLevel === 'ALL' 
    ? words 
    : words.filter((w) => w.level === selectedLevel);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full p-5 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] flex flex-col">
        {/* Top Controls Header - Not printed */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Cetak Flashcard & Cheatsheet (Print / PDF)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Format siap cetak dan digunting untuk belajar fisik di kertas A4 tanpa layar
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

        {/* Filter & Options Toolbar - Not printed */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0 print:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Level:</span>
            {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {lvl === 'ALL' ? `Semua (${words.length})` : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setPrintLayout('cards')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  printLayout === 'cards'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Kartu Saku
              </button>
              <button
                onClick={() => setPrintLayout('table')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  printLayout === 'table'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Tabel Rangkuman
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 print:p-0 print:overflow-visible" id="printable-sheet">
          <div className="hidden print:block text-center pb-4 border-b border-slate-300 mb-6">
            <h1 className="text-xl font-bold text-slate-900">Oxford 3000™ Vocabulary Flashcards</h1>
            <p className="text-xs text-slate-500">Level: {selectedLevel} • Total: {printableWords.length} kata kosakata</p>
          </div>

          {printLayout === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 print:grid-cols-3 print:gap-2">
              {printableWords.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 flex flex-col justify-between space-y-2 print:border-black print:text-black print:break-inside-avoid"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 print:text-black">
                        {item.level} • {item.pos}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 print:text-slate-700">
                        {item.phonetic}
                      </span>
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white print:text-black">
                      {item.word}
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1 border-t border-slate-100 dark:border-slate-700/60 pt-1.5 print:border-slate-400 print:text-black">
                      🇮🇩 {item.meaningId}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800 print:bg-white print:border-slate-300 print:text-black">
                    "{item.example}"
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 print:border-black">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 print:text-black">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold uppercase text-[10px] text-slate-500 dark:text-slate-400 print:bg-slate-100 print:text-black">
                  <tr>
                    <th className="py-2.5 px-3">Kata</th>
                    <th className="py-2.5 px-2">Level</th>
                    <th className="py-2.5 px-2">IPA</th>
                    <th className="py-2.5 px-3">Arti Indonesia</th>
                    <th className="py-2.5 px-3">Contoh Kalimat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300">
                  {printableWords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 print:break-inside-avoid">
                      <td className="py-2 px-3 font-black text-slate-900 dark:text-white print:text-black">{item.word} <span className="text-[10px] font-normal text-slate-400">({item.pos})</span></td>
                      <td className="py-2 px-2 font-bold">{item.level}</td>
                      <td className="py-2 px-2 font-mono text-slate-500 print:text-black">{item.phonetic}</td>
                      <td className="py-2 px-3 font-medium">{item.meaningId}</td>
                      <td className="py-2 px-3 italic text-slate-600 dark:text-slate-400 print:text-black">"{item.example}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
