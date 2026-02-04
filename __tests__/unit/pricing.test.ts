/**
 * Unit Tests for Pricing Module
 * Tests pricing tiers, feature checks, and upgrade logic
 */

import {
  PRICING_TIERS,
  SKILL_BUNDLES,
  getTier,
  getTierByPriceId,
  canUseSkill,
  getSkillsRemaining,
  shouldShowUpgradePrompt,
  getNextTier,
  formatPrice,
  calculateAnnualSavings,
} from '@/lib/pricing';

describe('Pricing Module', () => {
  describe('PRICING_TIERS', () => {
    it('should have all expected tiers', () => {
      const tierIds = PRICING_TIERS.map((t) => t.id);
      expect(tierIds).toContain('free');
      expect(tierIds).toContain('personal');
      expect(tierIds).toContain('plus');
      expect(tierIds).toContain('pro');
      expect(tierIds).toContain('family');
      expect(tierIds).toContain('team');
    });

    it('should have valid prices for all tiers', () => {
      PRICING_TIERS.forEach((tier) => {
        expect(tier.price).toBeGreaterThanOrEqual(0);
        expect(tier.priceDisplay).toMatch(/^\$\d+$/);
      });
    });

    it('should have valid message limits', () => {
      PRICING_TIERS.forEach((tier) => {
        const limit = tier.messagesPerMonth;
        expect(limit === 'unlimited' || typeof limit === 'number').toBe(true);
        if (typeof limit === 'number') {
          expect(limit).toBeGreaterThan(0);
        }
      });
    });

    it('should have valid skill counts', () => {
      PRICING_TIERS.forEach((tier) => {
        const count = tier.skillsIncluded;
        expect(count === 'unlimited' || typeof count === 'number').toBe(true);
        if (typeof count === 'number') {
          expect(count).toBeGreaterThan(0);
        }
      });
    });

    it('should have features arrays', () => {
      PRICING_TIERS.forEach((tier) => {
        expect(Array.isArray(tier.features)).toBe(true);
        expect(tier.features.length).toBeGreaterThan(0);
      });
    });

    // BUG CATCHER: Pricing tier consistency
    it('should have increasing prices by tier (free → personal → plus → pro)', () => {
      const free = PRICING_TIERS.find((t) => t.id === 'free')!;
      const personal = PRICING_TIERS.find((t) => t.id === 'personal')!;
      const plus = PRICING_TIERS.find((t) => t.id === 'plus')!;
      const pro = PRICING_TIERS.find((t) => t.id === 'pro')!;

      expect(free.price).toBe(0);
      expect(personal.price).toBeGreaterThan(free.price);
      expect(plus.price).toBeGreaterThan(personal.price);
      expect(pro.price).toBeGreaterThan(plus.price);
    });

    it('should have increasing message limits by tier', () => {
      const free = PRICING_TIERS.find((t) => t.id === 'free')!;
      const personal = PRICING_TIERS.find((t) => t.id === 'personal')!;
      const plus = PRICING_TIERS.find((t) => t.id === 'plus')!;

      expect(free.messagesPerMonth).toBeLessThan(
        personal.messagesPerMonth as number
      );
      expect(personal.messagesPerMonth).toBeLessThan(
        plus.messagesPerMonth as number
      );
    });
  });

  describe('SKILL_BUNDLES', () => {
    it('should match tier IDs', () => {
      expect(SKILL_BUNDLES.free).toBeDefined();
      expect(SKILL_BUNDLES.personal).toBeDefined();
      expect(SKILL_BUNDLES.plus).toBeDefined();
      expect(SKILL_BUNDLES.pro).toBeDefined();
    });

    it('should have valid skill counts', () => {
      Object.values(SKILL_BUNDLES).forEach((bundle) => {
        expect(bundle.count === 'unlimited' || bundle.count > 0).toBe(true);
      });
    });
  });

  describe('getTier', () => {
    it('should return correct tier by ID', () => {
      const tier = getTier('pro');
      expect(tier).toBeDefined();
      expect(tier?.id).toBe('pro');
      expect(tier?.name).toBe('Pro');
    });

    it('should return undefined for invalid ID', () => {
      expect(getTier('invalid')).toBeUndefined();
      expect(getTier('')).toBeUndefined();
    });
  });

  describe('getTierByPriceId', () => {
    it('should return tier for valid price ID', () => {
      const plusTier = PRICING_TIERS.find((t) => t.id === 'plus')!;
      if (plusTier.priceId) {
        const tier = getTierByPriceId(plusTier.priceId);
        expect(tier).toBeDefined();
        expect(tier?.id).toBe('plus');
      }
    });

    it('should return undefined for invalid price ID', () => {
      expect(getTierByPriceId('price_invalid')).toBeUndefined();
      expect(getTierByPriceId('')).toBeUndefined();
    });
  });

  describe('canUseSkill', () => {
    it('should return true for unlimited plans', () => {
      expect(canUseSkill('unlimited', 0)).toBe(true);
      expect(canUseSkill('unlimited', 100)).toBe(true);
      expect(canUseSkill('unlimited', 1000)).toBe(true);
    });

    it('should return true when under limit', () => {
      expect(canUseSkill(10, 0)).toBe(true);
      expect(canUseSkill(10, 5)).toBe(true);
      expect(canUseSkill(10, 9)).toBe(true);
    });

    it('should return false when at or over limit', () => {
      expect(canUseSkill(10, 10)).toBe(false);
      expect(canUseSkill(10, 15)).toBe(false);
    });

    // BUG CATCHER: Edge case at limit
    it('should correctly handle exactly at limit', () => {
      expect(canUseSkill(5, 4)).toBe(true);  // One remaining
      expect(canUseSkill(5, 5)).toBe(false); // At limit
    });
  });

  describe('getSkillsRemaining', () => {
    it('should return unlimited for unlimited plans', () => {
      expect(getSkillsRemaining('unlimited', 50)).toBe('unlimited');
    });

    it('should return correct remaining count', () => {
      expect(getSkillsRemaining(10, 0)).toBe(10);
      expect(getSkillsRemaining(10, 3)).toBe(7);
      expect(getSkillsRemaining(10, 10)).toBe(0);
    });

    it('should not return negative values', () => {
      expect(getSkillsRemaining(5, 10)).toBe(0);
      expect(getSkillsRemaining(5, 100)).toBe(0);
    });
  });

  describe('shouldShowUpgradePrompt', () => {
    it('should show upgrade at 80% message usage', () => {
      const freeTier = PRICING_TIERS.find((t) => t.id === 'free')!;
      const limit = freeTier.messagesPerMonth as number;

      // At 80% usage
      const result = shouldShowUpgradePrompt('free', {
        messages: limit * 0.8,
        skills: 0,
      });

      expect(result.show).toBe(true);
      expect(result.reason).toBe('message_limit');
    });

    it('should show upgrade when at skill limit', () => {
      const freeTier = PRICING_TIERS.find((t) => t.id === 'free')!;
      const skillLimit = freeTier.skillsIncluded as number;

      const result = shouldShowUpgradePrompt('free', {
        messages: 0,
        skills: skillLimit,
      });

      expect(result.show).toBe(true);
      expect(result.reason).toBe('skill_limit');
    });

    it('should not show upgrade for low usage', () => {
      const result = shouldShowUpgradePrompt('free', {
        messages: 10,
        skills: 1,
      });

      expect(result.show).toBe(false);
    });

    it('should not show upgrade for unlimited tier', () => {
      const result = shouldShowUpgradePrompt('pro', {
        messages: 100000,
        skills: 100,
      });

      expect(result.show).toBe(false);
    });

    it('should return undefined for invalid tier', () => {
      const result = shouldShowUpgradePrompt('invalid', {
        messages: 1000,
        skills: 10,
      });

      expect(result.show).toBe(false);
    });

    // BUG CATCHER: Correct suggested tier
    it('should suggest correct next tier', () => {
      const result = shouldShowUpgradePrompt('free', {
        messages: 80,
        skills: 5,
      });

      if (result.show) {
        expect(result.suggestedTier).toBe('personal');
      }
    });
  });

  describe('getNextTier', () => {
    it('should return personal for free', () => {
      expect(getNextTier('free')?.id).toBe('personal');
    });

    it('should return plus for personal', () => {
      expect(getNextTier('personal')?.id).toBe('plus');
    });

    it('should return pro for plus', () => {
      expect(getNextTier('plus')?.id).toBe('pro');
    });

    it('should return undefined for pro (highest tier)', () => {
      expect(getNextTier('pro')).toBeUndefined();
    });

    it('should return undefined for invalid tier', () => {
      expect(getNextTier('invalid')).toBeUndefined();
      expect(getNextTier('team')).toBeUndefined(); // Team is separate track
    });
  });

  describe('formatPrice', () => {
    it('should return "Free" for $0', () => {
      expect(formatPrice(0, '/month')).toBe('Free');
    });

    it('should format price with period', () => {
      expect(formatPrice(9, '/month')).toBe('$9/month');
      expect(formatPrice(29, '/seat/month')).toBe('$29/seat/month');
    });
  });

  describe('calculateAnnualSavings', () => {
    it('should calculate 2 months free (10x instead of 12x)', () => {
      const result = calculateAnnualSavings(10);

      expect(result.annual).toBe(100); // 10 * 10
      expect(result.savings).toBe(20); // 120 - 100
      expect(result.savingsPercent).toBe(17); // ~16.67% rounded
    });

    it('should calculate correct savings for different prices', () => {
      const result = calculateAnnualSavings(39);

      expect(result.annual).toBe(390);
      expect(result.savings).toBe(78); // 468 - 390
    });
  });

  describe('Price ID validation', () => {
    // BUG CATCHER: Ensure price IDs are valid Stripe format
    it('should have valid Stripe price ID format for paid tiers', () => {
      const paidTiers = PRICING_TIERS.filter((t) => t.price > 0 && t.priceId);

      paidTiers.forEach((tier) => {
        expect(tier.priceId).toMatch(/^price_[A-Za-z0-9]+$/);
      });
    });

    // BUG CATCHER: No duplicate price IDs
    it('should have unique price IDs', () => {
      const priceIds = PRICING_TIERS.map((t) => t.priceId).filter(Boolean);
      const uniquePriceIds = new Set(priceIds);

      expect(uniquePriceIds.size).toBe(priceIds.length);
    });
  });

  describe('Display consistency', () => {
    it('should have consistent badge presence for highlighted tiers', () => {
      PRICING_TIERS.forEach((tier) => {
        if (tier.popular || tier.highlighted) {
          expect(tier.badge).toBeDefined();
          expect(tier.badge!.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have exactly one "Most Popular" tier', () => {
      const popularTiers = PRICING_TIERS.filter((t) => t.popular);
      expect(popularTiers.length).toBe(1);
    });
  });
});
