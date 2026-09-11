import React from 'react';
import { SeverityLevel } from '../types';
import { AlertOctagon, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showPulse = true,
}) => {
  const configs = {
    CRITICAL: {
      bg: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-300/60',
      dot: 'bg-red-600',
      icon: AlertOctagon,
      label: 'CRITICAL SEVERITY',
      pulse: 'bg-red-400',
    },
    HIGH: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-300/50',
      dot: 'bg-amber-600',
      icon: AlertTriangle,
      label: 'HIGH SEVERITY',
      pulse: 'bg-amber-400',
    },
    MEDIUM: {
      bg: 'bg-yellow-50 text-yellow-800 border-yellow-200 ring-1 ring-yellow-300/40',
      dot: 'bg-yellow-600',
      icon: AlertCircle,
      label: 'MEDIUM SEVERITY',
      pulse: 'bg-yellow-400',
    },
    LOW: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-300/40',
      dot: 'bg-emerald-600',
      icon: Info,
      label: 'LOW SEVERITY',
      pulse: 'bg-emerald-400',
    },
  };

  const current = configs[severity] || configs.HIGH;
  const IconComponent = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1.5 gap-2 font-bold tracking-wide',
    lg: 'text-sm px-4 py-2 gap-2.5 font-extrabold tracking-wider',
  };

  return (
    <span
      id={`severity-badge-${severity.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border whitespace-nowrap uppercase transition-all shadow-xs ${current.bg} ${sizeClasses[size]}`}
    >
      {showPulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pulse}`}
          />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
        </span>
      )}
      <IconComponent className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{current.label}</span>
    </span>
  );
};
