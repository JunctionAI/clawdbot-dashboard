'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GiftIcon, ZapIcon, SparklesIcon, CheckIcon } from '@/components/ui/icons';

/**
 * Referral Landing Page
 * 
 * When someone clicks a referral link (e.g., /r/CLAWD123ABC), this page:
 * 1. Validates the referral code
 * 2. Stores the referral code in localStorage/cookie
 * 3. Shows a welcome message with the referral benefit
 * 4. Redirects to signup with the referral code
 */

export default function ReferralLandingPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function validateAndTrack() {
      try {
        // Track the referral click
        await fetch('/api/referrals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            referralCode: code,
            action: 'click',
          }),
        });
        
        // Store the referral code for later use during signup
        localStorage.setItem('referralCode', code);
        document.cookie = `referralCode=${code}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
        
        // In production, we'd validate the code with the backend
        // For now, assume valid if it matches the expected format
        const isValidFormat = /^CLAWD[A-Z0-9]{3,8}$/i.test(code);
        
        if (isValidFormat) {
          setIsValid(true);
          // Could fetch referrer name from API
          setReferrerName('a friend');
        } else {
          setError('Invalid referral code');
        }
      } catch (err) {
        console.error('Failed to validate referral:', err);
        // Still allow them to proceed even if tracking fails
        setIsValid(true);
        localStorage.setItem('referralCode', code);
      } finally {
        setIsValidating(false);
      }
    }
    
    if (code) {
      validateAndTrack();
    }
  }, [code]);

  const handleGetStarted = () => {
    // Redirect to checkout/signup with the referral code
    router.push(`/checkout?ref=${code}`);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Activating your referral bonus...</p>
        </div>
      </div>
    );
  }

  if (error || !isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🤔</div>
            <h1 className="text-2xl font-bold text-white mb-2">Invalid Referral Link</h1>
            <p className="text-gray-400 mb-6">
              This referral link doesn't seem to be valid. You can still sign up for Clawdbot!
            </p>
            <Button onClick={() => router.push('/checkout')} fullWidth>
              <ZapIcon className="w-5 h-5" />
              Get Started Anyway
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-purple-500/10 pointer-events-none animate-pulse-subtle"></div>
      
      <div className="relative max-w-2xl w-full">
        {/* Success Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium shadow-glow-green animate-bounce-subtle">
            <CheckIcon className="w-4 h-4" />
            Referral Bonus Activated!
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-green-500/30 backdrop-blur-xl">
          <CardContent className="p-8 sm:p-12 text-center">
            {/* Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <GiftIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {"You've Been Invited!"}
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              {referrerName ? `${referrerName} thinks you would love Clawdbot` : "Someone special thinks you would love Clawdbot"}
            </p>
            
            {/* Benefit Card */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30 mb-8">
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl font-bold text-green-400">$20</div>
                <div className="text-left">
                  <div className="text-white font-medium">OFF Your First Month</div>
                  <div className="text-green-400/80 text-sm">Applied automatically at checkout</div>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-purple-400 mb-2" />
                <div className="font-medium text-white text-sm">AI That Remembers</div>
                <div className="text-xs text-gray-400">Never repeat yourself again</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <ZapIcon className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="font-medium text-white text-sm">Automate Everything</div>
                <div className="text-xs text-gray-400">Email, calendar, tasks</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <GiftIcon className="w-6 h-6 text-green-400 mb-2" />
                <div className="font-medium text-white text-sm">Refer & Earn</div>
                <div className="text-xs text-gray-400">Get $20 per friend</div>
              </div>
            </div>
            
            {/* CTA */}
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              fullWidth
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
            >
              <GiftIcon className="w-5 h-5" />
              Claim Your $20 Discount
            </Button>
            
            <p className="mt-4 text-xs text-gray-500">
              Referral code: <span className="font-mono text-purple-400">{code}</span>
            </p>
          </CardContent>
        </Card>
        
        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★★★★★</span>
            <span>4.9/5 Rating</span>
          </div>
          <div>10,000+ Happy Users</div>
          <div>Enterprise-Grade Security</div>
        </div>
      </div>
    </div>
  );
}
