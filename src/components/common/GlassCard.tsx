import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { useLifeOS } from '../../context/LifeOSContext';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'flat' | 'glow';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  id,
  ...props
}) => {
  const { settings } = useLifeOS();
  const isLight = settings.theme === 'white';

  let baseStyle = '';
  if (isLight) {
    if (variant === 'gold') {
      baseStyle = 'bg-amber-50 border border-amber-200 shadow-sm';
    } else if (variant === 'glow') {
      baseStyle = 'bg-white border border-amber-300/60 shadow-md shadow-amber-500/10';
    } else if (variant === 'flat') {
      baseStyle = 'bg-zinc-50 border border-zinc-200';
    } else {
      baseStyle = 'bg-white border border-zinc-200 shadow-sm';
    }
  } else {
    if (variant === 'gold') {
      baseStyle = 'bg-gradient-to-b from-[#18140C] to-[#0E0C08] border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]';
    } else if (variant === 'glow') {
      baseStyle = 'bg-[#101015] border border-amber-500/35 shadow-[0_0_18px_rgba(245,158,11,0.1)]';
    } else if (variant === 'flat') {
      baseStyle = 'bg-[#0B0B0E] border border-white/[0.05]';
    } else {
      baseStyle = 'bg-[#0D0D11] border border-white/[0.07] shadow-[0_4px_20px_rgba(0,0,0,0.4)]';
    }
  }

  return (
    <motion.div
      id={id}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      className={`rounded-2xl p-4 transition-all duration-150 ${baseStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

