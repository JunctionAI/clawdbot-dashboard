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
}

export function StatCard({ icon, label, value, change, description, className = '' }: StatCardProps) {
  return (
    <Card className={`animate-fade-in-up ${className}`} hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${change.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {change.trend === 'up' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
          {description && (
            <p className="text-gray-500 text-xs mt-1">{description}</p>
          )}
        </div>
        <div className="text-purple-500 text-4xl opacity-50">
          {icon}
        </div>
      </div>
    </Card>
  );
}
