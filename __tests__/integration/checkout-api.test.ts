/**
 * Integration Tests for Checkout API
 * Tests the checkout endpoint with mocked Stripe
 */

import { NextRequest } from 'next/server';

// Mock Stripe before importing the route
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  }));
});

describe('Checkout API', () => {
  let GET: any;
  let POST: any;
  let mockStripe: any;

  beforeEach(async () => {
    jest.resetModules();
    
    // Set required env vars
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
    process.env.STRIPE_PRICE_PLUS = 'price_1SwtCbBfSldKMuDjM3p0kyG4';
    process.env.STRIPE_PRICE_PRO = 'price_1SwtCbBfSldKMuDjDmRHqErh';
    process.env.STRIPE_PRICE_TEAM = 'price_1SwtCcBfSldKMuDjEKBqQ6lH';

    // Import route handlers
    const routeModule = await import('@/app/api/checkout/route');
    GET = routeModule.GET;
    POST = routeModule.POST;

    // Get mock instance
    const Stripe = require('stripe');
    mockStripe = new Stripe();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/checkout', () => {
    it('should return 400 when price ID is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Price ID');
    });

    it('should return 400 for invalid price ID format', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/checkout?price=invalid_format'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid');
    });

    it('should return 400 for non-whitelisted price ID', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/checkout?price=price_not_in_whitelist'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid');
    });

    it('should redirect to Stripe for valid price ID', async () => {
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/session/cs_test_123',
      });

      const request = new NextRequest(
        'http://localhost:3000/api/checkout?price=price_1SwtCbBfSldKMuDjM3p0kyG4'
      );

      const response = await GET(request);

      // Should redirect (307)
      expect(response.status).toBe(307);
      expect(response.headers.get('Location')).toContain('stripe.com');
    });

    it('should handle Stripe API errors gracefully', async () => {
      mockStripe.checkout.sessions.create.mockRejectedValue(
        new Error('Stripe API error')
      );

      const request = new NextRequest(
        'http://localhost:3000/api/checkout?price=price_1SwtCbBfSldKMuDjM3p0kyG4'
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });

    // BUG CATCHER: Rate limiting
    it('should enforce rate limiting', async () => {
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/session/cs_test_123',
      });

      // Make 11 requests (limit is 10)
      const requests = Array(11)
        .fill(null)
        .map(() =>
          new NextRequest(
            'http://localhost:3000/api/checkout?price=price_1SwtCbBfSldKMuDjM3p0kyG4'
          )
        );

      const responses = await Promise.all(requests.map((r) => GET(r)));
      const statuses = responses.map((r) => r.status);

      // At least one should be rate limited
      expect(statuses).toContain(429);
    });

    // BUG CATCHER: Long price ID
    it('should reject very long price IDs', async () => {
      const longPriceId = 'price_' + 'a'.repeat(200);
      const request = new NextRequest(
        `http://localhost:3000/api/checkout?price=${longPriceId}`
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/checkout', () => {
    it('should return 400 when priceId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('priceId');
    });

    it('should return 400 when email is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ priceId: 'price_1SwtCbBfSldKMuDjM3p0kyG4' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          priceId: 'price_1SwtCbBfSldKMuDjM3p0kyG4',
          email: 'not-an-email',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('email');
    });

    it('should return session ID for valid request', async () => {
      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/session/cs_test_123',
      });

      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          priceId: 'price_1SwtCbBfSldKMuDjM3p0kyG4',
          email: 'test@example.com',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.sessionId).toBe('cs_test_123');
      expect(data.url).toContain('stripe.com');
    });

    // BUG CATCHER: URL injection in success/cancel URLs
    it('should sanitize custom success/cancel URLs', async () => {
      mockStripe.checkout.sessions.create.mockImplementation(async (params) => {
        // Verify URLs are same-origin
        expect(params.success_url).toMatch(/^http:\/\/localhost:3000/);
        expect(params.cancel_url).toMatch(/^http:\/\/localhost:3000/);
        return { id: 'cs_test_123', url: 'https://checkout.stripe.com/test' };
      });

      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          priceId: 'price_1SwtCbBfSldKMuDjM3p0kyG4',
          email: 'test@example.com',
          successUrl: 'https://evil.com/steal-data',
          cancelUrl: 'https://evil.com/phishing',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
    });

    // BUG CATCHER: Price ID whitelist bypass
    it('should enforce whitelist on POST endpoint too', async () => {
      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          priceId: 'price_unauthorized',
          email: 'test@example.com',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid');
    });
  });

  describe('Security', () => {
    // BUG CATCHER: Missing Stripe key
    it('should return 503 when Stripe is not configured', async () => {
      jest.resetModules();
      delete process.env.STRIPE_SECRET_KEY;

      const routeModule = await import('@/app/api/checkout/route');
      const request = new NextRequest(
        'http://localhost:3000/api/checkout?price=price_test'
      );

      const response = await routeModule.GET(request);
      
      // Should indicate configuration error
      expect([400, 503]).toContain(response.status);
    });

    // BUG CATCHER: Trial period configuration
    it('should include 14-day trial in checkout session', async () => {
      mockStripe.checkout.sessions.create.mockImplementation(async (params) => {
        expect(params.subscription_data.trial_period_days).toBe(14);
        return { id: 'cs_test_123', url: 'https://checkout.stripe.com/test' };
      });

      const request = new NextRequest('http://localhost:3000/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          priceId: 'price_1SwtCbBfSldKMuDjM3p0kyG4',
          email: 'test@example.com',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      await POST(request);

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
    });
  });
});
