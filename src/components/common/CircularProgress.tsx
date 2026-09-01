import React from 'react';
import { motion } from 'motion/react';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  gradientId?: string;
  gradientColors?: [string, string];
  trackColor?: string;
  children?: React.ReactNode;
  showGlow?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 10,
  color = '#F59E0B',
  gradientId,
  gradientColors,
  trackColor = 'rgba(255, 255, 255, 0.08)',
  children,
  showGlow = false,
}) => {
  const numericValue = typeof value === 'number' && !isNaN(value) && isFinite(value) ? value : 0;
  const clampedValue = Math.max(0, Math.min(100, numericValue));
  const radius = Math.max(1, (size - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const gid = gradientId || `grad-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`rotate-[-90deg] ${showGlow ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.45)]' : ''}`}
      >
        {gradientColors && (
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
          </defs>
        )}

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={gradientColors ? `url(#${gid})` : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
        />
      </svg>

      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
};
