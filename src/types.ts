export type TabType = 'home' | 'plan' | 'economy' | 'progress' | 'profile';

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';
export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';
export type TaskPriority = 'high' | 'medium' | 'low';
export type DifficultyMode = 'easy' | 'normal' | 'hard' | 'extreme' | 'hardcore';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  reminder?: string;
  frequency: 'daily' | 'weekly';
  targetWeeklyDays?: number;
  difficulty: HabitDifficulty;
  coinReward: number;
  xpReward: number;
  notes?: string;
  streak: number;
  longestStreak: number;
  completedDates: string[]; // YYYY-MM-DD
  archived?: boolean;
}

export interface RelapseRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  reason: string;
  notes?: string;
}

export interface BadHabit {
  id: string;
  name: string;
  icon: string;
  color: string;
  quitDate: string; // YYYY-MM-DD
  challengeDaysTarget: number; // typically 21
  currentStreakDays: number;
  longestStreakDays: number;
  relapseCount: number;
  relapses: RelapseRecord[];
  successPercentage: number;
  recoveryBonusEligible: boolean;
  cleanDaysHistory: string[]; // dates recorded as clean
}

export interface ScheduleTask {
  id: string;
  title: string;
  timeSlot: TimeSlot;
  startTime?: string;
  endTime?: string;
  category: 'deep_work' | 'health' | 'learning' | 'personal' | 'routine' | 'recovery';
  priority: TaskPriority;
  repeat: 'daily' | 'weekdays' | 'none';
  completed: boolean;
  date: string; // YYYY-MM-DD
  durationMinutes?: number;
}

export interface DailyVitals {
  date: string;
  mood: number; // 1-5
  sleepHours: number; // e.g. 7.5
  sleepQuality: number; // 1-5
  waterGlasses: number; // target e.g. 8
  waterTarget: number;
  energyLevel: number; // 1-5
  screenTimeMinutes: number;
  workoutMinutes: number;
  journalText: string;
  morningMission: string;
  recoveryMission?: string;
  manualScoreOverride?: number | null;
}

export interface FocusSession {
  id: string;
  date: string;
  mode: 'pomodoro' | 'deepwork' | 'stopwatch' | 'break';
  durationMinutes: number;
  taskTitle?: string;
  completedAt: string;
}

export interface RewardItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  coinCost: number;
  category: 'Food' | 'Entertainment' | 'Shopping' | 'Learning' | 'Travel' | 'Luxury' | 'Custom';
  difficulty: HabitDifficulty;
  isAvailable: boolean;
  notes?: string;
  timesPurchased: number;
  imageUrl?: string;
}

export interface PurchaseLog {
  id: string;
  rewardId: string;
  rewardName: string;
  coinCost: number;
  category: string;
  timestamp: string;
}

export interface EconomyTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  label: string;
  category: string;
  timestamp: string;
  icon?: string;
  createdAt?: number;
}

export interface ExpenseRecord {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  reason: string;
  notes?: string;
}

export type VaultDisciplineTier = 'maximum' | 'high' | 'normal' | 'reduced' | 'paused';
export type TrophyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'obsidian' | 'amethyst';

export interface GoldenVault {
  id: string;
  name: string;
  depositCoins: number;
  termDays: number; // 7 | 30 | 90 | 180 | 365 | custom
  startDate: string; // YYYY-MM-DD
  maturityDate: string; // YYYY-MM-DD
  startTimestamp?: number; // epoch ms for countdown
  maturityTimestamp?: number;
  baseInterestRate: number; // e.g. 0.35 (35%)
  initialMultiplier: number;
  currentMultiplier: number;
  disciplineMultiplier: number;
  disciplineTier: VaultDisciplineTier;
  dailyGrowthCoins: number;
  currentValue: number;
  expectedMaturityValue: number;
  avgDayScoreSnapshot: number;
  status: 'growing' | 'matured' | 'completed' | 'withdrawn' | 'reinvested';
  reinvestCount: number;
  isCustomDuration?: boolean;
  isTimeCapsule?: boolean;
  timeCapsuleData?: {
    title: string;
    futureMessage: string;
    personalPromise: string;
    goal: string;
    rewardDescription: string;
    photoUrl?: string;
    achievedStatus?: 'yes' | 'partially' | 'no';
    reflectionNotes?: string;
  };
}

export interface TimeCapsule {
  id: string;
  title: string;
  futureMessage: string;
  personalPromise?: string;
  goal: string;
  rewardDescription: string;
  targetDate: string; // YYYY-MM-DD
  startDate?: string;
  lockedCoins: number;
  createdAt: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  bonusCoinsEarned?: number;
  photoUrl?: string;
  achievedStatus?: 'yes' | 'partially' | 'no';
  reflectionNotes?: string;
  disciplineMultiplierBonus?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'Habits' | 'Focus' | 'Reading' | 'Workout' | 'Study' | 'Sleep' | 'Discipline' | 'Special' | string;
  icon: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  coinReward: number;
  xpReward: number;
  claimed: boolean;
  tier?: TrophyTier;
  isCustom?: boolean;
  customCriteria?: string;
  createdAt?: string;
}

