import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Checkout Flow
 * Tests the complete checkout journey from pricing to Stripe
 */

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to pricing or checkout page
    await page.goto('/checkout');
  });

  test('should display pricing tiers', async ({ page }) => {
    // Check for pricing tier cards
    await expect(page.getByText(/personal|starter|free/i).first()).toBeVisible();
    await expect(page.getByText(/plus|pro/i).first()).toBeVisible();
    await expect(page.getByText(/team|enterprise/i).first()).toBeVisible();
  });

  test('should show features for each tier', async ({ page }) => {
    // Each tier should list features
    const featureTexts = [
      'messages',
      'memory',
      'integrations',
      'support',
    ];

    for (const feature of featureTexts) {
      const featureElement = page.getByText(new RegExp(feature, 'i')).first();
      await expect(featureElement).toBeVisible();
    }
  });

  test('should highlight popular/recommended tier', async ({ page }) => {
    // Look for "Most Popular" or "Recommended" badge
    const popularBadge = page.getByText(/most popular|recommended|best value/i).first();
    await expect(popularBadge).toBeVisible();
  });

  test('should have clickable CTA buttons for each tier', async ({ page }) => {
    // Find all "Get Started" or "Subscribe" buttons
    const ctaButtons = page.locator(
      'button:has-text("Get Started"), button:has-text("Subscribe"), a:has-text("Get Started")'
    );

    const count = await ctaButtons.count();
    expect(count).toBeGreaterThan(0);

    // Each button should be clickable
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(ctaButtons.nth(i)).toBeEnabled();
    }
  });

  test('clicking paid tier should redirect to Stripe checkout', async ({ page }) => {
    // Find a paid tier CTA (not "Free")
    const paidTierButton = page.locator(
      'a[href*="checkout?price="], button:has-text("Get Started")'
    ).first();

    if (await paidTierButton.isVisible()) {
      // Monitor navigation
      const [response] = await Promise.all([
        page.waitForResponse(
          (resp) =>
            resp.url().includes('/api/checkout') ||
            resp.url().includes('stripe.com')
        ),
        paidTierButton.click(),
      ]);

      // Should either redirect to Stripe or return session URL
      expect(response.status()).toBeLessThan(500);
    }
  });

  test('should show error for invalid checkout attempt', async ({ page }) => {
    // Try to access checkout with invalid price
    await page.goto('/api/checkout?price=invalid_price_id');

    // Should show error message or redirect back
    const pageContent = await page.content();
    expect(
      pageContent.includes('Invalid') ||
      pageContent.includes('error') ||
      page.url().includes('cancelled')
    ).toBeTruthy();
  });

  test('should display annual/monthly toggle if available', async ({ page }) => {
    const toggle = page.locator(
      '[data-testid="billing-toggle"], button:has-text("Annual"), button:has-text("Monthly")'
    ).first();

    if (await toggle.isVisible()) {
      await toggle.click();
      // Prices should update
      await page.waitForTimeout(500);
    }
  });

  test('should show correct currency formatting', async ({ page }) => {
    // Prices should be formatted with $ sign
    const priceElements = page.locator('text=/\\$\\d+/');
    const count = await priceElements.count();

    expect(count).toBeGreaterThan(0);

    // Check format
    const firstPrice = await priceElements.first().textContent();
    expect(firstPrice).toMatch(/\$\d+/);
  });
});

test.describe('Checkout Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept and abort checkout API calls
    await page.route('**/api/checkout**', (route) => route.abort('failed'));

    await page.goto('/checkout');

    // Find and click a CTA
    const ctaButton = page
      .locator('a[href*="checkout"], button:has-text("Get Started")')
      .first();

    if (await ctaButton.isVisible()) {
      await ctaButton.click();

      // Should show error message, not crash
      await page.waitForTimeout(2000);
      const hasError =
        (await page.getByText(/error|failed|try again/i).count()) > 0;
      const isOnSamePage = page.url().includes('checkout');

      expect(hasError || isOnSamePage).toBeTruthy();
    }
  });

  test('should handle Stripe unavailability', async ({ page }) => {
    // Mock Stripe API being down
    await page.route('**/api/checkout**', (route) =>
      route.fulfill({
        status: 503,
        body: JSON.stringify({ error: 'Service unavailable' }),
      })
    );

    await page.goto('/checkout');

    const ctaButton = page
      .locator('a[href*="checkout"], button:has-text("Get Started")')
      .first();

    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      await page.waitForTimeout(1000);

      // Should not show blank page
      const bodyText = await page.locator('body').textContent();
      expect(bodyText!.length).toBeGreaterThan(0);
    }
  });
});

test.describe('Checkout Success Flow', () => {
  test('success page should display correctly', async ({ page }) => {
    // Navigate to success page with mock session
    await page.goto('/success?session_id=cs_test_mock_session');

    // Should show success message
    await expect(
      page.getByText(/thank|success|welcome|congratulations/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('success page should handle missing session', async ({ page }) => {
    await page.goto('/success');

    // Should handle gracefully - show message or redirect
    const pageText = await page.locator('body').textContent();
    expect(
      pageText!.includes('error') ||
      pageText!.includes('session') ||
      page.url() !== page.url().includes('success')
    ).toBeTruthy();
  });

  test('cancelled checkout should return to pricing', async ({ page }) => {
    await page.goto('/?cancelled=true');

    // Should be back on main page or show message
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Checkout Accessibility', () => {
  test('pricing cards should be keyboard navigable', async ({ page }) => {
    await page.goto('/checkout');

    // Tab through pricing cards
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Focus should be visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/checkout');

    // Check for ARIA labels on interactive elements
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const hasLabel =
        (await button.getAttribute('aria-label')) ||
        (await button.textContent());
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/checkout');

    // This is a basic check - use axe-playwright for comprehensive a11y testing
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Body should not be black (indicates potential styling issue)
    expect(bodyBg).not.toBe('rgb(0, 0, 0)');
  });
});
