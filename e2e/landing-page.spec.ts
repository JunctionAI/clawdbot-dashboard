import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Landing Page
 * Tests the main landing page and signup flow
 */

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section', async ({ page }) => {
    // Check for main headline
    await expect(
      page.getByRole('heading', { level: 1 })
    ).toBeVisible();

    // Check for CTA button
    const ctaButton = page.getByRole('link', { name: /get started|try free|start/i });
    await expect(ctaButton).toBeVisible();
  });

  test('should display pricing section', async ({ page }) => {
    // Scroll to pricing or click pricing link
    const pricingLink = page.getByRole('link', { name: /pricing/i });
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
    }

    // Check for pricing tiers
    await expect(page.getByText(/starter|personal|free/i).first()).toBeVisible();
    await expect(page.getByText(/pro|plus/i).first()).toBeVisible();
  });

  test('should display navigation', async ({ page }) => {
    // Check for nav elements
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero should still be visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Check for mobile menu or hamburger icon
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .hamburger, .menu-toggle').first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      // Navigation should appear
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out expected errors (e.g., third-party scripts)
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('analytics') &&
        !e.includes('hydration')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    // Check title
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title.toLowerCase()).toContain('clawdbot');

    // Check meta description
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);

    // Check OG tags
    const ogTitle = await page
      .locator('meta[property="og:title"]')
      .getAttribute('content');
    expect(ogTitle).toBeTruthy();
  });
});

test.describe('Email Subscription', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should subscribe with valid email', async ({ page }) => {
    // Find email input
    const emailInput = page.locator(
      'input[type="email"], input[placeholder*="email" i]'
    ).first();

    if (await emailInput.isVisible()) {
      await emailInput.fill('e2etest@example.com');

      // Find and click submit button
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Subscribe"), button:has-text("Get Started")'
      ).first();
      await submitButton.click();

      // Wait for success message or redirect
      await expect(
        page.getByText(/thank|success|subscribed/i).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show error for invalid email', async ({ page }) => {
    const emailInput = page.locator(
      'input[type="email"], input[placeholder*="email" i]'
    ).first();

    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');

      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Subscribe")'
      ).first();
      await submitButton.click();

      // Should show validation error
      await expect(
        page.getByText(/invalid|error|valid email/i).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
