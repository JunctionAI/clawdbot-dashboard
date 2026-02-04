'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { 
  ArrowLeftIcon,
  GiftIcon,
  UsersIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@/components/ui/icons';
import { ShareButtons, ReferralLink, ReferralList, RewardTracker } from '@/components/referrals';
import Link from 'next/link';

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

interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalCreditsEarned: number;
  pendingCredits: number;
  freeMonthsEarned: number;
  referrals: Referral[];
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
}

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchReferralData() {
      try {
        // In production, this would be an authenticated API call
        const response = await fetch('/api/referrals');
        if (!response.ok) {
          throw new Error('Failed to load referral data');
        }
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load referral data');
        setLoading(false);
      }
    }
    
    fetchReferralData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8 flex items-center justify-center">
        <ErrorState 
          message={error || 'Failed to load referral data'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-gradient bg-300%">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-inset">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 animate-fade-in-down">
          <div className="w-full sm:w-auto">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-3"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent flex items-center gap-3">
              <GiftIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
              Refer & Earn
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Share Clawdbot with friends and earn rewards for each successful referral
            </p>
          </div>
        </header>

        {/* Hero Card - Referral Link */}
        <Card className="mb-8 bg-gradient-to-br from-purple-900/50 to-blue-900/30 border-purple-500/30 animate-fade-in-up">
          <CardContent className="p-6 sm:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Link & Share */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-medium">Your Unique Referral Link</span>
                </div>
                
                <ReferralLink 
                  referralLink={data.referralLink}
                  referralCode={data.referralCode}
                  className="mb-6"
                />
                
                <ShareButtons 
                  referralLink={data.referralLink}
                  referralCode={data.referralCode}
                />
              </div>
              
              {/* Right: Quick Stats */}
              <div className="flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                      ${data.totalCreditsEarned}
                    </div>
                    <div className="text-sm text-gray-400">Total Earned</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                      {data.successfulReferrals}
                    </div>
                    <div className="text-sm text-gray-400">Referrals</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                      {data.freeMonthsEarned}
                    </div>
                    <div className="text-sm text-gray-400">Free Months</div>
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-1">
                      ${data.rewards.perReferral}
                    </div>
                    <div className="text-sm text-gray-400">Per Referral</div>
                  </div>
                </div>
                
                {/* Referral Bonus Callout */}
                <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <GiftIcon className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white">Your friends get $20 off too!</div>
                      <div className="text-sm text-green-400/80">Both of you win when they subscribe</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="referrals">
              <UsersIcon className="w-4 h-4 mr-2" />
              Referrals ({data.totalReferrals})
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <GiftIcon className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <RewardTracker
              totalCreditsEarned={data.totalCreditsEarned}
              pendingCredits={data.pendingCredits}
              freeMonthsEarned={data.freeMonthsEarned}
              successfulReferrals={data.successfulReferrals}
              pendingReferrals={data.pendingReferrals}
              rewards={data.rewards}
              tiers={data.tiers}
            />
          </TabsContent>
          
          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-blue-400" />
                  Your Referrals
                </CardTitle>
                <CardDescription>
                  Track the status of people you've invited to Clawdbot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReferralList referrals={data.referrals} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rewards">
            <div className="grid gap-6">
              {/* Earnings Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GiftIcon className="w-5 h-5 text-purple-400" />
                    Earnings Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-xl border border-green-500/20">
                      <div className="text-sm text-gray-400 mb-2">Available Credit</div>
                      <div className="text-4xl font-bold text-green-400">${data.totalCreditsEarned}</div>
                      <div className="text-sm text-green-400/60 mt-2">Applied to next bill</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/5 rounded-xl border border-yellow-500/20">
                      <div className="text-sm text-gray-400 mb-2">Pending Credit</div>
                      <div className="text-4xl font-bold text-yellow-400">${data.pendingCredits}</div>
                      <div className="text-sm text-yellow-400/60 mt-2">Waiting for subscriptions</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/5 rounded-xl border border-purple-500/20">
                      <div className="text-sm text-gray-400 mb-2">Free Months Earned</div>
                      <div className="text-4xl font-bold text-purple-400">{data.freeMonthsEarned}</div>
                      <div className="text-sm text-purple-400/60 mt-2">From referral milestones</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Reward Tiers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-yellow-400" />
                    Ambassador Tiers
                  </CardTitle>
                  <CardDescription>
                    Unlock higher rewards as you refer more friends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-4 gap-4">
                    {[
                      { name: 'Bronze', referrals: '0-4', reward: '$20', color: 'orange', current: data.successfulReferrals < 5 },
                      { name: 'Silver', referrals: '5-14', reward: '$25', color: 'gray', current: data.successfulReferrals >= 5 && data.successfulReferrals < 15 },
                      { name: 'Gold', referrals: '15-29', reward: '$30', color: 'yellow', current: data.successfulReferrals >= 15 && data.successfulReferrals < 30 },
                      { name: 'Platinum', referrals: '30+', reward: '$40', color: 'purple', current: data.successfulReferrals >= 30 },
                    ].map((tier) => (
                      <div 
                        key={tier.name}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          tier.current 
                            ? 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30' 
                            : 'bg-gray-800/30 border-gray-700/30 opacity-60'
                        }`}
                      >
                        <div className={`text-lg font-bold mb-1 ${
                          tier.color === 'orange' ? 'text-orange-400' :
                          tier.color === 'gray' ? 'text-gray-300' :
                          tier.color === 'yellow' ? 'text-yellow-400' :
                          'text-purple-400'
                        }`}>
                          {tier.name}
                        </div>
                        <div className="text-sm text-gray-400 mb-2">{tier.referrals} referrals</div>
                        <div className="text-2xl font-bold text-white">{tier.reward}</div>
                        <div className="text-xs text-gray-500">per referral</div>
                        {tier.current && (
                          <div className="mt-2 text-xs text-purple-400 font-medium">Current Tier</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Bonus Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GiftIcon className="w-5 h-5 text-green-400" />
                    Bonus Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">🎁</div>
                        <div>
                          <div className="font-medium text-white">Free Month Milestone</div>
                          <div className="text-sm text-gray-400">Every {data.rewards.freeMonthThreshold} successful referrals</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        You've earned {data.freeMonthsEarned} free month{data.freeMonthsEarned !== 1 ? 's' : ''} so far!
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">🔥</div>
                        <div>
                          <div className="font-medium text-white">Streak Bonus</div>
                          <div className="text-sm text-gray-400">Refer someone every month</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Current streak: {data.rewards.currentStreak} month{data.rewards.currentStreak !== 1 ? 's' : ''} — Extra 10% bonus!
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
