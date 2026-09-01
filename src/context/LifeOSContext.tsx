import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import {
  TabType,
  Habit,
  BadHabit,
  ScheduleTask,
  DailyVitals,
  RewardItem,
  PurchaseLog,
  ExpenseRecord,
  GoldenVault,
  TimeCapsule,
  Achievement,
  UserEconomy,
  UserSettings,
  DayScoreData,
  DifficultyMode,
  StreakState,
  LoopIncident,
  RecoveryStats,
  DisciplineTimeframeGoal,
  PersonalGoal,
  EconomyTransaction,
  QuickAddSectionType,
} from '../types';
import {
  getTodayKey,
  getPastDateKey,
  DIFFICULTY_CONFIGS,
  INITIAL_HABITS,
  INITIAL_BAD_HABITS,
  INITIAL_SCHEDULE,
  INITIAL_REWARDS,
  INITIAL_VAULTS,
  INITIAL_CAPSULES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_VITALS,
  INITIAL_ECONOMY,
  INITIAL_SETTINGS,
  INITIAL_STREAK,
  INITIAL_LOOP_INCIDENTS,
  INITIAL_RECOVERY_STATS,
  INITIAL_TIMEFRAME_GOALS,
  INITIAL_GOALS,
  INITIAL_TRANSACTIONS,
} from '../utils/defaultData';
import { sound } from '../utils/soundAndHaptics';
import { triggerConfetti, triggerBurstConfetti } from '../utils/confetti';
import {
  calculateLevelFromTotalXP,
  getLevelCoinReward,
  getMilestoneForLevel,
  getUnlockedTitlesForLevel,
} from '../utils/levelSystem';

