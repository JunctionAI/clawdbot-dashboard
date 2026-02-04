'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { 
  GiftIcon, 
  StarIcon, 
  TrophyIcon, 
  CurrencyDollarIcon,
  FireIcon,
  SparklesIcon
} from '@/components/ui/icons';

interface RewardTrackerProps {
  totalCreditsEarned: number;
  pendingCredits: number;
  freeMonthsEarned: number;
  successfulReferrals: number;
  pendingReferrals: number;
  rewards: {
    perReferral: number;
    freeMonthThreshold: number;
    currentStreak: number;
  };
  tiers: {
    current: string;
    next: string;
    progress: number;
    referralsToNext: number;
  };
  className?: string;
}

const tierConfig: Record<string, { color: string; icon: typeof StarIcon; gradient: string }> = {
  'Bronze Ambassador': { 
    color: 'text-orange-400', 
    icon: StarIcon,
    gradient: 'from-orange-600/20 to-yellow-600/20'
  },
  'Silver Ambassador': { 
    color: 'text-gray-300', 
    icon: StarIcon,
    gradient: 'from-gray-400/20 to-gray-300/20'
  },
  'Gold Ambassador': { 
    color: 'text-yellow-400', 
    icon: TrophyIcon,
    gradient: 'from-yellow-500/20 to-orange-400/20'
  },
  'Platinum Ambassador': { 
    color: 'text-purple-300', 
    icon: TrophyIcon,
    gradient: 'from-purple-400/20 to-pink-400/20'
  },
};

export function RewardTracker({
  totalCreditsEarned,
  pendingCredits,
  freeMonthsEarned,
  successfulReferrals,
  pendingReferrals,
  rewards,
  tiers,
  className = ''
}: RewardTrackerProps) {
  const currentTierConfig = tierConfig[tiers.current] || tierConfig['Bronze Ambassador'];
  const TierIcon = currentTierConfig.icon;
  
  const nextFreeMonth = rewards.freeMonthThreshold - (successfulReferrals % rewards.freeMonthThreshold);
  
  return (
    <div className={`grid gap-6 ${className}`}>
      {/* Main Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Credits */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5"></div>
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              ${totalCreditsEarned}
            </div>
            <div className="text-sm text-gray-400">Credits Earned</div>
            {pendingCredits > 0 && (
              <Badge variant="warning" size="sm" className="mt-2">
                +${pendingCredits} pending
              </Badge>
            )}
          </CardContent>
        </Card>
        
        {/* Free Months */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5"></div>
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <GiftIcon className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {freeMonthsEarned}
            </div>
            <div className="text-sm text-gray-400">Free Months</div>
            <div className="text-xs text-purple-400 mt-2">
              {nextFreeMonth} more to next
            </div>
          </CardContent>
        </Card>
        
        {/* Successful Referrals */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5"></div>
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
              {successfulReferrals}
            </div>
            <div className="text-sm text-gray-400">Successful Referrals</div>
            {pendingReferrals > 0 && (
              <Badge variant="info" size="sm" className="mt-2">
                +{pendingReferrals} pending
              </Badge>
            )}
          </CardContent>
        </Card>
        
        {/* Current Streak */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5"></div>
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <FireIcon className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-1">
              {rewards.currentStreak}
              {rewards.currentStreak >= 3 && <span className="text-lg">🔥</span>}
            </div>
            <div className="text-sm text-gray-400">Month Streak</div>
            <div className="text-xs text-orange-400 mt-2">
              Keep it going!
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Ambassador Tier Progress */}
      <Card className={`relative overflow-hidden bg-gradient-to-br ${currentTierConfig.gradient}`}>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center ${currentTierConfig.color}`}>
                <TierIcon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className={currentTierConfig.color}>{tiers.current}</span>
                </CardTitle>
                <CardDescription>
                  {tiers.referralsToNext} referrals to {tiers.next}
                </CardDescription>
              </div>
            </div>
            <Badge variant="default" className="bg-gray-800/50">
              Level {Math.floor(tiers.progress / 25) + 1}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ProgressBar 
            value={tiers.progress} 
            max={100} 
            color="purple"
            animated
          />
          
          {/* Tier Benefits Preview */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="text-sm text-gray-400">Current Reward</div>
              <div className="text-lg font-semibold text-white">${rewards.perReferral}/referral</div>
            </div>
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="text-sm text-gray-400">Next Tier Bonus</div>
              <div className="text-lg font-semibold text-purple-400">+$5/referral</div>
            </div>
            <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="text-sm text-gray-400">Free Month Every</div>
              <div className="text-lg font-semibold text-white">{rewards.freeMonthThreshold} referrals</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GiftIcon className="w-5 h-5 text-purple-400" />
            How Rewards Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                1
              </div>
              <div>
                <div className="font-medium text-white mb-1">Share Your Link</div>
                <div className="text-sm text-gray-400">Send your unique referral link to friends</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-medium text-white mb-1">They Subscribe</div>
                <div className="text-sm text-gray-400">When they sign up and subscribe</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-medium text-white mb-1">Earn Rewards</div>
                <div className="text-sm text-gray-400">Get ${rewards.perReferral} credit + free months!</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
