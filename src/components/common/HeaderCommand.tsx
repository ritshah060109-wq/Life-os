import React from 'react';
import { motion } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { Flame, Coins, Sparkles, Plus, Award, User, Zap, HelpCircle } from 'lucide-react';
import { calculateLevelFromTotalXP } from '../../utils/levelSystem';
import { sound } from '../../utils/soundAndHaptics';

export const HeaderCommand: React.FC = () => {
  const {
    economy,
    habits,
    settings,
    difficultyConfig,
    setQuickAddOpen,
    setActiveTab,
    setLevelProgressionModalOpen,
    setNameModalOpen,
    streak,
    setIsSmartHelpOpen,
  } = useLifeOS();
  const isLight = settings.theme === 'white';

  const currentLevel = economy.level || 1;
  const currentXP = economy.xp || 0;
  const { currentLevelXP, requiredXPForNext, progressPct } = calculateLevelFromTotalXP(currentXP);

  // Dynamic user display name with customized template formatting
  const formattedName = React.useMemo(() => {
    const rawName = settings.userName || 'Commander';
    const rawTitle = settings.userCallsign || economy.activeTitle || 'Sovereign';
    const template = settings.nameTemplate || '{name}';

    return template
      .replace('{title}', rawTitle)
      .replace('{name}', rawName);
  }, [settings.userName, settings.userCallsign, settings.nameTemplate, economy.activeTitle]);

  return (
    <header
      className="sticky top-0 z-30 w-full px-3 sm:px-4 pt-2.5 pb-2 backdrop-blur-2xl border-b border-white/[0.06] bg-[#050505]/85 transition-colors duration-200"
      id="lifeos-header"
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Left: User Level, Formatted Name & XP Progress Bar */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Level Badge (Tap to open RPG Progression Modal) */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setLevelProgressionModalOpen(true)}
            className="relative shrink-0 group"
            title="Tap to view RPG Progression & Milestone Roadmap"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border shadow-sm transition-transform group-hover:scale-105 ${
                isLight
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-gradient-to-br from-amber-500/25 to-yellow-600/30 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
              }`}
            >
              <span className="font-mono">L{currentLevel}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center text-[9px] font-black shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </motion.button>

          {/* User Name & Level Progress */}
          <div className="flex flex-col min-w-0">
            <button
              onClick={() => setNameModalOpen(true)}
              className="flex items-center gap-1.5 text-left group"
              title="Tap to customize your Sovereign Name & Title template"
            >
              <span
                className={`text-xs font-bold tracking-tight truncate max-w-[110px] sm:max-w-[160px] group-hover:text-amber-400 transition-colors ${
                  isLight ? 'text-slate-900' : 'text-zinc-100'
                }`}
              >
                {formattedName}
              </span>
              <span
                className={`text-[9px] font-mono px-1 py-0.2 rounded font-extrabold border shrink-0 ${
                  isLight
                    ? 'bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {difficultyConfig.title.split(' ')[0]}
              </span>
            </button>

            {/* XP Bar */}
            <div
              onClick={() => setLevelProgressionModalOpen(true)}
              className="flex items-center gap-1.5 mt-0.5 cursor-pointer"
            >
              <div
                className={`w-14 sm:w-20 h-1.5 rounded-full overflow-hidden shrink-0 ${
                  isLight ? 'bg-slate-200' : 'bg-zinc-800/80 border border-white/5'
                }`}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <span
                className={`text-[9px] font-mono shrink-0 ${
                  isLight ? 'text-slate-500' : 'text-zinc-400'
                }`}
              >
                {currentLevelXP}/{requiredXPForNext} XP
              </span>
            </div>
          </div>
        </div>

        {/* Right Badges: Daily Streak, Always-Visible Coin Pill, Golden Tokens, Quick Add */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Daily Streak Badge */}
          <div
            id="header-streak-badge"
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border shrink-0 ${
              isLight
                ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm'
                : 'bg-orange-500/10 text-orange-400 border-orange-500/25'
            }`}
            title={`Active Daily Streak: ${streak.currentStreak} Days`}
          >
            <Flame className="w-3 h-3 fill-orange-500 text-orange-500 animate-pulse" />
            <span className="font-mono text-[11px] font-extrabold">{streak.currentStreak}d</span>
          </div>

          {/* Luxury Sovereign Coins Badge (Always clearly visible on all mobile screens) */}
          <motion.button
            id="header-coins-pill"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab('economy')}
            className={`group relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-black border transition-all duration-200 shrink-0 ${
              isLight
                ? 'bg-gradient-to-r from-amber-50 to-yellow-100/90 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-gradient-to-r from-amber-950/50 via-zinc-900 to-amber-950/40 text-amber-300 border-amber-400/50 shadow-[0_0_14px_rgba(245,158,11,0.2)] hover:border-amber-400'
            }`}
            title="Life Coins — Tap to open Economy & Vault"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-neutral-950 shadow-sm group-hover:rotate-12 transition-transform duration-300 shrink-0">
              <Coins className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
            <span className="font-mono text-xs sm:text-[13px] tracking-tight font-black text-amber-300">
              {economy.coins.toLocaleString()}
            </span>
          </motion.button>

          {/* Golden Tokens Pill (Optional if > 0) */}
          {economy.goldenTokens > 0 && (
            <motion.button
              id="header-golden-tokens-pill"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('economy')}
              className={`hidden xs:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-extrabold border transition-all shrink-0 ${
                isLight
                  ? 'bg-yellow-100 text-yellow-900 border-yellow-300 shadow-sm'
                  : 'bg-amber-400/15 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
              }`}
              title="Golden Discipline Tokens"
            >
              <Award className="w-3 h-3 text-amber-400" />
              <span className="font-mono text-[11px]">{economy.goldenTokens}</span>
            </motion.button>
          )}

          {/* Smart Help (?) Guide Button */}
          <motion.button
            id="header-smart-help-btn"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              sound.tap();
              setIsSmartHelpOpen(true);
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold border transition-colors shrink-0 ${
              isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                : 'bg-zinc-900/90 text-amber-300 border-amber-500/30 hover:border-amber-400/60 shadow-sm'
            }`}
            title="Smart Page Guide & Formulas (?)"
          >
            <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>

          {/* Quick Add Log Button */}
          <motion.button
            id="quick-add-trigger-btn"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setQuickAddOpen(true)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold shadow-md transition-colors shrink-0 ${
              isLight
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-black hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/25'
            }`}
            title="Quick Log"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};
