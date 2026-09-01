import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Award, 
  Sparkles, 
  Trash2, 
  Save, 
  Coins, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Crown, 
  Gem, 
  Star, 
  Dumbbell, 
  BookOpenCheck, 
  Target, 
  Swords, 
  MoonStar, 
  Sun, 
  Rocket, 
  Heart,
  CheckCircle2
} from 'lucide-react';
import { Achievement, TrophyTier } from '../../types';
import { useLifeOS } from '../../context/LifeOSContext';

interface TrophyCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievementToEdit?: Achievement | null;
}

const AVAILABLE_ICONS = [
  { name: 'Award', component: Award },
  { name: 'Crown', component: Crown },
  { name: 'Flame', component: Flame },
  { name: 'ShieldCheck', component: ShieldCheck },
  { name: 'Zap', component: Zap },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Gem', component: Gem },
  { name: 'Star', component: Star },
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'BookOpenCheck', component: BookOpenCheck },
  { name: 'Target', component: Target },
  { name: 'Swords', component: Swords },
  { name: 'MoonStar', component: MoonStar },
  { name: 'Sun', component: Sun },
  { name: 'Rocket', component: Rocket },
  { name: 'Heart', component: Heart },
  { name: 'Coins', component: Coins },
];

const TIERS: { id: TrophyTier; label: string; bgGradient: string; border: string; glow: string; text: string }[] = [
  { id: 'bronze', label: 'Bronze', bgGradient: 'from-amber-900/40 via-amber-800/20 to-transparent', border: 'border-amber-700/50', glow: 'shadow-amber-900/20', text: 'text-amber-500' },
  { id: 'silver', label: 'Silver', bgGradient: 'from-slate-400/25 via-slate-500/10 to-transparent', border: 'border-slate-400/40', glow: 'shadow-slate-400/20', text: 'text-slate-300' },
  { id: 'gold', label: 'Gold', bgGradient: 'from-amber-500/30 via-yellow-500/15 to-transparent', border: 'border-amber-400/50', glow: 'shadow-amber-500/20', text: 'text-amber-400' },
  { id: 'platinum', label: 'Platinum', bgGradient: 'from-cyan-500/25 via-teal-500/10 to-transparent', border: 'border-cyan-400/50', glow: 'shadow-cyan-500/20', text: 'text-cyan-300' },
  { id: 'diamond', label: 'Diamond', bgGradient: 'from-sky-500/30 via-blue-500/15 to-transparent', border: 'border-sky-400/60', glow: 'shadow-sky-500/25', text: 'text-sky-300' },
  { id: 'obsidian', label: 'Obsidian', bgGradient: 'from-purple-900/40 via-neutral-900 to-transparent', border: 'border-purple-600/50', glow: 'shadow-purple-900/30', text: 'text-purple-300' },
  { id: 'amethyst', label: 'Amethyst', bgGradient: 'from-fuchsia-600/30 via-pink-600/15 to-transparent', border: 'border-fuchsia-500/50', glow: 'shadow-fuchsia-600/25', text: 'text-fuchsia-300' },
];

const CATEGORIES = ['Habits', 'Focus', 'Discipline', 'Reading', 'Workout', 'Sleep', 'Study', 'Special'];

