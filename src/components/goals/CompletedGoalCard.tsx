import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Target,
  Trophy,
  Flame,
  Zap,
  Dumbbell,
  BookOpen,
  Brain,
  Rocket,
  Crown,
  Star,
  Sparkles,
  Compass,
  Shield,
  HeartPulse,
  Flag,
  Coins,
  Calendar,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PersonalGoal } from '../../types';
import { useLifeOS } from '../../context/LifeOSContext';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Target,
  Flame,
  Zap,
  Trophy,
  Dumbbell,
  BookOpen,
  Brain,
  Rocket,
  Crown,
  Star,
  Sparkles,
  Compass,
  Shield,
  HeartPulse,
  Flag,
  Coins,
};

interface CompletedGoalCardProps {
  goal: PersonalGoal;
}

export const CompletedGoalCard: React.FC<CompletedGoalCardProps> = ({ goal }) => {
  const { updateGoal, updateGoalProgress, deleteGoal, settings } = useLifeOS();
  const isLight = settings.theme === 'white';
  const [showNotes, setShowNotes] = useState(false);

  const IconComp = ICON_MAP[goal.icon || 'Target'] || Target;

  const handleReopen = () => {
    updateGoal(goal.id, {
      status: 'in_progress',
      progress: 90,
      completedAt: undefined,
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Delete completed goal "${goal.title}"?`)) {
      deleteGoal(goal.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl p-4 sm:p-5 border transition-all relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-emerald-500/10 ${
        isLight
          ? 'border-amber-300 bg-amber-50/50 shadow-sm'
          : 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Completed Badge */}
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle2 size={11} className="stroke-[2.5]" />
            <span>Completed 100%</span>
          </span>

          {/* Category Chip */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {goal.category}
          </span>

          {/* Completion Date */}
          {goal.completedAt && (
            <span className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
              <Calendar size={11} />
              <span>Finished {goal.completedAt}</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleReopen}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-amber-300 transition-colors"
            title="Reopen Goal (Set to 90% in progress)"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Goal"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
          <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
            {goal.title}
          </h4>
          {goal.description && (
            <p className="text-xs text-neutral-300 mt-1 line-clamp-2 leading-relaxed">
              {goal.description}
            </p>
          )}

          {/* Related Habits */}
          {goal.relatedHabits && goal.relatedHabits.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] text-neutral-400 font-medium">Completed via Habits:</span>
              {goal.relatedHabits.map(h => (
                <span
                  key={h}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 100% Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full"
          />
        </div>
      </div>

      {/* Rewards Footer */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/5 text-xs text-neutral-400">
        {goal.rewardOnCompletion ? (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
            <Award size={13} className="text-amber-400" />
            <span>
              Claimed: {goal.rewardOnCompletion.coins ? `+${goal.rewardOnCompletion.coins} 🪙 ` : ''}
              {goal.rewardOnCompletion.xp ? `+${goal.rewardOnCompletion.xp} XP` : ''}
              {goal.rewardOnCompletion.customRewardText ? ` • ${goal.rewardOnCompletion.customRewardText}` : ''}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-emerald-400 font-medium">Victory Achieved</span>
        )}

        {goal.notes && (
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="text-[11px] text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <span>Notes</span>
            {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      {showNotes && goal.notes && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2.5 p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs text-neutral-300 leading-relaxed font-sans"
        >
          <span className="text-[10px] uppercase font-bold text-amber-400/90 block mb-0.5">
            Retrospective Protocol:
          </span>
          {goal.notes}
        </motion.div>
      )}
    </motion.div>
  );
};
