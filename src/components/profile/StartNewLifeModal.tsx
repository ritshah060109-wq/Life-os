import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';
import { GlassCard } from '../common/GlassCard';
import { AlertTriangle, Trash2, RotateCcw, ShieldAlert, X, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundAndHaptics';

interface StartNewLifeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartNewLifeModal: React.FC<StartNewLifeModalProps> = ({ isOpen, onClose }) => {
  const { startNewLife } = useLifeOS();
  const [confirmText, setConfirmText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isMatch = confirmText.trim().toUpperCase() === 'RESET';

  const handleConfirm = () => {
    if (!isMatch || isProcessing) return;
    setIsProcessing(true);
    sound.relapseAlert();

    setTimeout(() => {
      startNewLife();
      setIsProcessing(false);
      setConfirmText('');
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="relative w-full max-w-md z-10"
        >
          <GlassCard className="p-5 sm:p-6 border-rose-500/40 bg-gradient-to-b from-rose-950/40 via-zinc-950/90 to-black space-y-4 shadow-2xl shadow-rose-950/50">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-wide">
                    Start New Life • Complete Reset
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Irreversible System Wipe
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Warning description */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-2 text-xs">
              <p className="text-rose-200 font-semibold leading-relaxed">
                Are you sure you want to start a new life? This action will permanently erase all your progress and cannot be undone.
              </p>
              <div className="text-[11px] text-zinc-300 space-y-1 pt-1 border-t border-rose-500/20">
                <p className="font-bold text-rose-300">The reset will erase everything:</p>
                <ul className="list-disc list-inside space-y-0.5 text-zinc-400 text-[10px]">
                  <li>Current Level, XP, Coins & Golden Tokens</li>
                  <li>All Habits, Bad Habits & 21-Day Challenges</li>
                  <li>Streaks, Recovery Streaks & Incident History</li>
                  <li>Schedule, Tasks, Focus Logs & Day Scores</li>
                  <li>Time Capsules, Golden Vaults & Reward Shop</li>
                  <li>Journal Entries, Missions & Custom Categories</li>
                </ul>
              </div>
            </div>

            {/* Confirmation input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">
                Type <span className="text-rose-400 font-mono font-black">RESET</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="Type RESET here..."
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-rose-500/40 text-white font-mono text-center tracking-widest text-sm uppercase placeholder:text-zinc-600 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-bold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!isMatch || isProcessing}
                onClick={handleConfirm}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg ${
                  isMatch && !isProcessing
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-900/50 cursor-pointer active:scale-98'
                    : 'bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed opacity-60'
                }`}
              >
                <Trash2 size={14} />
                <span>{isProcessing ? 'Erasing Data...' : 'Erase & Start New Life'}</span>
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
