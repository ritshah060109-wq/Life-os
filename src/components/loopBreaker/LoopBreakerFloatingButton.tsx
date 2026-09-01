import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Zap } from 'lucide-react';
import { sound } from '../../utils/soundAndHaptics';

interface LoopBreakerFloatingButtonProps {
  onClick: () => void;
  isTriggered?: boolean;
}

export const LoopBreakerFloatingButton: React.FC<LoopBreakerFloatingButtonProps> = ({
  onClick,
  isTriggered = false,
}) => {
  const handleClick = () => {
    sound.relapseAlert();
    onClick();
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-20 right-4 z-30"
      id="break-loop-floating-container"
    >
      <button
        id="break-the-loop-btn"
        onClick={handleClick}
        className={`group relative flex items-center gap-2 py-2.5 px-4 rounded-full font-black text-xs transition-all duration-300 shadow-2xl ${
          isTriggered
            ? 'bg-rose-600 text-white animate-pulse border-2 border-rose-300 shadow-rose-600/50'
            : 'bg-gradient-to-r from-red-500/90 via-rose-600/90 to-amber-600/90 hover:from-red-500 hover:to-amber-500 text-white border border-rose-400/40 shadow-rose-950/60 hover:scale-105 active:scale-95'
        } backdrop-blur-xl`}
      >
        {/* Subtle Halo Glow */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 to-amber-500 opacity-40 blur group-hover:opacity-75 transition-opacity" />

        <div className="relative z-10 flex items-center gap-1.5 font-mono tracking-wider">
          <span className="text-sm">🚨</span>
          <span className="font-extrabold uppercase tracking-wide">BREAK THE LOOP</span>
        </div>
      </button>
    </motion.div>
  );
};
