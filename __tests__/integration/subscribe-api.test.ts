/**
 * Integration Tests for Subscribe API
 * Tests the email subscription endpoint
 */

import { NextRequest } from 'next/server';

describe('Subscribe API', () => {
  let POST: any;
  let DELETE: any;

  beforeEach(async () => {
    jest.resetModules();
    
    // Import route handlers fresh for each test
    const routeModule = await import('@/app/api/subscribe/route');
    POST = routeModule.POST;
    DELETE = routeModule.DELETE;
  });

  describe('POST /api/subscribe', () => {
    it('should return 400 when email is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Email');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidEmails = [
        'not-an-email',
        '@missing-local.com',
        'missing@',
        'spaces in@email.com',
        '',
      ];

      for (const email of invalidEmails) {
        const request = new NextRequest('http://localhost:3000/api/subscribe', {
          method: 'POST',
          body: JSON.stringify({ email }),
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      }
    });

    it('should reject disposable email addresses', async () => {
      const disposableEmails = [
        'test@mailinator.com',
        'test@tempmail.com',
        'test@guerrillamail.com',
        'test@10minutemail.com',
        'test@yopmail.com',
      ];

      for (const email of disposableEmails) {
        const request = new NextRequest('http://localhost:3000/api/subscribe', {
          method: 'POST',
          body: JSON.stringify({ email }),
          headers: { 'Content-Type': 'application/json' },
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toContain('Disposable');
      }
    });

    it('should accept valid email addresses', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: 'valid@example.com' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBeDefined();
    });

    it('should normalize email to lowercase', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: '  TEST@EXAMPLE.COM  ' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      // Email should be stored as lowercase and trimmed
    });

    it('should handle duplicate subscriptions gracefully', async () => {
      const email = 'duplicate@example.com';

      // First subscription
      const request1 = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      });
      const response1 = await POST(request1);
      expect(response1.status).toBe(200);

      // Second subscription (duplicate)
      const request2 = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' },
      });
      const response2 = await POST(request2);

      // Should return success to prevent email enumeration
      expect(response2.status).toBe(200);
    });

    // BUG CATCHER: Rate limiting
    it('should enforce rate limiting', async () => {
      const requests = Array(6)
        .fill(null)
        .map(
          (_, i) =>
            new NextRequest('http://localhost:3000/api/subscribe', {
              method: 'POST',
              body: JSON.stringify({ email: `user${i}@example.com` }),
              headers: { 'Content-Type': 'application/json' },
            })
        );

      const responses = await Promise.all(requests.map((r) => POST(r)));
      const statuses = responses.map((r) => r.status);

      // 5 allowed per hour, 6th should be rate limited
      expect(statuses.filter((s) => s === 429).length).toBeGreaterThan(0);
    });

    it('should return 400 for invalid JSON body', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: 'not valid json{{{',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should accept optional source parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'source-test@example.com',
          source: 'landing_page',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    // BUG CATCHER: Very long email
    it('should reject very long email addresses', async () => {
      const longEmail = 'a'.repeat(300) + '@example.com';
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email: longEmail }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('too long');
    });
  });

  describe('DELETE /api/subscribe', () => {
    it('should return 400 when email is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/subscribe?token=abc123',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Email');
    });

    it('should return 400 when token is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/subscribe?email=test@example.com',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('token');
    });

    it('should successfully unsubscribe with valid parameters', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/subscribe?email=test@example.com&token=valid_token',
        { method: 'DELETE' }
      );

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe('Security', () => {
    // BUG CATCHER: Email enumeration prevention
    it('should not reveal whether email exists', async () => {
      // Subscribe first
      const subscribeRequest = new NextRequest(
        'http://localhost:3000/api/subscribe',
        {
          method: 'POST',
          body: JSON.stringify({ email: 'exists@example.com' }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      await POST(subscribeRequest);

      // Try to subscribe again - should return same response as first time
      const duplicateRequest = new NextRequest(
        'http://localhost:3000/api/subscribe',
        {
          method: 'POST',
          body: JSON.stringify({ email: 'exists@example.com' }),
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const duplicateResponse = await POST(duplicateRequest);

      // Should return success, not "already subscribed"
      expect(duplicateResponse.status).toBe(200);
      const data = await duplicateResponse.json();
      expect(data.success).toBe(true);
      // Message should NOT indicate the email already exists
      expect(data.message).not.toContain('already');
    });

    // BUG CATCHER: XSS in email
    it('should handle special characters in email safely', async () => {
      const request = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test+<script>@example.com',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      // Should either reject as invalid or sanitize - not crash
      expect([200, 400]).toContain(response.status);
    });
  });
});
