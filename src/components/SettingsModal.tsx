import React from 'react';
import { X, Sliders, Volume2, RotateCcw, ShieldCheck, Check, Moon, Sun, Globe } from 'lucide-react';
import { CEFRLevel, UserStats } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';
import { setGlobalSpeechAccent } from '../utils/speech';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: UserStats) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  onResetProgress
}) => {
  if (!isOpen) return null;

  const targetOptions = [5, 10, 15, 20];
  const speedOptions = [
    { label: '0.8x (Lambat)', value: 0.8 },
    { label: '0.9x (Sedang)', value: 0.9 },
    { label: '1.0x (Normal)', value: 1.0 }
  ];

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

  const handleAccentChange = (accent: 'us' | 'uk') => {
    setGlobalSpeechAccent(accent);
    onUpdateStats({ ...stats, voiceAccent: accent });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 sm:p-8 shadow-xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Pengaturan Belajar</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sesuaikan ritme dan preferensi tutor pribadimu</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Preference: Dark / Light Mode */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            {stats.darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Tema Gelap (Dark Mode)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Nyaman untuk belajar di malam hari</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateStats({ ...stats, darkMode: !stats.darkMode })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              stats.darkMode ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* Voice Accent: US vs UK */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Aksen Suara Pengucapan (Voice Accent)
          </label>
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={() => handleAccentChange('us')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                (stats.voiceAccent || 'us') === 'us'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-1 ring-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">🇺🇸</span>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">American (US)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Pengucapan standar Amerika</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleAccentChange('uk')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                stats.voiceAccent === 'uk'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 ring-1 ring-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">🇬🇧</span>
              <div>
                <p className="text-xs font-black text-slate-900 dark:text-white">British (UK)</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Pengucapan khas British (RP)</p>
              </div>
            </button>
          </div>
        </div>

        {/* 1. Daily Words Target */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Target Kosakata Harian (Daily Target)
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Default 10 kata per hari agar pembelajaran tidak terasa membebani.
          </p>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {targetOptions.map((count) => {
              const isSelected = stats.dailyTarget === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => onUpdateStats({ ...stats, dailyTarget: count })}
                  className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {count} Words
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Audio Pronunciation Speed */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Kecepatan Pengucapan (Voice Speed)
          </label>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {speedOptions.map((sp) => {
              const isSelected = Math.abs(stats.voiceSpeed - sp.value) < 0.05;
              return (
                <button
                  key={sp.value}
                  type="button"
                  onClick={() => onUpdateStats({ ...stats, voiceSpeed: sp.value })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs dark:bg-indigo-600 dark:border-indigo-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {sp.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Level Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Level Aktif Saat Ini
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {levels.map((lvl) => {
              const isSelected = stats.currentLevel === lvl;
              const meta = CEFR_LEVEL_METADATA[lvl];
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onUpdateStats({ ...stats, currentLevel: lvl })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/60 ring-1 ring-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{meta.icon}</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{lvl}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{meta.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Reset progress */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Apakah kamu yakin ingin mereset seluruh progress kosakata dan statistik belajar?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Ulang Progress
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm shadow-xs transition-colors"
          >
            Simpan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
