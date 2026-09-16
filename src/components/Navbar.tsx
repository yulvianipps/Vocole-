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
  Menu,
  X,
  Search,
  Zap,
  PenTool
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
  onOpenGlobalSearch?: () => void;
  onOpenSpeedChallenge?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenSettings,
  onToggleDarkMode,
  onOpenAudioMode,
  onOpenPlacementTest,
  onOpenGlobalSearch,
  onOpenSpeedChallenge
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);
  const currentLevelMeta = CEFR_LEVEL_METADATA[stats.currentLevel];

  const desktopNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'flashcards', label: 'Review', icon: Layers },
    { id: 'spelling', label: 'Dikte', icon: PenTool },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle2 },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'stories', label: 'Stories', icon: MessageSquare },
    { id: 'say_it', label: 'Say It', icon: Mic },
    { id: 'my_words', label: 'Words', icon: Bookmark },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  // Exactly 4 items so that with the 5th item ('Menu') it fits in 1 single row of 5 columns
  const mobilePrimaryNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Belajar', icon: BookOpen },
    { id: 'spelling', label: 'Dikte', icon: PenTool },
    { id: 'my_words', label: 'Kamus', icon: Bookmark }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMoreMenuOpen(false);
  };

  return (
    <>
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Left: Logo & Level */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                id="btn-header-home"
                onClick={() => handleSelectTab('home')}
                className="flex items-center gap-2 text-left focus:outline-none group"
                title="Kembali ke Beranda"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-sm shadow-indigo-200 dark:shadow-none">
                  Ox
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm sm:text-base md:text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Oxford 3000™
                    </span>
                    <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      {stats.voiceAccent === 'uk' ? 'UK' : 'US'}
                    </span>
                  </div>
                  <p className="hidden md:block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Personal Vocabulary Tutor
                  </p>
                </div>
              </button>

              {/* Current Level Pill */}
              <div className="hidden xl:flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span>{currentLevelMeta.icon}</span>
                <span>Level {stats.currentLevel}</span>
              </div>
            </div>

            {/* Center: Desktop Navigation Bar (Visible on lg: 1024px+) */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Search, Speed 60s, Audio, Dark Mode, Streak, Settings & Mobile Menu */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Quick Global Search Button */}
              {onOpenGlobalSearch && (
                <button
                  id="btn-navbar-search"
                  onClick={onOpenGlobalSearch}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 text-xs font-semibold transition-all cursor-pointer"
                  title="Pencarian Cepat Kosakata (Ctrl + K)"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Cari</span>
                  <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-slate-400">
                    ⌘K
                  </kbd>
                </button>
              )}

              {/* Speed 60s Challenge Button */}
              {onOpenSpeedChallenge && (
                <button
                  id="btn-navbar-speed"
                  onClick={onOpenSpeedChallenge}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
                  title="Speed Challenge 60 Detik"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="hidden lg:inline">60s Speed</span>
                </button>
              )}

              {/* Commute Audio Mode Button */}
              {onOpenAudioMode && (
                <button
                  id="btn-navbar-audio-mode"
                  onClick={onOpenAudioMode}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                  title="Buka Hands-Free Commute Audio Mode"
                >
                  <Headphones className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden xl:inline">Audio</span>
                </button>
              )}

              {/* Dark Mode Toggle */}
              {onToggleDarkMode && (
                <button
                  id="btn-toggle-dark-mode"
                  onClick={onToggleDarkMode}
                  className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title={stats.darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                >
                  {stats.darkMode ? (
                    <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              )}

              {/* Streak Badge */}
              <div 
                id="btn-navbar-streak"
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-xs cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
                title={`${stats.streak} hari beruntun belajar`}
                onClick={() => handleSelectTab('progress')}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{stats.streak}d</span>
              </div>

              {/* Settings Button */}
              <button
                id="btn-settings"
                onClick={onOpenSettings}
                className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Pengaturan Belajar"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Mobile / Compact Menu Hamburger Button */}
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-xl transition-colors flex items-center gap-1 border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 font-bold text-xs"
                title={isMoreMenuOpen ? "Tutup Menu" : "Buka Menu Navigasi"}
              >
                {isMoreMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                <span className="hidden xs:inline">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="lg:hidden hide-on-short-screen fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-1.5 py-1 shadow-lg"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {mobilePrimaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all min-h-[46px] ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50/90 dark:bg-indigo-950/80'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.4]' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* 5th Column: Menu Trigger */}
          <button
            id="mobile-nav-more"
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all min-h-[46px] ${
              ['flashcards', 'quiz', 'games', 'stories', 'say_it', 'progress'].includes(activeTab) || isMoreMenuOpen
                ? 'text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50/90 dark:bg-indigo-950/80'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-4 h-4 mb-0.5 text-slate-500 dark:text-slate-400" />
            <span className="truncate">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile "More / Menu" Drawer Modal */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fadeIn"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  Ox
                </div>
                <div>
                  <span className="font-black text-slate-900 dark:text-white text-base">Menu Navigasi</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Level {stats.currentLevel} • {currentLevelMeta.name}</p>
                </div>
              </div>
              <button
                id="btn-close-drawer"
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of All Main Modes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleSelectTab('home')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'home'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Beranda</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Dashboard belajar</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('learn')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'learn'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Tutor 9-Step</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Belajar interaktif</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('spelling')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'spelling'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <PenTool className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Tes Dikte Audio</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Listening spelling test</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('flashcards')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Flashcards</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Spaced repetition</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('quiz')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Kuis Kosakata</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Pilihan ganda & arti</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('games')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'games'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Mini Games</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Match & Scramble</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('stories')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'stories'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Stories & Dialog</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Percakapan tematik</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('say_it')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'say_it'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Mic className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Say It (Suara)</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Latihan pengucapan</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('my_words')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'my_words'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Kamus Oxford 3000</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Koleksi kosakata</div>
                </div>
              </button>

              <button
                onClick={() => handleSelectTab('progress')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  activeTab === 'progress'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold">Progress & Level</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Statistik belajar</div>
                </div>
              </button>
            </div>

            {/* Special Features: Commute Audio & Placement Test */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {onOpenAudioMode && (
                <button
                  id="btn-drawer-audio"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenAudioMode();
                  }}
                  className="p-3 rounded-2xl border bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-slate-800 border-indigo-200 dark:border-indigo-800 text-left flex items-start gap-2.5 hover:shadow-xs transition-all"
                >
                  <Headphones className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black text-indigo-950 dark:text-indigo-200">Commute Audio</div>
                    <div className="text-[10px] text-indigo-700 dark:text-indigo-300">Hands-free player</div>
                  </div>
                </button>
              )}

              {onOpenPlacementTest && (
                <button
                  id="btn-drawer-placement"
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenPlacementTest();
                  }}
                  className="p-3 rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-slate-800 border-amber-200 dark:border-amber-800 text-left flex items-start gap-2.5 hover:shadow-xs transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black text-amber-950 dark:text-amber-200">Tes Penempatan</div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-300">Diagnostik CEFR</div>
                  </div>
                </button>
              )}
            </div>

            <div className="pt-1">
              <button
                id="btn-drawer-settings"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenSettings();
                }}
                className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Pengaturan Belajar & Target Harian
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};