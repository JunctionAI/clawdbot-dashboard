import { NextRequest, NextResponse } from 'next/server';

/**
 * Referral System API
 * 
 * Manages referral links, tracking, and rewards
 * 
 * TODO: Connect to real database when ready
 */

export interface Referral {
  id: string;
  email: string;
  name?: string;
  status: 'pending' | 'signed_up' | 'subscribed' | 'churned';
  signedUpAt: string;
  subscribedAt?: string;
  plan?: string;
  rewardEarned?: number;
}

export interface ReferralData {
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

// Generate a unique referral code from user ID
function generateReferralCode(userId: string): string {
  // In production, this would be stored in DB
  // Using a deterministic hash for demo
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `CLAWD${hash.toString(36).toUpperCase().slice(0, 6)}`;
}

export async function GET(request: NextRequest) {
  // SEC-001: Check for auth header or session
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('session');
  
  if (!authHeader && !sessionCookie) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required.' },
      { status: 401 }
    );
  }
  
  // In development, return mock data
  if (process.env.NODE_ENV === 'development') {
    const userId = 'user_demo_123';
    const referralCode = generateReferralCode(userId);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clawdbot.com';
    
    const mockData: ReferralData = {
      referralCode,
      referralLink: `${baseUrl}/r/${referralCode}`,
      totalReferrals: 7,
      successfulReferrals: 4,
      pendingReferrals: 3,
      totalCreditsEarned: 80,
      pendingCredits: 60,
      freeMonthsEarned: 1,
      referrals: [
        {
          id: 'ref_1',
          email: 'sarah.j***@gmail.com',
          name: 'Sarah J.',
          status: 'subscribed',
          signedUpAt: '2024-01-15T10:30:00Z',
          subscribedAt: '2024-01-18T14:20:00Z',
          plan: 'Pro',
          rewardEarned: 20,
        },
        {
          id: 'ref_2',
          email: 'mike.t***@outlook.com',
          name: 'Mike T.',
          status: 'subscribed',
          signedUpAt: '2024-01-20T09:15:00Z',
          subscribedAt: '2024-01-25T11:45:00Z',
          plan: 'Pro',
          rewardEarned: 20,
        },
        {
          id: 'ref_3',
          email: 'emily.r***@company.com',
          name: 'Emily R.',
          status: 'subscribed',
          signedUpAt: '2024-02-01T16:00:00Z',
          subscribedAt: '2024-02-05T08:30:00Z',
          plan: 'Family',
          rewardEarned: 40,
        },
        {
          id: 'ref_4',
          email: 'alex.w***@startup.io',
          name: 'Alex W.',
          status: 'subscribed',
          signedUpAt: '2024-02-10T13:45:00Z',
          subscribedAt: '2024-02-12T10:00:00Z',
          plan: 'Pro',
          rewardEarned: 20,
        },
        {
          id: 'ref_5',
          email: 'jordan.k***@tech.co',
          name: 'Jordan K.',
          status: 'signed_up',
          signedUpAt: '2024-02-15T11:20:00Z',
        },
        {
          id: 'ref_6',
          email: 'taylor.m***@design.co',
          name: 'Taylor M.',
          status: 'signed_up',
          signedUpAt: '2024-02-18T15:30:00Z',
        },
        {
          id: 'ref_7',
          email: 'casey.b***@agency.com',
          name: 'Casey B.',
          status: 'pending',
          signedUpAt: '2024-02-20T09:00:00Z',
        },
      ],
      rewards: {
        perReferral: 20,
        freeMonthThreshold: 5,
        currentStreak: 3,
      },
      tiers: {
        current: 'Bronze Ambassador',
        next: 'Silver Ambassador',
        progress: 70,
        referralsToNext: 3,
      },
    };
    
    return NextResponse.json(mockData);
  }
  
  return NextResponse.json(
    { error: 'Not Implemented', message: 'Connect to database.' },
    { status: 501 }
  );
}

// Track a referral click/conversion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralCode, action, email } = body;
    
    if (!referralCode) {
      return NextResponse.json(
        { error: 'Missing referral code' },
        { status: 400 }
      );
    }
    
    // In production: 
    // 1. Validate referral code exists
    // 2. Track the action (click, signup, subscribe)
    // 3. Award credits when subscription happens
    
    console.log(`Referral tracked: ${referralCode}, action: ${action}, email: ${email}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Referral tracked successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
