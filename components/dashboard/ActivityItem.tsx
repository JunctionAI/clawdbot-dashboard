'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUpIcon } from '@/components/ui/icons';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

interface ActivityItemProps {
  activity: Activity;
  animationDelay?: number;
}

export function ActivityItem({ activity, animationDelay = 0 }: ActivityItemProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'agent':
        return '🤖';
      case 'integration':
        return '🔗';
      case 'skill':
        return '⚡';
      case 'error':
        return '⚠️';
      default:
        return '📌';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
      className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200"
    >
      <div className="text-lg mt-0.5">{getTypeIcon(activity.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{activity.description}</p>
        <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
      </div>
    </motion.div>
  );
}

/**
 * Empty state for when there's no recent activity
 */
export function ActivityEmptyState() {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 mb-4 text-gray-600">
        <TrendingUpIcon className="w-16 h-16" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
      <p className="text-gray-400 text-sm">
        Your recent workspace activity will appear here
      </p>
    </div>
  );
}

/**
 * Loading skeleton for activity items
 */
export function ActivitySkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div 
          key={i}
          className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50"
        >
          <div className="w-6 h-6 rounded bg-gray-700 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse mb-2" />
            <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
