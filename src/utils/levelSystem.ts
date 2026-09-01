// RPG Level Progression & Titles Engine
import { UserEconomy } from '../types';

export interface LevelMilestone {
  level: number;
  title: string;
  bonusCoins: number;
  bonusGoldenTokens: number;
  badgeName: string;
  perkDescription: string;
  unlockedTitle?: string;
}

export const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 1, title: 'Beginner', bonusCoins: 0, bonusGoldenTokens: 0, badgeName: 'Initiate Crest', perkDescription: 'Journey to Life Mastery begins', unlockedTitle: 'Beginner' },
  { level: 5, title: 'Explorer', bonusCoins: 500, bonusGoldenTokens: 1, badgeName: 'Explorer Compass', perkDescription: 'Unlocked Explorer title + 500 coins', unlockedTitle: 'Explorer' },
  { level: 10, title: 'Disciplined', bonusCoins: 1000, bonusGoldenTokens: 2, badgeName: 'Golden Chest of Focus', perkDescription: 'Golden Chest + Disciplined title', unlockedTitle: 'Disciplined' },
  { level: 20, title: 'Achiever', bonusCoins: 2000, bonusGoldenTokens: 5, badgeName: 'Golden Token Cache', perkDescription: '5 Golden Tokens + Achiever title', unlockedTitle: 'Achiever' },
  { level: 30, title: 'Unstoppable', bonusCoins: 3000, bonusGoldenTokens: 3, badgeName: 'Exclusive Unstoppable Badge', perkDescription: 'Exclusive badge + 3 Golden Tokens', unlockedTitle: 'Unstoppable' },
  { level: 35, title: 'Warrior', bonusCoins: 3500, bonusGoldenTokens: 4, badgeName: 'Iron Will Crest', perkDescription: 'Warrior title + 3,500 coins', unlockedTitle: 'Warrior' },
  { level: 50, title: 'Elite', bonusCoins: 5000, bonusGoldenTokens: 10, badgeName: 'Elite Sovereign Ring', perkDescription: 'Elite title + 5,000 Coins + 10 Golden Tokens', unlockedTitle: 'Elite' },
  { level: 75, title: 'Legend', bonusCoins: 7500, bonusGoldenTokens: 15, badgeName: 'Legendary Halo', perkDescription: 'Legend rank + 7,500 Coins + 15 Tokens', unlockedTitle: 'Legend' },
  { level: 100, title: 'Life Master', bonusCoins: 10000, bonusGoldenTokens: 25, badgeName: 'Life Master Crown', perkDescription: 'Grand Life Master ascension + 10,000 Coins + 25 Tokens', unlockedTitle: 'Life Master' },
];

export const PLAYER_TITLES: { levelReq: number; title: string; desc: string }[] = [
  { levelReq: 1, title: 'Beginner', desc: 'Starting the journey of life optimization' },
  { levelReq: 5, title: 'Explorer', desc: 'Discovering habits, schedules, and focus routines' },
  { levelReq: 10, title: 'Disciplined', desc: 'Forming ironclad daily consistency' },
  { levelReq: 20, title: 'Achiever', desc: 'Consistently hitting targets and expanding horizons' },
  { levelReq: 35, title: 'Warrior', desc: 'Overcoming resistance, relapses, and fatigue' },
  { levelReq: 50, title: 'Elite', desc: 'Top-tier consistency and self-sovereignty' },
  { levelReq: 75, title: 'Legend', desc: 'Unbroken focus and relentless mastery' },
  { levelReq: 100, title: 'Life Master', desc: 'The pinnacle of sovereign self-mastery' },
];

/**
 * Calculates XP required to reach next level
 * Base: Level 1 -> 2 is 500 XP.
 * Scaled formula: 500 XP per level
 */
export const getXPForLevel = (level: number): number => {
  return level * 500;
};

/**
 * Total cumulative XP required to reach a specific level
 */
export const getTotalXPForLevel = (level: number): number => {
  let sum = 0;
  for (let l = 1; l < level; l++) {
    sum += getXPForLevel(l);
  }
  return sum;
};

/**
 * Calculate level and progress from total lifetime XP
 */
export const calculateLevelFromTotalXP = (totalXP: number): {
  level: number;
  currentLevelXP: number;
  requiredXPForNext: number;
  progressPct: number;
} => {
  let level = 1;
  const safeXP = typeof totalXP === 'number' && !isNaN(totalXP) ? Math.max(0, totalXP) : 0;
  let remainingXP = safeXP;

  while (true) {
    const needed = getXPForLevel(level);
    if (remainingXP >= needed && level < 100) {
      remainingXP -= needed;
      level++;
    } else {
      break;
    }
  }

  const requiredXPForNext = getXPForLevel(level) || 100;
  const progressPct = Math.min(100, Math.round((remainingXP / requiredXPForNext) * 100));

  return {
    level,
    currentLevelXP: remainingXP,
    requiredXPForNext,
    progressPct: isNaN(progressPct) ? 0 : progressPct,
  };
};

/**
 * Calculates coin reward for reaching a level: Level × 100 Coins
 */
export const getLevelCoinReward = (level: number): number => {
  return level * 100;
};

/**
 * Checks if a level grants special milestone bonuses (every 10 levels or special ranks)
 */
export const getMilestoneForLevel = (level: number): LevelMilestone | undefined => {
  return LEVEL_MILESTONES.find(m => m.level === level);
};

/**
 * Returns all unlocked titles based on player level
 */
export const getUnlockedTitlesForLevel = (level: number): string[] => {
  return PLAYER_TITLES.filter(t => t.levelReq <= level).map(t => t.title);
};
