import React from 'react';
import { motion } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { TabType } from '../../types';
import { Home, CalendarCheck, Coins, BarChart3, UserCheck, Flame } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, settings, habits, badHabits } = useLifeOS();
  const isLight = settings.theme === 'white';

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'plan', label: 'PLAN', icon: CalendarCheck },
    { id: 'economy', label: 'ECONOMY', icon: Coins },
    { id: 'progress', label: 'PROGRESS', icon: BarChart3 },
    { id: 'profile', label: 'PROFILE', icon: UserCheck },
  ];

  return (
    <nav
      id="lifeos-bottom-nav"
      className={`fixed bottom-0 left-0 right-0 z-40 px-3 pb-safe pt-2 border-t backdrop-blur-2xl transition-colors duration-200 ${
        isLight
          ? 'bg-white/85 border-zinc-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]'
          : 'bg-[#050505]/85 border-white/[0.06] shadow-[0_-8px_30px_rgba(0,0,0,0.7)]'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[62px] rounded-xl transition-all duration-200"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute inset-0 rounded-xl ${
                    isLight
                      ? 'bg-amber-500/15 border border-amber-500/30'
                      : 'bg-gradient-to-t from-amber-500/20 to-amber-500/5 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  }`}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? settings.goldAccent
                        ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : isLight ? 'text-slate-900 scale-110' : 'text-white scale-110'
                      : isLight
                      ? 'text-slate-400 hover:text-slate-600'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                />
                <span
                  className={`text-[9px] font-bold tracking-wider mt-1 transition-colors ${
                    isActive
                      ? settings.goldAccent
                        ? 'text-amber-400 font-extrabold'
                        : isLight ? 'text-slate-900 font-extrabold' : 'text-white font-extrabold'
                      : isLight
                      ? 'text-slate-400'
                      : 'text-zinc-500'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
