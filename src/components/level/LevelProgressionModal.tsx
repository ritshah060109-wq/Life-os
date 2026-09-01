import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import {
  X,
  Zap,
  Award,
  Crown,
  Sparkles,
  Coins,
  Shield,
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
} from 'lucide-react';
import {
  LEVEL_MILESTONES,
  PLAYER_TITLES,
  calculateLevelFromTotalXP,
  getLevelCoinReward,
  getXPForLevel,
} from '../../utils/levelSystem';

interface LevelProgressionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LevelProgressionModal: React.FC<LevelProgressionModalProps> = ({ isOpen, onClose }) => {
  const { economy, settings } = useLifeOS();

  if (!isOpen) return null;

  const currentLevel = economy.level || 1;
  const currentXP = economy.xp || 0;
  const lifetimeXP = economy.lifetimeXP || economy.xp || 0;

  const { currentLevelXP, requiredXPForNext, progressPct } = calculateLevelFromTotalXP(currentXP);

  const nextLevelCoinReward = getLevelCoinReward(currentLevel + 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-xl max-h-[90vh] overflow-hidden"
        >
          <GlassCard variant="gold" className="p-5 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center font-black text-sm shadow-md">
                  L{currentLevel}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    RPG Progression & Mastery System
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Earn XP across habits, schedule, and clean days to ascend levels
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Current Level Master Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/30 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                    Current Sovereign Rank
                  </span>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-zinc-100 font-mono">
                      Level {currentLevel}
                    </h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-sm">
                      {economy.activeTitle || 'Disciplined'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 block font-mono">Lifetime Earned XP</span>
                  <span className="text-sm font-extrabold text-cyan-400 font-mono">
                    {lifetimeXP.toLocaleString()} XP
                  </span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Zap size={13} className="fill-amber-400" /> {currentLevelXP} / {requiredXPForNext} XP
                  </span>
                  <span className="font-extrabold text-zinc-200">{progressPct}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/50 p-0.5 border border-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>Level {currentLevel}</span>
                  <span className="text-amber-400 font-bold">
                    Next Level: +{nextLevelCoinReward} Coins reward (Level × 100)
                  </span>
                  <span>Level {currentLevel + 1}</span>
                </div>
              </div>
            </div>

            {/* XP Sources Guide */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-yellow-400" />
                Active XP Sources (XP is strictly for Leveling Up)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-400 block">Habit Complete</span>
                  <span className="font-bold text-amber-400 font-mono">+40-100 XP</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-400 block">Schedule Block</span>
                  <span className="font-bold text-cyan-400 font-mono">+30-60 XP</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-400 block">Clean Day Standard</span>
                  <span className="font-bold text-emerald-400 font-mono">+70 XP</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-400 block">Focus Session</span>
                  <span className="font-bold text-purple-400 font-mono">+25-100 XP</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-400 block">Rescue Timer Done</span>
                  <span className="font-bold text-rose-400 font-mono">+80 XP</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-zinc-400 block">Daily Streak Check-in</span>
                  <span className="font-bold text-yellow-400 font-mono">+50 XP (+30 Coins)</span>
                </div>
              </div>
            </div>

            {/* Level Milestone Roadmap (Every 10 Levels & Special Ranks) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Crown size={13} className="text-amber-400" />
                  Ascension Milestone Roadmap (Levels 1 - 100)
                </h4>
                <span className="text-[10px] font-mono text-zinc-400">Scales Level × 100 Coins</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                {LEVEL_MILESTONES.map(milestone => {
                  const isUnlocked = currentLevel >= milestone.level;
                  const isCurrent = currentLevel === milestone.level;

                  return (
                    <div
                      key={milestone.level}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-400/80 shadow-md shadow-amber-500/10'
                          : isUnlocked
                          ? 'bg-black/40 border-emerald-500/30'
                          : 'bg-black/20 border-white/[0.04] opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs border ${
                            isCurrent
                              ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                              : isUnlocked
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-zinc-800 text-zinc-500 border-white/5'
                          }`}
                        >
                          L{milestone.level}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-100">
                              {milestone.title}
                            </span>
                            {isUnlocked && (
                              <CheckCircle2 size={13} className="text-emerald-400 stroke-[2.5]" />
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-400">{milestone.perkDescription}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-bold text-amber-400 block font-mono">
                          +{milestone.bonusCoins > 0 ? milestone.bonusCoins : milestone.level * 100} Coins
                        </span>
                        {milestone.bonusGoldenTokens > 0 && (
                          <span className="text-[9px] font-bold text-yellow-300 block font-mono">
                            +{milestone.bonusGoldenTokens} Golden Tokens
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="text-[9px] text-zinc-500 font-mono flex items-center justify-end gap-1 mt-0.5">
                            <Lock size={10} /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Close */}
            <div className="pt-2 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs shadow-md shadow-amber-500/20 hover:brightness-110 transition-all"
              >
                Close Roadmap
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
