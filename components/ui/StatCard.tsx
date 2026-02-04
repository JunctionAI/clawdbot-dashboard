import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({ icon, label, value, change, description, className = '', style }: StatCardProps) {
  return (
    <Card className={`animate-fade-in-up p-4 sm:p-6 ${className}`} hover style={style}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-gray-400 text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 truncate">{label}</p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${change.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change.trend === 'up' ? (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
          {description && (
            <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1 truncate">{description}</p>
          )}
        </div>
        <div className="text-purple-500 opacity-50 flex-shrink-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 [&>svg]:w-full [&>svg]:h-full">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
}