interface LifeOSContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  habits: Habit[];
  badHabits: BadHabit[];
  schedule: ScheduleTask[];
  vitals: DailyVitals;
  economy: UserEconomy;
  rewards: RewardItem[];
  purchaseHistory: PurchaseLog[];
  expenses: ExpenseRecord[];
  transactions: EconomyTransaction[];
  recordTransaction: (type: 'earn' | 'spend', amount: number, label: string, category: string) => void;
  vaults: GoldenVault[];
  capsules: TimeCapsule[];
  achievements: Achievement[];
  settings: UserSettings;
  todayScore: DayScoreData;
  dayScoreHistory: Record<string, number>;
  difficultyConfig: typeof DIFFICULTY_CONFIGS[DifficultyMode];
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  quickAddTab: QuickAddSectionType;
  setQuickAddTab: (tab: QuickAddSectionType) => void;
  openQuickAdd: (tab?: QuickAddSectionType) => void;

  // Streak System
  streak: StreakState;
  streakToastMessage: string | null;
  setStreakToastMessage: (msg: string | null) => void;
  recordDailyCheckIn: () => void;

  // RPG Level Progression & Celebration
  levelProgressionModalOpen: boolean;
  setLevelProgressionModalOpen: (open: boolean) => void;
  isLevelProgressionModalOpen: boolean;
  celebrationLevel: number | null;
  setCelebrationLevel: (level: number | null) => void;
  levelUpCelebrationLevel: number | null;
  setLevelUpCelebrationLevel: (level: number | null) => void;

  // Name / Callsign Customizer
  nameModalOpen: boolean;
  setNameModalOpen: (open: boolean) => void;
  isNameModalOpen: boolean;

  // Loop Breaker & Emergency Recovery
  loopBreakerOpen: boolean;
  setLoopBreakerOpen: (open: boolean) => void;
  isLoopBreakerOpen: boolean;
  loopIncidents: LoopIncident[];
  recordLoopIncident: (incident: Omit<LoopIncident, 'id' | 'date' | 'time'>) => void;
  recoveryStats: RecoveryStats;

  // Discipline Timeframe Goals
  timeframeGoals: DisciplineTimeframeGoal[];
  toggleTimeframeGoal: (id: string) => void;
  addTimeframeGoal: (goal: Omit<DisciplineTimeframeGoal, 'id' | 'completed'>) => void;
  deleteTimeframeGoal: (id: string) => void;

  // Personal Goals Hub
  goals: PersonalGoal[];
  addGoal: (goal: Omit<PersonalGoal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, partial: Partial<PersonalGoal>) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  completeGoal: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Actions
  toggleHabit: (id: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates'>) => void;
  editHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;

  recordRelapse: (badHabitId: string, reason: string, notes?: string) => void;
  recordCleanDay: (badHabitId: string) => void;
  addBadHabit: (badHabit: Omit<BadHabit, 'id' | 'currentStreakDays' | 'longestStreakDays' | 'relapseCount' | 'relapses' | 'successPercentage' | 'recoveryBonusEligible' | 'cleanDaysHistory'>) => void;
  deleteBadHabit: (id: string) => void;

  toggleScheduleTask: (id: string) => void;
  addScheduleTask: (task: Omit<ScheduleTask, 'id' | 'completed' | 'date'>) => void;
  deleteScheduleTask: (id: string) => void;

  updateVitals: (partial: Partial<DailyVitals>) => void;
  adjustWater: (delta: number) => void;
  setManualScoreOverride: (score: number | null) => void;

  purchaseReward: (rewardId: string) => boolean;
  addCustomReward: (reward: Omit<RewardItem, 'id' | 'timesPurchased'>) => void;
  deleteReward: (rewardId: string) => void;

  logExpense: (expense: Omit<ExpenseRecord, 'id' | 'date'>) => void;

  depositVault: (params: {
    coins: number;
    termDays: number;
    name?: string;
    isTimeCapsule?: boolean;
    timeCapsuleData?: {
      title: string;
      futureMessage: string;
      personalPromise: string;
      goal: string;
      rewardDescription: string;
      photoUrl?: string;
    };
  }) => boolean;
  withdrawVault: (vaultId: string) => { coinsReturned: number; bonusEarned: number; goldenTokensEarned: number } | null;
  reinvestVault: (vaultId: string, newTermDays?: number) => boolean;
  extendVaultTerm: (vaultId: string, additionalDays: number) => boolean;
  simulateAdvanceVault: (vaultId: string, daysToAdvance: number) => void;

  createTimeCapsule: (capsule: Omit<TimeCapsule, 'id' | 'createdAt' | 'isUnlocked'>) => boolean;
  unlockTimeCapsule: (capsuleId: string, data?: { achievedStatus?: 'yes' | 'partially' | 'no'; reflectionNotes?: string }) => void;

  claimAchievement: (achievementId: string) => void;
  addCustomAchievement: (achievement: Omit<Achievement, 'id' | 'isUnlocked' | 'claimed'>) => void;
  editAchievement: (id: string, partial: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  activeVaultForOpening: GoldenVault | null;
  setActiveVaultForOpening: (vault: GoldenVault | null) => void;
  activeCapsuleForOpening: TimeCapsule | null;
  setActiveCapsuleForOpening: (capsule: TimeCapsule | null) => void;

  updateSettings: (partial: Partial<UserSettings>) => void;

  logFocusTime: (minutes: number, modeName: string, customCoins?: number, customXP?: number) => void;

  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  resetAllData: () => void;
  loadSampleData: () => void;

  // New Game / Complete Reset & Welcome Onboarding
  startNewLife: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isStartNewLifeOpen: boolean;
  setIsStartNewLifeOpen: (open: boolean) => void;

  // Smart Help Modal
  isSmartHelpOpen: boolean;
  setIsSmartHelpOpen: (open: boolean) => void;
  openSmartHelp: (tab?: TabType) => void;
}

const LifeOSContext = createContext<LifeOSContextType | null>(null);

const STORAGE_PREFIX = 'lifeos_v1_';

export const LifeOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<TabType>('home');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState<QuickAddSectionType>('task');
  const [levelProgressionModalOpen, setLevelProgressionModalOpen] = useState(false);
  const [celebrationLevel, setCelebrationLevel] = useState<number | null>(null);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [loopBreakerOpen, setLoopBreakerOpen] = useState(false);
  const [streakToastMessage, setStreakToastMessage] = useState<string | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const completed = localStorage.getItem('lifeos_has_completed_onboarding');
    return completed !== 'true';
  });
  const [isStartNewLifeOpen, setIsStartNewLifeOpen] = useState(false);
  const [isSmartHelpOpen, setIsSmartHelpOpen] = useState(false);

  const openSmartHelp = useCallback((tab?: TabType) => {
    if (tab) setActiveTabState(tab);
    setIsSmartHelpOpen(true);
  }, []);

  const openQuickAdd = useCallback((tab: QuickAddSectionType = 'task') => {
    setQuickAddTab(tab);
    setQuickAddOpen(true);
  }, []);

  // Local storage load helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [habits, setHabits] = useState<Habit[]>(() => loadStored('habits', INITIAL_HABITS));
  const [badHabits, setBadHabits] = useState<BadHabit[]>(() => loadStored('bad_habits', INITIAL_BAD_HABITS));
  const [schedule, setSchedule] = useState<ScheduleTask[]>(() => loadStored('schedule', INITIAL_SCHEDULE));
  const [vitals, setVitals] = useState<DailyVitals>(() => loadStored('vitals', INITIAL_VITALS));
  const [economy, setEconomy] = useState<UserEconomy>(() => loadStored('economy', INITIAL_ECONOMY));
  const [rewards, setRewards] = useState<RewardItem[]>(() => loadStored('rewards', INITIAL_REWARDS));
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseLog[]>(() => loadStored('purchase_history', [
    { id: 'p-1', rewardId: 'rew-1', rewardName: 'Double Wagyu Smash Burger', coinCost: 180, category: 'Food', timestamp: getPastDateKey(3) + ' 19:40' },
    { id: 'p-2', rewardId: 'rew-2', rewardName: '2-Hour PS5 / PC Gaming Session', coinCost: 120, category: 'Entertainment', timestamp: getPastDateKey(6) + ' 21:00' },
  ]));
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => loadStored('expenses', [
    { id: 'e-1', name: 'Late Night Screen Fine', amount: 30, category: 'Discipline Penalty', date: getPastDateKey(15), reason: 'Rule violation: screen in bed' },
  ]));
  const [transactions, setTransactions] = useState<EconomyTransaction[]>(() => loadStored('transactions', INITIAL_TRANSACTIONS));
  const [vaults, setVaults] = useState<GoldenVault[]>(() => loadStored('vaults', INITIAL_VAULTS));
  const [capsules, setCapsules] = useState<TimeCapsule[]>(() => loadStored('capsules', INITIAL_CAPSULES));
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadStored('achievements', INITIAL_ACHIEVEMENTS));
  const [settings, setSettings] = useState<UserSettings>(() => loadStored('settings', INITIAL_SETTINGS));
  const [streak, setStreak] = useState<StreakState>(() => loadStored('streak', INITIAL_STREAK));
  const [loopIncidents, setLoopIncidents] = useState<LoopIncident[]>(() => loadStored('loop_incidents', INITIAL_LOOP_INCIDENTS));
  const [recoveryStats, setRecoveryStats] = useState<RecoveryStats>(() => loadStored('recovery_stats', INITIAL_RECOVERY_STATS));
  const [timeframeGoals, setTimeframeGoals] = useState<DisciplineTimeframeGoal[]>(() => loadStored('timeframe_goals', INITIAL_TIMEFRAME_GOALS));
  const [goals, setGoals] = useState<PersonalGoal[]>(() => loadStored('personal_goals', INITIAL_GOALS));

  const [activeVaultForOpening, setActiveVaultForOpening] = useState<GoldenVault | null>(null);
  const [activeCapsuleForOpening, setActiveCapsuleForOpening] = useState<TimeCapsule | null>(null);
  const [dayScoreHistory, setDayScoreHistory] = useState<Record<string, number>>(() => loadStored('day_score_history', {}));

  // Sync sound engine preferences with settings
  useEffect(() => {
    sound.setPreferences(settings.soundEnabled, settings.hapticsEnabled);
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  // Sync theme to document element
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (settings.theme === 'white') {
        root.classList.remove('dark');
        root.classList.add('light');
        document.body.className = 'bg-slate-50 text-slate-900 antialiased selection:bg-amber-500/30 selection:text-amber-900';
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
        document.body.className = 'bg-black text-white antialiased selection:bg-amber-500/30 selection:text-amber-200';
      }
    }
  }, [settings.theme]);

  // Persist states to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'habits', JSON.stringify(habits));
      localStorage.setItem(STORAGE_PREFIX + 'bad_habits', JSON.stringify(badHabits));
      localStorage.setItem(STORAGE_PREFIX + 'schedule', JSON.stringify(schedule));
      localStorage.setItem(STORAGE_PREFIX + 'vitals', JSON.stringify(vitals));
      localStorage.setItem(STORAGE_PREFIX + 'economy', JSON.stringify(economy));
      localStorage.setItem(STORAGE_PREFIX + 'rewards', JSON.stringify(rewards));
      localStorage.setItem(STORAGE_PREFIX + 'purchase_history', JSON.stringify(purchaseHistory));
      localStorage.setItem(STORAGE_PREFIX + 'expenses', JSON.stringify(expenses));
      localStorage.setItem(STORAGE_PREFIX + 'transactions', JSON.stringify(transactions));
      localStorage.setItem(STORAGE_PREFIX + 'vaults', JSON.stringify(vaults));
      localStorage.setItem(STORAGE_PREFIX + 'capsules', JSON.stringify(capsules));
      localStorage.setItem(STORAGE_PREFIX + 'achievements', JSON.stringify(achievements));
      localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
      localStorage.setItem(STORAGE_PREFIX + 'streak', JSON.stringify(streak));
      localStorage.setItem(STORAGE_PREFIX + 'loop_incidents', JSON.stringify(loopIncidents));
      localStorage.setItem(STORAGE_PREFIX + 'recovery_stats', JSON.stringify(recoveryStats));
      localStorage.setItem(STORAGE_PREFIX + 'timeframe_goals', JSON.stringify(timeframeGoals));
      localStorage.setItem(STORAGE_PREFIX + 'personal_goals', JSON.stringify(goals));
      localStorage.setItem(STORAGE_PREFIX + 'day_score_history', JSON.stringify(dayScoreHistory));
    } catch {
      // Storage quota safety
    }
  }, [habits, badHabits, schedule, vitals, economy, rewards, purchaseHistory, expenses, transactions, vaults, capsules, achievements, settings, streak, loopIncidents, recoveryStats, timeframeGoals, goals, dayScoreHistory]);

  const difficultyConfig = useMemo(() => {
    return DIFFICULTY_CONFIGS[settings.difficulty] || DIFFICULTY_CONFIGS.normal;
  }, [settings.difficulty]);

  /**
   * Universal Economy Transaction Logger (Last 50 events stored, last 5 rendered in Economy)
   */
  const recordTransaction = useCallback((type: 'earn' | 'spend', amount: number, label: string, category: string) => {
    if (amount <= 0) return;
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeFormatted = `Today • ${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;

    const newTx: EconomyTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      amount,
      label,
      category,
      timestamp: timeFormatted,
      createdAt: Date.now(),
    };

    setTransactions(prev => [newTx, ...prev].slice(0, 50));
  }, []);

  /**
   * RPG Level & XP Engine: Awards XP, recalculates Level, and unlocks scaled rewards (Level × 100 Coins)
   */
  const grantXPAndCoins = useCallback((xpAmount: number, coinAmount: number = 0) => {
    setEconomy(prev => {
      const newTotalXP = (prev.lifetimeXP || prev.xp || 0) + xpAmount;
      const { level: newLevel } = calculateLevelFromTotalXP(newTotalXP);
      const oldLevel = prev.level || 1;

      let extraCoins = coinAmount;
      let extraTokens = 0;
      let newTitles = prev.unlockedTitles || ['Beginner', 'Explorer', 'Disciplined'];

      if (newLevel > oldLevel) {
        // Level up reward formula: Level × 100 Coins
        const levelBonusCoins = getLevelCoinReward(newLevel);
        extraCoins += levelBonusCoins;

        // Check Milestone perks
        const milestone = getMilestoneForLevel(newLevel);
        if (milestone) {
          extraTokens += milestone.bonusGoldenTokens || 0;
          if (milestone.unlockedTitle && !newTitles.includes(milestone.unlockedTitle)) {
            newTitles = [...newTitles, milestone.unlockedTitle];
          }
        }

        const allAvailableTitles = getUnlockedTitlesForLevel(newLevel);
        allAvailableTitles.forEach(t => {
          if (!newTitles.includes(t)) newTitles.push(t);
        });

        // Trigger celebratory fanfare
        sound.levelUp();
        triggerBurstConfetti();
        setCelebrationLevel(newLevel);
      }

      return {
        ...prev,
        coins: prev.coins + extraCoins,
        lifetimeEarned: prev.lifetimeEarned + extraCoins,
        xp: newTotalXP,
        lifetimeXP: newTotalXP,
        level: newLevel,
        highestLevel: Math.max(prev.highestLevel || 1, newLevel),
        goldenTokens: prev.goldenTokens + extraTokens,
        unlockedTitles: newTitles,
      };
    });
  }, []);

  /**
   * Daily Streak System: Checks in user, advances streak, and awards +30 Coins every active day!
   */
  const recordDailyCheckIn = useCallback(() => {
    const today = getTodayKey();
    const yesterday = getPastDateKey(1);

    setStreak(prev => {
      if (prev.lastActiveDate === today && prev.todayClaimed) {
        return prev;
      }

      let newStreakCount = 1;
      let isContinued = false;

      if (prev.lastActiveDate === yesterday || prev.lastActiveDate === today) {
        newStreakCount = prev.lastActiveDate === today ? prev.currentStreak : prev.currentStreak + 1;
        isContinued = true;
      } else {
        newStreakCount = 1;
      }

      const longest = Math.max(prev.longestStreak || 0, newStreakCount);
      const newHistory = prev.streakHistory.includes(today) ? prev.streakHistory : [today, ...prev.streakHistory];

      // Award +30 Coins Daily Streak Bonus + 50 XP
      grantXPAndCoins(50, 30);
      recordTransaction('earn', 30, `Daily Streak Check-in (+30 Coins)`, 'Streak');
      sound.coin();
      triggerConfetti(true);

      setStreakToastMessage(
        `🔥 Streak Active: ${newStreakCount} Days! +30 Daily Streak Coins & +50 XP Awarded!`
      );
      setTimeout(() => setStreakToastMessage(null), 4500);

      return {
        currentStreak: newStreakCount,
        longestStreak: longest,
        lastActiveDate: today,
        todayClaimed: true,
        totalCoinsEarned: (prev.totalCoinsEarned || 0) + 30,
        streakHistory: newHistory,
      };
    });
  }, [grantXPAndCoins]);

  // Run automatic check-in when app loads
  useEffect(() => {
    recordDailyCheckIn();
  }, [recordDailyCheckIn]);

  // Compute live Day Score (0-100)
  const todayScore: DayScoreData = useMemo(() => {
    const today = getTodayKey();
    const activeHabits = (habits || []).filter(h => !h.archived);
    const completedHabits = activeHabits.filter(h => (h.completedDates || []).includes(today));
    const habitScore = activeHabits.length > 0 ? (completedHabits.length / activeHabits.length) * 30 : 30;

    const todayTasks = (schedule || []).filter(t => t.date === today || t.repeat !== 'none');
    const completedTasks = todayTasks.filter(t => t.completed);
    const scheduleScore = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 20 : 20;

    // Sleep score
    const safeSleepHours = typeof vitals?.sleepHours === 'number' && !isNaN(vitals.sleepHours) ? vitals.sleepHours : 8;
    const safeSleepQuality = typeof vitals?.sleepQuality === 'number' && !isNaN(vitals.sleepQuality) ? vitals.sleepQuality : 4;
    const sleepHourScore = Math.min(10, (safeSleepHours / 8) * 10);
    const sleepQualScore = (safeSleepQuality / 5) * 5;
    const sleepScore = Math.min(15, sleepHourScore + sleepQualScore);

    // Workout score
    const safeWorkoutMins = typeof vitals?.workoutMinutes === 'number' && !isNaN(vitals.workoutMinutes) ? vitals.workoutMinutes : 30;
    const workoutScore = Math.min(10, (safeWorkoutMins / 45) * 10);

    // Focus score
    const safeWaterGlasses = typeof vitals?.waterGlasses === 'number' && !isNaN(vitals.waterGlasses) ? vitals.waterGlasses : 6;
    const safeWaterTarget = typeof vitals?.waterTarget === 'number' && !isNaN(vitals.waterTarget) && vitals.waterTarget > 0 ? vitals.waterTarget : 8;
    const focusScore = Math.min(10, (safeWaterGlasses / safeWaterTarget) * 5 + 5);

    // Mood & Energy
    const safeMood = typeof vitals?.mood === 'number' && !isNaN(vitals.mood) ? vitals.mood : 5;
    const safeEnergy = typeof vitals?.energyLevel === 'number' && !isNaN(vitals.energyLevel) ? vitals.energyLevel : 5;
    const moodScore = ((safeMood + safeEnergy) / 10) * 10;

    // Bad habit score
    const relapsesToday = (badHabits || []).reduce((acc, bh) => {
      const relToday = (bh.relapses || []).filter(r => r.date === today).length;
      return acc + relToday;
    }, 0);
    const badHabitScore = relapsesToday === 0 ? 5 : Math.max(0, 5 - relapsesToday * 3);

    // Screen time penalty if > 240 mins (4 hours)
    const safeScreenTime = typeof vitals?.screenTimeMinutes === 'number' && !isNaN(vitals.screenTimeMinutes) ? vitals.screenTimeMinutes : 120;
    const screenTimeScore = safeScreenTime > 240 ? -5 : 0;

    const rawSum = habitScore + scheduleScore + sleepScore + workoutScore + focusScore + moodScore + badHabitScore + screenTimeScore;
    const rawTotal = Math.max(0, Math.min(100, Math.round(isNaN(rawSum) ? 80 : rawSum)));
    
    const isOverride = vitals?.manualScoreOverride !== null && vitals?.manualScoreOverride !== undefined && !isNaN(vitals.manualScoreOverride);
    const calculatedScore = isOverride ? vitals.manualScoreOverride! : rawTotal;
    const finalScore = typeof calculatedScore === 'number' && !isNaN(calculatedScore) ? calculatedScore : 80;

    let letterGrade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
    if (finalScore >= 93) letterGrade = 'S';
    else if (finalScore >= 82) letterGrade = 'A';
    else if (finalScore >= 70) letterGrade = 'B';
    else if (finalScore >= 55) letterGrade = 'C';
    else if (finalScore >= 40) letterGrade = 'D';
    else letterGrade = 'F';

    return {
      score: isNaN(finalScore) ? 80 : finalScore,
      letterGrade,
      habitScore: Math.round(isNaN(habitScore) ? 30 : habitScore),
      scheduleScore: Math.round(isNaN(scheduleScore) ? 20 : scheduleScore),
      sleepScore: Math.round(isNaN(sleepScore) ? 15 : sleepScore),
      workoutScore: Math.round(isNaN(workoutScore) ? 10 : workoutScore),
      focusScore: Math.round(isNaN(focusScore) ? 10 : focusScore),
      moodScore: Math.round(isNaN(moodScore) ? 10 : moodScore),
      badHabitScore: Math.round(isNaN(badHabitScore) ? 5 : badHabitScore),
      screenTimeScore: isNaN(screenTimeScore) ? 0 : screenTimeScore,
      isManualOverride: isOverride,
    };
  }, [habits, schedule, vitals, badHabits]);

  // Update today's score in history automatically
  useEffect(() => {
    const today = getTodayKey();
    setDayScoreHistory(prev => ({
      ...prev,
      [today]: todayScore.score,
    }));
  }, [todayScore.score]);

  const setActiveTab = (tab: TabType) => {
    sound.tap();
    recordDailyCheckIn();
    setActiveTabState(tab);
  };

  // Toggle habit completion
  const toggleHabit = (id: string) => {
    recordDailyCheckIn();
    const today = getTodayKey();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompleted = habit.completedDates.includes(today);

    if (!isCompleted) {
      sound.completeHabit();
      triggerConfetti(settings.goldAccent);

      const coinEarned = Math.round(habit.coinReward * difficultyConfig.coinMultiplier);
      const xpEarned = Math.round(habit.xpReward * difficultyConfig.xpMultiplier);

      const newStreak = habit.streak + 1;
      const newLongest = Math.max(habit.longestStreak, newStreak);

      setHabits(prev =>
        prev.map(h =>
          h.id === id
            ? {
                ...h,
                completedDates: [...h.completedDates, today],
                streak: newStreak,
                longestStreak: newLongest,
              }
            : h
        )
      );

      grantXPAndCoins(xpEarned, coinEarned);
      recordTransaction('earn', coinEarned, `Completed Habit: ${habit.name}`, habit.category || 'Habits');
    } else {
      sound.tap();
      const coinLost = Math.round(habit.coinReward * difficultyConfig.coinMultiplier);
      const xpLost = Math.round(habit.xpReward * difficultyConfig.xpMultiplier);

      setHabits(prev =>
        prev.map(h =>
          h.id === id
            ? {
                ...h,
                completedDates: h.completedDates.filter(d => d !== today),
                streak: Math.max(0, h.streak - 1),
              }
            : h
        )
      );

      setEconomy(prev => ({
        ...prev,
        coins: Math.max(0, prev.coins - coinLost),
        lifetimeEarned: Math.max(0, prev.lifetimeEarned - coinLost),
        xp: Math.max(0, prev.xp - xpLost),
      }));
    }
  };

  const addHabit = (data: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedDates'>) => {
    sound.coin();
    recordDailyCheckIn();
    const newHabit: Habit = {
      ...data,
      id: `h-${Date.now()}`,
      streak: 0,
      longestStreak: 0,
      completedDates: [],
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const editHabit = (id: string, partial: Partial<Habit>) => {
    sound.tap();
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...partial } : h)));
  };

  const deleteHabit = (id: string) => {
    sound.tap();
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Bad Habit Destroyer logic
  const recordRelapse = (badHabitId: string, reason: string, notes?: string) => {
    recordDailyCheckIn();
    sound.relapseAlert();
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = getTodayKey();

    setBadHabits(prev =>
      prev.map(bh => {
        if (bh.id !== badHabitId) return bh;
        const newRelapses = [
          ...bh.relapses,
          {
            id: `rel-${Date.now()}`,
            date: today,
            time: timeStr,
            reason,
            notes,
          },
        ];
        const totalAttempts = bh.cleanDaysHistory.length + newRelapses.length;
        const successPercentage = Math.round((bh.cleanDaysHistory.length / (totalAttempts || 1)) * 100);

        return {
          ...bh,
          relapseCount: bh.relapseCount + 1,
          currentStreakDays: 0,
          relapses: newRelapses,
          successPercentage,
        };
      })
    );

    setVitals(prev => ({
      ...prev,
      recoveryMission: `Bounce-back Protocol: Reclaim focus after relapse in ${reason}. Maintain 100% schedule today.`,
    }));
  };

  const recordCleanDay = (badHabitId: string) => {
    recordDailyCheckIn();
    const today = getTodayKey();
    sound.completeHabit();
    triggerConfetti(true);

    setBadHabits(prev =>
      prev.map(bh => {
        if (bh.id !== badHabitId) return bh;
        if (bh.cleanDaysHistory.includes(today)) return bh;

        const newCleanDays = [...bh.cleanDaysHistory, today];
        const newStreak = bh.currentStreakDays + 1;
        const newLongest = Math.max(bh.longestStreakDays, newStreak);
        const totalAttempts = newCleanDays.length + bh.relapses.length;
        const successPercentage = Math.round((newCleanDays.length / (totalAttempts || 1)) * 100);

        return {
          ...bh,
          cleanDaysHistory: newCleanDays,
          currentStreakDays: newStreak,
          longestStreakDays: newLongest,
          successPercentage,
        };
      })
    );

    grantXPAndCoins(70, 35);
    const bhObj = badHabits.find(b => b.id === badHabitId);
    recordTransaction('earn', 35, `Clean Day: ${bhObj?.name || 'Bad Habit'}`, 'Discipline');
  };

  const addBadHabit = (data: Omit<BadHabit, 'id' | 'currentStreakDays' | 'longestStreakDays' | 'relapseCount' | 'relapses' | 'successPercentage' | 'recoveryBonusEligible' | 'cleanDaysHistory'>) => {
    sound.tap();
    const newBadHabit: BadHabit = {
      ...data,
      id: `bh-${Date.now()}`,
      currentStreakDays: 0,
      longestStreakDays: 0,
      relapseCount: 0,
      relapses: [],
      successPercentage: 100,
      recoveryBonusEligible: true,
      cleanDaysHistory: [],
    };
    setBadHabits(prev => [...prev, newBadHabit]);
  };

  const deleteBadHabit = (id: string) => {
    sound.tap();
    setBadHabits(prev => prev.filter(bh => bh.id !== id));
  };

  // Schedule task logic
  const toggleScheduleTask = (id: string) => {
    recordDailyCheckIn();
    sound.tap();
    setSchedule(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const newCompleted = !t.completed;
        if (newCompleted) {
          sound.coin();
          grantXPAndCoins(35, 15);
          recordTransaction('earn', 15, `Schedule Task: ${t.title}`, t.category || 'Schedule');
        }
        return { ...t, completed: newCompleted };
      })
    );
  };

  const addScheduleTask = (taskData: Omit<ScheduleTask, 'id' | 'completed' | 'date'>) => {
    sound.tap();
    recordDailyCheckIn();
    const newTask: ScheduleTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
      date: getTodayKey(),
    };
    setSchedule(prev => [...prev, newTask]);
  };

  const deleteScheduleTask = (id: string) => {
    sound.tap();
    setSchedule(prev => prev.filter(t => t.id !== id));
  };

  // Vitals logic
  const updateVitals = (partial: Partial<DailyVitals>) => {
    recordDailyCheckIn();
    sound.tap();
    setVitals(prev => ({ ...prev, ...partial }));
  };

  const adjustWater = (delta: number) => {
    recordDailyCheckIn();
    sound.tap();
    setVitals(prev => ({
      ...prev,
      waterGlasses: Math.max(0, Math.min(20, prev.waterGlasses + delta)),
    }));
  };

  const setManualScoreOverride = (score: number | null) => {
    sound.tap();
    setVitals(prev => ({ ...prev, manualScoreOverride: score }));
  };

  // Reward Shop & Economy
  const purchaseReward = (rewardId: string): boolean => {
    recordDailyCheckIn();
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return false;

    const adjustedCost = Math.round(reward.coinCost * difficultyConfig.rewardCostMultiplier);

    if (economy.coins < adjustedCost) {
      sound.relapseAlert();
      return false;
    }

    sound.purchase();
    triggerBurstConfetti();

    const now = new Date();
    const log: PurchaseLog = {
      id: `p-${Date.now()}`,
      rewardId: reward.id,
      rewardName: reward.name,
      coinCost: adjustedCost,
      category: reward.category,
      timestamp: `${getTodayKey()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    };

    setEconomy(prev => ({
      ...prev,
      coins: prev.coins - adjustedCost,
      lifetimeSpent: prev.lifetimeSpent + adjustedCost,
    }));

    setPurchaseHistory(prev => [log, ...prev]);
    recordTransaction('spend', adjustedCost, `Redeemed: ${reward.name}`, reward.category || 'Reward');

    setRewards(prev =>
      prev.map(r => (r.id === rewardId ? { ...r, timesPurchased: r.timesPurchased + 1 } : r))
    );

    return true;
  };

  const addCustomReward = (data: Omit<RewardItem, 'id' | 'timesPurchased'>) => {
    sound.coin();
    const newReward: RewardItem = {
      ...data,
      id: `rew-${Date.now()}`,
      timesPurchased: 0,
    };
    setRewards(prev => [newReward, ...prev]);
  };

  const deleteReward = (rewardId: string) => {
    sound.tap();
    setRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  const logExpense = (expenseData: Omit<ExpenseRecord, 'id' | 'date'>) => {
    sound.tap();
    const newExp: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      date: getTodayKey(),
    };
    setExpenses(prev => [newExp, ...prev]);
    recordTransaction('spend', expenseData.amount, `Expense: ${expenseData.name}`, expenseData.category || 'Expense');
    setEconomy(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins - expenseData.amount),
      lifetimeSpent: prev.lifetimeSpent + expenseData.amount,
    }));
  };

  // Golden Token Vault: Premium Discipline Investment System
  const depositVault = (params: {
    coins: number;
    termDays: number;
    name?: string;
    isTimeCapsule?: boolean;
    timeCapsuleData?: {
      title: string;
      futureMessage: string;
      personalPromise: string;
      goal: string;
      rewardDescription: string;
      photoUrl?: string;
    };
  }): boolean => {
    recordDailyCheckIn();
    const { coins, termDays, name, isTimeCapsule, timeCapsuleData } = params;
    if (economy.coins < coins || coins <= 0) {
      sound.relapseAlert();
      return false;
    }

    sound.vaultDeposit();
    triggerConfetti(true);

    const termBaseRates: Record<number, number> = {
      7: 0.12,
      30: 0.35,
      90: 0.75,
      180: 1.50,
      365: 3.20,
    };
    const baseInterestRate = termBaseRates[termDays] || Number(((0.35 / 30) * termDays).toFixed(2));
    const initialMultiplier = Number((1 + baseInterestRate).toFixed(2));

    const currentScore = todayScore.score;
    let disciplineTier: 'maximum' | 'high' | 'normal' | 'reduced' | 'paused' = 'normal';
    let disciplineMultiplier = 1.0;

    if (currentScore >= 90) {
      disciplineTier = 'maximum';
      disciplineMultiplier = 1.5;
    } else if (currentScore >= 80) {
      disciplineTier = 'high';
      disciplineMultiplier = 1.25;
    } else if (currentScore >= 70) {
      disciplineTier = 'normal';
      disciplineMultiplier = 1.0;
    } else if (currentScore >= 60) {
      disciplineTier = 'reduced';
      disciplineMultiplier = 0.7;
    } else {
      disciplineTier = 'paused';
      disciplineMultiplier = 0.0;
    }

    const currentMultiplier = Number((1 + baseInterestRate * (disciplineMultiplier || 0.1)).toFixed(2));
    const totalMaturityExpected = Math.round(coins * (1 + baseInterestRate * Math.max(1.0, disciplineMultiplier)));
    const dailyGrowthCoins = Math.max(1, Math.round((totalMaturityExpected - coins) / Math.max(1, termDays)));

    const now = Date.now();
    const maturityEpoch = now + termDays * 86400000;

    const newVault: GoldenVault = {
      id: `vault-${Date.now()}`,
      name: name || (isTimeCapsule ? `Time Capsule Vault: ${timeCapsuleData?.title || 'Iron Oath'}` : `${termDays}-Day Discipline Certificate`),
      depositCoins: coins,
      termDays,
      startDate: getTodayKey(),
      maturityDate: getPastDateKey(-termDays),
      startTimestamp: now,
      maturityTimestamp: maturityEpoch,
      baseInterestRate,
      initialMultiplier,
      currentMultiplier,
      disciplineMultiplier,
      disciplineTier,
      dailyGrowthCoins,
      currentValue: coins,
      expectedMaturityValue: totalMaturityExpected,
      avgDayScoreSnapshot: currentScore,
      status: 'growing',
      reinvestCount: 0,
      isCustomDuration: ![7, 30, 90, 180, 365].includes(termDays),
      isTimeCapsule: !!isTimeCapsule,
      timeCapsuleData: isTimeCapsule && timeCapsuleData ? { ...timeCapsuleData } : undefined,
    };

    setEconomy(prev => ({
      ...prev,
      coins: prev.coins - coins,
      goldenTokens: prev.goldenTokens + (termDays >= 90 ? 2 : 1),
    }));

    setVaults(prev => [newVault, ...prev]);
    recordTransaction('spend', coins, `Vault Deposit: ${newVault.name}`, 'Vault');

    if (isTimeCapsule && timeCapsuleData) {
      const newCap: TimeCapsule = {
        id: `cap-${Date.now()}`,
        title: timeCapsuleData.title,
        futureMessage: timeCapsuleData.futureMessage,
        personalPromise: timeCapsuleData.personalPromise,
        goal: timeCapsuleData.goal,
        rewardDescription: timeCapsuleData.rewardDescription,
        startDate: getTodayKey(),
        targetDate: getPastDateKey(-termDays),
        lockedCoins: coins,
        createdAt: getTodayKey(),
        isUnlocked: false,
        bonusCoinsEarned: Math.round(coins * baseInterestRate * 1.2),
        photoUrl: timeCapsuleData.photoUrl,
        disciplineMultiplierBonus: disciplineMultiplier,
      };
      setCapsules(prev => [newCap, ...prev]);
    }

    return true;
  };

  const withdrawVault = (vaultId: string) => {
    const vault = vaults.find(v => v.id === vaultId);
    if (!vault || (vault.status !== 'growing' && vault.status !== 'matured')) return null;

    sound.levelUp();
    triggerBurstConfetti();

    const returnCoins = vault.expectedMaturityValue || Math.round(vault.depositCoins * vault.currentMultiplier);
    const bonusEarned = Math.max(0, returnCoins - vault.depositCoins);
    const goldenTokensEarned = vault.termDays >= 365 ? 5 : vault.termDays >= 180 ? 3 : vault.termDays >= 90 ? 2 : 1;

    setEconomy(prev => ({
      ...prev,
      coins: prev.coins + returnCoins,
      lifetimeEarned: prev.lifetimeEarned + bonusEarned,
      goldenTokens: prev.goldenTokens + goldenTokensEarned,
    }));

    setVaults(prev =>
      prev.map(v => (v.id === vaultId ? { ...v, status: 'withdrawn' as const } : v))
    );
    recordTransaction('earn', returnCoins, `Vault Return: ${vault.name}`, 'Vault');

    if (vault.isTimeCapsule) {
      setCapsules(prev =>
        prev.map(c =>
          c.title === vault.timeCapsuleData?.title
            ? { ...c, isUnlocked: true, unlockedAt: getTodayKey() }
            : c
        )
      );
    }

    return { coinsReturned: returnCoins, bonusEarned, goldenTokensEarned };
  };

  const reinvestVault = (vaultId: string, newTermDays?: number): boolean => {
    const vault = vaults.find(v => v.id === vaultId);
    if (!vault) return false;

    sound.vaultDeposit();
    triggerBurstConfetti();

    const chosenDays = newTermDays || vault.termDays;
    const termBaseRates: Record<number, number> = {
      7: 0.12,
      30: 0.35,
      90: 0.75,
      180: 1.50,
      365: 3.20,
    };
    const baseInterestRate = termBaseRates[chosenDays] || Number(((0.35 / 30) * chosenDays).toFixed(2));
    
    const stackBooster = 0.30 * (vault.reinvestCount + 1);
    const boostedMultiplier = Number((1 + baseInterestRate + stackBooster).toFixed(2));
    const newDeposit = vault.expectedMaturityValue || Math.round(vault.depositCoins * vault.currentMultiplier);

    const now = Date.now();
    const newVault: GoldenVault = {
      id: `vault-${Date.now()}`,
      name: `${vault.name} [Reinvested #${vault.reinvestCount + 1}]`,
      depositCoins: newDeposit,
      termDays: chosenDays,
      startDate: getTodayKey(),
      maturityDate: getPastDateKey(-chosenDays),
      startTimestamp: now,
      maturityTimestamp: now + chosenDays * 86400000,
      baseInterestRate,
      initialMultiplier: boostedMultiplier,
      currentMultiplier: boostedMultiplier,
      disciplineMultiplier: Math.max(1.2, vault.disciplineMultiplier + 0.15),
      disciplineTier: 'maximum',
      dailyGrowthCoins: Math.max(2, Math.round((newDeposit * boostedMultiplier - newDeposit) / chosenDays)),
      currentValue: newDeposit,
      expectedMaturityValue: Math.round(newDeposit * boostedMultiplier),
      avgDayScoreSnapshot: todayScore.score,
      status: 'growing',
      reinvestCount: vault.reinvestCount + 1,
      isCustomDuration: ![7, 30, 90, 180, 365].includes(chosenDays),
    };

    setEconomy(prev => ({
      ...prev,
      goldenTokens: prev.goldenTokens + 2,
    }));

    setVaults(prev => [
      newVault,
      ...prev.map(v => (v.id === vaultId ? { ...v, status: 'reinvested' as const } : v)),
    ]);

    return true;
  };

  const extendVaultTerm = (vaultId: string, additionalDays: number): boolean => {
    const vault = vaults.find(v => v.id === vaultId);
    if (!vault) return false;

    sound.coin();
    triggerConfetti(true);

    const updatedTerm = vault.termDays + additionalDays;
    const extensionBooster = 0.15;
    const updatedMultiplier = Number((vault.currentMultiplier + extensionBooster).toFixed(2));
    const updatedExpectedReturn = Math.round(vault.depositCoins * updatedMultiplier);

    setVaults(prev =>
      prev.map(v =>
        v.id === vaultId
          ? {
              ...v,
              termDays: updatedTerm,
              maturityDate: getPastDateKey(-updatedTerm),
              currentMultiplier: updatedMultiplier,
              expectedMaturityValue: updatedExpectedReturn,
              status: 'growing',
            }
          : v
      )
    );

    return true;
  };

  const simulateAdvanceVault = (vaultId: string, daysToAdvance: number) => {
    sound.vaultDeposit();
    triggerConfetti(true);

    setVaults(prev =>
      prev.map(v => {
        if (v.id !== vaultId) return v;
        const newCurrentVal = Math.min(
          v.expectedMaturityValue,
          Math.round(v.currentValue + v.dailyGrowthCoins * daysToAdvance)
        );
        const shouldMature = newCurrentVal >= v.expectedMaturityValue;
        return {
          ...v,
          currentValue: newCurrentVal,
          status: shouldMature ? 'matured' : v.status,
        };
      })
    );
  };

  // Time Capsule
  const createTimeCapsule = (capsuleData: Omit<TimeCapsule, 'id' | 'createdAt' | 'isUnlocked'>): boolean => {
    if (economy.coins < capsuleData.lockedCoins || capsuleData.lockedCoins <= 0) {
      sound.relapseAlert();
      return false;
    }

    sound.vaultDeposit();
    triggerConfetti(true);

    const newCapsule: TimeCapsule = {
      ...capsuleData,
      id: `cap-${Date.now()}`,
      startDate: getTodayKey(),
      createdAt: getTodayKey(),
      isUnlocked: false,
      bonusCoinsEarned: Math.round(capsuleData.lockedCoins * 0.45),
      disciplineMultiplierBonus: 1.25,
    };

    setEconomy(prev => ({
      ...prev,
      coins: prev.coins - capsuleData.lockedCoins,
      goldenTokens: prev.goldenTokens + 1,
    }));

    setCapsules(prev => [newCapsule, ...prev]);
    recordTransaction('spend', capsuleData.lockedCoins, `Time Capsule Lock: ${capsuleData.title}`, 'Vault');
    return true;
  };

  const unlockTimeCapsule = (
    capsuleId: string,
    data?: { achievedStatus?: 'yes' | 'partially' | 'no'; reflectionNotes?: string }
  ) => {
    const capsule = capsules.find(c => c.id === capsuleId);
    if (!capsule || capsule.isUnlocked) return;

    sound.levelUp();
    triggerBurstConfetti();

    let goalFactor = 1.0;
    if (data?.achievedStatus === 'yes') goalFactor = 1.35;
    else if (data?.achievedStatus === 'partially') goalFactor = 1.0;
    else if (data?.achievedStatus === 'no') goalFactor = 0.85;

    const baseBonus = capsule.bonusCoinsEarned || Math.round(capsule.lockedCoins * 0.45);
    const finalBonus = Math.round(baseBonus * goalFactor);
    const totalReturn = capsule.lockedCoins + finalBonus;

    grantXPAndCoins(250, totalReturn);
    recordTransaction('earn', totalReturn, `Time Capsule Unlocked: ${capsule.title}`, 'Vault');

    setEconomy(prev => ({
      ...prev,
      goldenTokens: prev.goldenTokens + (data?.achievedStatus === 'yes' ? 3 : 1),
    }));

    setCapsules(prev =>
      prev.map(c =>
        c.id === capsuleId
          ? {
              ...c,
              isUnlocked: true,
              unlockedAt: getTodayKey(),
              achievedStatus: data?.achievedStatus || 'yes',
              reflectionNotes: data?.reflectionNotes || c.reflectionNotes,
              bonusCoinsEarned: finalBonus,
            }
          : c
      )
    );
  };

  // Customizable Trophies / Achievements
  const claimAchievement = (achievementId: string) => {
    const ach = achievements.find(a => a.id === achievementId);
    if (!ach || ach.claimed) return;

    sound.levelUp();
    triggerBurstConfetti();

    grantXPAndCoins(ach.xpReward, ach.coinReward);
    recordTransaction('earn', ach.coinReward, `Achievement: ${ach.title}`, ach.category || 'Trophy');

    setAchievements(prev =>
      prev.map(a => (a.id === achievementId ? { ...a, claimed: true, isUnlocked: true } : a))
    );
  };

  const addCustomAchievement = (data: Omit<Achievement, 'id' | 'isUnlocked' | 'claimed'>) => {
    sound.coin();
    triggerConfetti(true);
    const newAch: Achievement = {
      ...data,
      id: `ach-${Date.now()}`,
      isUnlocked: data.progress >= data.maxProgress,
      claimed: false,
      isCustom: true,
      createdAt: getTodayKey(),
    };
    setAchievements(prev => [newAch, ...prev]);
  };

  const editAchievement = (id: string, partial: Partial<Achievement>) => {
    sound.tap();
    setAchievements(prev =>
      prev.map(a => {
        if (a.id !== id) return a;
        const updated = { ...a, ...partial };
        if (updated.progress !== undefined && updated.maxProgress !== undefined) {
          updated.isUnlocked = updated.progress >= updated.maxProgress;
        }
        return updated;
      })
    );
  };

  const deleteAchievement = (id: string) => {
    sound.tap();
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  // Loop Breaker Incident Logger
  const recordLoopIncident = (incidentData: Omit<LoopIncident, 'id' | 'date' | 'time'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newInc: LoopIncident = {
      ...incidentData,
      id: `loop-${Date.now()}`,
      date: getTodayKey(),
      time: timeStr,
      recoveredAtDate: getTodayKey(),
      recoveryDaysTaken: 1,
    };

    setLoopIncidents(prev => [newInc, ...prev]);

    // Give Recovery XP and Coins
    grantXPAndCoins(80, 50);
    recordTransaction('earn', 50, 'Loop Breaker Recovery Rescue', 'Recovery');

    setRecoveryStats(prev => ({
      ...prev,
      currentRecoveryStreak: prev.currentRecoveryStreak + 1,
      totalLoopsInterrupted: prev.totalLoopsInterrupted + 1,
    }));
  };

  // Discipline Timeframe Goals
  const toggleTimeframeGoal = (id: string) => {
    recordDailyCheckIn();
    sound.completeHabit();
    triggerConfetti(true);

    setTimeframeGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const nextDone = !g.completed;
        if (nextDone) {
          grantXPAndCoins(g.rewardXP, g.rewardCoins);
          recordTransaction('earn', g.rewardCoins, `Vision Goal: ${g.title}`, g.category || 'Goals');
        }
        return {
          ...g,
          completed: nextDone,
          currentValue: nextDone ? g.targetValue : Math.max(0, g.targetValue - 1),
        };
      })
    );
  };

  const addTimeframeGoal = (goalData: Omit<DisciplineTimeframeGoal, 'id' | 'completed'>) => {
    sound.coin();
    const newGoal: DisciplineTimeframeGoal = {
      ...goalData,
      id: `dtg-${Date.now()}`,
      completed: false,
    };
    setTimeframeGoals(prev => [...prev, newGoal]);
  };

  const deleteTimeframeGoal = (id: string) => {
    sound.tap();
    setTimeframeGoals(prev => prev.filter(g => g.id !== id));
  };

  // Personal Goals Engine
  const addGoal = (goalData: Omit<PersonalGoal, 'id' | 'createdAt'>) => {
    sound.coin();
    triggerConfetti();
    const isAlreadyComplete = goalData.progress >= 100 || goalData.status === 'completed';
    const newGoal: PersonalGoal = {
      ...goalData,
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: getTodayKey(),
      progress: Math.max(0, Math.min(100, goalData.progress ?? 0)),
      status: isAlreadyComplete ? 'completed' : goalData.status || 'not_started',
      completedAt: isAlreadyComplete ? (goalData.completedAt || getTodayKey()) : undefined,
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id: string, partial: Partial<PersonalGoal>) => {
    sound.tap();
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const updated = { ...g, ...partial };
        const isNowCompleted = (updated.progress >= 100 || updated.status === 'completed') && g.status !== 'completed';
        if (isNowCompleted) {
          sound.levelUp();
          triggerBurstConfetti();
          updated.status = 'completed';
          updated.progress = 100;
          updated.completedAt = updated.completedAt || getTodayKey();

          const coinReward = updated.rewardOnCompletion?.coins || 0;
          const xpReward = updated.rewardOnCompletion?.xp || 0;
          if (coinReward > 0 || xpReward > 0) {
            grantXPAndCoins(xpReward, coinReward);
            recordTransaction('earn', coinReward, `Goal Completed: ${updated.title}`, updated.category || 'Goals');
          }
        }
        return updated;
      })
    );
  };

  const updateGoalProgress = (id: string, progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== id) return g;
        const wasCompleted = g.status === 'completed';
        const isNowCompleted = clampedProgress >= 100;

        if (isNowCompleted && !wasCompleted) {
          sound.levelUp();
          triggerBurstConfetti();
          const coinReward = g.rewardOnCompletion?.coins || 0;
          const xpReward = g.rewardOnCompletion?.xp || 0;
          if (coinReward > 0 || xpReward > 0) {
            grantXPAndCoins(xpReward, coinReward);
            recordTransaction('earn', coinReward, `Goal Completed: ${g.title}`, g.category || 'Goals');
          }
          return {
            ...g,
            progress: 100,
            status: 'completed',
            completedAt: getTodayKey(),
          };
        } else if (!isNowCompleted) {
          sound.tap();
          return {
            ...g,
            progress: clampedProgress,
            status: clampedProgress > 0 ? 'in_progress' : (clampedProgress === 0 ? 'not_started' : g.status),
            completedAt: undefined,
          };
        } else {
          return {
            ...g,
            progress: 100,
          };
        }
      })
    );
  };

  const completeGoal = (id: string) => {
    updateGoalProgress(id, 100);
  };

  const deleteGoal = (id: string) => {
    sound.tap();
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateSettings = (partial: Partial<UserSettings>) => {
    sound.tap();
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const logFocusTime = (minutes: number, modeName: string, customCoins?: number, customXP?: number) => {
    sound.coin();
    triggerConfetti();

    const coinsEarned = typeof customCoins === 'number' && customCoins >= 0
      ? customCoins
      : Math.round((minutes / 10) * 12 * difficultyConfig.coinMultiplier);

    const xpEarned = typeof customXP === 'number' && customXP >= 0
      ? customXP
      : Math.round((minutes / 10) * 25 * difficultyConfig.xpMultiplier);

    grantXPAndCoins(xpEarned, coinsEarned);
    recordTransaction('earn', coinsEarned, `Focus Session: ${modeName} (${minutes}m)`, 'Focus');
  };

  const exportData = (): string => {
    return JSON.stringify({
      habits,
      badHabits,
      schedule,
      vitals,
      economy,
      rewards,
      purchaseHistory,
      expenses,
      transactions,
      vaults,
      capsules,
      achievements,
      settings,
      streak,
      loopIncidents,
      recoveryStats,
      timeframeGoals,
      goals,
      dayScoreHistory,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.habits) setHabits(parsed.habits);
      if (parsed.badHabits) setBadHabits(parsed.badHabits);
      if (parsed.schedule) setSchedule(parsed.schedule);
      if (parsed.vitals) setVitals(parsed.vitals);
      if (parsed.economy) setEconomy(parsed.economy);
      if (parsed.rewards) setRewards(parsed.rewards);
      if (parsed.purchaseHistory) setPurchaseHistory(parsed.purchaseHistory);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.vaults) setVaults(parsed.vaults);
      if (parsed.capsules) setCapsules(parsed.capsules);
      if (parsed.achievements) setAchievements(parsed.achievements);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.streak) setStreak(parsed.streak);
      if (parsed.loopIncidents) setLoopIncidents(parsed.loopIncidents);
      if (parsed.recoveryStats) setRecoveryStats(parsed.recoveryStats);
      if (parsed.timeframeGoals) setTimeframeGoals(parsed.timeframeGoals);
      if (parsed.goals) setGoals(parsed.goals);
      if (parsed.dayScoreHistory) setDayScoreHistory(parsed.dayScoreHistory);
      sound.levelUp();
      return true;
    } catch {
      sound.relapseAlert();
      return false;
    }
  };

  const resetAllData = () => {
    sound.relapseAlert();
    setHabits(INITIAL_HABITS);
    setBadHabits(INITIAL_BAD_HABITS);
    setSchedule(INITIAL_SCHEDULE);
    setVitals(INITIAL_VITALS);
    setEconomy(INITIAL_ECONOMY);
    setRewards(INITIAL_REWARDS);
    setPurchaseHistory([]);
    setExpenses([]);
    setTransactions(INITIAL_TRANSACTIONS);
    setVaults(INITIAL_VAULTS);
    setCapsules(INITIAL_CAPSULES);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setSettings(INITIAL_SETTINGS);
    setStreak(INITIAL_STREAK);
    setLoopIncidents(INITIAL_LOOP_INCIDENTS);
    setRecoveryStats(INITIAL_RECOVERY_STATS);
    setTimeframeGoals(INITIAL_TIMEFRAME_GOALS);
    setGoals(INITIAL_GOALS);
    setDayScoreHistory({});
  };

  const loadSampleData = () => {
    sound.levelUp();
    resetAllData();
  };

  const startNewLife = () => {
    sound.relapseAlert();
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }

    // Complete Day 1 reset to starter state
    setHabits([]);
    setBadHabits([]);
    setSchedule([]);
    setVitals({
      date: getTodayKey(),
      morningMood: 'good',
      morningEnergy: 80,
      waterLiters: 0,
      sleepHours: 0,
      sleepQuality: 'good',
      morningMission: '',
      eveningReflection: '',
      workoutDone: false,
      workoutMinutes: 0,
      workoutType: '',
      readingDone: false,
      readingMinutes: 0,
      focusMinutes: 0,
      journalText: '',
      recoveryMission: '',
    });
    setEconomy({
      coins: 0,
      lifetimeEarned: 0,
      lifetimeSpent: 0,
      goldenTokens: 0,
      xp: 0,
      level: 1,
      unlockedTitles: ['Initiate'],
      activeTitle: 'Initiate',
    });
    setRewards([]);
    setPurchaseHistory([]);
    setExpenses([]);
    setTransactions([]);
    setVaults([]);
    setCapsules([]);
    setAchievements([]);
    setSettings({
      ...INITIAL_SETTINGS,
      userName: 'Commander',
      userTitle: 'Sovereign',
    });
    setStreak({
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: getTodayKey(),
      todayClaimed: false,
      totalCoinsEarned: 0,
      streakHistory: [getTodayKey()],
    });
    setLoopIncidents([]);
    setRecoveryStats({
      currentRecoveryStreak: 0,
      fastestRecoveryDays: 0,
      averageRecoveryDays: 0,
      recoverySuccessRate: 100,
      totalLoopsInterrupted: 0,
    });
    setTimeframeGoals([]);
    setDayScoreHistory({});
    setActiveTabState('home');
    setIsOnboardingOpen(true);
  };

  return (
    <LifeOSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        habits,
        badHabits,
        schedule,
        vitals,
        economy,
        rewards,
        purchaseHistory,
        expenses,
        transactions,
        recordTransaction,
        vaults,
        capsules,
        achievements,
        settings,
        todayScore,
        dayScoreHistory,
        difficultyConfig,
        quickAddOpen,
        setQuickAddOpen,
        quickAddTab,
        setQuickAddTab,
        openQuickAdd,
        streak,
        streakToastMessage,
        setStreakToastMessage,
        recordDailyCheckIn,
        levelProgressionModalOpen,
        setLevelProgressionModalOpen,
        isLevelProgressionModalOpen: levelProgressionModalOpen,
        celebrationLevel,
        setCelebrationLevel,
        levelUpCelebrationLevel: celebrationLevel,
        setLevelUpCelebrationLevel: setCelebrationLevel,
        nameModalOpen,
        setNameModalOpen,
        isNameModalOpen: nameModalOpen,
        loopBreakerOpen,
        setLoopBreakerOpen,
        isLoopBreakerOpen: loopBreakerOpen,
        loopIncidents,
        recordLoopIncident,
        recoveryStats,
        timeframeGoals,
        toggleTimeframeGoal,
        addTimeframeGoal,
        deleteTimeframeGoal,
        goals,
        addGoal,
        updateGoal,
        updateGoalProgress,
        completeGoal,
        deleteGoal,
        toggleHabit,
        addHabit,
        editHabit,
        deleteHabit,
        recordRelapse,
        recordCleanDay,
        addBadHabit,
        deleteBadHabit,
        toggleScheduleTask,
        addScheduleTask,
        deleteScheduleTask,
        updateVitals,
        adjustWater,
        setManualScoreOverride,
        purchaseReward,
        addCustomReward,
        deleteReward,
        logExpense,
        depositVault,
        withdrawVault,
        reinvestVault,
        extendVaultTerm,
        simulateAdvanceVault,
        createTimeCapsule,
        unlockTimeCapsule,
        claimAchievement,
        addCustomAchievement,
        editAchievement,
        deleteAchievement,
        activeVaultForOpening,
        setActiveVaultForOpening,
        activeCapsuleForOpening,
        setActiveCapsuleForOpening,
        updateSettings,
        logFocusTime,
        exportData,
        importData,
        resetAllData,
        loadSampleData,
        startNewLife,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isStartNewLifeOpen,
        setIsStartNewLifeOpen,
        isSmartHelpOpen,
        setIsSmartHelpOpen,
        openSmartHelp,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
