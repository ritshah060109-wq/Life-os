import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size, color }) => {
  // Try direct match or PascalCase
  const iconsMap = Icons as Record<string, React.FC<Icons.LucideProps> | undefined>;
  const IconComponent = iconsMap[name] || Icons.CircleDot;

  return <IconComponent className={className} size={size} color={color} />;
};
