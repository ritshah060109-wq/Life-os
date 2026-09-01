import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { HeaderCommand } from './components/common/HeaderCommand';
import { BottomNav } from './components/common/BottomNav';
import { QuickAddModal } from './components/common/QuickAddModal';
import { HomeView } from './components/home/HomeView';
import { PlanView } from './components/plan/PlanView';
import { EconomyView } from './components/economy/EconomyView';
import { ProgressView } from './components/progress/ProgressView';
import { ProfileView } from './components/profile/ProfileView';

// Modals and Floating Components
import { EmergencyRecoveryModal } from './components/loopBreaker/EmergencyRecoveryModal';
import { LevelProgressionModal } from './components/level/LevelProgressionModal';
import { LevelUpCelebrationModal } from './components/level/LevelUpCelebrationModal';
import { NameCustomizerModal } from './components/name/NameCustomizerModal';
import { StartNewLifeModal } from './components/profile/StartNewLifeModal';
import { InteractiveGuideModal } from './components/onboarding/InteractiveGuideModal';
import { SmartHelpModal } from './components/common/SmartHelpModal';
import { Flame, CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    settings,
    isLoopBreakerOpen,
    setLoopBreakerOpen,
    isNameModalOpen,
    setNameModalOpen,
    isLevelProgressionModalOpen,
    setLevelProgressionModalOpen,
    levelUpCelebrationLevel,
    setLevelUpCelebrationLevel,
    streakToastMessage,
    setStreakToastMessage,
    isStartNewLifeOpen,
    setIsStartNewLifeOpen,
    isOnboardingOpen,
    setIsOnboardingOpen,
    isSmartHelpOpen,
    setIsSmartHelpOpen,
  } = useLifeOS();

  const isLight = settings.theme === 'white';

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-[#FCFCFD] text-slate-900' : 'bg-[#050505] text-zinc-100'
      }`}
    >
      {/* Subtle Minimalist Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {settings.goldAccent && (
          <>
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/[0.04] blur-3xl" />
            <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-amber-500/[0.03] blur-3xl" />
          </>
        )}
      </div>

      {/* Top Header Command Bar */}
      <HeaderCommand />

      {/* Daily Streak Check-in Toast Notification */}
      <AnimatePresence>
        {streakToastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-auto"
          >
            <div className="p-3 rounded-2xl bg-black/90 border border-amber-500/50 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black flex items-center justify-center shadow-md">
                  <Flame size={18} className="fill-black" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-amber-300 block">
                    Daily Streak Logged
                  </span>
                  <span className="text-[11px] text-zinc-300">{streakToastMessage}</span>
                </div>
              </div>
              <button
                onClick={() => setStreakToastMessage(null)}
                className="p-1 text-zinc-400 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Tab Views with Smooth Slide/Fade Transition */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'plan' && <PlanView />}
            {activeTab === 'economy' && <EconomyView />}
            {activeTab === 'progress' && <ProgressView />}
            {activeTab === 'profile' && <ProfileView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Emergency Recovery Protocol Modal */}
      <EmergencyRecoveryModal
        isOpen={isLoopBreakerOpen}
        onClose={() => setLoopBreakerOpen(false)}
      />

      {/* Start New Life / Complete Reset Confirmation Modal */}
      <StartNewLifeModal
        isOpen={isStartNewLifeOpen}
        onClose={() => setIsStartNewLifeOpen(false)}
      />

      {/* Full-Screen Interactive Onboarding & Feature Guide for First-Time Users */}
      <InteractiveGuideModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Contextual Smart Help Modal for All Screens */}
      <SmartHelpModal
        isOpen={isSmartHelpOpen}
        onClose={() => setIsSmartHelpOpen(false)}
        activeTab={activeTab}
      />

      {/* RPG Level Progression Roadmap Modal */}
      <LevelProgressionModal
        isOpen={isLevelProgressionModalOpen}
        onClose={() => setLevelProgressionModalOpen(false)}
      />

      {/* Level Up Instant Celebration Modal */}
      <LevelUpCelebrationModal
        isOpen={levelUpCelebrationLevel !== null}
        newLevel={levelUpCelebrationLevel || 1}
        onClose={() => setLevelUpCelebrationLevel(null)}
      />

      {/* Identity & Name Customizer Modal */}
      <NameCustomizerModal
        isOpen={isNameModalOpen}
        onClose={() => setNameModalOpen(false)}
      />

      {/* Floating Quick Add Modal */}
      <QuickAddModal />

      {/* Liquid 5-Tab Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <LifeOSProvider>
      <MainContent />
    </LifeOSProvider>
  );
}
