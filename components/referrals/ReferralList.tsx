'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { UsersIcon, CheckIcon, ClockIcon, CurrencyDollarIcon } from '@/components/ui/icons';

interface Referral {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'signed_up' | 'subscribed' | 'churned';
  signedUpAt: string;
  subscribedAt?: string;
  plan?: string;
  rewardEarned?: number;
}

interface ReferralListProps {
  referrals: Referral[];
  className?: string;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'warning' as const, icon: ClockIcon },
  signed_up: { label: 'Signed Up', variant: 'info' as const, icon: UsersIcon },
  subscribed: { label: 'Subscribed', variant: 'success' as const, icon: CheckIcon },
  churned: { label: 'Churned', variant: 'error' as const, icon: ClockIcon },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
}

export function ReferralList({ referrals, className = '' }: ReferralListProps) {
  if (referrals.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="w-16 h-16" />}
        title="No referrals yet"
        description="Share your link to start earning rewards!"
      />
    );
  }
  
  return (
    <div className={`space-y-3 ${className}`}>
      {referrals.map((referral, index) => {
        const status = statusConfig[referral.status];
        const StatusIcon = status.icon;
        
        return (
          <div
            key={referral.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                referral.status === 'subscribed' 
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                  : 'bg-gray-700'
              }`}>
                {referral.name ? referral.name.charAt(0).toUpperCase() : '?'}
              </div>
              
              {/* Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-white truncate">
                    {referral.name || 'Anonymous'}
                  </span>
                  <Badge variant={status.variant} size="sm">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <div className="text-sm text-gray-400 flex items-center gap-2 flex-wrap">
                  <span className="truncate">{referral.email}</span>
                  <span className="text-gray-600">•</span>
                  <span>{formatRelativeTime(referral.signedUpAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Reward */}
            <div className="flex items-center gap-2 sm:text-right">
              {referral.rewardEarned ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20">
                  <CurrencyDollarIcon className="w-4 h-4" />
                  <span className="font-semibold">${referral.rewardEarned}</span>
                  <span className="text-xs text-green-400/70">earned</span>
                </div>
              ) : referral.status === 'signed_up' ? (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  Waiting to subscribe
                </div>
              ) : referral.status === 'pending' ? (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  Invite pending
                </div>
              ) : null}
              
              {referral.plan && (
                <Badge variant="default" size="sm" className="bg-purple-500/20 text-purple-300">
                  {referral.plan}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
