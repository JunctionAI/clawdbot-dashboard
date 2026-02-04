// Clawdbot Pricing Configuration
// All pricing tiers, features, and Stripe price IDs

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  period: string;
  description: string;
  features: string[];
  skillsIncluded: number | 'unlimited';
  messagesPerMonth: number | 'unlimited';
  highlighted?: boolean;
  popular?: boolean;
  priceId?: string; // Stripe Price ID
  badge?: string;
}

export interface SkillBundle {
  tier: string;
  count: number | 'unlimited';
  description: string;
}

// Skill bundling configuration
export const SKILL_BUNDLES: Record<string, SkillBundle> = {
  free: { tier: 'Free', count: 5, description: '5 core skills included' },
  personal: { tier: 'Personal', count: 10, description: '10 skills to customize your experience' },
  plus: { tier: 'Plus', count: 15, description: '15 skills for power users' },
  pro: { tier: 'Pro', count: 'unlimited', description: 'Unlimited skills - unlock everything' },
  family: { tier: 'Family', count: 15, description: '15 skills per family member' },
  team: { tier: 'Team', count: 'unlimited', description: 'Unlimited skills for your team' },
};

// Full pricing tiers - Updated to match marketing research (Feb 2026)
export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: '$0',
    period: 'forever',
    description: 'Try Ally with no commitment',
    skillsIncluded: 5,
    messagesPerMonth: 50,
    features: [
      '50 messages/day',
      '5 skills included',
      'Web access',
      '7-day memory',
      'Single platform',
    ],
  },
  {
    id: 'personal',
    name: 'Personal',
    price: 9,
    priceDisplay: '$9',
    period: '/month',
    description: 'Your AI that actually does things',
    skillsIncluded: 15,
    messagesPerMonth: 'unlimited',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONAL,
    features: [
      'Unlimited messages',
      '15 skills included',
      'Full memory (remembers everything)',
      'All platforms (web, mobile, Discord)',
      'Email support',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 19,
    priceDisplay: '$19',
    period: '/month',
    description: 'Advanced actions & integrations',
    skillsIncluded: 'unlimited',
    messagesPerMonth: 'unlimited',
    popular: true,
    badge: 'Most Popular',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PLUS,
    features: [
      'Everything in Personal',
      'Unlimited skills',
      'Gmail & Calendar integration',
      'Voice conversations',
      'Browser automation',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    priceDisplay: '$39',
    period: '/month',
    description: 'Full power for professionals',
    skillsIncluded: 'unlimited',
    messagesPerMonth: 'unlimited',
    highlighted: true,
    badge: 'Best Value',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    features: [
      'Everything in Plus',
      'API access',
      'Custom workflows',
      'Advanced automation',
      'Early access to new features',
      'Dedicated support',
    ],
  },
  {
    id: 'family',
    name: 'Family',
    price: 19,
    priceDisplay: '$19',
    period: '/month',
    description: 'Share Ally with up to 5 family members',
    skillsIncluded: 15,
    messagesPerMonth: 'unlimited',
    badge: 'Great for Families',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY,
    features: [
      'Up to 5 family members',
      '15 skills per member',
      'Individual memories (100% private)',
      'Shared family calendar',
      'Kid-safe mode available',
      'Family dashboard',
    ],
  },
];

// Get tier by ID
export function getTier(id: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === id);
}

// Get tier by Stripe price ID
export function getTierByPriceId(priceId: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.priceId === priceId);
}

// Check if user can use a skill based on their tier
export function canUseSkill(tierSkillCount: number | 'unlimited', skillsUsed: number): boolean {
  if (tierSkillCount === 'unlimited') return true;
  return skillsUsed < tierSkillCount;
}

// Get skills remaining
export function getSkillsRemaining(tierSkillCount: number | 'unlimited', skillsUsed: number): number | 'unlimited' {
  if (tierSkillCount === 'unlimited') return 'unlimited';
  return Math.max(0, tierSkillCount - skillsUsed);
}

// Check if user should see upgrade prompt
export function shouldShowUpgradePrompt(
  currentTierId: string,
  usage: { messages: number; skills: number }
): { show: boolean; reason?: string; suggestedTier?: string } {
  const tier = getTier(currentTierId);
  if (!tier) return { show: false };

  const messageLimit = tier.messagesPerMonth === 'unlimited' ? Infinity : tier.messagesPerMonth;
  const skillLimit = tier.skillsIncluded === 'unlimited' ? Infinity : tier.skillsIncluded;

  // At 80% message usage
  if (usage.messages >= messageLimit * 0.8) {
    return {
      show: true,
      reason: 'message_limit',
      suggestedTier: getNextTier(currentTierId)?.id,
    };
  }

  // At skill limit
  if (usage.skills >= skillLimit) {
    return {
      show: true,
      reason: 'skill_limit',
      suggestedTier: getNextTier(currentTierId)?.id,
    };
  }

  return { show: false };
}

// Get next tier upgrade
export function getNextTier(currentTierId: string): PricingTier | undefined {
  const tierOrder = ['free', 'personal', 'plus', 'pro'];
  const currentIndex = tierOrder.indexOf(currentTierId);
  if (currentIndex === -1 || currentIndex >= tierOrder.length - 1) return undefined;
  return getTier(tierOrder[currentIndex + 1]);
}

// Format price for display
export function formatPrice(price: number, period: string): string {
  if (price === 0) return 'Free';
  return `$${price}${period}`;
}

// Calculate savings for annual billing (if implemented)
export function calculateAnnualSavings(monthlyPrice: number): { annual: number; savings: number; savingsPercent: number } {
  const annualPrice = monthlyPrice * 10; // 2 months free
  const regularAnnual = monthlyPrice * 12;
  return {
    annual: annualPrice,
    savings: regularAnnual - annualPrice,
    savingsPercent: Math.round((1 - annualPrice / regularAnnual) * 100),
  };
}
