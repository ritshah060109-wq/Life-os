import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { X, Check, Sparkles, Clock, Target, ShieldAlert, Gift, Plus, Droplets, Smile, BookOpen } from 'lucide-react';
import { HabitDifficulty, TimeSlot, TaskPriority } from '../../types';

export const QuickAddModal: React.FC = () => {
  const {
    quickAddOpen,
    setQuickAddOpen,
    quickAddTab,
    addHabit,
    addScheduleTask,
    addBadHabit,
    addCustomReward,
    updateVitals,
    adjustWater,
    vitals,
    settings,
  } = useLifeOS();

  const isLight = settings.theme === 'white';
  const [activeType, setActiveType] = useState<'task' | 'habit' | 'bad_habit' | 'vitals' | 'reward'>(
    quickAddTab || 'task'
  );

  useEffect(() => {
    if (quickAddOpen && quickAddTab) {
      setActiveType(quickAddTab);
    }
  }, [quickAddOpen, quickAddTab]);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSlot, setTaskSlot] = useState<TimeSlot>('morning');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskCategory, setTaskCategory] = useState<'deep_work' | 'health' | 'learning' | 'personal' | 'routine' | 'recovery'>('deep_work');
  const [taskStartTime, setTaskStartTime] = useState('09:00');
  const [taskDuration, setTaskDuration] = useState(60);

  // Habit Form State
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Productivity');
  const [habitIcon, setHabitIcon] = useState('Zap');
  const [habitColor, setHabitColor] = useState('#F59E0B');
  const [habitDifficulty, setHabitDifficulty] = useState<HabitDifficulty>('medium');
  const [habitCoinReward, setHabitCoinReward] = useState(30);
  const [habitXpReward, setHabitXpReward] = useState(60);
  const [habitNotes, setHabitNotes] = useState('');

  // Bad Habit Form State
  const [badHabitName, setBadHabitName] = useState('');
  const [badHabitReason, setBadHabitReason] = useState('');
  const [badHabitIcon, setBadHabitIcon] = useState('SmartphoneOff');

  // Reward Form State
  const [rewardName, setRewardName] = useState('');
  const [rewardCost, setRewardCost] = useState(150);
  const [rewardCategory, setRewardCategory] = useState<'Food' | 'Entertainment' | 'Shopping' | 'Learning' | 'Travel' | 'Luxury' | 'Custom'>('Entertainment');
  const [rewardDescription, setRewardDescription] = useState('');

  // Vitals State
  const [moodVal, setMoodVal] = useState(vitals.mood);
  const [energyVal, setEnergyVal] = useState(vitals.energyLevel);
  const [sleepHrs, setSleepHrs] = useState(vitals.sleepHours);
  const [journalNote, setJournalNote] = useState(vitals.journalText);

  if (!quickAddOpen) return null;

  const handleClose = () => {
    setQuickAddOpen(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addScheduleTask({
      title: taskTitle.trim(),
      timeSlot: taskSlot,
      category: taskCategory,
      priority: taskPriority,
      startTime: taskStartTime,
      durationMinutes: taskDuration,
      repeat: 'none',
    });
    setTaskTitle('');
    handleClose();
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    addHabit({
      name: habitName.trim(),
      category: habitCategory,
      icon: habitIcon,
      color: habitColor,
      frequency: 'daily',
      difficulty: habitDifficulty,
      coinReward: habitCoinReward,
      xpReward: habitXpReward,
      notes: habitNotes,
    });
    setHabitName('');
    handleClose();
  };

  const handleCreateBadHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badHabitName.trim()) return;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    addBadHabit({
      name: badHabitName.trim(),
      icon: badHabitIcon,
      color: '#EF4444',
      quitDate: dateStr,
      challengeDaysTarget: 21,
    });
    setBadHabitName('');
    handleClose();
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardName.trim()) return;
    addCustomReward({
      name: rewardName.trim(),
      description: rewardDescription,
      coinCost: rewardCost,
      category: rewardCategory,
      difficulty: 'medium',
      isAvailable: true,
      icon: 'Gift',
    });
    setRewardName('');
    handleClose();
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    updateVitals({
      mood: moodVal,
      energyLevel: energyVal,
      sleepHours: sleepHrs,
      journalText: journalNote,
    });
    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 border shadow-2xl max-h-[90vh] overflow-y-auto ${
            isLight
              ? 'bg-white text-slate-900 border-slate-200'
              : 'bg-[#111116] text-white border-white/10'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">Quick Command Input</h2>
            </div>
            <button
              onClick={handleClose}
              className={`p-2 rounded-full hover:bg-white/10 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Type Selector Tabs */}
          <div className="grid grid-cols-5 gap-1 my-4 p-1 rounded-xl bg-black/20 border border-white/[0.06]">
            {[
              { id: 'task', label: 'Task' },
              { id: 'habit', label: 'Habit' },
              { id: 'bad_habit', label: 'Break' },
              { id: 'reward', label: 'Reward' },
              { id: 'vitals', label: 'Vitals' },
            ].map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveType(t.id as any)}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeType === t.id
                    ? 'bg-amber-500 text-black shadow font-bold'
                    : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TASK FORM */}
          {activeType === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Architecture Blueprint"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:border-amber-400 ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900/90 border-zinc-700'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Timeline Slot</label>
                  <select
                    value={taskSlot}
                    onChange={e => setTaskSlot(e.target.value as TimeSlot)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                    }`}
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as TaskPriority)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                    }`}
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={taskStartTime}
                    onChange={e => setTaskStartTime(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    min={5}
                    max={360}
                    step={5}
                    value={taskDuration}
                    onChange={e => setTaskDuration(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm shadow-md hover:from-amber-400 hover:to-yellow-300 transition-all mt-2"
              >
                Add Schedule Task
              </button>
            </form>
          )}

          {/* HABIT FORM */}
          {activeType === 'habit' && (
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 Pages Non-Fiction"
                  value={habitName}
                  onChange={e => setHabitName(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:border-amber-400 ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900/90 border-zinc-700'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Category</label>
                  <input
                    type="text"
                    value={habitCategory}
                    onChange={e => setHabitCategory(e.target.value)}
                    placeholder="Productivity, Health..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Difficulty</label>
                  <select
                    value={habitDifficulty}
                    onChange={e => {
                      const diff = e.target.value as HabitDifficulty;
                      setHabitDifficulty(diff);
                      if (diff === 'easy') { setHabitCoinReward(20); setHabitXpReward(40); }
                      else if (diff === 'medium') { setHabitCoinReward(35); setHabitXpReward(70); }
                      else if (diff === 'hard') { setHabitCoinReward(60); setHabitXpReward(120); }
                      else if (diff === 'legendary') { setHabitCoinReward(100); setHabitXpReward(200); }
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                    }`}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Custom Coin Reward</label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={habitCoinReward}
                    onChange={e => setHabitCoinReward(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Custom XP Reward</label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={habitXpReward}
                    onChange={e => setHabitXpReward(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Notes / Cue / Routine</label>
                <input
                  type="text"
                  placeholder="e.g. Immediately after morning espresso"
                  value={habitNotes}
                  onChange={e => setHabitNotes(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm shadow-md hover:from-amber-400 hover:to-yellow-300 transition-all mt-2"
              >
                Create Habit (+ Rewards)
              </button>
            </form>
          )}

          {/* BAD HABIT DESTROYER FORM */}
          {activeType === 'bad_habit' && (
            <form onSubmit={handleCreateBadHabit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Bad Habit to Destroy</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mindless Social Media Scrolling"
                  value={badHabitName}
                  onChange={e => setBadHabitName(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:border-amber-400 ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900/90 border-zinc-700'
                  }`}
                />
              </div>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                <span className="font-bold">21-Day Destroy Challenge:</span> Track daily clean streaks, log reasons if relapses happen, and maintain lifetime resilience statistics without wiping previous victories.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
              >
                Initiate 21-Day Destroyer
              </button>
            </form>
          )}

          {/* REWARD FORM */}
          {activeType === 'reward' && (
            <form onSubmit={handleCreateReward} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Reward Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wagyu Burger, 2h Gaming, Weekend Trip"
                  value={rewardName}
                  onChange={e => setRewardName(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:border-amber-400 ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900/90 border-zinc-700'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Coin Cost</label>
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    step={10}
                    value={rewardCost}
                    onChange={e => setRewardCost(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                      isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Category</label>
                  <select
                    value={rewardCategory}
                    onChange={e => setRewardCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-medium ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                    }`}
                  >
                    <option value="Food">Food</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Learning">Learning</option>
                    <option value="Travel">Travel</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Description / Rules</label>
                <input
                  type="text"
                  placeholder="e.g. Only redeemable after completing deep work"
                  value={rewardDescription}
                  onChange={e => setRewardDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm shadow-md hover:from-amber-400 hover:to-yellow-300 transition-all mt-2"
              >
                Add to Reward Shop
              </button>
            </form>
          )}

          {/* VITALS & LOG FORM */}
          {activeType === 'vitals' && (
            <form onSubmit={handleSaveVitals} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Mood (1 to 5)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setMoodVal(v)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                          moodVal === v
                            ? 'bg-amber-500 text-black border-amber-400'
                            : isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      >
                        {v}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Energy (1 to 5)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setEnergyVal(v)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border ${
                          energyVal === v
                            ? 'bg-amber-500 text-black border-amber-400'
                            : isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      >
                        {v}⚡
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Sleep Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="16"
                  value={sleepHrs}
                  onChange={e => setSleepHrs(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Daily Reflection / Journal</label>
                <textarea
                  rows={3}
                  value={journalNote}
                  onChange={e => setJournalNote(e.target.value)}
                  placeholder="Record today's breakthroughs, lessons, or resistance..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-700'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm shadow-md hover:from-amber-400 hover:to-yellow-300 transition-all mt-2"
              >
                Update Vitals & Journal
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
