import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import { CircularProgress } from '../common/CircularProgress';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  CalendarCheck,
  Zap,
  ShieldAlert,
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Flame,
  AlertOctagon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  History,
  Sliders,
} from 'lucide-react';
import { getTodayKey, getPastDateKey } from '../../utils/defaultData';
import { TimeSlot, TaskPriority, HabitDifficulty } from '../../types';

export const PlanView: React.FC = () => {
  const {
    habits,
    toggleHabit,
    deleteHabit,
    addHabit,
    schedule,
    toggleScheduleTask,
    deleteScheduleTask,
    addScheduleTask,
    badHabits,
    recordRelapse,
    recordCleanDay,
    deleteBadHabit,
    settings,
    openQuickAdd,
    logFocusTime,
  } = useLifeOS();

  const isLight = settings.theme === 'white';
  const today = getTodayKey();

  // Sub-tab navigation inside PLAN
  const [subTab, setSubTab] = useState<'schedule' | 'habits' | 'destroyer' | 'heatmap' | 'focus'>('schedule');

  // Relapse Modal State
  const [relapseModalHabitId, setRelapseModalHabitId] = useState<string | null>(null);
  const [relapseReason, setRelapseReason] = useState('Stress & fatigue');
  const [relapseNotes, setRelapseNotes] = useState('');

  // Focus Mode State (Fully Customizable)
  const [focusType, setFocusType] = useState<'pomodoro' | 'deepwork' | 'sprint' | 'custom' | 'stopwatch'>('pomodoro');
  const [customDurationMinutes, setCustomDurationMinutes] = useState(25);
  const [customCoinsReward, setCustomCoinsReward] = useState(30);
  const [customXpReward, setCustomXpReward] = useState(60);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(25 * 60);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusTotalMinutesToday, setFocusTotalMinutesToday] = useState(0);
  const [focusSessionTask, setFocusSessionTask] = useState('Deep Work Implementation');
  const [showCustomConfig, setShowCustomConfig] = useState(false);

  // Focus Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (focusRunning) {
      interval = setInterval(() => {
        if (focusType === 'stopwatch') {
          setFocusSeconds(s => s + 1);
        } else {
          setFocusSeconds(s => {
            if (s <= 1) {
              setFocusRunning(false);
              const duration = customDurationMinutes;
              logFocusTime(duration, focusSessionTask, customCoinsReward, customXpReward);
              setFocusTotalMinutesToday(m => m + duration);
              return 0;
            }
            return s - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusRunning, focusType, customDurationMinutes, focusSessionTask, customCoinsReward, customXpReward, logFocusTime]);

  const setTimerPreset = (type: 'pomodoro' | 'deepwork' | 'sprint' | 'custom' | 'stopwatch') => {
    setFocusRunning(false);
    setFocusType(type);
    if (type === 'pomodoro') {
      setCustomDurationMinutes(25);
      setCustomCoinsReward(30);
      setCustomXpReward(60);
      setTotalTimerSeconds(25 * 60);
      setFocusSeconds(25 * 60);
    } else if (type === 'deepwork') {
      setCustomDurationMinutes(50);
      setCustomCoinsReward(75);
      setCustomXpReward(150);
      setTotalTimerSeconds(50 * 60);
      setFocusSeconds(50 * 60);
    } else if (type === 'sprint') {
      setCustomDurationMinutes(15);
      setCustomCoinsReward(20);
      setCustomXpReward(40);
      setTotalTimerSeconds(15 * 60);
      setFocusSeconds(15 * 60);
    } else if (type === 'stopwatch') {
      setFocusSeconds(0);
      setTotalTimerSeconds(0);
    } else if (type === 'custom') {
      setFocusSeconds(customDurationMinutes * 60);
      setTotalTimerSeconds(customDurationMinutes * 60);
      setShowCustomConfig(true);
    }
  };

  const applyCustomSettings = (minutes: number, coins: number, xp?: number) => {
    const validMins = Math.max(1, Math.min(360, minutes));
    const validCoins = Math.max(0, coins);
    const validXP = typeof xp === 'number' ? xp : validCoins * 2;
    setCustomDurationMinutes(validMins);
    setCustomCoinsReward(validCoins);
    setCustomXpReward(validXP);
    setTotalTimerSeconds(validMins * 60);
    setFocusSeconds(validMins * 60);
    setFocusRunning(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Schedule accuracy metrics
  const todayTasks = schedule.filter(t => t.date === today || t.repeat !== 'none');
  const completedTasks = todayTasks.filter(t => t.completed);
  const scheduleAccuracy = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 100;

  // Weekly Heatmap 7 days (Monday - Sunday)
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const dateKey = getPastDateKey(6 - i);
    const dateObj = new Date(dateKey);
    const dayName = dayNames[(dateObj.getDay() + 6) % 7]; // shift Mon=0
    return { dateKey, dayName };
  });

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3" id="plan-module">
      {/* Top Segmented Sub-Tab Switcher */}
      <div className="flex items-center justify-between p-1 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-xl overflow-x-auto no-scrollbar">
        {[
          { id: 'schedule', label: 'Schedule', icon: CalendarCheck },
          { id: 'habits', label: 'Habits', icon: Zap },
          { id: 'destroyer', label: 'Destroyer', icon: ShieldAlert },
          { id: 'heatmap', label: '7D Heatmap', icon: Calendar },
          { id: 'focus', label: 'Focus Mode', icon: Clock },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. SCHEDULE PLANNER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'schedule' && (
        <div className="space-y-4">
          {/* Header Stats: Accuracy & Progress */}
          <GlassCard variant="gold" className="flex items-center justify-between p-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Schedule Accuracy & Completion
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold font-mono text-amber-300">
                  {scheduleAccuracy}%
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  ({completedTasks.length}/{todayTasks.length} Blocks Complete)
                </span>
              </div>
            </div>

            <button
              onClick={() => openQuickAdd('task')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-400 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
          </GlassCard>

          {/* Timeline Slots */}
          {(['morning', 'afternoon', 'evening', 'night'] as TimeSlot[]).map(slot => {
            const slotTasks = todayTasks.filter(t => t.timeSlot === slot);
            const slotColors: Record<TimeSlot, string> = {
              morning: '#F59E0B',
              afternoon: '#38BDF8',
              evening: '#A855F7',
              night: '#6366F1',
            };

            return (
              <GlassCard key={slot} className="p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: slotColors[slot], boxShadow: `0 0 10px ${slotColors[slot]}80` }}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      {slot} Timeline
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {slotTasks.filter(t => t.completed).length}/{slotTasks.length} Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {slotTasks.length === 0 ? (
                    <div className="py-3 text-center text-xs text-zinc-500">
                      No blocks scheduled. Tap '+ Add Block' above.
                    </div>
                  ) : (
                    slotTasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                          task.completed
                            ? 'bg-white/5 border-white/5 opacity-60'
                            : isLight ? 'bg-white border-slate-200' : 'bg-black/40 border-white/[0.08]'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 flex-1 cursor-pointer"
                          onClick={() => toggleScheduleTask(task.id)}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                              task.completed
                                ? 'bg-amber-500 border-amber-400 text-black'
                                : isLight ? 'border-slate-300' : 'border-zinc-700'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono mt-0.5">
                              {task.startTime && <span>{task.startTime}</span>}
                              {task.durationMinutes && <span>({task.durationMinutes} mins)</span>}
                              <span className="capitalize text-zinc-500">{task.category.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                              task.priority === 'high'
                                ? 'bg-red-500/20 text-red-300'
                                : task.priority === 'medium'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <button
                            onClick={() => deleteScheduleTask(task.id)}
                            className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. HABIT TRACKER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'habits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Active Habit Protocols ({habits.length})
            </span>
            <button
              onClick={() => openQuickAdd('habit')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Habit</span>
            </button>
          </div>

          <div className="space-y-3">
            {habits.map(habit => {
              const isDone = habit.completedDates.includes(today);

              return (
                <GlassCard
                  key={habit.id}
                  className={`p-4 border transition-all ${
                    isDone
                      ? isLight ? 'bg-amber-50/60 border-amber-300' : 'bg-amber-500/10 border-amber-500/30'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="flex items-start gap-3.5 flex-1 cursor-pointer"
                      onClick={() => toggleHabit(habit.id)}
                    >
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: `${habit.color}25`, color: habit.color }}
                      >
                        <DynamicIcon name={habit.icon} className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${isDone ? 'line-through opacity-75' : ''}`}>
                            {habit.name}
                          </h4>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              habit.difficulty === 'hard' || habit.difficulty === 'legendary'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {habit.difficulty}
                          </span>
                        </div>

                        {habit.notes && (
                          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{habit.notes}</p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                            +{habit.coinReward} Coins
                          </span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-indigo-400 font-bold">+{habit.xpReward} XP</span>
                          <span className="text-zinc-500">•</span>
                          <span className="flex items-center gap-1 text-orange-400 font-bold">
                            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                            {habit.streak}d streak
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all ${
                          isDone
                            ? 'bg-amber-500 border-amber-400 text-black shadow-md shadow-amber-500/30'
                            : isLight ? 'border-slate-300' : 'border-zinc-700 hover:border-amber-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5 stroke-[3]" /> : <Circle className="w-5 h-5 opacity-20" />}
                      </button>

                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 transition-colors"
                        title="Delete habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. BAD HABIT DESTROYER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'destroyer' && (
        <div className="space-y-4">
          <GlassCard variant="glow" className="p-4 bg-gradient-to-r from-red-950/30 to-orange-950/20 border-red-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="text-sm font-bold">21-Day Bad Habit Destroyer</h3>
                  <p className="text-[11px] text-zinc-400">
                    Sustain unbroken clean streaks. Never erase lifetime statistics on relapse.
                  </p>
                </div>
              </div>

              <button
                onClick={() => openQuickAdd('bad_habit')}
                className="px-3.5 py-1.5 rounded-xl bg-red-500 text-white font-bold text-xs shadow hover:bg-red-600 transition-all"
              >
                + Add Bad Habit
              </button>
            </div>
          </GlassCard>

          <div className="space-y-4">
            {badHabits.map(bh => {
              const cleanToday = (bh.cleanDaysHistory || []).includes(today);
              const targetDays = bh.challengeDaysTarget && !isNaN(bh.challengeDaysTarget) && bh.challengeDaysTarget > 0 ? bh.challengeDaysTarget : 21;
              const currentStreak = typeof bh.currentStreakDays === 'number' && !isNaN(bh.currentStreakDays) ? bh.currentStreakDays : 0;
              const progressPct = Math.min(100, Math.round((currentStreak / targetDays) * 100));
              const safeSuccessPct = typeof bh.successPercentage === 'number' && !isNaN(bh.successPercentage) ? bh.successPercentage : 100;

              return (
                <GlassCard key={bh.id} className="p-4 space-y-4 border-red-500/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                        <DynamicIcon name={bh.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100">{bh.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                          <span>Target: {targetDays} Days Clean</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-mono font-bold">{safeSuccessPct}% Success</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteBadHabit(bh.id)}
                      className="text-zinc-600 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 21-Day Progress Ring & Stats */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] flex items-center justify-between gap-4">
                    <CircularProgress
                      value={progressPct}
                      size={76}
                      strokeWidth={7}
                      gradientColors={['#EF4444', '#F97316']}
                    >
                      <span className="text-xs font-mono font-bold text-red-400">
                        {bh.currentStreakDays}d
                      </span>
                    </CircularProgress>

                    <div className="flex-1 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-white/[0.04]">
                        <span className="text-[9px] text-zinc-400 block">Clean Streak</span>
                        <span className="font-mono font-bold text-emerald-400">{bh.currentStreakDays} Days</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.04]">
                        <span className="text-[9px] text-zinc-400 block">Best Streak</span>
                        <span className="font-mono font-bold text-amber-400">{bh.longestStreakDays} Days</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.04]">
                        <span className="text-[9px] text-zinc-400 block">Relapses</span>
                        <span className="font-mono font-bold text-rose-400">{bh.relapseCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Log Clean Day or Log Relapse */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => recordCleanDay(bh.id)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow ${
                        cleanToday
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-500 text-black hover:bg-emerald-400'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{cleanToday ? 'Clean Day Recorded (+35 Coins)' : 'Log Clean Day (+35 Coins)'}</span>
                    </button>

                    <button
                      onClick={() => setRelapseModalHabitId(bh.id)}
                      className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>Log Relapse</span>
                    </button>
                  </div>

                  {/* Relapse History Accordion */}
                  {bh.relapses.length > 0 && (
                    <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1">
                        <History className="w-3 h-3 text-red-400" /> Relapse Archive ({bh.relapses.length})
                      </span>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {bh.relapses.map(rel => (
                          <div key={rel.id} className="text-[11px] flex items-center justify-between text-zinc-400">
                            <span>{rel.date} {rel.time}</span>
                            <span className="text-red-300 font-medium">{rel.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. WEEKLY 7-DAY HEATMAP */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'heatmap' && (
        <div className="space-y-4">
          <GlassCard variant="gold" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">7-Day Habit Heatmap</h3>
                <p className="text-[11px] text-zinc-400">
                  Green = 100% Completed • Yellow = 50-99% • Red = &lt;50%
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs">
                86% Weekly Average
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left pb-3 font-semibold text-zinc-400">Habit Protocol</th>
                  {past7Days.map(d => (
                    <th key={d.dateKey} className="pb-3 text-center font-mono font-bold text-zinc-300">
                      {d.dayName}
                    </th>
                  ))}
                  <th className="pb-3 text-right font-mono font-bold text-amber-400">Weekly %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {habits.map(habit => {
                  let completedCount = 0;
                  return (
                    <tr key={habit.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2">
                          <DynamicIcon name={habit.icon} className="w-4 h-4" color={habit.color} />
                          <span className="font-bold text-zinc-200 truncate max-w-[130px]">{habit.name}</span>
                        </div>
                      </td>
                      {past7Days.map(d => {
                        const isDone = habit.completedDates.includes(d.dateKey);
                        if (isDone) completedCount++;

                        return (
                          <td key={d.dateKey} className="py-3 text-center">
                            <div
                              className={`w-6 h-6 rounded-md mx-auto flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-emerald-500 text-black font-bold shadow-sm shadow-emerald-500/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {isDone ? '✓' : '•'}
                            </div>
                          </td>
                        );
                      })}
                      <td className="py-3 text-right font-mono font-bold text-amber-300">
                        {Math.round((completedCount / 7) * 100)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. FOCUS MODE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {subTab === 'focus' && (
        <div className="space-y-4">
          <GlassCard variant="glow" className="p-6 flex flex-col items-center justify-center space-y-5">
            {/* Mode Selectors */}
            <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-black/40 border border-white/[0.08] w-full max-w-md">
              {[
                { id: 'pomodoro', label: 'Pomodoro' },
                { id: 'deepwork', label: 'Deep Work' },
                { id: 'sprint', label: 'Sprint' },
                { id: 'custom', label: 'Custom' },
                { id: 'stopwatch', label: 'Stopwatch' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setTimerPreset(mode.id as any)}
                  className={`py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                    focusType === mode.id
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Customizer Panel (Toggle or always accessible) */}
            <div className="w-full max-w-md p-3.5 rounded-2xl bg-black/30 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Session Config & Bounty
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold">
                  +{customCoinsReward} Coins • +{customXpReward} XP
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 block mb-1">
                    Duration (Minutes): <span className="text-white font-mono">{customDurationMinutes}m</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={360}
                    value={customDurationMinutes}
                    onChange={e => applyCustomSettings(parseInt(e.target.value) || 1, customCoinsReward, customXpReward)}
                    className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:border-amber-400 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-zinc-900/90 border-zinc-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 block mb-1">
                    Coin Bounty: <span className="text-amber-400 font-mono">{customCoinsReward} 🪙</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    value={customCoinsReward}
                    onChange={e => applyCustomSettings(customDurationMinutes, parseInt(e.target.value) || 0, customXpReward)}
                    className={`w-full px-3 py-1.5 rounded-xl border text-xs font-mono font-bold focus:outline-none focus:border-amber-400 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-zinc-900/90 border-zinc-700 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for Custom Configuration */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {[
                  { m: 15, c: 20, l: '15m / 20🪙' },
                  { m: 25, c: 30, l: '25m / 30🪙' },
                  { m: 45, c: 60, l: '45m / 60🪙' },
                  { m: 60, c: 100, l: '60m / 100🪙' },
                  { m: 90, c: 150, l: '90m / 150🪙' },
                  { m: 120, c: 250, l: '120m / 250🪙' },
                ].map(p => (
                  <button
                    key={p.l}
                    onClick={() => applyCustomSettings(p.m, p.c, p.c * 2)}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-zinc-300 whitespace-nowrap"
                  >
                    {p.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Huge Radial Timer */}
            <CircularProgress
              value={
                focusType === 'stopwatch'
                  ? 100
                  : Math.max(
                      0,
                      Math.min(
                        100,
                        totalTimerSeconds > 0
                          ? ((typeof focusSeconds === 'number' && !isNaN(focusSeconds) ? focusSeconds : 0) /
                              totalTimerSeconds) *
                            100
                          : 100
                      )
                    )
              }
              size={210}
              strokeWidth={14}
              gradientColors={['#F59E0B', '#EAB308']}
              showGlow={focusRunning}
            >
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold font-mono tracking-tight text-zinc-100">
                  {formatTime(focusSeconds)}
                </span>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest mt-1">
                  {focusType === 'custom' ? `${customDurationMinutes}m Custom` : focusType}
                </span>
              </div>
            </CircularProgress>

            {/* Task label */}
            <input
              type="text"
              value={focusSessionTask}
              onChange={e => setFocusSessionTask(e.target.value)}
              placeholder="What are you focusing on?"
              className={`w-full max-w-sm px-4 py-2 rounded-xl border text-xs font-semibold text-center focus:outline-none focus:border-amber-400 ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-black/50 border-white/10'
              }`}
            />

            {/* Timer Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFocusRunning(!focusRunning)}
                className={`w-16 h-16 rounded-3xl flex items-center justify-center font-bold shadow-xl transition-all ${
                  focusRunning
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-black shadow-amber-500/30 hover:scale-105'
                }`}
              >
                {focusRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-1" />}
              </button>

              <button
                onClick={() => {
                  setFocusRunning(false);
                  setFocusSeconds(focusType === 'stopwatch' ? 0 : customDurationMinutes * 60);
                }}
                className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Focus Statistics */}
            <div className="grid grid-cols-3 gap-3 w-full pt-2">
              <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] text-center">
                <span className="text-[10px] text-zinc-400 block">Daily Focus</span>
                <span className="text-base font-extrabold font-mono text-amber-300">
                  {(focusTotalMinutesToday / 60).toFixed(1)}h
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] text-center">
                <span className="text-[10px] text-zinc-400 block">Session Bounty</span>
                <span className="text-base font-extrabold font-mono text-cyan-300">+{customCoinsReward}🪙</span>
              </div>

              <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] text-center">
                <span className="text-[10px] text-zinc-400 block">XP Reward</span>
                <span className="text-base font-extrabold font-mono text-emerald-300">+{customXpReward} XP</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Relapse Logger Modal */}
      <AnimatePresence>
        {relapseModalHabitId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-3xl bg-[#141214] border border-red-500/30 text-white space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Log Relapse</h3>
                  <p className="text-xs text-zinc-400">
                    Acknowledge the trigger. Your lifetime stats remain intact.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Primary Reason</label>
                <select
                  value={relapseReason}
                  onChange={e => setRelapseReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-medium text-white"
                >
                  <option value="Stress & fatigue">Stress & fatigue</option>
                  <option value="Late night boredom">Late night boredom</option>
                  <option value="Social pressure">Social pressure</option>
                  <option value="Procrastination trigger">Procrastination trigger</option>
                  <option value="Emotional spike">Emotional spike</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400 block mb-1">Reflection / Notes</label>
                <textarea
                  rows={2}
                  value={relapseNotes}
                  onChange={e => setRelapseNotes(e.target.value)}
                  placeholder="What will you adjust to prevent this next time?"
                  className="w-full p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setRelapseModalHabitId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    recordRelapse(relapseModalHabitId, relapseReason, relapseNotes);
                    setRelapseModalHabitId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
                >
                  Record & Bounce Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
