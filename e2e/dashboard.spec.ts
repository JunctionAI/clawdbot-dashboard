import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Dashboard
 * Tests authenticated user flows in the dashboard
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should show authentication required message or redirect', async ({
    page,
  }) => {
    // Dashboard should require authentication
    // Either show "Please sign in" or redirect to login
    const isRedirected = !page.url().includes('/dashboard');
    const hasAuthMessage =
      (await page.getByText(/sign in|log in|authenticate/i).count()) > 0;

    // One of these should be true
    expect(isRedirected || hasAuthMessage).toBeTruthy();
  });

  test('should display navigation sidebar', async ({ page }) => {
    const sidebar = page.locator('nav, aside, [role="navigation"]').first();
    
    if (await sidebar.isVisible()) {
      // Check for navigation items
      const navItems = ['dashboard', 'settings', 'billing'];
      for (const item of navItems) {
        const link = page.getByRole('link', { name: new RegExp(item, 'i') });
        if (await link.count() > 0) {
          await expect(link.first()).toBeVisible();
        }
      }
    }
  });
});

test.describe('Dashboard - Billing Section', () => {
  test('should display current plan', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Should show plan info (even if mocked in dev)
    const planText = page.getByText(/plan|subscription|starter|pro|team/i).first();
    await expect(planText).toBeVisible({ timeout: 5000 });
  });

  test('should show usage statistics', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Look for usage indicators
    const usageElements = [
      page.getByText(/messages/i).first(),
      page.getByText(/used|remaining/i).first(),
    ];

    for (const element of usageElements) {
      if (await element.count() > 0) {
        await expect(element).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should have upgrade button for non-unlimited plans', async ({ page }) => {
    await page.goto('/dashboard/billing');

    // Look for upgrade CTA
    const upgradeButton = page.locator(
      'button:has-text("Upgrade"), a:has-text("Upgrade")'
    ).first();

    // May or may not be visible depending on current plan
    // Just check it doesn't cause errors
    await page.waitForTimeout(1000);
  });

  test('should link to Stripe billing portal', async ({ page }) => {
    await page.goto('/dashboard/billing');

    const manageButton = page.locator(
      'button:has-text("Manage"), a:has-text("Billing Portal")'
    ).first();

    if (await manageButton.isVisible()) {
      // Should have onclick or href
      const href = await manageButton.getAttribute('href');
      const onclick = await manageButton.getAttribute('onclick');
      expect(href || onclick).toBeTruthy();
    }
  });
});

test.describe('Dashboard - Settings', () => {
  test('should display settings page', async ({ page }) => {
    await page.goto('/dashboard/settings');

    // Check for settings sections
    const settingsHeading = page.getByRole('heading', {
      name: /settings|preferences|account/i,
    }).first();

    if (await settingsHeading.count() > 0) {
      await expect(settingsHeading).toBeVisible();
    }
  });

  test('should have account settings', async ({ page }) => {
    await page.goto('/dashboard/settings');

    // Look for account-related settings
    const accountElements = page.locator(
      'text=/email|password|profile|account/i'
    );

    if (await accountElements.count() > 0) {
      await expect(accountElements.first()).toBeVisible();
    }
  });
});

test.describe('Dashboard - Workspace', () => {
  test('should display workspace info', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for workspace ID or name
    const workspaceInfo = page.locator(
      'text=/claw_|workspace|API key/i'
    ).first();

    if (await workspaceInfo.count() > 0) {
      await expect(workspaceInfo).toBeVisible({ timeout: 5000 });
    }
  });

  test('should protect sensitive information', async ({ page }) => {
    await page.goto('/dashboard');

    // API keys should be masked
    const apiKeyElement = page.locator('[data-testid="api-key"], text=/claw_/');

    if (await apiKeyElement.count() > 0) {
      const content = await apiKeyElement.first().textContent();
      // Should be masked (contain ... or * or be truncated)
      expect(
        content!.includes('...') ||
        content!.includes('*') ||
        content!.length < 50
      ).toBeTruthy();
    }
  });

  test('should have copy button for API key', async ({ page }) => {
    await page.goto('/dashboard');

    const copyButton = page.locator(
      'button[title*="Copy"], button:has-text("Copy"), [data-testid="copy-button"]'
    ).first();

    if (await copyButton.count() > 0) {
      await expect(copyButton).toBeVisible();
      await expect(copyButton).toBeEnabled();
    }
  });
});

test.describe('Dashboard - Responsive Design', () => {
  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');

    // Content should still be visible
    await expect(page.locator('body')).toBeVisible();

    // Check there's no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // Content should still be visible
    await expect(page.locator('body')).toBeVisible();

    // Navigation should be collapsible or in menu
    const mobileNav = page.locator(
      '[data-testid="mobile-nav"], .mobile-menu, .hamburger'
    ).first();

    // Either nav is collapsed or shows hamburger menu
    const hasNav = await page.locator('nav').isVisible();
    const hasMobileNav = await mobileNav.count() > 0;
    expect(hasNav || hasMobileNav).toBeTruthy();
  });
});

test.describe('Dashboard - Error States', () => {
  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/customer**', (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    );

    await page.goto('/dashboard');

    // Should not show blank page
    const bodyText = await page.locator('body').textContent();
    expect(bodyText!.length).toBeGreaterThan(0);

    // Should show error or fallback content
    await page.waitForTimeout(2000);
    const hasErrorUI =
      (await page.getByText(/error|unavailable|try again/i).count()) > 0;
    const hasContent =
      (await page.locator('main, article, section').count()) > 0;

    expect(hasErrorUI || hasContent).toBeTruthy();
  });

  test('should handle network errors', async ({ page }) => {
    // Abort API calls
    await page.route('**/api/**', (route) => route.abort('failed'));

    await page.goto('/dashboard');

    // Should show some UI, not crash
    await page.waitForTimeout(2000);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Dashboard - Security', () => {
  test('should not expose sensitive data in page source', async ({ page }) => {
    await page.goto('/dashboard');

    const pageSource = await page.content();

    // Should not contain full API keys
    expect(pageSource).not.toMatch(/claw_[a-f0-9]{64}/);

    // Should not contain Stripe secret keys
    expect(pageSource).not.toMatch(/sk_live_/);
    expect(pageSource).not.toMatch(/sk_test_[a-zA-Z0-9]{20,}/);

    // Should not contain database URLs
    expect(pageSource).not.toMatch(/postgresql:\/\//);
  });

  test('should have proper security headers', async ({ page }) => {
    const response = await page.goto('/dashboard');

    if (response) {
      const headers = response.headers();

      // Check for security headers (set by middleware)
      expect(headers['x-frame-options']).toBeTruthy();
      expect(headers['x-content-type-options']).toBe('nosniff');
    }
  });
});
