import { NextRequest, NextResponse } from 'next/server';

// Rate limit for email subscriptions (prevent spam)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5; // subscriptions per hour per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Disposable email domains to block
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'mailinator.com',
  'maildrop.cc',
  'yopmail.com',
]);

// Validate email format and domain
function validateEmail(email: string): { valid: boolean; error?: string } {
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Length check
  if (email.length > 254) {
    return { valid: false, error: 'Email address too long' };
  }

  // Disposable domain check
  const domain = email.split('@')[1].toLowerCase();
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  return { valid: true };
}

// Sanitize email
function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Simple in-memory store for subscribers (replace with database in production)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Please wait before subscribing again.',
      },
      { status: 429 }
    );
  }

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { email, source = 'website' } = body;

    // Validate email presence
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(email);
    const validation = validateEmail(sanitizedEmail);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check for duplicate (in production, check database)
    if (subscribers.has(sanitizedEmail)) {
      // Return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'Thank you! Check your inbox for confirmation.',
      });
    }

    // Store subscriber
    subscribers.add(sanitizedEmail);

    // Log subscription (no PII in production logs)
    console.log(`📧 New subscriber from ${source}:`, {
      domain: sanitizedEmail.split('@')[1],
      source,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send to email marketing service (Resend, ConvertKit, etc.)
    // await sendToEmailService(sanitizedEmail, source);

    // TODO: Send confirmation email
    // await sendConfirmationEmail(sanitizedEmail);

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for confirmation.',
    });
  } catch (error: any) {
    console.error('❌ Subscribe error:', error.message);
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    // TODO: Verify unsubscribe token
    // const isValid = await verifyUnsubscribeToken(email, token);

    const sanitizedEmail = sanitizeEmail(email);
    subscribers.delete(sanitizedEmail);

    console.log(`📭 Unsubscribed:`, {
      domain: sanitizedEmail.split('@')[1],
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'You have been unsubscribed.',
    });
  } catch (error: any) {
    console.error('❌ Unsubscribe error:', error.message);
    return NextResponse.json(
      { error: 'Unsubscribe failed' },
      { status: 500 }
    );
  }
}
