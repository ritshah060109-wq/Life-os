import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import {
  X,
  ShieldAlert,
  Sparkles,
  Zap,
  RotateCcw,
  Check,
  Timer,
  Wind,
  Droplets,
  BookOpen,
  Footprints,
  Coffee,
  HeartHandshake,
  BarChart2,
  Smile,
  AlertCircle,
  Play,
  Pause,
  Award,
} from 'lucide-react';
import { LoopTriggerReason } from '../../types';
import { sound } from '../../utils/soundAndHaptics';
import { triggerBurstConfetti } from '../../utils/confetti';

interface EmergencyRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MICRO_ACTIONS = [
  {
    id: 'act-water',
    title: 'Drink One Full Glass of Cold Water',
    description: 'Dehydration reduces cognitive control by 20%. Hydrate right now.',
    icon: Droplets,
    durationText: '30 seconds',
    color: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/30',
  },
  {
    id: 'act-stand',
    title: 'Stand Up and Stretch Your Spine',
    description: 'Break the physical posture of procrastination. Roll your shoulders back.',
    icon: Footprints,
    durationText: '45 seconds',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
  },
  {
    id: 'act-breathe',
    title: 'Take 10 Slow Diaphragmatic Breaths',
    description: 'Inhale deep into your belly for 4s, exhale for 6s. Calm the dopamine frenzy.',
    icon: Wind,
    durationText: '1 minute',
    color: 'from-purple-500/20 to-indigo-500/10',
    border: 'border-purple-500/30',
  },
  {
    id: 'act-desk',
    title: 'Clean 3 Objects Off Your Desk',
    description: 'A cluttered surface induces cognitive micro-fatigue. Clear your visual field.',
    icon: Sparkles,
    durationText: '2 minutes',
    color: 'from-amber-500/20 to-yellow-500/10',
    border: 'border-amber-500/30',
  },
  {
    id: 'act-study5',
    title: 'Work on One Easy Task for Just 5 Minutes',
    description: 'Promise yourself you can stop after 5 minutes. Inertia is the only enemy.',
    icon: Timer,
    durationText: '5 minutes',
    color: 'from-rose-500/20 to-red-500/10',
    border: 'border-rose-500/30',
  },
  {
    id: 'act-read',
    title: 'Read Exactly 1 Page of a Good Book',
    description: 'Shift your brain from passive short-form consumption back to linear comprehension.',
    icon: BookOpen,
    durationText: '2 minutes',
    color: 'from-yellow-500/20 to-amber-500/10',
    border: 'border-yellow-500/30',
  },
  {
    id: 'act-walk',
    title: 'Walk in Place or Step Outside for 2 Minutes',
    description: 'Natural light and biomechanical movement immediately reset circadian alertness.',
    icon: Footprints,
    durationText: '2 minutes',
    color: 'from-emerald-500/20 to-green-500/10',
    border: 'border-emerald-500/30',
  },
];

const TRIGGER_OPTIONS: LoopTriggerReason[] = [
  'Phone',
  'YouTube',
  'Instagram',
  'Gaming',
  'Low Energy',
  'Poor Sleep',
  'Overthinking',
  'Stress',
  'Friends',
  'No Motivation',
  'Forgot',
  'Other',
];

const MOTIVATION_QUOTES = [
  { quote: 'You do not have to be great to start, but you must start to be great.', author: 'Marcus Aurelius' },
  { quote: 'Momentum is created in the first 60 seconds of action.', author: 'LifeOS Protocol' },
  { quote: 'Do not negotiate with your tired mind. Execute one micro-step.', author: 'Sovereign Principle' },
  { quote: 'Forgive the last hour. Win the next five minutes.', author: 'Discipline Master' },
];

