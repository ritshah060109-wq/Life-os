import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import {
  UserCheck,
  Shield,
  Palette,
  Volume2,
  VolumeX,
  Vibrate,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  Check,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Crown,
  Flame,
  Award,
  ShieldAlert,
  Edit3,
  Clock,
  Calendar,
  RefreshCw,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { DifficultyMode } from '../../types';
import { DIFFICULTY_CONFIGS, getTodayKey } from '../../utils/defaultData';
import { calculateLevelFromTotalXP } from '../../utils/levelSystem';
import { sound } from '../../utils/soundAndHaptics';

export const ProfileView: React.FC = () => {
  const {
    settings,
    updateSettings,
    difficultyConfig,
    exportData,
    importData,
    economy,
    setNameModalOpen,
    setLevelProgressionModalOpen,
    setLoopBreakerOpen,
    streak,
    recoveryStats,
    setIsStartNewLifeOpen,
    setIsOnboardingOpen,
    badHabits,
  } = useLifeOS();

  const isLight = settings.theme === 'white';
  const [importJson, setImportJson] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Live device time clock state
  const [liveDate, setLiveDate] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Manual time states initialized from settings or current date
  const [manualDateInput, setManualDateInput] = useState(
    settings.manualDate || getTodayKey()
  );
  const [manualTimeInput, setManualTimeInput] = useState(
    settings.manualTime ||
      `${String(new Date().getHours()).padStart(2, '0')}:${String(
        new Date().getMinutes()
      ).padStart(2, '0')}`
  );

  const currentLevel = economy.level || 1;
  const currentXP = economy.xp || 0;
  const { currentLevelXP, requiredXPForNext, progressPct } = calculateLevelFromTotalXP(currentXP);

  // Formatted display name based on custom template
  const formattedName = React.useMemo(() => {
    const rawName = settings.userName || 'Commander';
    const rawTitle = settings.userCallsign || economy.activeTitle || 'Sovereign';
    const template = settings.nameTemplate || '{name}';

    return template
      .replace('{title}', rawTitle)
      .replace('{name}', rawName);
  }, [settings.userName, settings.userCallsign, settings.nameTemplate, economy.activeTitle]);

  const handleExport = () => {
    sound.tap();
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeos-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setStatusMsg('Backup downloaded successfully');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleImport = () => {
    sound.tap();
    if (!importJson.trim()) return;
    const ok = importData(importJson);
    if (ok) {
      setStatusMsg('Data successfully restored!');
      setShowImportBox(false);
      setImportJson('');
    } else {
      setStatusMsg('Invalid JSON backup file');
    }
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleSyncLiveTime = () => {
    sound.tap();
    const now = new Date();
    const today = getTodayKey(now);
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setManualDateInput(today);
    setManualTimeInput(time);
    updateSettings({
      timeSyncMode: 'auto',
      manualDate: undefined,
      manualTime: undefined,
    });
    setStatusMsg('Synchronized with Live Mobile Device Time');
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleApplyManualTime = () => {
    sound.tap();
    updateSettings({
      timeSyncMode: 'manual',
      manualDate: manualDateInput,
      manualTime: manualTimeInput,
    });
    setStatusMsg(`Manual system date & time override active: ${manualDateInput} • ${manualTimeInput}`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  // Format live time string
  const formattedLiveTime = liveDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedLiveDate = liveDate.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-4 pb-24 max-w-2xl mx-auto px-4 pt-3" id="profile-hub">
      {/* 1. IDENTITY & CALLSIGN COMMAND CARD */}
      <GlassCard variant="gold" className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-lg shadow-amber-500/25">
              {(settings.userName || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold text-zinc-100 truncate max-w-[160px] sm:max-w-[240px]">
                  {formattedName}
                </h2>
                <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  {difficultyConfig.title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-zinc-400 mt-0.5 flex-wrap">
                <span>Rank: Lvl {currentLevel}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{economy.coins} C</span>
                <span>•</span>
                <span className="text-yellow-400 font-bold">{economy.xp} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.tap();
              setNameModalOpen(true);
            }}
            className="self-end sm:self-center shrink-0 py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Edit3 size={13} />
            <span>Customize</span>
          </button>
        </div>

        {/* Level XP Progress */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Level {currentLevel} Progression
            </span>
            <button
              onClick={() => {
                sound.tap();
                setLevelProgressionModalOpen(true);
              }}
              className="text-[11px] text-amber-400 hover:underline font-bold"
            >
              View Full RPG Roadmap →
            </button>
          </div>

          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Current: {currentLevelXP} XP</span>
            <span>Next Level: {requiredXPForNext} XP ({progressPct}%)</span>
          </div>
        </div>
      </GlassCard>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold text-center">
          {statusMsg}
        </div>
      )}

      {/* 2. STREAK & DISCIPLINE SYSTEM INFO (Total Check-Ins Removed) */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Daily Auto Streak Engine
            </h3>
          </div>
          <span className="text-[11px] font-mono text-orange-400 font-bold">
            {streak.currentStreak} Days Active
          </span>
        </div>

        <p className="text-xs text-neutral-300">
          Your discipline streak is automatically tracked every single day you open and interact with LifeOS. Daily streak bonuses grant <span className="text-amber-400 font-bold">+30 Coins</span> and preserve momentum.
        </p>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Current Streak</span>
            <span className="font-mono font-extrabold text-orange-400">{streak.currentStreak} Days</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Longest Record</span>
            <span className="font-mono font-extrabold text-amber-400">{streak.longestStreak} Days</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Clean Shield</span>
            <span className="font-mono font-extrabold text-emerald-400">
              {badHabits.filter(b => b.relapseCount === 0).length} / {Math.max(1, badHabits.length)}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 3. TIME, DATE & WORLD CLOCK SYNCHRONIZATION */}
      <GlassCard className="p-4 space-y-4" id="time-sync-section">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Time, Date & Clock Synchronization
            </h3>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
              settings.timeSyncMode === 'manual'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {settings.timeSyncMode === 'manual' ? 'Manual Override' : 'Mobile Live Sync'}
          </span>
        </div>

        {/* Live Device Clock Readout */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                Synchronized System Clock
              </span>
              <span className="text-base sm:text-lg font-black font-mono text-white">
                {settings.timeSyncMode === 'manual' && settings.manualDate && settings.manualTime
                  ? `${settings.manualDate} • ${settings.manualTime}`
                  : formattedLiveTime}
              </span>
            </div>

            <button
              onClick={handleSyncLiveTime}
              className="py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <RefreshCw size={13} className="animate-spin-slow" />
              <span>Sync Mobile Time</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
            <Calendar size={13} className="text-amber-400" />
            <span>
              {settings.timeSyncMode === 'manual' && settings.manualDate
                ? settings.manualDate
                : formattedLiveDate}
            </span>
          </div>
        </div>

        {/* Manual Date & Time Setter */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200">Manual Date & Time Setter</span>
            <span className="text-[10px] text-zinc-400">Set day, date, year & exact time</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400">Day, Month & Year</label>
              <input
                type="date"
                value={manualDateInput}
                onChange={e => setManualDateInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400">Exact Time (HH:MM)</label>
              <input
                type="time"
                value={manualTimeInput}
                onChange={e => setManualTimeInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Prominent Anti-Cheat Warning */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-extrabold text-amber-300 block">Anti-Cheat Discipline Warning:</span>
              <p className="text-[10px] leading-relaxed text-zinc-300">
                Manually setting the date or time alters your daily streak evaluation, vault maturity timelines, and Day Score calculations. <strong>Do not use this to artificially game or cheat your discipline matrix.</strong> Genuine self-mastery requires absolute honesty with yourself.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleApplyManualTime}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all text-center"
            >
              Apply Manual Date & Time
            </button>
            <button
              onClick={handleSyncLiveTime}
              className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all"
            >
              Reset to Device
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 4. EMERGENCY LOOP BREAKER & RECOVERY PROTOCOL */}
      <GlassCard className="p-4 space-y-3 border-rose-500/20 bg-gradient-to-r from-rose-950/20 to-black/40">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
              Emergency Loop Breaker
            </h3>
          </div>
          <button
            onClick={() => {
              sound.tap();
              setLoopBreakerOpen(true);
            }}
            className="py-1 px-2.5 rounded-lg bg-rose-500 text-white font-bold text-xs shadow hover:bg-rose-600 transition-all flex items-center gap-1"
          >
            Launch Rescue
          </button>
        </div>

        <p className="text-xs text-neutral-300">
          Designed to catch negative mental loops, dopamine urges, and procrastination early. Recover instantly with 5-minute micro-actions and box breathing.
        </p>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Total Loops Interrupted</span>
            <span className="font-mono font-bold text-emerald-400">{recoveryStats.totalLoopsInterrupted} Rescues</span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Recovery Streak</span>
            <span className="font-mono font-bold text-amber-400">{recoveryStats.currentRecoveryStreak} Clean</span>
          </div>
        </div>
      </GlassCard>

      {/* 5. DIFFICULTY MODES */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <Shield className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            LifeOS Operating Difficulty Mode
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyMode[]).map(mode => {
            const conf = DIFFICULTY_CONFIGS[mode];
            const isSelected = settings.difficulty === mode;

            return (
              <div
                key={mode}
                onClick={() => {
                  sound.tap();
                  updateSettings({ difficulty: mode });
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/15 to-yellow-500/5 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-black/30 border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isSelected ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'bg-zinc-700'
                      }`}
                    />
                    <span className="text-xs font-extrabold capitalize text-zinc-100">
                      {conf.title} ({mode})
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    {conf.coinMultiplier}x Coins • {conf.xpMultiplier}x XP
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 mt-1 pl-5">
                  {conf.description}
                </p>

                {isSelected && (
                  <div className="mt-2 pl-5 flex items-center gap-3 text-[10px] font-mono text-zinc-400">
                    <span>Penalty Rate: {conf.penaltyMultiplier}x</span>
                    <span>•</span>
                    <span>Reward Multiplier: {conf.rewardCostMultiplier}x</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 6. AESTHETICS & THEME */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <Palette className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Aesthetics & Visual Theme
          </h3>
        </div>

        {/* Theme Switcher */}
        <div className="grid grid-cols-1 gap-2.5">
          <div
            className="p-3.5 rounded-2xl border bg-zinc-900/90 border-amber-500/60 shadow-md ring-1 ring-amber-500/30 text-left space-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span className="text-xs font-bold text-white">Tactical OLED Black</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                Active Theme
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 block pl-5">
              High-contrast tactical OLED dark palette engineered for deep focus and battery longevity
            </span>
          </div>
        </div>

        {/* Gold Accent Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-bold text-zinc-200 block">Imperial Gold Accents</span>
            <span className="text-[10px] text-zinc-400">Warm subtle golden halos and active indicators</span>
          </div>
          <button
            onClick={() => {
              sound.tap();
              updateSettings({ goldAccent: !settings.goldAccent });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.goldAccent ? 'bg-amber-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                settings.goldAccent ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </GlassCard>

      {/* 7. HELP, GUIDE & INTERACTIVE TOUR */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Interactive Guide & Onboarding
          </h3>
        </div>

        <p className="text-xs text-neutral-300">
          Replay the full interactive onboarding guide, feature tour, and first setup wizard anytime.
        </p>

        <button
          onClick={() => {
            sound.tap();
            setIsOnboardingOpen(true);
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
        >
          <BookOpen size={15} />
          <span>Launch Interactive App Guide & Tour</span>
        </button>
      </GlassCard>

      {/* 8. TACTICAL FEEDBACK (Audio & Haptics) */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            Tactical & Sensory Feedback
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            <div>
              <span className="text-xs font-bold text-zinc-200 block">Synthesized UI Sounds</span>
              <span className="text-[10px] text-zinc-400">Audio bell, coin chime, and victory chords</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.tap();
              updateSettings({ soundEnabled: !settings.soundEnabled });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.soundEnabled ? 'bg-amber-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Vibrate className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs font-bold text-zinc-200 block">Tactile Haptics</span>
              <span className="text-[10px] text-zinc-400">Physical vibration pulses on tap and completion</span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.tap();
              updateSettings({ hapticsEnabled: !settings.hapticsEnabled });
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.hapticsEnabled ? 'bg-amber-500' : 'bg-zinc-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition-transform ${
                settings.hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </GlassCard>

      {/* 9. DATA MANAGEMENT (Backup, Restore, Export, Reset) */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
          <Download className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            System Data & Storage
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup</span>
          </button>

          <button
            onClick={() => {
              sound.tap();
              setShowImportBox(!showImportBox);
            }}
            className="p-3 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
          </button>
        </div>

        {showImportBox && (
          <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
            <textarea
              rows={3}
              value={importJson}
              onChange={e => setImportJson(e.target.value)}
              placeholder="Paste exported JSON data here..."
              className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-white"
            />
            <button
              onClick={handleImport}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow"
            >
              Restore Database
            </button>
          </div>
        )}

        {/* Start New Life / Complete Reset Option */}
        <div className="pt-2 border-t border-white/[0.06]">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-950/25 to-black border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-rose-200 block">Start New Life</span>
                <span className="text-[10px] text-zinc-400">Complete wipe to Day 1 • Type RESET to confirm</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.tap();
                setIsStartNewLifeOpen(true);
              }}
              className="self-end sm:self-center shrink-0 py-2 px-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-md shadow-rose-950/50 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Life</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 10. ABOUT APP (Made by Smrt mob & Full Purpose Description) */}
      <GlassCard className="p-5 space-y-4 border-amber-500/20 bg-gradient-to-b from-zinc-950 to-black">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <Info className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            About LifeOS
          </h3>
        </div>

        <div className="space-y-3 text-xs leading-relaxed">
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
            <span className="font-semibold text-zinc-300">Created & Engineered By</span>
            <span className="font-extrabold text-amber-400 font-mono text-sm">Smrt mob</span>
          </div>

          <div className="space-y-1.5 p-3.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-xs font-bold text-amber-300 block">Purpose of App:</span>
            <p className="text-[11px] text-zinc-300 leading-relaxed text-justify">
              LifeOS is a high-performance Personal Operating System designed from the ground up to forge unbreakable self-discipline, eliminate bad habits, optimize daily productivity, and cultivate sovereign consistency. By merging real-time schedule planning, micro-habit tracking, a 21-Day Bad Habit Destroyer, an integrated gamified economy with high-yield Golden Token Vaults, emergency dopamine recovery protocols, customizable trophy milestones, and comprehensive long-term discipline analytics, LifeOS transforms personal development into a sleek, motivating daily ritual.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono text-zinc-400">
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block">Architecture</span>
              <span className="text-zinc-200 font-bold">100% Sovereign SPA</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-900/60 border border-white/5">
              <span className="text-zinc-500 block">Build Release</span>
              <span className="text-amber-400 font-bold">v2.4.0 Titanium Master</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-1 border-t border-white/[0.06]">
          <span className="text-[10px] text-zinc-500 font-mono">
            Made by Smrt mob • Zero Telemetry • Pure Discipline
          </span>
        </div>
      </GlassCard>
    </div>
  );
};