export const TrophyCustomizerModal: React.FC<TrophyCustomizerModalProps> = ({
  isOpen,
  onClose,
  achievementToEdit,
}) => {
  const { addCustomAchievement, editAchievement, deleteAchievement } = useLifeOS();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Habits');
  const [customCategory, setCustomCategory] = useState('');
  const [tier, setTier] = useState<TrophyTier>('gold');
  const [selectedIcon, setSelectedIcon] = useState('Award');
  const [progress, setProgress] = useState(0);
  const [maxProgress, setMaxProgress] = useState(10);
  const [coinReward, setCoinReward] = useState(150);
  const [xpReward, setXpReward] = useState(300);

  useEffect(() => {
    if (achievementToEdit) {
      setTitle(achievementToEdit.title);
      setDescription(achievementToEdit.description);
      if (CATEGORIES.includes(achievementToEdit.category)) {
        setCategory(achievementToEdit.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(achievementToEdit.category);
      }
      setTier(achievementToEdit.tier || 'gold');
      setSelectedIcon(achievementToEdit.icon || 'Award');
      setProgress(achievementToEdit.progress);
      setMaxProgress(achievementToEdit.maxProgress);
      setCoinReward(achievementToEdit.coinReward);
      setXpReward(achievementToEdit.xpReward);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Habits');
      setCustomCategory('');
      setTier('gold');
      setSelectedIcon('Crown');
      setProgress(0);
      setMaxProgress(7);
      setCoinReward(200);
      setXpReward(400);
    }
  }, [achievementToEdit, isOpen]);

  if (!isOpen) return null;

  const currentTierConfig = TIERS.find(t => t.id === tier) || TIERS[2];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = category === 'Custom' ? (customCategory.trim() || 'Special') : category;

    if (achievementToEdit) {
      editAchievement(achievementToEdit.id, {
        title,
        description,
        category: finalCategory,
        tier,
        icon: selectedIcon,
        progress: Math.min(progress, maxProgress),
        maxProgress: Math.max(1, maxProgress),
        coinReward,
        xpReward,
      });
    } else {
      addCustomAchievement({
        title,
        description: description || 'Complete customized discipline target.',
        category: finalCategory,
        tier,
        icon: selectedIcon,
        progress: Math.min(progress, maxProgress),
        maxProgress: Math.max(1, maxProgress),
        coinReward,
        xpReward,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (achievementToEdit) {
      deleteAchievement(achievementToEdit.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="trophy-customizer-modal-backdrop" 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#09090b] border border-amber-500/30 p-4 sm:p-6 md:p-7 text-neutral-100 shadow-[0_0_40px_rgba(245,158,11,0.12)] my-auto no-scrollbar"
        >
          {/* Close button */}
          <button
            id="close-trophy-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5 pr-8">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {achievementToEdit ? 'Customize Trophy & Milestones' : 'Forge Custom Sovereign Trophy'}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                Design custom milestones, tiers, rewards, and icon badges
              </p>
            </div>
          </div>

          {/* Live Trophy Card Preview */}
          <div className={`p-4 rounded-xl border ${currentTierConfig.border} bg-gradient-to-r ${currentTierConfig.bgGradient} mb-5 relative overflow-hidden shadow-lg ${currentTierConfig.glow}`}>
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-xl bg-black/40 border ${currentTierConfig.border} flex items-center justify-center shadow-inner`}>
                {React.createElement(
                  AVAILABLE_ICONS.find(i => i.name === selectedIcon)?.component || Award,
                  { className: `w-6 h-6 ${currentTierConfig.text}` }
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-black/50 border ${currentTierConfig.border} ${currentTierConfig.text}`}>
                    {currentTierConfig.label} Tier
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {category === 'Custom' ? (customCategory || 'Custom') : category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1 truncate">
                  {title || 'Untitled Trophy'}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">
                  {description || 'Custom milestone criteria...'}
                </p>

                {/* Progress bar preview */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-yellow-300"
                      style={{ width: `${Math.min(100, Math.round((progress / Math.max(1, maxProgress)) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-300">
                    {progress}/{maxProgress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Trophy Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., 50-Day Cold Shower Monk"
                  required
                  className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Criteria / Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g., Complete 50 consecutive days of cold water exposure"
                  className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            {/* Tier Selection */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">Trophy Tier</label>
              <div className="grid grid-cols-4 gap-1.5">
                {TIERS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTier(t.id)}
                    className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border transition-all text-center ${
                      tier === t.id
                        ? `${t.border} bg-white/10 ${t.text} shadow-sm`
                        : 'border-white/5 bg-neutral-900 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">Choose Emblem</label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
                {AVAILABLE_ICONS.map(item => {
                  const IconComp = item.component;
                  const isSel = selectedIcon === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedIcon(item.name)}
                      className={`p-2 rounded-xl border flex-shrink-0 transition-all ${
                        isSel
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                          : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <IconComp size={16} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setCustomCategory('');
                    }}
                    className={`py-1 px-2.5 text-[11px] font-medium rounded-lg border transition-all ${
                      category === cat
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCategory('Custom')}
                  className={`py-1 px-2.5 text-[11px] font-medium rounded-lg border transition-all ${
                    category === 'Custom'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  Custom
                </button>
              </div>

              {category === 'Custom' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="mt-2 w-full text-xs bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              )}
            </div>

            {/* Progress & Rewards */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-neutral-900/70 border border-white/5 rounded-xl">
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">Current Progress</label>
                <input
                  type="number"
                  min="0"
                  max={maxProgress}
                  value={progress}
                  onChange={e => setProgress(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-xs font-bold bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">Target Count</label>
                <input
                  type="number"
                  min="1"
                  value={maxProgress}
                  onChange={e => setMaxProgress(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs font-bold bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">Coin Bounty</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={coinReward}
                    onChange={e => setCoinReward(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-bold bg-black/40 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-amber-300"
                  />
                  <Coins size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">XP Reward</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={xpReward}
                    onChange={e => setXpReward(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs font-bold bg-black/40 border border-white/10 rounded-lg pl-3 pr-7 py-2 text-cyan-300"
                  />
                  <Zap size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-2">
              {achievementToEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="py-3 px-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
              <button
                type="submit"
                id="save-trophy-btn"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Save size={15} />
                {achievementToEdit ? 'Save Trophy Customizations' : 'Forge Custom Trophy'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
