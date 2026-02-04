import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'purple' | 'green' | 'blue' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  max, 
  label,
  showPercentage = true,
  color = 'purple',
  size = 'md',
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
  };
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm mb-2">
          {label && <span className="text-gray-400">{label}</span>}
          {showPercentage && (
            <span className="text-white font-medium">{value.toLocaleString()} / {max.toLocaleString()}</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${animated ? 'animate-fade-in-right' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          {animated && (
            <div className="h-full w-full bg-white/20 animate-shimmer bg-300%"></div>
          )}
        </div>
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-400 mt-2">
          {Math.round(percentage)}% used
        </p>
      )}
    </div>
  );
}
