'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text' | 'card';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-shimmer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-300%';

  const variantClasses = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-xl',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  ));

  if (count === 1) {
    return elements[0];
  }

  return <div className="space-y-2">{elements}</div>;
}

// Pre-built skeleton patterns
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <Skeleton variant="text" width={80} />
      </div>
      <Skeleton variant="text" className="mb-2" width="60%" />
      <Skeleton variant="text" width="80%" />
      <div className="mt-4 flex gap-2">
        <Skeleton variant="rectangular" className="h-8 flex-1" />
        <Skeleton variant="rectangular" className="h-8 w-20" />
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="40%" className="mb-2" />
            <Skeleton variant="text" width="70%" />
          </div>
          <Skeleton variant="rectangular" width={60} height={24} />
        </div>
      ))}
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-start justify-between mb-4">
            <Skeleton variant="circular" width={48} height={48} />
            <Skeleton variant="text" width={50} />
          </div>
          <Skeleton variant="text" className="h-8 mb-2" width="50%" />
          <Skeleton variant="text" width="80%" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-700/50">
      {/* Header */}
      <div className="bg-gray-800/70 p-4 flex gap-4">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} variant="text" className="flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="p-4 flex gap-4 border-t border-gray-700/30">
          {Array.from({ length: cols }, (_, j) => (
            <Skeleton key={j} variant="text" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 p-6 bg-gray-800/50 rounded-xl">
      <Skeleton variant="circular" width={64} height={64} />
      <div className="flex-1">
        <Skeleton variant="text" width={150} className="mb-2 h-6" />
        <Skeleton variant="text" width={200} />
        <Skeleton variant="text" width={120} className="mt-2" />
      </div>
    </div>
  );
}
