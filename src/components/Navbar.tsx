import React from 'react';
import { 
  Home, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Mic, 
  Bookmark, 
  BarChart3, 
  Flame, 
  Settings,
  Gamepad2,
  Moon,
  Sun,
  Headphones,
  GraduationCap,
  MessageSquare,
  MoreHorizontal,
  X
} from 'lucide-react';
import { CEFRLevel, UserStats } from '../types';
import { CEFR_LEVEL_METADATA } from '../data/oxfordWords';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: UserStats;
  onOpenSettings: () => void;
  onToggleDarkMode?: () => void;
  onOpenAudioMode?: () => void;
  onOpenPlacementTest?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenSettings,
  onToggleDarkMode,
  onOpenAudioMode,
  onOpenPlacementTest
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);
  const currentLevelMeta = CEFR_LEVEL_METADATA[stats.currentLevel];

  const desktopNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'flashcards', label: 'Review', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle2 },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'stories', label: 'Stories', icon: MessageSquare },
    { id: 'say_it', label: 'Say It', icon: Mic },
    { id: 'my_words', label: 'Words', icon: Bookmark },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  const mobilePrimaryNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'flashcards', label: 'Review', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle2 },
    { id: 'games', label: 'Games', icon: Gamepad2 }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMoreMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Level */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-200">
                Ox
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                    Oxford 3000™
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                    US English
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Personal Vocabulary Tutor</p>
              </div>
            </button>

            {/* Current Level Pill */}
            <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <span>{currentLevelMeta.icon}</span>
              <span>Level {stats.currentLevel}</span>
              <span className="text-slate-400 font-normal">({currentLevelMeta.name})</span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Header: Audio Mode, Streak, Dark Mode & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Mode (Hands-free Commute) */}
            {onOpenAudioMode && (
              <button
                id="btn-navbar-audio-mode"
                onClick={onOpenAudioMode}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                title="Buka Hands-Free Commute Audio Mode"
              >
                <Headphones className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Audio Mode</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            {onToggleDarkMode && (
              <button
                id="btn-toggle-dark-mode"
                onClick={onToggleDarkMode}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={stats.darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              >
                {stats.darkMode ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Streak Badge */}
            <div 
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold shadow-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
              title={`${stats.streak} hari beruntun belajar`}
              onClick={() => setActiveTab('progress')}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{stats.streak} Hari</span>
            </div>

            {/* Settings Button */}
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Pengaturan Belajar"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (5 clean, high-comfort touch targets) */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-xl">
        <div className="grid grid-cols-5 gap-1">
          {mobilePrimaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-all min-h-[46px] ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50/80 dark:bg-indigo-950/60'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.4]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* More Menu Trigger */}
          <button
            id="mobile-nav-more"
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[11px] font-semibold transition-all min-h-[46px] ${
              ['stories', 'say_it', 'my_words', 'progress'].includes(activeTab) || isMoreMenuOpen
                ? 'text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50/80 dark:bg-indigo-950/60'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <MoreHorizontal className="w-4 h-4 mb-0.5 text-slate-500 dark:text-slate-400" />
            <span className="truncate">Lainnya</span>
          </button>
        </div>
      </div>

      {/* Mobile "More" Slide-up Drawer */}
      {isMoreMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 dark:text-white text-base">Menu & Fitur Belajar</span>
                <span className="text-[10px] uppercase font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">
                  Oxford 3000™
                </span>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleSelectTab('stories')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'stories'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <MessageSquare className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Stories & Dialog</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Percakapan tematik</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('say_it')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'say_it'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Mic className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Say It (Suara)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Latihan pengucapan</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('my_words')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'my_words'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Bookmark className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">My Words</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Koleksi kosakata</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('progress')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'progress'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <BarChart3 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Progress & Badges</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Statistik belajar</div>
                </div>
              </button>

              {/* Commute Audio Mode Modal Trigger */}
              {onOpenAudioMode && (
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenAudioMode();
                  }}
                  className="p-3.5 rounded-2xl border bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-slate-800 border-indigo-200 dark:border-indigo-800 text-left flex items-start gap-2.5"
                >
                  <Headphones className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black text-indigo-950 dark:text-indigo-200">Commute Audio</div>
                    <div className="text-[10px] text-indigo-700 dark:text-indigo-300">Hands-free player</div>
                  </div>
                </button>
              )}

              {/* Placement Test Trigger */}
              {onOpenPlacementTest && (
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenPlacementTest();
                  }}
                  className="p-3.5 rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-slate-800 border-amber-200 dark:border-amber-800 text-left flex items-start gap-2.5"
                >
                  <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black text-amber-950 dark:text-amber-200">Tes Penempatan</div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-300">Ukur level CEFR</div>
                  </div>
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Pengaturan Belajar & Target
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
