import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import {
  Sparkles,
  Target,
  Plus,
  Check,
  Shield,
  Zap,
  Flame,
  Crown,
  Heart,
  BookOpen,
  Dumbbell,
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  Clock,
  Coins,
  Award,
  ShieldAlert,
  Sliders,
  Palette,
  BarChart3,
  Calendar,
  Lock,
  Hourglass,
  HelpCircle,
  Trophy,
  CheckCircle2,
} from 'lucide-react';
import { sound } from '../../utils/soundAndHaptics';
import { triggerConfetti } from '../../utils/confetti';
import { DifficultyMode } from '../../types';
import { DIFFICULTY_CONFIGS } from '../../utils/defaultData';

interface InteractiveGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveGuideModal: React.FC<InteractiveGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    settings,
    updateSettings,
    updateVitals,
    addHabit,
    addBadHabit,
    addCustomReward,
  } = useLifeOS();

  // Total steps: 1 to 14
  // 1-6: Conceptual Guide (Welcome, Home, Plan, Economy, Progress, Profile)
  // 7: Interactive Spotlight Tour Overview
  // 8-13: Setup Wizard (Theme, Difficulty, Habit, Bad Habit, Reward, Daily Mission)
  // 14: Final Celebration
  const [currentStep, setCurrentStep] = useState<number>(1);
  const TOTAL_STEPS = 14;

  // Wizard state
  const [chosenTheme, setChosenTheme] = useState<'black' | 'white'>(settings.theme || 'black');
  const [chosenDifficulty, setChosenDifficulty] = useState<DifficultyMode>(settings.difficulty || 'normal');
  const [userName, setUserName] = useState(settings.userName || 'Commander');
  const [firstHabitTitle, setFirstHabitTitle] = useState('Morning Sunlight & 500ml Hydration');
  const [firstHabitCategory, setFirstHabitCategory] = useState<'Health' | 'Fitness' | 'Study' | 'Focus' | 'Mindset'>('Health');
  const [firstBadHabitTitle, setFirstBadHabitTitle] = useState('Mindless Short-Form Scrolling');
  const [badHabitTargetDays, setBadHabitTargetDays] = useState(21);
  const [firstRewardTitle, setFirstRewardTitle] = useState('Guilt-Free 90-Min Gaming Session');
  const [firstRewardCost, setFirstRewardCost] = useState(120);
  const [firstRewardCategory, setFirstRewardCategory] = useState('Entertainment');
  const [todayMission, setTodayMission] = useState('Execute all planned blocks with zero relapses & 100% focus');

  if (!isOpen) return null;

  const handleSkip = () => {
    sound.tap();
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_has_completed_onboarding', 'true');
    }
    onClose();
  };

  const handleNext = () => {
    sound.tap();
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishSetup();
    }
  };

  const handleBack = () => {
    sound.tap();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const finishSetup = () => {
    sound.levelUp();
    triggerConfetti();

    // 1. Update settings
    updateSettings({
      theme: chosenTheme,
      difficulty: chosenDifficulty,
      userName: userName.trim() || 'Commander',
    });

    // 2. Set today's mission in vitals
    updateVitals({
      morningMission: todayMission.trim() || 'Execute with relentless discipline.',
    });

    // 3. Add first habit
    if (firstHabitTitle.trim()) {
      addHabit({
        title: firstHabitTitle.trim(),
        description: 'First keystone habit established during LifeOS setup',
        category: firstHabitCategory,
        frequency: 'daily',
        timeSlot: 'morning',
        coinReward: 20,
        xpReward: 35,
        targetDurationMinutes: 15,
        priority: 'high',
        icon: firstHabitCategory === 'Fitness' ? 'Dumbbell' : firstHabitCategory === 'Study' ? 'BookOpen' : 'Sparkles',
        archived: false,
      });
    }

    // 4. Add first bad habit
    if (firstBadHabitTitle.trim()) {
      addBadHabit({
        name: firstBadHabitTitle.trim(),
        triggerTriggers: ['Boredom', 'Late Night', 'Low Energy'],
        relapsePenaltyCoins: 50,
        challengeDaysTarget: badHabitTargetDays,
        icon: 'Flame',
      });
    }

    // 5. Add first reward
    if (firstRewardTitle.trim()) {
      addCustomReward({
        name: firstRewardTitle.trim(),
        coinCost: firstRewardCost,
        category: firstRewardCategory,
        icon: 'Sparkles',
        description: 'First custom reward created during setup',
      });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('lifeos_has_completed_onboarding', 'true');
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl z-10 my-auto"
        >
          <GlassCard variant="gold" className="p-5 sm:p-7 space-y-5 border-amber-500/40 shadow-2xl shadow-amber-500/10">
            {/* Top Navigation & Step Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold">
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  {currentStep <= 6 ? 'Interactive Guide' : currentStep === 7 ? 'Feature Spotlight' : currentStep <= 13 ? 'Setup Wizard' : 'Activation'}
                </span>
              </div>

              <button
                onClick={handleSkip}
                className="text-xs font-mono font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white/5"
              >
                <span>Skip Guide</span>
                <X size={14} />
              </button>
            </div>

            {/* Smooth Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
                animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* STEP CONTENTS */}
            <div className="min-h-[290px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {/* 1. WELCOME */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 text-center"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30">
                      <Crown size={32} className="fill-black" />
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Welcome to LifeOS
                      </h2>
                      <p className="text-xs sm:text-sm text-amber-300 font-semibold">
                        Your Personal Operating System for Sovereign Discipline
                      </p>
                    </div>
                    <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                      LifeOS is engineered to replace chaos with precision. It fuses schedule planning, habit momentum, a 21-Day Bad Habit Destroyer, a gamified coin economy with high-yield Golden Vaults, and emergency recovery into one distraction-free interface.
                    </p>
                  </motion.div>
                )}

                {/* 2. HOME COMMAND */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Target size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Home • Daily Command Center</h3>
                        <p className="text-xs text-zinc-400">Everything you need to master today in one glance</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <BarChart3 size={13} /> Day Score (0-100)
                        </span>
                        <p className="text-[11px] text-zinc-400">Real-time composite score grading your habits, schedule, hydration, and sleep.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Crown size={13} /> Prime Mission
                        </span>
                        <p className="text-[11px] text-zinc-400">Your top daily imperative. Never lose track of your #1 goal.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <Clock size={13} /> Focus Timer
                        </span>
                        <p className="text-[11px] text-zinc-400">Pomodoro and deep-work stopwatch with binaural sounds and coin rewards.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-amber-300 font-bold flex items-center gap-1">
                          <ShieldAlert size={13} /> Recovery Mission
                        </span>
                        <p className="text-[11px] text-zinc-400">No guilt on rough days — instant comeback protocols to rebuild momentum.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. PLAN & EXECUTION */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Plan • Execution & Habits</h3>
                        <p className="text-xs text-zinc-400">Time-block your day and eliminate bad habits</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} /> Schedule Planner
                        </span>
                        <p className="text-[11px] text-zinc-400">Structure your day into morning, afternoon, and evening blocks.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <Flame size={13} /> Bad Habit Destroyer
                        </span>
                        <p className="text-[11px] text-zinc-400">21-Day challenge system with relapse journaling and clean streak tracking.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <Sparkles size={13} /> Keystone Habits
                        </span>
                        <p className="text-[11px] text-zinc-400">Earn coins & XP for every completed habit with customizable rewards.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <BarChart3 size={13} /> 7-Day Consistency Matrix
                        </span>
                        <p className="text-[11px] text-zinc-400">Visual week-at-a-glance habit completion grid.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 4. ECONOMY & GOLDEN VAULTS */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                        <Coins size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Economy • Coins & Golden Vaults</h3>
                        <p className="text-xs text-zinc-400">Earn from discipline, invest in vaults, spend on real rewards</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                      💡 <span className="font-bold">Real-Life Example:</span> Complete 4 habits and 3 focus sessions to earn 150 Coins. Buy a 2-hour gaming pass or deposit 500 Coins into a 14-Day Golden Vault to earn bonus returns!
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-amber-300 font-bold">Reward Shop</span>
                        <p className="text-[11px] text-zinc-400">Purchase custom guilt-free leisure rewards with earned coins.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-amber-300 font-bold">Golden Token Vault</span>
                        <p className="text-[11px] text-zinc-400">Lock coins for 7 to 30 days to multiply returns & discipline.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 5. PROGRESS & TROPHY VAULT */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Trophy size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Progress • Discipline Analytics</h3>
                        <p className="text-xs text-zinc-400">Track long-term momentum across days, weeks, and months</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-cyan-300 font-bold">Long-Term Analytics</span>
                        <p className="text-[11px] text-zinc-400">Filter Day Score trends by Daily, Weekly, Monthly, and Yearly.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-cyan-300 font-bold">Customizable Trophy Vault</span>
                        <p className="text-[11px] text-zinc-400">Unlock Bronze, Silver, Gold, and Diamond achievement tiers.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-cyan-300 font-bold">Discipline Matrix</span>
                        <p className="text-[11px] text-zinc-400">Live streak counter, recovery velocity, and clean habit shield.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-cyan-300 font-bold">Weekly Performance Report</span>
                        <p className="text-[11px] text-zinc-400">Comprehensive recap of execution rate and high-momentum days.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 6. PROFILE & SETTINGS */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <Sliders size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Profile • Sovereign Control</h3>
                        <p className="text-xs text-zinc-400">Tailor LifeOS to your exact standards</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-purple-300 font-bold">5 Difficulty Modes</span>
                        <p className="text-[11px] text-zinc-400">Easy to Hardcore with custom multipliers and penalties.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-purple-300 font-bold">World Clock Sync</span>
                        <p className="text-[11px] text-zinc-400">Live mobile clock sync with manual time override options.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-purple-300 font-bold">Data Backups</span>
                        <p className="text-[11px] text-zinc-400">Zero telemetry. Export and restore full JSON backups anytime.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <span className="text-purple-300 font-bold">Emergency Rescue</span>
                        <p className="text-[11px] text-zinc-400">One-tap loop breaker for instant urges and focus recovery.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 7. SPOTLIGHT TOUR OVERVIEW */}
                {currentStep === 7 && (
                  <motion.div
                    key="step-7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center mx-auto shadow-lg">
                      <Sparkles size={28} className="fill-black" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Interactive Feature Highlights</h3>
                      <p className="text-xs text-amber-300">Quickly identify the core interactive controls:</p>
                    </div>
                    <div className="space-y-2 text-left text-xs max-w-md mx-auto">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Plus size={14} />
                        </div>
                        <div>
                          <span className="font-bold text-white block">Quick Command (+)</span>
                          <span className="text-[11px] text-zinc-400">In the header bar — add habits, tasks, expenses, and logs in under 2 taps.</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Coins size={14} />
                        </div>
                        <div>
                          <span className="font-bold text-white block">Coin Pill & Vaults</span>
                          <span className="text-[11px] text-zinc-400">Always visible in the header — tap to view your wallet and active Golden Tokens.</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-amber-500/30 flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldAlert size={14} />
                        </div>
                        <div>
                          <span className="font-bold text-white block">Emergency Loop Breaker</span>
                          <span className="text-[11px] text-zinc-400">Use whenever you feel stuck in a dopamine trap or procrastination loop.</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 8. WIZARD: THEME */}
                {currentStep === 8 && (
                  <motion.div
                    key="step-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">Setup Wizard • Step 1/6</span>
                      <h3 className="text-base font-bold text-white">Choose Your Visual Canvas</h3>
                      <p className="text-xs text-zinc-400">Select your preferred lighting style</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div
                        onClick={() => {
                          setChosenTheme('black');
                          sound.tap();
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer text-center space-y-2 transition-all ${
                          chosenTheme === 'black'
                            ? 'bg-zinc-900 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500'
                            : 'bg-zinc-950 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-black border border-white/20 mx-auto flex items-center justify-center text-amber-400">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">OLED Dark</span>
                          <span className="text-[10px] text-zinc-400">Tactical high-contrast black</span>
                        </div>
                      </div>

                      <div
                        onClick={() => {
                          setChosenTheme('white');
                          sound.tap();
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer text-center space-y-2 transition-all ${
                          chosenTheme === 'white'
                            ? 'bg-slate-100 border-amber-500 shadow-lg shadow-amber-500/20 ring-1 ring-amber-500'
                            : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 mx-auto flex items-center justify-center text-amber-600">
                          <Palette size={18} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-zinc-200 block">Porcelain Light</span>
                          <span className="text-[10px] text-zinc-400">Clean minimalist daylight</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 9. WIZARD: DIFFICULTY */}
                {currentStep === 9 && (
                  <motion.div
                    key="step-9"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">Setup Wizard • Step 2/6</span>
                      <h3 className="text-base font-bold text-white">Select Operating Difficulty</h3>
                      <p className="text-xs text-zinc-400">Adjusts rewards and discipline strictness</p>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyMode[]).map(mode => {
                        const conf = DIFFICULTY_CONFIGS[mode];
                        const isSelected = chosenDifficulty === mode;
                        return (
                          <div
                            key={mode}
                            onClick={() => {
                              setChosenDifficulty(mode);
                              sound.tap();
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 shadow-sm'
                                : 'bg-black/30 border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]' : 'bg-zinc-700'}`} />
                              <div>
                                <span className="text-xs font-bold text-white capitalize">{conf.title}</span>
                                <span className="text-[10px] text-zinc-400 block">{conf.description}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                              {conf.coinMultiplier}x Coins
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* 10. WIZARD: FIRST HABIT */}
                {currentStep === 10 && (
                  <motion.div
                    key="step-10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">Setup Wizard • Step 3/6</span>
                      <h3 className="text-base font-bold text-white">Create Your First Keystone Habit</h3>
                      <p className="text-xs text-zinc-400">Anchor your daily consistency starting on Day 1</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-amber-300">Habit Name</label>
                        <input
                          type="text"
                          value={firstHabitTitle}
                          onChange={e => setFirstHabitTitle(e.target.value)}
                          placeholder="e.g. Morning Sunlight, 50 Pushups, Read 15 mins"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-300">Category</label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(['Health', 'Fitness', 'Study', 'Focus', 'Mindset'] as const).map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFirstHabitCategory(cat)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                firstHabitCategory === cat
                                  ? 'bg-amber-500 text-black border-amber-400'
                                  : 'bg-zinc-800 text-zinc-400 border-white/5 hover:text-white'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 11. WIZARD: FIRST BAD HABIT CHALLENGE */}
                {currentStep === 11 && (
                  <motion.div
                    key="step-11"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">Setup Wizard • Step 4/6</span>
                      <h3 className="text-base font-bold text-white">Create First Bad Habit Challenge</h3>
                      <p className="text-xs text-zinc-400">Launch a 21-Day Clean Streak challenge</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-rose-500/30 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-rose-300">Habit to Destroy</label>
                        <input
                          type="text"
                          value={firstBadHabitTitle}
                          onChange={e => setFirstBadHabitTitle(e.target.value)}
                          placeholder="e.g. Late Night Screen, Junk Food, Reels Scrolling"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:border-rose-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-300">Challenge Target Days</label>
                        <div className="flex items-center gap-2">
                          {[7, 14, 21, 30].map(days => (
                            <button
                              key={days}
                              type="button"
                              onClick={() => setBadHabitTargetDays(days)}
                              className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                                badHabitTargetDays === days
                                  ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                                  : 'bg-zinc-800 text-zinc-400 border-white/5'
                              }`}
                            >
                              {days} Days
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 12. WIZARD: FIRST REWARD */}
                {currentStep === 12 && (
                  <motion.div
                    key="step-12"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">Setup Wizard • Step 5/6</span>
                      <h3 className="text-base font-bold text-white">Create Your First Custom Reward</h3>
                      <p className="text-xs text-zinc-400">Give yourself a guilt-free prize to work towards</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/30 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-amber-300">Reward Title</label>
                        <input
                          type="text"
                          value={firstRewardTitle}
                          onChange={e => setFirstRewardTitle(e.target.value)}
                          placeholder="e.g. 2-Hour PS5 Gaming, Double Burger, Cheat Meal"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300">Coin Cost</label>
                          <input
                            type="number"
                            min="20"
                            step="10"
                            value={firstRewardCost}
                            onChange={e => setFirstRewardCost(Math.max(10, parseInt(e.target.value) || 50))}
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-amber-300 font-mono text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-zinc-300">Category</label>
                          <input
                            type="text"
                            value={firstRewardCategory}
                            onChange={e => setFirstRewardCategory(e.target.value)}
                            placeholder="Entertainment"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 13. WIZARD: TODAY'S MISSION & USERNAME */}
                {currentStep === 13 && (
                  <motion.div
                    key="step-13"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">Setup Wizard • Step 6/6</span>
                      <h3 className="text-base font-bold text-white">Name & Prime Daily Mission</h3>
                      <p className="text-xs text-zinc-400">Establish your callsign and top priority today</p>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <Crown size={13} /> Your Callsign / Name
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={e => setUserName(e.target.value)}
                          placeholder="e.g. Commander, David, Alex"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <Target size={13} /> Today's Prime Mission
                        </label>
                        <textarea
                          rows={2}
                          value={todayMission}
                          onChange={e => setTodayMission(e.target.value)}
                          placeholder="e.g. Complete 4 focus sessions and stay 100% clean"
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 14. CELEBRATION */}
                {currentStep === 14 && (
                  <motion.div
                    key="step-14"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4 text-center py-2"
                  >
                    <div className="text-4xl animate-bounce">🎉</div>
                    <div className="space-y-1.5">
                      <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                        Congratulations!
                      </h2>
                      <p className="text-sm font-bold text-white">
                        Your LifeOS is now ready.
                      </p>
                    </div>
                    <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
                      Your identity, keystone habits, reward shop, and discipline matrix have been initialized. Good luck on your journey to total self-mastery.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center gap-2"
              >
                <span>{currentStep === TOTAL_STEPS ? 'Enter LifeOS Command' : currentStep === 6 ? 'Start Feature Spotlight' : currentStep === 7 ? 'Start Setup Wizard' : 'Next'}</span>
                <ArrowRight size={14} className="stroke-[2.5]" />
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
