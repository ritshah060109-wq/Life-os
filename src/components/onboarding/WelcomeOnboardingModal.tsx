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
} from 'lucide-react';
import { sound } from '../../utils/soundAndHaptics';
import { triggerConfetti } from '../../utils/confetti';

interface WelcomeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { updateSettings, updateVitals, addHabit, settings } = useLifeOS();

  const [step, setStep] = useState<1 | 2>(1);
  const [userName, setUserName] = useState(settings.userName || 'Commander');
  const [morningMission, setMorningMission] = useState('Maintain relentless focus & build unbreakable discipline.');
  const [firstHabitTitle, setFirstHabitTitle] = useState('Morning Sunlight & Hydration');
  const [firstHabitCategory, setFirstHabitCategory] = useState<'Health' | 'Focus' | 'Mindset' | 'Fitness' | 'Study'>('Health');

  if (!isOpen) return null;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    sound.levelUp();
    triggerConfetti();

    // 1. Update user name
    updateSettings({
      userName: userName.trim() || 'Commander',
    });

    // 2. Set morning mission in vitals
    updateVitals({
      morningMission: morningMission.trim() || 'Execute with relentless discipline.',
    });

    // 3. Create first keystone habit
    if (firstHabitTitle.trim()) {
      addHabit({
        title: firstHabitTitle.trim(),
        description: 'First keystone habit to anchor your daily momentum',
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

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark blurred backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          className="relative w-full max-w-lg z-10"
        >
          <GlassCard variant="gold" className="p-6 space-y-5 border-amber-500/40 shadow-2xl shadow-amber-500/10">
            {/* Header banner */}
            <div className="text-center space-y-1.5 pb-3 border-b border-white/[0.08]">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold mb-1">
                <Sparkles size={13} className="text-amber-400" />
                <span>Day 1 • Sovereign Initiation</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Welcome to Your New Life
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Clean slate established. Configure your identity, prime mission, and first keystone habit.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFinish} className="space-y-4">
              {/* 1. Commander Identity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Crown size={14} />
                  <span>Your Commander Name</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="e.g. Alex, David, Sovereign"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 2. Prime Imperative / Morning Mission */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Target size={14} />
                  <span>First Prime Mission (Today's Imperative)</span>
                </label>
                <input
                  type="text"
                  value={morningMission}
                  onChange={e => setMorningMission(e.target.value)}
                  placeholder="e.g. 100% schedule execution and zero relapses"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* 3. First Keystone Habit */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Flame size={14} className="text-orange-400 fill-orange-400" />
                    First Keystone Habit
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">+20 Coins • +35 XP</span>
                </div>

                <input
                  type="text"
                  value={firstHabitTitle}
                  onChange={e => setFirstHabitTitle(e.target.value)}
                  placeholder="e.g. Morning Sunlight, 100 Pushups, Read 20 Mins"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />

                {/* Habit Category Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['Health', 'Fitness', 'Study', 'Focus', 'Mindset'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFirstHabitCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                        firstHabitCategory === cat
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-black/40 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={15} className="fill-black" />
                <span>Initialize LifeOS • Day 1</span>
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
