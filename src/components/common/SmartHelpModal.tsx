import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import {
  HelpCircle,
  X,
  Target,
  Calendar,
  Coins,
  BarChart3,
  Sliders,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Clock,
  Award,
  Crown,
  Trophy,
} from 'lucide-react';
import { TabType } from '../../types';

interface SmartHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
}

export const SmartHelpModal: React.FC<SmartHelpModalProps> = ({
  isOpen,
  onClose,
  activeTab,
}) => {
  if (!isOpen) return null;

  const getHelpContent = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: 'Home • Command Center Intelligence',
          icon: <Target className="w-5 h-5 text-amber-400" />,
          sections: [
            {
              title: 'Day Score (0–100)',
              desc: 'Calculated in real time based on 5 weighted pillars: Keystone Habits (35%), Schedule Execution (25%), Focus Time (15%), Hydration (10%), and Sleep Quality (15%).',
            },
            {
              title: 'Prime Daily Mission',
              desc: 'Your single most important imperative today. Check it off to claim a 50 Coin and 80 XP bounty.',
            },
            {
              title: 'Focus Stopwatch & Pomodoro',
              desc: 'Deep work timer with ambient sound generation. Earn 1 Coin per minute of sustained concentration.',
            },
            {
              title: 'Recovery Mission',
              desc: 'If you ever hit a low Day Score (<50), trigger an instant recovery mission to bounce back without shame.',
            },
          ],
          proTip: 'Tap the level badge in the top-left header anytime to view your complete RPG level progression roadmap.',
        };

      case 'plan':
        return {
          title: 'Plan • Execution & Habits Guide',
          icon: <Calendar className="w-5 h-5 text-emerald-400" />,
          sections: [
            {
              title: 'Schedule Time-Blocking',
              desc: 'Organize tasks into Morning, Afternoon, and Evening blocks. Complete them to elevate your Day Score.',
            },
            {
              title: 'Keystone Habits',
              desc: 'Micro-actions that compound into massive results. Tap checkboxes to earn coins, XP, and streak multipliers.',
            },
            {
              title: 'Bad Habit Destroyer (21-Day Shield)',
              desc: 'Track clean days against addictions and vices. If an urge strikes, log a relapse journal to learn triggers and restart with zero guilt.',
            },
            {
              title: '7-Day Consistency Grid',
              desc: 'Visual heatmap displaying your completion velocity across the entire week.',
            },
          ],
          proTip: 'Tap "+ Quick Habit" or "+ Task" to rapidly schedule new actions into today\'s plan.',
        };

      case 'economy':
        return {
          title: 'Economy • Coins, Vaults & Rewards',
          icon: <Coins className="w-5 h-5 text-yellow-400" />,
          sections: [
            {
              title: 'Life Coins',
              desc: 'Earned exclusively through disciplined execution. Spend them guilt-free on your custom reward list.',
            },
            {
              title: 'Golden Token Vaults',
              desc: 'Lock coins away for 7, 14, 21, or 30 days. When the term matures, claim high interest yields and rare Golden Tokens.',
            },
            {
              title: 'Time Capsules',
              desc: 'Send messages, photos, and coin stakes to your future self. Locked until your target milestone date arrives.',
            },
            {
              title: 'Spending Manager',
              desc: 'Log discipline fines and keep track of your earned vs. spent coin ledger.',
            },
          ],
          proTip: 'Never buy rewards with real money! Use LifeOS coins as an emotional boundary for guilt-free leisure.',
        };

      case 'progress':
        return {
          title: 'Progress • Discipline Matrix & Trophies',
          icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
          sections: [
            {
              title: 'Long-Term Analytics Matrix',
              desc: 'Toggle between Daily, Weekly, Monthly, and Yearly timeframes to analyze historical Day Score averages and consistency highs.',
            },
            {
              title: 'Customizable Trophy Vault',
              desc: 'Unlock Bronze, Silver, Gold, and Diamond achievements as you conquer discipline milestones. Create your own custom trophies anytime.',
            },
            {
              title: 'Auto Streak Engine',
              desc: 'Monitors your active daily consistency and records your longest unbroken discipline runs.',
            },
            {
              title: 'Weekly Performance Reports',
              desc: 'Detailed breakdown of high-execution days, total focus hours logged, and habits mastered.',
            },
          ],
          proTip: 'Tap "+ Add Custom Achievement" to forge custom challenges tailored to your personal life goals.',
        };

      case 'profile':
      default:
        return {
          title: 'Profile • Sovereign Settings & Time Sync',
          icon: <Sliders className="w-5 h-5 text-purple-400" />,
          sections: [
            {
              title: '5 Operating Difficulty Modes',
              desc: 'Switch between Balanced Explorer (Easy), Disciplined Monk (Normal), Spartan Warrior (Hard), Cyber-Ronin (Extreme), and Sovereign Stoic (Hardcore) for scaled coin multipliers and stricter penalties.',
            },
            {
              title: 'World Clock & Time Synchronization',
              desc: 'Sync the app with your live device clock or manually set the date and time for testing or timezone travel.',
            },
            {
              title: 'Zero Telemetry & Backups',
              desc: '100% private. Export complete encrypted JSON backups or restore your database with one tap.',
            },
            {
              title: 'Start New Life',
              desc: 'Factory reset LifeOS to Day 1 with an interactive onboarding launch whenever you need a clean slate.',
            },
          ],
          proTip: 'You can replay the complete interactive app guide anytime from Profile > Help > App Guide.',
        };
    }
  };

  const content = getHelpContent();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg max-h-[88vh] flex flex-col z-10 my-auto"
        >
          <GlassCard variant="gold" className="p-4 sm:p-6 space-y-3.5 border-amber-500/30 shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  {content.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">{content.title}</h3>
                  <span className="text-[10px] text-zinc-400 block">Smart Page Guide & Formulas</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 min-h-0">
              {content.sections.map((sec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-xs font-bold text-amber-300 block">{sec.title}</span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">{sec.desc}</p>
                </div>
              ))}
            </div>

            {/* Pro Tip */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-200 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong className="font-bold">Pro Tip:</strong> {content.proTip}
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all shrink-0"
            >
              Got it • Back to App
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
