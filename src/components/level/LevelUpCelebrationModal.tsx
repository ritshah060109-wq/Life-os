import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../common/GlassCard';
import { Crown, Sparkles, Zap, Coins, Check, Award } from 'lucide-react';
import { getLevelCoinReward, getMilestoneForLevel } from '../../utils/levelSystem';
import { sound } from '../../utils/soundAndHaptics';

interface LevelUpCelebrationModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  isOpen,
  newLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  const coinReward = getLevelCoinReward(newLevel);
  const milestone = getMilestoneForLevel(newLevel);

  const handleClaim = () => {
    sound.purchase();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-md text-center"
        >
          <GlassCard
            variant="gold"
            className="p-6 space-y-5 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden"
          >
            {/* Ambient Background Rays */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 via-transparent to-transparent pointer-events-none" />

            {/* Level Badge Icon */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-3xl border-2 border-dashed border-amber-400/40"
              />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-black flex flex-col items-center justify-center font-black shadow-2xl shadow-amber-500/40 relative z-10">
                <Crown size={20} className="stroke-[2.5]" />
                <span className="text-2xl font-mono leading-none mt-0.5">L{newLevel}</span>
              </div>
            </div>

            {/* Title Announcement */}
            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                Ascension Complete!
              </span>
              <h2 className="text-2xl font-black text-zinc-100 font-mono tracking-tight">
                Reached Level {newLevel}!
              </h2>
              <p className="text-xs text-zinc-400">
                Your sovereign discipline and consistency have elevated your rank.
              </p>
            </div>

            {/* Rewards Box */}
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/30 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Level Ascension Bounty Claimed
              </span>

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold font-mono text-sm">
                  <Coins size={16} />
                  +{coinReward} Coins
                </div>

                {milestone?.bonusGoldenTokens ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 font-extrabold font-mono text-sm">
                    <Sparkles size={16} />
                    +{milestone.bonusGoldenTokens} Golden Tokens
                  </div>
                ) : null}

                {milestone?.unlockedTitle ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-xs">
                    <Award size={14} />
                    Title: {milestone.unlockedTitle}
                  </div>
                ) : null}
              </div>

              {milestone && (
                <p className="text-[11px] text-amber-300 font-semibold pt-1">
                  ⭐ Milestone Perk: {milestone.perkDescription}
                </p>
              )}
            </div>

            {/* Claim Action */}
            <button
              onClick={handleClaim}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-sm shadow-xl shadow-amber-500/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} className="stroke-[3]" />
              Claim Ascension Rewards
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
