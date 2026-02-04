import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  return (
    <div className={`animate-spin rounded-full border-b-2 border-purple-500 ${sizeClasses[size]} ${className}`}></div>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-400 animate-pulse-subtle">Loading your workspace...</p>
      </div>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-shimmer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-300% rounded ${className}`}></div>
  );
}
