import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import { DynamicIcon } from '../common/DynamicIcon';
import { TrophyCustomizerModal } from './TrophyCustomizerModal';
import { GoalsHub } from '../goals/GoalsHub';
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  Check,
  Plus,
  Edit3,
} from 'lucide-react';
import { Achievement } from '../../types';

const TIER_STYLES: Record<string, { badge: string; border: string; glow: string; text: string; bg: string }> = {
  bronze: {
    badge: 'bg-amber-900/40 text-amber-500 border-amber-800/60',
    border: 'border-amber-800/40',
    glow: 'shadow-amber-900/20',
    text: 'text-amber-500',
    bg: 'from-amber-950/30 to-black/40',
  },
  silver: {
    badge: 'bg-slate-400/20 text-slate-300 border-slate-400/40',
    border: 'border-slate-400/30',
    glow: 'shadow-slate-400/20',
    text: 'text-slate-300',
    bg: 'from-slate-800/30 to-black/40',
  },
  gold: {
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    border: 'border-amber-500/35',
    glow: 'shadow-amber-500/20',
    text: 'text-amber-400',
    bg: 'from-amber-950/40 via-yellow-950/20 to-black/40',
  },
  platinum: {
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    border: 'border-cyan-400/35',
    glow: 'shadow-cyan-500/20',
    text: 'text-cyan-300',
    bg: 'from-cyan-950/40 to-black/40',
  },
  diamond: {
    badge: 'bg-sky-500/20 text-sky-300 border-sky-400/50',
    border: 'border-sky-400/45',
    glow: 'shadow-sky-500/25',
    text: 'text-sky-300',
    bg: 'from-sky-950/40 to-black/40',
  },
  obsidian: {
    badge: 'bg-purple-900/40 text-purple-300 border-purple-600/50',
    border: 'border-purple-600/40',
    glow: 'shadow-purple-900/30',
    text: 'text-purple-300',
    bg: 'from-purple-950/40 to-black/40',
  },
  amethyst: {
    badge: 'bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-500/40',
    border: 'border-fuchsia-500/40',
    glow: 'shadow-fuchsia-600/25',
    text: 'text-fuchsia-300',
    bg: 'from-fuchsia-950/40 to-black/40',
  },
};

export const ProgressView: React.FC = () => {
  const {
    achievements,
    claimAchievement,
    settings,
  } = useLifeOS();

  const isLight = settings.theme === 'white';
  const [selectedAchievementCat, setSelectedAchievementCat] = useState<string>('All');
  const [trophyModalOpen, setTrophyModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const achievementCategories = [
    'All',
    'Habits',
    'Focus',
    'Reading',
    'Workout',
    'Study',
    'Discipline',
    'Clean Living',
    'Custom',
  ];

  const filteredAchievements = (achievements || []).filter(ach => {
    if (selectedAchievementCat === 'All') return true;
    if (selectedAchievementCat === 'Custom') {
      return !['Habits', 'Focus', 'Reading', 'Workout', 'Study', 'Discipline', 'Clean Living'].includes(ach.category);
    }
    return ach.category === selectedAchievementCat;
  });

  const handleOpenForgeTrophy = () => {
    setEditingAchievement(null);
    setTrophyModalOpen(true);
  };

  const handleEditTrophy = (ach: Achievement) => {
    setEditingAchievement(ach);
    setTrophyModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto px-4 pt-3" id="progress-view-container">
      {/* 1. GOALS HUB (Replaces Long-Term Discipline Matrix) */}
      <GoalsHub />

      {/* 2. CUSTOMIZABLE TROPHY & MILESTONE VAULT */}
      <GlassCard className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                Trophy & Milestone Vault
              </h3>
              <p className="text-xs text-neutral-400">
                Forge custom sovereign milestones, tiers, and criteria
              </p>
            </div>
          </div>
          <button
            id="forge-custom-trophy-btn"
            onClick={handleOpenForgeTrophy}
            className="py-2 px-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>Forge Trophy</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {achievementCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedAchievementCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedAchievementCat === cat
                  ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-sm'
                  : 'bg-black/30 text-neutral-400 border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="space-y-3">
          {filteredAchievements.map(ach => {
            const safeMaxProgress = ach.maxProgress && !isNaN(ach.maxProgress) && ach.maxProgress > 0 ? ach.maxProgress : 1;
            const safeProgress = typeof ach.progress === 'number' && !isNaN(ach.progress) ? ach.progress : 0;
            const isFinished = safeProgress >= safeMaxProgress;
            const pct = Math.min(100, Math.round((safeProgress / safeMaxProgress) * 100));
            const tierStyle = TIER_STYLES[ach.tier || 'gold'] || TIER_STYLES.gold;

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden bg-gradient-to-r ${tierStyle.bg} ${
                  ach.isUnlocked || isFinished
                    ? `${tierStyle.border} shadow-sm ${tierStyle.glow}`
                    : 'border-white/[0.06] opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner ${
                        ach.isUnlocked || isFinished
                          ? `${tierStyle.badge} shadow-[0_0_12px_rgba(245,158,11,0.2)]`
                          : 'bg-zinc-800 text-zinc-500 border-white/5'
                      }`}
                    >
                      <DynamicIcon name={ach.icon} className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-zinc-100">{ach.title}</h4>
                        {ach.tier && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase border ${tierStyle.badge}`}
                          >
                            {ach.tier}
                          </span>
                        )}
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-white/10 text-zinc-300">
                          {ach.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTrophy(ach)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                      title="Customize this trophy"
                    >
                      <Edit3 size={13} />
                    </button>

                    {ach.claimed ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Claimed
                      </span>
                    ) : isFinished || ach.isUnlocked ? (
                      <button
                        onClick={() => claimAchievement(ach.id)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs shadow-md animate-bounce"
                      >
                        Claim Reward
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Rewards */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span>
                      Progress: {ach.progress} / {ach.maxProgress}
                    </span>
                    <span className="text-amber-400 font-bold">
                      +{ach.coinReward} Coins • +{ach.xpReward} XP
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Trophy Customizer Modal */}
      <TrophyCustomizerModal
        isOpen={trophyModalOpen}
        onClose={() => {
          setTrophyModalOpen(false);
          setEditingAchievement(null);
        }}
        achievementToEdit={editingAchievement}
      />
    </div>
  );
};