export const EmergencyRecoveryModal: React.FC<EmergencyRecoveryModalProps> = ({ isOpen, onClose }) => {
  const { adjustWater, recordLoopIncident, loopIncidents, recoveryStats } = useLifeOS();

  const [activeTab, setActiveTab] = useState<'single_action' | 'rescue_timer' | 'toolkit' | 'insights'>('single_action');
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [selectedTrigger, setSelectedTrigger] = useState<LoopTriggerReason>('Phone');
  const [loopNotes, setLoopNotes] = useState('');
  const [brainDump, setBrainDump] = useState('');
  const [journalOneSentence, setJournalOneSentence] = useState('');
  const [actionDone, setActionDone] = useState(false);

  // 5-Min Rescue Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(300); // 5 minutes
  const [timerFinished, setTimerFinished] = useState(false);

  // Box Breathing State
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathingCount, setBreathingCount] = useState(4);
  const [breathingActive, setBreathingActive] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && timerRunning) {
      setTimerRunning(false);
      setTimerFinished(true);
      sound.levelUp();
      triggerBurstConfetti();
      recordLoopIncident({
        triggerReason: selectedTrigger,
        notes: loopNotes || 'Completed 5-minute rescue timer',
        microActionChosen: '5-Minute Rescue Timer Focus Session',
        completedRescueTimer: true,
        rescueDurationSeconds: 300,
      });
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSecondsLeft, selectedTrigger, loopNotes, recordLoopIncident]);

  // Box Breathing loop
  useEffect(() => {
    let breathTimer: any = null;
    if (breathingActive) {
      breathTimer = setInterval(() => {
        setBreathingCount(prev => {
          if (prev <= 1) {
            setBreathingPhase(curr => {
              if (curr === 'Inhale') return 'Hold';
              if (curr === 'Hold') return 'Exhale';
              if (curr === 'Exhale') return 'Rest';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(breathTimer);
  }, [breathingActive]);

  if (!isOpen) return null;

  const currentAction = MICRO_ACTIONS[currentActionIndex];

  const handleNextAction = () => {
    sound.tap();
    setCurrentActionIndex(prev => (prev + 1) % MICRO_ACTIONS.length);
    setActionDone(false);
  };

  const handleCompleteAction = () => {
    sound.completeHabit();
    triggerBurstConfetti();
    setActionDone(true);

    if (currentAction.id === 'act-water') {
      adjustWater(1);
    }

    recordLoopIncident({
      triggerReason: selectedTrigger,
      notes: loopNotes || `Executed micro-action: ${currentAction.title}`,
      microActionChosen: currentAction.title,
      completedRescueTimer: false,
      rescueDurationSeconds: 60,
    });
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${String(remainder).padStart(2, '0')}`;
  };

  const quote = MOTIVATION_QUOTES[currentActionIndex % MOTIVATION_QUOTES.length];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl max-h-[92vh] overflow-hidden"
        >
          <GlassCard
            variant="gold"
            className="p-4 sm:p-5 max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl border-rose-500/40"
          >
            {/* Header / Calm Intervention */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    Life Loop Breaker & Emergency Recovery
                  </h3>
                  <p className="text-[11px] text-zinc-300 font-medium">
                    ⚠️ You seem stuck. Let’s fix this together without guilt.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Pills */}
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-black/50 border border-white/[0.06] text-xs">
              <button
                onClick={() => setActiveTab('single_action')}
                className={`py-1.5 px-2 rounded-xl font-bold transition-all text-center ${
                  activeTab === 'single_action'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                1. Micro Action
              </button>
              <button
                onClick={() => setActiveTab('rescue_timer')}
                className={`py-1.5 px-2 rounded-xl font-bold transition-all text-center ${
                  activeTab === 'rescue_timer'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                2. 5-Min Timer
              </button>
              <button
                onClick={() => setActiveTab('toolkit')}
                className={`py-1.5 px-2 rounded-xl font-bold transition-all text-center ${
                  activeTab === 'toolkit'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                3. Toolkit
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`py-1.5 px-2 rounded-xl font-bold transition-all text-center ${
                  activeTab === 'insights'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                4. Insights
              </button>
            </div>

            {/* ────────────────────────────────────────────────
                TAB 1: SINGLE MICRO ACTION (Never overwhelming)
               ──────────────────────────────────────────────── */}
            {activeTab === 'single_action' && (
              <div className="space-y-4">
                {/* Intervention Message */}
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-zinc-300">
                    <strong className="text-white block font-semibold mb-0.5">Zero Judgment Protocol</strong>
                    Do not try to fix your whole week right now. Your only objective is to execute
                    <strong> one tiny physical micro-action</strong> to break mental inertia.
                  </div>
                </div>

                {/* Display ONE Micro Action */}
                <motion.div
                  key={currentAction.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-5 rounded-3xl bg-gradient-to-b ${currentAction.color} border ${currentAction.border} space-y-4 text-center relative overflow-hidden shadow-xl`}
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 shadow-inner">
                    <currentAction.icon size={28} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                      Estimated Time: {currentAction.durationText}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                      {currentAction.title}
                    </h2>
                    <p className="text-xs text-zinc-300 max-w-md mx-auto">
                      {currentAction.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={handleCompleteAction}
                      disabled={actionDone}
                      className={`w-full sm:w-auto py-3 px-6 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                        actionDone
                          ? 'bg-emerald-500 text-black border border-emerald-400'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-500/30 hover:brightness-110 active:scale-95'
                      }`}
                    >
                      <Check size={16} className="stroke-[3]" />
                      {actionDone ? 'Momentum Reclaimed! (+40 XP)' : 'I Did This Tiny Action!'}
                    </button>

                    <button
                      onClick={handleNextAction}
                      className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/5"
                    >
                      <RotateCcw size={14} />
                      Give Me Another Tiny Step
                    </button>
                  </div>
                </motion.div>

                {/* Root Cause Quick Tagging */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                  <span className="text-[11px] font-bold text-zinc-300 block">
                    What triggered this loop? (Quick 1-tap analysis)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {TRIGGER_OPTIONS.map(trigger => (
                      <button
                        key={trigger}
                        onClick={() => setSelectedTrigger(trigger)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all border ${
                          selectedTrigger === trigger
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-sm'
                            : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                        }`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stoic Quote */}
                <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.04] text-center space-y-0.5">
                  <p className="text-xs italic text-zinc-300">"{quote.quote}"</p>
                  <span className="text-[10px] text-zinc-500 font-mono">— {quote.author}</span>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────
                TAB 2: 5-MINUTE RESCUE TIMER
               ──────────────────────────────────────────────── */}
            {activeTab === 'rescue_timer' && (
              <div className="space-y-4 text-center">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-300">
                  <strong className="text-amber-300 block mb-0.5">5-Minute Distraction-Free Rescue Countdown</strong>
                  Commit to working on your highest-leverage task for only 300 seconds. No phone. No tabs.
                </div>

                {/* Countdown Dial */}
                <div className="py-6 flex flex-col items-center justify-center relative">
                  <motion.div
                    animate={timerRunning ? { scale: [1, 1.03, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="w-48 h-48 rounded-full border-4 border-amber-500/30 flex flex-col items-center justify-center bg-black/60 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative"
                  >
                    <span className="text-4xl font-black text-white font-mono tracking-tight">
                      {formatTimer(timerSecondsLeft)}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-400 mt-1">
                      {timerRunning ? 'Rescue Mode Active' : timerFinished ? 'Session Complete' : '5-Min Rescue'}
                    </span>
                  </motion.div>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="py-3 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 flex items-center gap-2"
                  >
                    {timerRunning ? <Pause size={16} /> : <Play size={16} />}
                    {timerRunning ? 'Pause Timer' : 'Start 5-Min Rescue'}
                  </button>

                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSecondsLeft(300);
                      setTimerFinished(false);
                    }}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/5"
                    title="Reset timer"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                {timerFinished && (
                  <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce">
                    🎉 5-Minute Rescue Completed! +80 XP & +50 Recovery Coins Earned!
                  </div>
                )}
              </div>
            )}

            {/* ────────────────────────────────────────────────
                TAB 3: EMERGENCY TOOLKIT
               ──────────────────────────────────────────────── */}
            {activeTab === 'toolkit' && (
              <div className="space-y-4">
                {/* 1. Box Breathing Guide */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-xs font-bold text-zinc-100">Box Breathing (4-4-4-4 Protocol)</h4>
                    </div>
                    <button
                      onClick={() => setBreathingActive(!breathingActive)}
                      className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold"
                    >
                      {breathingActive ? 'Stop' : 'Start Breathing'}
                    </button>
                  </div>

                  {breathingActive ? (
                    <div className="py-4 text-center space-y-2">
                      <motion.div
                        animate={{
                          scale: breathingPhase === 'Inhale' ? 1.25 : breathingPhase === 'Exhale' ? 0.85 : 1.1,
                        }}
                        transition={{ duration: 3.8, ease: 'easeInOut' }}
                        className="w-24 h-24 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400 flex flex-col items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                      >
                        <span className="text-xs font-extrabold uppercase">{breathingPhase}</span>
                        <span className="text-xl font-mono font-black">{breathingCount}</span>
                      </motion.div>
                      <p className="text-[11px] text-zinc-400">Follow the circle cadence to lower cortisol.</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-400">
                      Navy SEAL technique: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Resets the nervous system.
                    </p>
                  )}
                </div>

                {/* 2. Brain Dump Scratchpad */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                  <label className="text-xs font-bold text-zinc-200 block">
                    🧠 Distraction & Brain Dump Scratchpad
                  </label>
                  <textarea
                    rows={2}
                    value={brainDump}
                    onChange={e => setBrainDump(e.target.value)}
                    placeholder="Write down all chaotic thoughts, open tabs, or worries here to unload working memory..."
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/[0.08] text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* 3. 1-Sentence Emergency Unblock Journal */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                  <label className="text-xs font-bold text-zinc-200 block">
                    ✍️ 1-Sentence Emergency Reflection
                  </label>
                  <input
                    type="text"
                    value={journalOneSentence}
                    onChange={e => setJournalOneSentence(e.target.value)}
                    placeholder="The ONE thing that will make today a victory is..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.08] text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────
                TAB 4: LOOP INSIGHTS & ANALYTICS
               ──────────────────────────────────────────────── */}
            {activeTab === 'insights' && (
              <div className="space-y-4">
                {/* Recovery Velocity Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] text-center">
                    <span className="text-[10px] text-zinc-400 block">Recovery Streak</span>
                    <span className="text-lg font-black text-amber-400 font-mono">
                      {recoveryStats.currentRecoveryStreak} Days
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] text-center">
                    <span className="text-[10px] text-zinc-400 block">Fastest Recovery</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {recoveryStats.fastestRecoveryDays} Day
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] text-center">
                    <span className="text-[10px] text-zinc-400 block">Avg Recovery Time</span>
                    <span className="text-lg font-black text-cyan-400 font-mono">
                      {recoveryStats.averageRecoveryDays} Days
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] text-center">
                    <span className="text-[10px] text-zinc-400 block">Success Rate</span>
                    <span className="text-lg font-black text-yellow-400 font-mono">
                      {recoveryStats.recoverySuccessRate}%
                    </span>
                  </div>
                </div>

                {/* Behavioral Intelligence Insights */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                    <BarChart2 size={13} className="text-amber-400" />
                    LifeOS Behavioral Intelligence & Trigger Diagnostics
                  </h4>

                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>You lose focus most often between <strong>8:00 PM and 10:30 PM</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>You recover fastest (avg 1.0 day) after completing <strong>one small task</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>Your biggest recurring trigger is <strong>YouTube & Phone doomscrolling</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Most productive day of the week: <strong>Tuesday (Score: 94.2)</strong>.</span>
                    </li>
                  </ul>
                </div>

                {/* Recent Loop Incidents */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-300 block">Recent Loop Interruptions</span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                    {loopIncidents.map(inc => (
                      <div
                        key={inc.id}
                        className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-200">{inc.triggerReason}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {inc.date} {inc.time}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 block">{inc.microActionChosen}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 font-mono">
                          Recovered in {inc.recoveryDaysTaken || 1}d
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono">LifeOS Protocol v2.0</span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-bold transition-colors"
              >
                Close Emergency Hub
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
