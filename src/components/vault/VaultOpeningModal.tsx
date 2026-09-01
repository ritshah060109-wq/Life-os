import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Lock, 
  Unlock, 
  Coins, 
  Award, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { GoldenVault, TimeCapsule } from '../../types';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';

interface VaultOpeningModalProps {
  vault: GoldenVault | null;
  capsule?: TimeCapsule | null;
  onClose: () => void;
  onReinvest?: (vaultId: string) => void;
}

export const VaultOpeningModal: React.FC<VaultOpeningModalProps> = ({
  vault,
  capsule,
  onClose,
  onReinvest,
}) => {
  const { withdrawVault, unlockTimeCapsule } = useLifeOS();
  const [phase, setPhase] = useState<'locked' | 'unsealing' | 'unveiled'>('locked');
  const [achievedGoal, setAchievedGoal] = useState<'yes' | 'partially' | 'no'>('yes');
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [withdrawnStats, setWithdrawnStats] = useState<{
    coinsReturned: number;
    bonusEarned: number;
    goldenTokensEarned: number;
  } | null>(null);

  if (!vault && !capsule) return null;

  const isCapsule = !!capsule || !!vault?.isTimeCapsule;
  const depositCoins = vault?.depositCoins || capsule?.lockedCoins || 0;
  const expectedReturn = vault?.expectedMaturityValue || (depositCoins + (capsule?.bonusCoinsEarned || Math.round(depositCoins * 0.45)));
  const termDays = vault?.termDays || 30;

  const handleStartUnseal = () => {
    setPhase('unsealing');
    setTimeout(() => {
      if (vault) {
        const res = withdrawVault(vault.id);
        if (res) setWithdrawnStats(res);
      }
      if (capsule) {
        unlockTimeCapsule(capsule.id, {
          achievedStatus: achievedGoal,
          reflectionNotes,
        });
      }
      setPhase('unveiled');
    }, 1800);
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        id="vault-opening-modal-backdrop" 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-[460px] max-h-[85vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#09090b] border border-amber-500/30 p-3.5 sm:p-5 text-neutral-100 shadow-[0_0_50px_rgba(245,158,11,0.15)] my-auto no-scrollbar"
        >
          {/* Close button */}
          <button
            id="close-vault-opening-btn"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Ambient light glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {phase === 'locked' && (
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Vault Medallion */}
              <div className="relative flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center animate-spin-slow">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-amber-400/30 border border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Lock className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-bounce" />
              </div>

              <div>
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2">
                  {isCapsule ? 'Time Capsule Unsealing' : 'Discipline Maturity Unlocked'}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {vault?.name || capsule?.title || 'Golden Token Vault'}
                </h2>
                <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto">
                  {isCapsule
                    ? 'Your sealed oath and locked treasure are ready to be unveiled to your future self.'
                    : `You sustained iron discipline for ${termDays} days. Harvest your compound reward now.`}
                </p>
              </div>

              {/* Stats Preview Card */}
              <div className="w-full grid grid-cols-3 gap-2.5 bg-neutral-900/80 border border-white/5 rounded-xl p-3.5">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Locked</span>
                  <span className="text-base font-bold text-neutral-200 mt-0.5">{depositCoins}</span>
                  <span className="text-[10px] text-neutral-400">Coins</span>
                </div>
                <div className="flex flex-col items-center border-x border-white/5">
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider">Discipline Boost</span>
                  <span className="text-base font-bold text-amber-300 mt-0.5">
                    +{vault?.disciplineMultiplier ? Math.round((vault.disciplineMultiplier - 1) * 100) : 45}%
                  </span>
                  <span className="text-[10px] text-amber-400">Rate</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider">Total Harvest</span>
                  <span className="text-base font-bold text-emerald-400 mt-0.5">+{expectedReturn}</span>
                  <span className="text-[10px] text-emerald-400">Coins</span>
                </div>
              </div>

              {isCapsule && (
                <div className="w-full text-left space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    Did you conquer your stated goal?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['yes', 'partially', 'no'] as const).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAchievedGoal(opt)}
                        className={`py-2 px-2 text-xs font-medium rounded-lg border transition-all ${
                          achievedGoal === opt
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                            : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {opt === 'yes' ? ' Conquered (+35%)' : opt === 'partially' ? ' Partial' : ' Missed'}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-medium text-neutral-400 block mb-1">
                      Reflection Notes (Optional):
                    </label>
                    <textarea
                      value={reflectionNotes}
                      onChange={e => setReflectionNotes(e.target.value)}
                      placeholder="What did you learn from this discipline cycle?"
                      rows={2}
                      className="w-full text-xs bg-neutral-900 border border-white/10 rounded-lg p-2.5 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
              )}

              <button
                id="unseal-vault-action-btn"
                onClick={handleStartUnseal}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Unseal Vault & Harvest Treasure
              </button>
            </div>
          )}

          {phase === 'unsealing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="w-32 h-32 rounded-full border-4 border-dashed border-amber-400/60 flex items-center justify-center"
                >
                  <div className="w-24 h-24 rounded-full bg-amber-500/20 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-amber-300" />
                  </div>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Coins className="w-8 h-8 text-amber-400 animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">Breaking Discipline Seal...</h3>
                <p className="text-xs text-neutral-400 mt-1">Compounding dividends and updating sovereign ledger</p>
              </div>
            </div>
          )}

          {phase === 'unveiled' && (
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Unlocked Badge */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-amber-500/30 border border-emerald-400/50 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Harvest Complete
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
                  Vault Successfully Unlocked!
                </h2>
              </div>

              {/* Rewards Harvested Box */}
              <div className="w-full bg-gradient-to-b from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-xs text-neutral-400">Total Coins Added</span>
                  <span className="text-xl font-black text-amber-400 flex items-center gap-1.5">
                    <Coins className="w-5 h-5 text-amber-400" />
                    +{withdrawnStats?.coinsReturned || expectedReturn}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Net Discipline Dividend</span>
                  <span className="font-semibold text-emerald-400">
                    +{withdrawnStats?.bonusEarned || (expectedReturn - depositCoins)} Coins
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Golden Tokens Awarded</span>
                  <span className="font-semibold text-amber-300 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    +{withdrawnStats?.goldenTokensEarned || 2} Tokens
                  </span>
                </div>
              </div>

              {/* Time Capsule Message Display */}
              {isCapsule && (capsule?.futureMessage || vault?.timeCapsuleData?.futureMessage) && (
                <div className="w-full text-left bg-neutral-900/90 border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <HeartHandshake className="w-4 h-4" />
                    Message from Past You:
                  </div>
                  <p className="text-xs text-neutral-200 italic leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                    "{capsule?.futureMessage || vault?.timeCapsuleData?.futureMessage}"
                  </p>
                  {(capsule?.personalPromise || vault?.timeCapsuleData?.personalPromise) && (
                    <div className="text-[11px] text-neutral-400 pt-1">
                      <span className="text-neutral-300 font-medium">Promise Kept: </span>
                      {capsule?.personalPromise || vault?.timeCapsuleData?.personalPromise}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full grid grid-cols-1 gap-2.5">
                {onReinvest && vault && (
                  <button
                    id="reinvest-matured-vault-btn"
                    onClick={() => {
                      onReinvest(vault.id);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reinvest into Compound Vault (+30% Bonus Booster)
                  </button>
                )}
                <button
                  id="done-harvest-vault-btn"
                  onClick={handleFinish}
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  Collect & Return to Command Center
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