export interface DayScoreData {
  score: number; // 0-100
  letterGrade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  habitScore: number;
  scheduleScore: number;
  sleepScore: number;
  workoutScore: number;
  focusScore: number;
  moodScore: number;
  badHabitScore: number;
  screenTimeScore: number;
  isManualOverride: boolean;
}

export interface UserEconomy {
  coins: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  goldenTokens: number;
  xp: number;
  level: number;
  lifetimeXP?: number;
  highestLevel?: number;
  unlockedTitles?: string[];
  activeTitle?: string;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  todayClaimed: boolean;
  totalCoinsEarned: number;
  streakHistory: string[];
}

export type LoopTriggerReason =
  | 'Phone'
  | 'YouTube'
  | 'Instagram'
  | 'Gaming'
  | 'Low Energy'
  | 'Poor Sleep'
  | 'Overthinking'
  | 'Stress'
  | 'Friends'
  | 'No Motivation'
  | 'Forgot'
  | 'Other';

export interface LoopIncident {
  id: string;
  date: string;
  time: string;
  triggerReason: LoopTriggerReason;
  notes?: string;
  microActionChosen: string;
  completedRescueTimer: boolean;
  rescueDurationSeconds: number;
  recoveredAtDate?: string;
  recoveryDaysTaken?: number;
}

export interface RecoveryStats {
  currentRecoveryStreak: number;
  fastestRecoveryDays: number;
  averageRecoveryDays: number;
  recoverySuccessRate: number;
  totalLoopsInterrupted: number;
}

export interface DisciplineTimeframeGoal {
  id: string;
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  title: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  rewardCoins: number;
  rewardXP: number;
  category: 'Habits' | 'Focus' | 'Clean Living' | 'Fitness' | 'Mindset' | 'Finances';
}

export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalStatus = 'not_started' | 'in_progress' | 'completed';

export interface GoalReward {
  coins?: number;
  xp?: number;
  customRewardText?: string;
}

export interface PersonalGoal {
  id: string;
  title: string; // Goal Name
  description: string;
  category: string;
  priority: GoalPriority;
  targetDate: string; // YYYY-MM-DD
  progress: number; // 0 to 100 (%)
  status: GoalStatus;
  relatedHabits?: string[];
  rewardOnCompletion?: GoalReward;
  notes?: string;
  icon?: string;
  createdAt: string; // YYYY-MM-DD
  completedAt?: string; // YYYY-MM-DD
}

export interface DifficultyConfig {
  mode: DifficultyMode;
  title: string;
  description: string;
  coinMultiplier: number;
  xpMultiplier: number;
  penaltyMultiplier: number;
  dailyGoalFactor: number;
  rewardCostMultiplier: number;
}

export interface UserSettings {
  difficulty: DifficultyMode;
  theme: 'black';
  goldAccent: boolean;
  glassIntensity: number; // 0.2 to 1.0
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  notificationsEnabled: boolean;
  userName: string;
  userTitle?: string;
  userCallsign?: string;
  nameTemplate?: string;
  avatarSeed: string;
  timeSyncMode?: 'auto' | 'manual';
  manualDate?: string; // YYYY-MM-DD
  manualTime?: string; // HH:mm
  lastCloudSyncTimestamp?: number;
  authUid?: string;
  authEmail?: string;
  authDisplayName?: string;
  authPhotoURL?: string;
  isGuest?: boolean;
}

export type ActivityCategory =
  | 'All'
  | 'Habits'
  | 'Bad Habits'
  | 'Schedule'
  | 'Focus'
  | 'Economy'
  | 'Achievements'
  | 'Progress'
  | 'Settings'
  | 'System'
  | 'Auth';

export interface ActivityLogItem {
  id: string;
  timestamp: string; // ISO string or epoch
  date: string; // YYYY-MM-DD
  time: string; // HH:mm:ss
  category: Exclude<ActivityCategory, 'All'>;
  relatedFeature: string; // e.g. "Keystone Habit", "Day Score", "Golden Vault", "Rescue Protocol", etc.
  eventTitle: string; // e.g. "Habit Completed: Morning Cold Shower"
  description: string; // detailed description
  icon?: string; // lucide icon name or emoji
  coinsChange?: number; // +30 or -50
  xpChange?: number; // +50
  badgeColor?: 'amber' | 'emerald' | 'rose' | 'indigo' | 'cyan' | 'purple';
  metadata?: Record<string, any>;
}

export type QuickAddSectionType = 'task' | 'habit' | 'bad_habit' | 'vitals' | 'reward';


