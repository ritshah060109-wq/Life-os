import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { CircularProgress } from '../common/CircularProgress';
import { GlassCard } from '../common/GlassCard';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  Flame,
  Coins,
  Award,
  Zap,
  Target,
  Clock,
  Droplets,
  Moon,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { getTodayKey } from '../../utils/defaultData';
import { TimeSlot } from '../../types';
import { sound } from '../../utils/soundAndHaptics';

export const HomeView: React.FC = () => {
  const {
    todayScore,
    economy,
    habits,
    schedule,
    badHabits,
    vitals,
    updateVitals,
    toggleHabit,
    toggleScheduleTask,
    settings,
    openQuickAdd,
    setActiveTab,
    setLoopBreakerOpen,
  } = useLifeOS();

  const isLight = settings.theme === 'white';
  const today = getTodayKey();

  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [journalEdit, setJournalEdit] = useState(false);
  const [journalTextDraft, setJournalTextDraft] = useState(vitals.journalText);
  const [missionEdit, setMissionEdit] = useState(false);
  const [missionDraft, setMissionDraft] = useState(vitals.morningMission);

  const activeHabits = habits.filter(h => !h.archived);
  const completedHabits = activeHabits.filter(h => h.completedDates.includes(today));
  const habitPct = activeHabits.length > 0 ? Math.round((completedHabits.length / activeHabits.length) * 100) : 100;

  const todayTasks = schedule.filter(t => t.date === today || t.repeat !== 'none');
  const completedTasks = todayTasks.filter(t => t.completed);
  const schedulePct = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 100;

  // Bad habit clean challenge summary
  const cleanBadHabits = badHabits.filter(bh => !bh.relapses.some(r => r.date === today));
  const badHabitPct = badHabits.length > 0 ? Math.round((cleanBadHabits.length / badHabits.length) * 100) : 100;

  // Timeline slots grouped
  const timeSlots: { key: TimeSlot; label: string; timeRange: string; color: string }[] = [
    { key: 'morning', label: 'Morning Protocol', timeRange: '06:00 - 12:00', color: '#F59E0B' },
    { key: 'afternoon', label: 'Afternoon Execution', timeRange: '12:00 - 17:00', color: '#38BDF8' },
    { key: 'evening', label: 'Evening Peak & Fitness', timeRange: '17:00 - 21:00', color: '#A855F7' },
    { key: 'night', label: 'Night Recovery & Sleep', timeRange: '21:00 - 23:30', color: '#6366F1' },
  ];

  // Coins earned today estimate
  const coinsEarnedToday = completedHabits.reduce((sum, h) => sum + h.coinReward, 0) + completedTasks.length * 15;

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto px-4 pt-3" id="home-command-center">
      {/* 1. HERO COMMAND CENTER: DAY SCORE & CURRENT MISSION */}
      <GlassCard variant="gold" className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Circular Progress Day Score */}
          <div className="flex flex-col items-center">
            <CircularProgress
              value={todayScore.score}
              size={135}
              strokeWidth={11}
              gradientColors={['#F59E0B', '#EAB308']}
              trackColor={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}
              showGlow
            >
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-amber-400">
                  {todayScore.score}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Grade
                  </span>
                  <span className="text-xs font-extrabold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 font-mono">
                    {todayScore.letterGrade}
                  </span>
                </div>
              </div>
            </CircularProgress>

            <button
              onClick={() => setShowScoreDetails(!showScoreDetails)}
              className="mt-2 text-[11px] font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Score Breakdown</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showScoreDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Current Mission & Core KPIs */}
          <div className="flex-1 w-full flex flex-col justify-center space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Current Mission
                </span>
              </div>
              <button
                onClick={() => {
                  if (missionEdit) {
                    updateVitals({ morningMission: missionDraft });
                  }
                  setMissionEdit(!missionEdit);
                }}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 underline"
              >
                {missionEdit ? 'Save' : 'Edit'}
              </button>
            </div>

            {missionEdit ? (
              <input
                type="text"
                value={missionDraft}
                onChange={e => setMissionDraft(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-black/40 border-amber-500/30 text-white'
                }`}
                placeholder="What is your prime imperative today?"
              />
            ) : (
              <p className={`text-sm font-semibold leading-snug ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                {vitals.morningMission || 'Maintain relentless focus & build unbreakable discipline.'}
              </p>
            )}

            {/* Quick 3-ring progress metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className={`p-2 rounded-xl border flex flex-col items-center ${isLight ? 'bg-white/60 border-slate-200' : 'bg-black/30 border-white/[0.06]'}`}>
                <span className="text-[10px] font-medium text-zinc-400">Schedule</span>
                <span className="text-xs font-extrabold font-mono text-cyan-400">{schedulePct}%</span>
                <span className="text-[9px] text-zinc-500">{completedTasks.length}/{todayTasks.length}</span>
              </div>

              <div className={`p-2 rounded-xl border flex flex-col items-center ${isLight ? 'bg-white/60 border-slate-200' : 'bg-black/30 border-white/[0.06]'}`}>
                <span className="text-[10px] font-medium text-zinc-400">Habits</span>
                <span className="text-xs font-extrabold font-mono text-emerald-400">{habitPct}%</span>
                <span className="text-[9px] text-zinc-500">{completedHabits.length}/{activeHabits.length}</span>
              </div>

              <div className={`p-2 rounded-xl border flex flex-col items-center ${isLight ? 'bg-white/60 border-slate-200' : 'bg-black/30 border-white/[0.06]'}`}>
                <span className="text-[10px] font-medium text-zinc-400">Clean Bad</span>
                <span className="text-xs font-extrabold font-mono text-rose-400">{badHabitPct}%</span>
                <span className="text-[9px] text-zinc-500">{cleanBadHabits.length}/{badHabits.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Score Breakdown */}
        <AnimatePresence>
          {showScoreDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 mt-4 border-t border-white/[0.08]"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-black/20 border border-white/[0.05]">
                  <span className="text-zinc-400 block text-[10px]">Habits (30 max)</span>
                  <span className="font-mono font-bold text-amber-400">{todayScore.habitScore} pts</span>
                </div>
                <div className="p-2 rounded-lg bg-black/20 border border-white/[0.05]">
                  <span className="text-zinc-400 block text-[10px]">Schedule (20 max)</span>
                  <span className="font-mono font-bold text-cyan-400">{todayScore.scheduleScore} pts</span>
                </div>
                <div className="p-2 rounded-lg bg-black/20 border border-white/[0.05]">
                  <span className="text-zinc-400 block text-[10px]">Sleep & Rest (15)</span>
                  <span className="font-mono font-bold text-indigo-400">{todayScore.sleepScore} pts</span>
                </div>
                <div className="p-2 rounded-lg bg-black/20 border border-white/[0.05]">
                  <span className="text-zinc-400 block text-[10px]">Fitness & Vitals (35)</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {todayScore.workoutScore + todayScore.focusScore + todayScore.moodScore + todayScore.badHabitScore} pts
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* 2. BREAK THE LOOP EMERGENCY PROTOCOL (Below Scorecard) */}
      <div className="relative group" id="break-the-loop-home-section">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/30 via-red-500/20 to-amber-500/30 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        <div className="relative p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-950/30 to-black/70 border border-rose-500/30 backdrop-blur-xl shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                  Break The Loop
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                  Emergency
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 truncate sm:whitespace-normal mt-0.5">
                Urge, doomscrolling, or brain fog? Launch instant 5-min dopamine rescue.
              </p>
            </div>
          </div>

          <button
            id="home-break-the-loop-btn"
            onClick={() => {
              sound.tap();
              setLoopBreakerOpen(true);
            }}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-md shadow-rose-900/40 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Launch</span>
          </button>
        </div>
      </div>

      {/* 3. RECOVERY MISSION BANNER (If yesterday had low score or relapse) */}
      {vitals.recoveryMission && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/50 to-orange-950/40 border border-red-500/30 flex items-start gap-3 shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-300 uppercase tracking-wider text-[10px]">
                Recovery Mission Active
              </span>
              <button
                onClick={() => updateVitals({ recoveryMission: '' })}
                className="text-[10px] text-zinc-400 hover:text-zinc-200"
              >
                Dismiss
              </button>
            </div>
            <p className="text-zinc-200 mt-1 font-medium">{vitals.recoveryMission}</p>
          </div>
        </motion.div>
      )}

      {/* 3. DAILY BIO-FEEDBACK (Sleep, Mood, Energy) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Sleep Tracker */}
        <GlassCard className="flex flex-col justify-between p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-indigo-400" /> Sleep
            </span>
            <span className="text-xs font-mono font-bold text-indigo-400">
              {vitals.sleepHours}h
            </span>
          </div>

          <div className="my-2 flex items-center justify-around text-xs">
            <span className="text-[10px] text-zinc-500">Quality</span>
            <div className="flex gap-0.5 text-indigo-300 text-xs">
              {'★'.repeat(vitals.sleepQuality)}
            </div>
          </div>

          <button
            onClick={() => openQuickAdd('vitals')}
            className="w-full py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-medium text-center"
          >
            Adjust Sleep
          </button>
        </GlassCard>

        {/* Mood State */}
        <GlassCard className="flex flex-col justify-between p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Smile className="w-3.5 h-3.5 text-emerald-400" /> Mood
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {vitals.mood}/5
            </span>
          </div>

          <div className="my-2 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(v => (
              <button
                key={v}
                onClick={() => updateVitals({ mood: v })}
                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                  vitals.mood === v
                    ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : isLight ? 'bg-slate-200 text-slate-600' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-zinc-500 text-center">
            {vitals.mood >= 4 ? 'High Clarity' : vitals.mood === 3 ? 'Centered' : 'Fatigued'}
          </span>
        </GlassCard>

        {/* Energy State */}
        <GlassCard className="flex flex-col justify-between p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Energy
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {vitals.energyLevel}/5
            </span>
          </div>

          <div className="my-2 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(v => (
              <button
                key={v}
                onClick={() => updateVitals({ energyLevel: v })}
                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                  vitals.energyLevel === v
                    ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    : isLight ? 'bg-slate-200 text-slate-600' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <span className="text-[10px] text-zinc-500 text-center">
            {vitals.energyLevel >= 4 ? 'Peak Drive' : 'Steady State'}
          </span>
        </GlassCard>
      </div>

      {/* 4. LIVE TODAY VELOCITY & COINS STATS */}
      <GlassCard className="flex flex-col justify-between p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Today's Discipline Velocity
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
            +{coinsEarnedToday} Coins Earned
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 block">Habits Done</span>
            <span className="text-sm font-bold font-mono text-amber-300">{completedHabits.length} / {activeHabits.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 block">Tasks Done</span>
            <span className="text-sm font-bold font-mono text-cyan-300">{completedTasks.length} / {todayTasks.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/[0.04]">
            <span className="text-[10px] text-zinc-400 block">Clean Habits</span>
            <span className="text-sm font-bold font-mono text-emerald-300">{cleanBadHabits.length} / {badHabits.length}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
          <span className="text-[11px] text-neutral-400">Total Coins in Sovereign Bank: <strong className="text-amber-400 font-mono">{economy.coins}</strong></span>
          <button
            onClick={() => setActiveTab('economy')}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Open Wallet & Shop</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </GlassCard>

      {/* 5. TODAY'S HABITS FAST-ACTION CHECKLIST */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold tracking-wide">Daily Habits</h3>
          </div>
          <button
            onClick={() => setActiveTab('plan')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {activeHabits.slice(0, 4).map(habit => {
            const isDone = habit.completedDates.includes(today);
            return (
              <motion.div
                key={habit.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleHabit(habit.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isDone
                    ? isLight
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-amber-500/10 border-amber-500/30'
                    : isLight
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-black/30 border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${habit.color}25`, color: habit.color }}
                  >
                    <DynamicIcon name={habit.icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isDone ? 'line-through opacity-70' : ''}`}>
                      {habit.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                      <span className="font-mono text-amber-400 font-semibold">+{habit.coinReward} Coins</span>
                      <span>•</span>
                      <span>Streak: {habit.streak}d</span>
                    </div>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    isDone
                      ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                      : isLight ? 'border-slate-300' : 'border-zinc-700'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : <Circle className="w-4 h-4 opacity-20" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>

      {/* 6. FOUR-SLOT TIMELINE BREAKDOWN (Morning, Afternoon, Evening, Night) */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold tracking-wide">Daily Timeline Progression</h3>
          </div>
          <button
            onClick={() => openQuickAdd('task')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="space-y-3">
          {timeSlots.map(slot => {
            const slotTasks = todayTasks.filter(t => t.timeSlot === slot.key);
            const slotDone = slotTasks.filter(t => t.completed).length;

            return (
              <div
                key={slot.key}
                className={`p-3 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: slot.color, boxShadow: `0 0 8px ${slot.color}80` }}
                    />
                    <span className="text-xs font-bold tracking-wide">{slot.label}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({slot.timeRange})</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-zinc-400">
                    {slotDone}/{slotTasks.length} Done
                  </span>
                </div>

                <div className="space-y-2 mt-2">
                  {slotTasks.length === 0 ? (
                    <div className="py-2 text-center text-[11px] text-zinc-500 italic">
                      No tasks scheduled for {slot.label.toLowerCase()}
                    </div>
                  ) : (
                    slotTasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleScheduleTask(task.id)}
                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          task.completed
                            ? 'bg-white/5 border-white/5 opacity-60'
                            : isLight ? 'bg-white border-slate-200' : 'bg-zinc-900/80 border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                              task.completed ? 'bg-cyan-500 border-cyan-400 text-black' : isLight ? 'border-slate-400' : 'border-zinc-600'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className={`text-xs font-semibold ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </span>
                            {task.startTime && (
                              <span className="text-[10px] text-zinc-400 font-mono ml-2">
                                {task.startTime} ({task.durationMinutes || 45}m)
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            task.priority === 'high'
                              ? 'bg-red-500/20 text-red-300'
                              : task.priority === 'medium'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 7. DAILY JOURNAL & REFLECTION */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold tracking-wide">Daily Mindset Journal</h3>
          </div>
          <button
            onClick={() => {
              if (journalEdit) {
                updateVitals({ journalText: journalTextDraft });
              }
              setJournalEdit(!journalEdit);
            }}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300"
          >
            {journalEdit ? 'Save Entry' : 'Edit Entry'}
          </button>
        </div>

        {journalEdit ? (
          <textarea
            rows={4}
            value={journalTextDraft}
            onChange={e => setJournalTextDraft(e.target.value)}
            className={`w-full p-3 rounded-xl border text-xs font-medium focus:outline-none focus:border-purple-400 ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-black/50 border-white/10 text-white'
            }`}
            placeholder="Reflect on today's discipline, obstacles, and wins..."
          />
        ) : (
          <p className={`text-xs leading-relaxed font-medium italic p-3 rounded-xl border ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/30 border-white/[0.04] text-zinc-300'
          }`}>
            "{vitals.journalText || 'Take 2 minutes to write your evening reflection and close out the day.'}"
          </p>
        )}
      </GlassCard>
    </div>
  );
};
