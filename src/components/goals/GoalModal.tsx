import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
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
  AlertCircle,
  Clock,
  Layers,
  Award,
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';
import { PersonalGoal, GoalPriority, GoalStatus } from '../../types';
import { getFutureDateKey, getTodayKey } from '../../utils/defaultData';
import { sound } from '../../utils/soundAndHaptics';

const AVAILABLE_ICONS = [
  { name: 'Target', icon: Target },
  { name: 'Flame', icon: Flame },
  { name: 'Zap', icon: Zap },
  { name: 'Trophy', icon: Trophy },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Brain', icon: Brain },
  { name: 'Rocket', icon: Rocket },
  { name: 'Crown', icon: Crown },
  { name: 'Star', icon: Star },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Compass', icon: Compass },
  { name: 'Shield', icon: Shield },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'Flag', icon: Flag },
  { name: 'Coins', icon: Coins },
];

const PRESET_CATEGORIES = [
  'Mindset & Discipline',
  'Career & Wealth',
  'Health & Fitness',
  'Learning & Skills',
  'Personal & Lifestyle',
  'Creative & Projects',
];

const PRIORITY_CONFIG: Record<GoalPriority, { label: string; bg: string; text: string; border: string }> = {
  low: {
    label: 'Low',
    bg: 'bg-slate-500/15',
    text: 'text-slate-300',
    border: 'border-slate-500/30',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  high: {
    label: 'High',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  critical: {
    label: 'Critical',
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
  },
};

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: PersonalGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
}) => {
  const { addGoal, updateGoal, habits } = useLifeOS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Mindset & Discipline');
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState<GoalPriority>('high');
  const [targetDate, setTargetDate] = useState(getFutureDateKey(30));
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GoalStatus>('in_progress');
  const [selectedIcon, setSelectedIcon] = useState('Target');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [rewardCoins, setRewardCoins] = useState<number | ''>(250);
  const [rewardXP, setRewardXP] = useState<number | ''>(500);
  const [customRewardText, setCustomRewardText] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title || '');
      setDescription(goalToEdit.description || '');
      if (PRESET_CATEGORIES.includes(goalToEdit.category)) {
        setCategory(goalToEdit.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(goalToEdit.category || '');
      }
      setPriority(goalToEdit.priority || 'high');
      setTargetDate(goalToEdit.targetDate || getFutureDateKey(30));
      setProgress(goalToEdit.progress ?? 0);
      setStatus(goalToEdit.status || 'in_progress');
      setSelectedIcon(goalToEdit.icon || 'Target');
      setSelectedHabits(goalToEdit.relatedHabits || []);
      setRewardCoins(goalToEdit.rewardOnCompletion?.coins ?? 250);
      setRewardXP(goalToEdit.rewardOnCompletion?.xp ?? 500);
      setCustomRewardText(goalToEdit.rewardOnCompletion?.customRewardText || '');
      setNotes(goalToEdit.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Mindset & Discipline');
      setCustomCategory('');
      setPriority('high');
      setTargetDate(getFutureDateKey(30));
      setProgress(0);
      setStatus('in_progress');
      setSelectedIcon('Target');
      setSelectedHabits([]);
      setRewardCoins(250);
      setRewardXP(500);
      setCustomRewardText('');
      setNotes('');
    }
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleToggleHabit = (habitName: string) => {
    sound.tap();
    setSelectedHabits(prev =>
      prev.includes(habitName) ? prev.filter(h => h !== habitName) : [...prev, habitName]
    );
  };

  const handleSetQuickTargetDate = (daysAhead: number) => {
    sound.tap();
    setTargetDate(getFutureDateKey(daysAhead));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = category === 'Custom' ? (customCategory.trim() || 'General') : category;
    const finalCoins = typeof rewardCoins === 'number' && rewardCoins > 0 ? rewardCoins : undefined;
    const finalXP = typeof rewardXP === 'number' && rewardXP > 0 ? rewardXP : undefined;

    const rewardData = (finalCoins || finalXP || customRewardText.trim()) ? {
      coins: finalCoins,
      xp: finalXP,
      customRewardText: customRewardText.trim() || undefined,
    } : undefined;

    let computedStatus: GoalStatus = status;
    if (progress >= 100) computedStatus = 'completed';
    else if (progress === 0 && status === 'completed') computedStatus = 'not_started';
    else if (progress > 0 && status === 'not_started') computedStatus = 'in_progress';

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        priority,
        targetDate,
        progress,
        status: computedStatus,
        icon: selectedIcon,
        relatedHabits: selectedHabits,
        rewardOnCompletion: rewardData,
        notes: notes.trim(),
      });
    } else {
      addGoal({
        title: title.trim(),
        description: description.trim(),
        category: finalCategory,
        priority,
        targetDate,
        progress,
        status: computedStatus,
        icon: selectedIcon,
        relatedHabits: selectedHabits,
        rewardOnCompletion: rewardData,
        notes: notes.trim(),
      });
    }

    onClose();
  };

  const activeHabits = habits.filter(h => !h.archived);

  return (
    <AnimatePresence>
      <div
        id="goal-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#09090b] border border-amber-500/30 p-4 sm:p-6 text-neutral-100 shadow-[0_0_40px_rgba(245,158,11,0.12)] my-auto no-scrollbar"
        >
          {/* Close button */}
          <button
            id="close-goal-modal-btn"
            onClick={onClose}
            aria-label="Close goal modal"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pr-8">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {goalToEdit ? 'Edit Personal Goal' : 'Forge New Personal Goal'}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Define milestones, target deadlines, habit alignments, and completion rewards
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Goal Name */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                Goal Name <span className="text-amber-400">*</span>
              </label>
              <input
                id="goal-title-input"
                type="text"
                required
                placeholder="e.g. Master Full-Stack Architecture & Ship v1.0"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            {/* 2. Description */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                Description & Vision
              </label>
              <textarea
                id="goal-description-input"
                rows={2}
                placeholder="Why does this goal matter? What does sovereign victory look like?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            {/* 3. Category & Icon Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                  Category
                </label>
                <select
                  id="goal-category-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {PRESET_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom">+ Custom Category...</option>
                </select>

                {category === 'Custom' && (
                  <input
                    type="text"
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    className="w-full mt-2 px-3 py-1.5 rounded-xl bg-black/50 border border-amber-500/30 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                  Priority Tier
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['low', 'medium', 'high', 'critical'] as GoalPriority[]).map(p => {
                    const cfg = PRIORITY_CONFIG[p];
                    const isSelected = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          sound.tap();
                          setPriority(p);
                        }}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all text-center ${
                          isSelected
                            ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-1 ring-amber-400/40`
                            : 'bg-black/40 text-neutral-400 border-white/5 hover:text-white'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Icon Selector */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                Goal Icon
              </label>
              <div className="grid grid-cols-8 gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5 max-h-24 overflow-y-auto no-scrollbar">
                {AVAILABLE_ICONS.map(({ name, icon: IconComp }) => {
                  const isSelected = selectedIcon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        sound.tap();
                        setSelectedIcon(name);
                      }}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 scale-105'
                          : 'text-neutral-400 hover:bg-white/10 hover:text-white'
                      }`}
                      title={name}
                    >
                      <IconComp size={16} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Target Date & Quick Durations */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-neutral-300">
                  Target Deadline Date
                </label>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                  <span>Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSetQuickTargetDate(7)}
                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-amber-300"
                  >
                    +7d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetQuickTargetDate(30)}
                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-amber-300"
                  >
                    +30d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetQuickTargetDate(90)}
                    className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-amber-300"
                  >
                    +90d
                  </button>
                </div>
              </div>
              <input
                id="goal-target-date-input"
                type="date"
                required
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 6. Progress Percentage & Status */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300">
                  Initial / Current Progress: <span className="font-mono text-amber-400 font-extrabold">{progress}%</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {(['not_started', 'in_progress', 'completed'] as GoalStatus[]).map(st => {
                    const isSelected = status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          sound.tap();
                          setStatus(st);
                          if (st === 'completed') setProgress(100);
                          else if (st === 'not_started') setProgress(0);
                          else if (progress === 0 || progress === 100) setProgress(25);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'text-neutral-500 border-transparent hover:text-neutral-300'
                        }`}
                      >
                        {st === 'not_started' ? 'Not Started' : st === 'in_progress' ? 'In Progress' : 'Completed'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={e => {
                  const val = Number(e.target.value);
                  setProgress(val);
                  if (val === 100) setStatus('completed');
                  else if (val > 0) setStatus('in_progress');
                  else setStatus('not_started');
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>0% (Kickoff)</span>
                <span>50% (Halfway)</span>
                <span>100% (Sovereign Completion)</span>
              </div>
            </div>

            {/* 7. Optional Related Habits Multi-Select */}
            {activeHabits.length > 0 && (
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                  Related Habits (Optional alignment)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar p-1">
                  {activeHabits.map(h => {
                    const isSelected = selectedHabits.includes(h.name);
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleToggleHabit(h.name)}
                        className={`text-xs px-2.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                            : 'bg-black/30 text-neutral-400 border-white/5 hover:text-neutral-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="truncate max-w-[150px]">{h.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. Completion Rewards (Optional) */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Coins size={14} />
                <span>Rewards on Goal Completion (Optional)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">+ Coins Bonus</label>
                  <input
                    type="number"
                    min={0}
                    step={25}
                    placeholder="250"
                    value={rewardCoins}
                    onChange={e => setRewardCoins(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/20 text-amber-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">+ XP Bonus</label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    placeholder="500"
                    value={rewardXP}
                    onChange={e => setRewardXP(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/20 text-amber-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Custom unlock perk (e.g. 'Unlock 48-Hour Cheat Feast' or 'Gold Certificate')"
                  value={customRewardText}
                  onChange={e => setCustomRewardText(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* 9. Actionable Notes (Optional) */}
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">
                Strategic Notes & Action Protocol (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Tactical routines, anti-relapse guardrails, key milestones..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                id="submit-goal-btn"
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>{goalToEdit ? 'Save Changes' : 'Commit Goal'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
