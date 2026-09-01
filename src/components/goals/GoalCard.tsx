import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Sparkle,
  Layers,
  Award,
  Sliders,
} from 'lucide-react';
import { PersonalGoal, GoalPriority } from '../../types';
import { useLifeOS } from '../../context/LifeOSContext';
import { sound } from '../../utils/soundAndHaptics';

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

const PRIORITY_BADGES: Record<GoalPriority, { label: string; bg: string; text: string; border: string; glow: string }> = {
  low: {
    label: 'Low Priority',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/25',
    glow: '',
  },
  medium: {
    label: 'Medium Priority',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/25',
    glow: '',
  },
  high: {
    label: 'High Priority',
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/35',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.12)]',
  },
  critical: {
    label: 'Critical Priority',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/35',
    glow: 'shadow-[0_0_18px_rgba(244,63,94,0.15)]',
  },
};

const CATEGORY_COLORS: Record<string, { badge: string; iconBg: string; text: string }> = {
  'Mindset & Discipline': { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', iconBg: 'bg-amber-500/20 text-amber-400 border-amber-400/30', text: 'text-amber-400' },
  'Career & Wealth': { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/30', text: 'text-emerald-400' },
  'Health & Fitness': { badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30', iconBg: 'bg-rose-500/20 text-rose-400 border-rose-400/30', text: 'text-rose-400' },
  'Learning & Skills': { badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-400/30', text: 'text-indigo-400' },
  'Personal & Lifestyle': { badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30', iconBg: 'bg-purple-500/20 text-purple-400 border-purple-400/30', text: 'text-purple-400' },
  'Creative & Projects': { badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-400/30', text: 'text-cyan-400' },
};

interface GoalCardProps {
  goal: PersonalGoal;
  onEdit: (goal: PersonalGoal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit }) => {
  const { updateGoalProgress, completeGoal, deleteGoal, settings } = useLifeOS();
  const isLight = settings.theme === 'white';

  const [showSlider, setShowSlider] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const IconComp = ICON_MAP[goal.icon || 'Target'] || Target;
  const priorityStyle = PRIORITY_BADGES[goal.priority || 'medium'] || PRIORITY_BADGES.medium;
  const categoryStyle = CATEGORY_COLORS[goal.category] || {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-400/30',
    text: 'text-amber-400',
  };

  // Compute remaining days
  const computeRemainingDays = () => {
    if (!goal.targetDate) return { text: 'No deadline', isOverdue: false, isDueToday: false };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = goal.targetDate.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Due Today', isOverdue: false, isDueToday: true, days: 0 };
    if (diffDays === 1) return { text: '1 day left', isOverdue: false, isDueToday: false, days: 1 };
    if (diffDays > 1) return { text: `${diffDays} days left`, isOverdue: false, isDueToday: false, days: diffDays };
    const absDays = Math.abs(diffDays);
    return { text: `Overdue by ${absDays} ${absDays === 1 ? 'day' : 'days'}`, isOverdue: true, isDueToday: false, days: diffDays };
  };

  const remaining = computeRemainingDays();

  const handleStepProgress = (delta: number) => {
    const nextVal = Math.max(0, Math.min(100, (goal.progress ?? 0) + delta));
    updateGoalProgress(goal.id, nextVal);
  };

  const handleComplete = () => {
    completeGoal(goal.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete the goal "${goal.title}"?`)) {
      deleteGoal(goal.id);
    }
  };

  const progressValue = Math.max(0, Math.min(100, goal.progress ?? 0));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl p-4 sm:p-5 border transition-all relative overflow-hidden ${
        isLight
          ? 'bg-white/95 border-slate-200/90 shadow-sm hover:shadow-md'
          : `bg-[#0c0c0e]/95 border-white/[0.08] ${priorityStyle.glow} hover:border-amber-500/30`
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Priority Chip */}
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
          >
            {priorityStyle.label}
          </span>

          {/* Category Chip */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyle.badge}`}
          >
            {goal.category}
          </span>

          {/* Status Chip */}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 capitalize">
            {goal.status === 'not_started' ? 'Not Started' : 'In Progress'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="Edit Goal"
          >
            <Edit3 size={13} />
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

      {/* Main Content Area */}
      <div className="flex items-start gap-3.5 mb-3.5">
        {/* Goal Icon */}
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border shrink-0 shadow-inner ${categoryStyle.iconBg}`}
        >
          <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
            {goal.title}
          </h4>
          {goal.description && (
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {goal.description}
            </p>
          )}

          {/* Related Habits Tags */}
          {goal.relatedHabits && goal.relatedHabits.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2">
              <span className="text-[10px] text-neutral-500 font-medium">Linked Habits:</span>
              {goal.relatedHabits.map(h => (
                <span
                  key={h}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300/90 border border-amber-500/20 font-medium"
                >
                  ⚡ {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress & Remaining Days Section */}
      <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          {/* Remaining Days */}
          <div className="flex items-center gap-1.5">
            <Clock
              size={13}
              className={
                remaining.isOverdue
                  ? 'text-rose-400'
                  : remaining.isDueToday
                  ? 'text-amber-400 animate-pulse'
                  : 'text-neutral-400'
              }
            />
            <span
              className={`font-semibold text-[11px] ${
                remaining.isOverdue
                  ? 'text-rose-400 font-bold'
                  : remaining.isDueToday
                  ? 'text-amber-400 font-bold'
                  : 'text-neutral-300'
              }`}
            >
              {remaining.text}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              ({goal.targetDate})
            </span>
          </div>

          {/* Completion Percentage */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Progress:</span>
            <span className="text-sm font-extrabold font-mono text-amber-400">
              {progressValue}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2.5 rounded-full bg-neutral-800/80 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`h-full rounded-full transition-all ${
              progressValue >= 80
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : progressValue >= 40
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-gradient-to-r from-neutral-600 to-amber-500'
            }`}
          />
        </div>

        {/* Interactive Progress Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStepProgress(-5)}
              disabled={progressValue <= 0}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="-5%"
            >
              <Minus size={12} />
            </button>
            <button
              onClick={() => handleStepProgress(5)}
              disabled={progressValue >= 100}
              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/20 transition-colors"
            >
              +5%
            </button>
            <button
              onClick={() => handleStepProgress(10)}
              disabled={progressValue >= 100}
              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/20 transition-colors"
            >
              +10%
            </button>
            <button
              onClick={() => handleStepProgress(25)}
              disabled={progressValue >= 100}
              className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/20 transition-colors"
            >
              +25%
            </button>
            <button
              onClick={() => setShowSlider(!showSlider)}
              className={`p-1.5 rounded-lg transition-colors ${
                showSlider ? 'bg-amber-500 text-black' : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white'
              }`}
              title="Toggle Precise Slider"
            >
              <Sliders size={12} />
            </button>
          </div>

          {/* 1-Click Complete Button */}
          <button
            onClick={handleComplete}
            className="py-1 px-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 active:scale-95 text-black font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-all"
            title="Mark 100% Completed"
          >
            <CheckCircle2 size={13} />
            <span>Complete</span>
          </button>
        </div>

        {/* Precise Slider Panel */}
        {showSlider && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-white/5 space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Calibrate Progress:</span>
              <span className="font-mono text-amber-300 font-bold">{progressValue}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={progressValue}
              onChange={e => updateGoalProgress(goal.id, Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </motion.div>
        )}
      </div>

      {/* Rewards & Notes Footer Bar */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/5 text-xs text-neutral-400">
        {/* Completion Reward Preview */}
        {goal.rewardOnCompletion ? (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300/90">
            <Award size={13} className="text-amber-400" />
            <span>
              {goal.rewardOnCompletion.coins ? `+${goal.rewardOnCompletion.coins} 🪙` : ''}
              {goal.rewardOnCompletion.coins && goal.rewardOnCompletion.xp ? ' • ' : ''}
              {goal.rewardOnCompletion.xp ? `+${goal.rewardOnCompletion.xp} XP` : ''}
              {goal.rewardOnCompletion.customRewardText ? ` (${goal.rewardOnCompletion.customRewardText})` : ''}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-neutral-500 italic">Self-Discipline Sovereign Reward</span>
        )}

        {/* Notes Toggle */}
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

      {/* Expanded Notes Section */}
      {showNotes && goal.notes && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2.5 p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs text-neutral-300 leading-relaxed font-sans"
        >
          <span className="text-[10px] uppercase font-bold text-amber-400/90 block mb-0.5">
            Tactical Protocol:
          </span>
          {goal.notes}
        </motion.div>
      )}
    </motion.div>
  );
};
