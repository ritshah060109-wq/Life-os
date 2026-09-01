import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Lock, 
  Sparkles, 
  Coins, 
  Flame, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Image as ImageIcon,
  HeartHandshake,
  Award
} from 'lucide-react';
import { useLifeOS } from '../../context/LifeOSContext';

interface GoldenVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'vault' | 'capsule';
}

const DURATION_PRESETS = [
  { days: 7, label: '7 Days', baseRate: 0.12, description: 'Rapid Sprint Certificate' },
  { days: 30, label: '30 Days', baseRate: 0.35, description: 'Standard Habit Mastery' },
  { days: 90, label: '90 Days', baseRate: 0.75, description: 'Quarterly Metamorphosis' },
  { days: 180, label: '180 Days', baseRate: 1.50, description: 'Semi-Annual Sovereign Vault' },
  { days: 365, label: '365 Days', baseRate: 3.20, description: 'Annual Grand Legacy Vault' },
];

export const GoldenVaultModal: React.FC<GoldenVaultModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'vault',
}) => {
  const { economy, todayScore, depositVault } = useLifeOS();

  const [mode, setMode] = useState<'vault' | 'capsule'>(initialMode);
  const [tokenName, setTokenName] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [isCustomDays, setIsCustomDays] = useState(false);
  const [customDaysInput, setCustomDaysInput] = useState<number>(45);

  // Time Capsule Fields
  const [capsuleTitle, setCapsuleTitle] = useState('');
  const [futureMessage, setFutureMessage] = useState('');
  const [personalPromise, setPersonalPromise] = useState('');
  const [goal, setGoal] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  if (!isOpen) return null;

  const currentScore = todayScore.score;
  let disciplineMultiplier = 1.0;
  let disciplineTierLabel = 'Normal (1.0x)';
  let disciplineTierColor = 'text-blue-400';

  if (currentScore >= 90) {
    disciplineMultiplier = 1.5;
    disciplineTierLabel = 'Maximum (+50% Rate Booster)';
    disciplineTierColor = 'text-amber-400';
  } else if (currentScore >= 80) {
    disciplineMultiplier = 1.25;
    disciplineTierLabel = 'High (+25% Rate Booster)';
    disciplineTierColor = 'text-emerald-400';
  } else if (currentScore >= 70) {
    disciplineMultiplier = 1.0;
    disciplineTierLabel = 'Normal (Standard Growth)';
    disciplineTierColor = 'text-blue-400';
  } else if (currentScore >= 60) {
    disciplineMultiplier = 0.7;
    disciplineTierLabel = 'Reduced (Slow Growth)';
    disciplineTierColor = 'text-yellow-500';
  } else {
    disciplineMultiplier = 0.0;
    disciplineTierLabel = 'Paused (Improve Day Score)';
    disciplineTierColor = 'text-rose-500';
  }

  const activeDays = isCustomDays ? Math.max(1, customDaysInput) : selectedDuration;
  const preset = DURATION_PRESETS.find(p => p.days === activeDays);
  const baseRate = preset ? preset.baseRate : Number(((0.35 / 30) * activeDays).toFixed(2));
  const effectiveMultiplier = Number((1 + baseRate * Math.max(1.0, disciplineMultiplier)).toFixed(2));
  const expectedReturn = Math.round(depositAmount * effectiveMultiplier);
  const dailyGrowth = Math.max(1, Math.round((expectedReturn - depositAmount) / activeDays));

  const handleQuickAmount = (amt: number) => {
    setDepositAmount(Math.min(economy.coins, amt));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0 || depositAmount > economy.coins) return;

    if (mode === 'capsule') {
      depositVault({
        coins: depositAmount,
        termDays: activeDays,
        name: capsuleTitle || 'Time Capsule Vault',
        isTimeCapsule: true,
        timeCapsuleData: {
          title: capsuleTitle || 'Sovereign Promise Capsule',
          futureMessage: futureMessage || 'Remember the vision you held when locking this vault.',
          personalPromise: personalPromise || 'Stay consistent and conquer resistance.',
          goal: goal || 'Reach next discipline tier',
          rewardDescription: rewardDescription || 'Discipline harvest + Title',
          photoUrl: photoUrl || undefined,
        },
      });
    } else {
      depositVault({
        coins: depositAmount,
        termDays: activeDays,
        name: tokenName || `${activeDays}-Day Sovereign Vault`,
        isTimeCapsule: false,
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        id="golden-vault-modal-backdrop" 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[460px] max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#09090b] border border-amber-500/30 p-3.5 sm:p-5 text-neutral-100 shadow-[0_0_40px_rgba(245,158,11,0.12)] my-auto no-scrollbar"
        >
          {/* Close button */}
          <button
            id="close-vault-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 sm:mb-5 pr-8">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {mode === 'vault' ? 'Deposit into Golden Token Vault' : 'Forge Sealed Time Capsule'}
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                Discipline-multiplied sovereign investment & future commitment
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-900 border border-white/5 rounded-xl mb-5">
            <button
              type="button"
              id="switch-to-vault-mode-btn"
              onClick={() => setMode('vault')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'vault'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Coins size={14} />
              Standard Golden Vault
            </button>
            <button
              type="button"
              id="switch-to-capsule-mode-btn"
              onClick={() => setMode('capsule')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'capsule'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <HeartHandshake size={14} />
              Time Capsule (Vault + Oath)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vault / Capsule Name */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                {mode === 'vault' ? 'Token / Vault Name' : 'Capsule Title'}
              </label>
              <input
                type="text"
                value={mode === 'vault' ? tokenName : capsuleTitle}
                onChange={e => mode === 'vault' ? setTokenName(e.target.value) : setCapsuleTitle(e.target.value)}
                placeholder={mode === 'vault' ? 'e.g., 30-Day Master Discipline Vault' : 'e.g., Letter to My 50-Day Future Self'}
                className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Deposit Coins */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-medium text-neutral-300">Deposit Amount (Coins)</label>
                <span className="text-neutral-400">
                  Available: <strong className="text-amber-400">{economy.coins}</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="10"
                  max={economy.coins}
                  value={depositAmount || ''}
                  onChange={e => setDepositAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full text-sm font-bold bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-amber-300 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
                />
                <Coins className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex items-center gap-1.5 mt-2">
                {[100, 250, 500, 1000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    disabled={economy.coins < amt}
                    className="flex-1 py-1 text-[11px] font-medium bg-white/5 border border-white/5 rounded-lg text-neutral-300 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    {amt}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleQuickAmount(economy.coins)}
                  className="py-1 px-2.5 text-[11px] font-semibold bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 hover:bg-amber-500/30 transition-colors"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1.5">
                Lock Duration & Growth Rate
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DURATION_PRESETS.map(p => (
                  <button
                    key={p.days}
                    type="button"
                    onClick={() => {
                      setSelectedDuration(p.days);
                      setIsCustomDays(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      !isCustomDays && selectedDuration === p.days
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm shadow-amber-500/10'
                        : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{p.label}</div>
                    <div className="text-[10px] text-amber-400 font-medium mt-0.5">
                      +{Math.round(p.baseRate * 100)}% Base Rate
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomDays(true)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isCustomDays
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm shadow-amber-500/10'
                      : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="text-xs font-bold text-white">Custom</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">Flexible Days</div>
                </button>
              </div>

              {isCustomDays && (
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Lock for:</span>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={customDaysInput}
                    onChange={e => setCustomDaysInput(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-xs font-bold bg-neutral-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-xs text-neutral-400">Days</span>
                </div>
              )}
            </div>

            {/* Time Capsule Specific Fields */}
            {mode === 'capsule' && (
              <div className="space-y-3 p-3.5 bg-neutral-900/90 border border-white/5 rounded-xl">
                <div>
                  <label className="text-[11px] font-semibold text-amber-400 block mb-1">
                    Future Message (Words to your future self)
                  </label>
                  <textarea
                    value={futureMessage}
                    onChange={e => setFutureMessage(e.target.value)}
                    placeholder="Write a heartfelt message to your future self when this capsule unlocks..."
                    rows={2}
                    className="w-full text-xs bg-black/40 border border-white/10 rounded-lg p-2.5 text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-300 block mb-1">
                      Personal Promise
                    </label>
                    <input
                      type="text"
                      value={personalPromise}
                      onChange={e => setPersonalPromise(e.target.value)}
                      placeholder="e.g. Zero relapses on dopamine"
                      className="w-full text-xs bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-300 block mb-1">
                      Stated Goal
                    </label>
                    <input
                      type="text"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      placeholder="e.g. Hit 90+ Day Score avg"
                      className="w-full text-xs bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-300 block mb-1">
                      Reward Unlocked
                    </label>
                    <input
                      type="text"
                      value={rewardDescription}
                      onChange={e => setRewardDescription(e.target.value)}
                      placeholder="e.g. Smartwatch upgrade"
                      className="w-full text-xs bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-white placeholder:text-neutral-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-neutral-300 block mb-1">
                      Attach Photo (Optional)
                    </label>
                    <label className="flex items-center justify-center gap-1.5 w-full py-2 px-2 text-xs bg-white/5 border border-white/10 rounded-lg text-neutral-300 hover:bg-white/10 cursor-pointer">
                      <ImageIcon size={14} className="text-amber-400" />
                      <span>{photoUrl ? 'Photo Loaded' : 'Upload Cover'}</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Live Calculation / Discipline Breakdown */}
            <div className="p-3.5 bg-neutral-900/60 border border-amber-500/20 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Flame size={13} className="text-amber-400" />
                  Your Discipline Multiplier:
                </span>
                <span className={`font-semibold ${disciplineTierColor}`}>
                  {disciplineTierLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1">
                  <TrendingUp size={13} className="text-emerald-400" />
                  Est. Daily Growth:
                </span>
                <span className="font-semibold text-emerald-400">
                  +{dailyGrowth} Coins/day
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/5">
                <span className="text-neutral-300 font-medium">Expected Maturity Value:</span>
                <span className="text-base font-black text-amber-400 flex items-center gap-1">
                  <Coins size={16} />
                  {expectedReturn} Coins
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="confirm-deposit-vault-btn"
              disabled={depositAmount <= 0 || depositAmount > economy.coins}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
            >
              <Lock size={15} />
              {mode === 'vault' ? `Lock ${depositAmount} Coins for ${activeDays} Days` : `Seal Time Capsule (${depositAmount} Coins)`}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
