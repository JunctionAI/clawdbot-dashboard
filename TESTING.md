# Testing Guide - Clawdbot Dashboard

This document describes the test suite for the Clawdbot SaaS dashboard.

## Overview

The test suite is organized into three categories:
- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test API route handlers
- **E2E Tests**: Test complete user flows with Playwright

## Running Tests

```bash
# Unit and integration tests (Jest)
npm test
npm run test:watch
npm run test:unit
npm run test:integration

# E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui  # Visual test runner
```

## Test Structure

```
__tests__/
├── setup.ts                   # Jest configuration
├── unit/
│   └── pricing.test.ts        # Pricing module tests
└── integration/
    ├── checkout-api.test.ts   # Checkout endpoint tests
    └── subscribe-api.test.ts  # Subscribe endpoint tests

e2e/
├── landing-page.spec.ts       # Landing page tests
├── checkout-flow.spec.ts      # Checkout flow tests
└── dashboard.spec.ts          # Dashboard tests
```

## Test Categories

### Unit Tests

#### pricing.test.ts
Tests the pricing module (`lib/pricing.ts`):
- **PRICING_TIERS**: Configuration validation, tier consistency
- **getTier/getTierByPriceId**: Lookup functions
- **canUseSkill/getSkillsRemaining**: Feature gating logic
- **shouldShowUpgradePrompt**: Usage threshold detection
- **getNextTier**: Upgrade path logic
- **formatPrice/calculateAnnualSavings**: Display helpers

### Integration Tests

#### checkout-api.test.ts
Tests the checkout endpoint (`app/api/checkout/route.ts`):
- **GET**: Price ID validation, whitelist enforcement, Stripe redirect
- **POST**: Email validation, session creation, URL sanitization
- **Rate Limiting**: Request throttling
- **Error Handling**: Stripe API errors, missing keys

#### subscribe-api.test.ts
Tests the subscribe endpoint (`app/api/subscribe/route.ts`):
- **POST**: Email validation, disposable email blocking
- **DELETE**: Unsubscribe with token verification
- **Rate Limiting**: Spam prevention
- **Security**: Email enumeration prevention

### E2E Tests (Playwright)

#### landing-page.spec.ts
- Hero section visibility
- Pricing section
- Navigation
- Mobile responsiveness
- SEO meta tags
- Email subscription flow

#### checkout-flow.spec.ts
- Pricing tier display
- Feature listing
- Stripe checkout redirect
- Error handling (network, Stripe down)
- Success/cancel flows
- Accessibility (keyboard nav, ARIA)

#### dashboard.spec.ts
- Authentication required
- Billing section (plan, usage, upgrade)
- Settings page
- Workspace info (API key masking)
- Responsive design (tablet, mobile)
- Error states (API errors, network errors)
- Security (no sensitive data in source)

## Bug-Catching Tests

### Price ID Whitelist Bypass
```typescript
it('should reject non-whitelisted price ID', async () => {
  const response = await POST(request);
  expect(response.status).toBe(400);
});
```

### URL Injection
```typescript
it('should sanitize custom success/cancel URLs', async () => {
  // Malicious URLs should be replaced with safe defaults
});
```

### Rate Limit Enforcement
```typescript
it('should enforce rate limiting', async () => {
  const responses = await Promise.all(requests.map(r => GET(r)));
  expect(responses.some(r => r.status === 429)).toBe(true);
});
```

### Email Enumeration Prevention
```typescript
it('should not reveal whether email exists', async () => {
  // Duplicate subscription returns same response as new
});
```

### Sensitive Data Exposure
```typescript
it('should not expose sensitive data in page source', async () => {
  expect(pageSource).not.toMatch(/claw_[a-f0-9]{64}/);
  expect(pageSource).not.toMatch(/sk_live_/);
});
```

## Coverage Requirements

```javascript
coverageThreshold: {
  global: {
    branches: 60,
    functions: 60,
    lines: 60,
    statements: 60,
  },
},
```

## E2E Test Configuration

Playwright runs tests across multiple browsers:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

Features:
- Screenshots on failure
- Video recording on retry
- Trace files for debugging
- Auto-start dev server in local mode

## Mocking Strategy

### Next.js Router
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));
```

### Stripe SDK
```typescript
jest.mock('stripe', () => jest.fn().mockImplementation(() => ({
  checkout: { sessions: { create: jest.fn() } },
})));
```

### Fetch (API calls)
```typescript
global.fetch = jest.fn();
testUtils.mockSuccessfulFetch(data);
testUtils.mockFailedFetch(500, 'Server error');
```

## Adding New Tests

### Unit Test
```typescript
// __tests__/unit/[module].test.ts
describe('Module Name', () => {
  it('should do expected behavior', () => {
    expect(result).toBe(expected);
  });
});
```

### Integration Test
```typescript
// __tests__/integration/[route].test.ts
describe('Route Name', () => {
  it('should return expected response', async () => {
    const response = await handler(mockRequest);
    expect(response.status).toBe(200);
  });
});
```

### E2E Test
```typescript
// e2e/[feature].spec.ts
test('should complete user flow', async ({ page }) => {
  await page.goto('/');
  await page.click('button');
  await expect(page.getByText('Success')).toBeVisible();
});
```

## Best Practices

1. **Test behavior, not implementation**: Focus on inputs and outputs
2. **Use meaningful assertions**: Don't just check `toBeDefined`
3. **Test edge cases**: Empty inputs, long strings, special characters
4. **Test error paths**: Network errors, API failures, invalid data
5. **Keep tests fast**: Mock external dependencies
6. **Keep tests independent**: No shared state between tests
7. **Use descriptive names**: `should reject expired session token`

## CI/CD Integration

Tests are designed for CI pipelines:
- **Jest**: Fast unit/integration tests
- **Playwright**: Headless browser tests
- **Coverage reports**: Generated for each run
- **Exit codes**: Non-zero on failure

Example GitHub Action:
```yaml
- run: npm test -- --coverage
- run: npx playwright install --with-deps
- run: npm run test:e2e
```
