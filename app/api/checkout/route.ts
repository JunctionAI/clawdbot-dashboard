import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// Allowed price IDs (whitelist)
const ALLOWED_PRICE_IDS = new Set([
  process.env.STRIPE_PRICE_STARTER,
  process.env.STRIPE_PRICE_PRO,
  process.env.STRIPE_PRICE_ENTERPRISE,
].filter(Boolean));

// Rate limit check (simple in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // checkouts per hour
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

export async function GET(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Too many checkout attempts. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Retry-After': '3600',
        },
      }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const priceId = searchParams.get('price');

  // Validate price ID
  if (!priceId) {
    return NextResponse.json(
      { error: 'Bad Request', message: 'Price ID is required' },
      { status: 400 }
    );
  }

  // Whitelist check
  if (!ALLOWED_PRICE_IDS.has(priceId) && ALLOWED_PRICE_IDS.size > 0) {
    console.warn(`⚠️ Invalid price ID attempt: ${priceId} from IP: ${ip}`);
    return NextResponse.json(
      { error: 'Bad Request', message: 'Invalid price ID' },
      { status: 400 }
    );
  }

  // Validate price ID format (Stripe price IDs start with 'price_')
  if (!priceId.startsWith('price_') || priceId.length > 100) {
    return NextResponse.json(
      { error: 'Bad Request', message: 'Invalid price ID format' },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}?cancelled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          source: 'checkout_page',
          timestamp: new Date().toISOString(),
        },
      },
      metadata: {
        ip_address: ip,
        created_at: new Date().toISOString(),
      },
    });

    // Log successful checkout creation (no sensitive data)
    console.log(`✅ Checkout session created: ${session.id.substring(0, 20)}...`);

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url!);
  } catch (error: any) {
    // Log error securely
    console.error('❌ Stripe checkout error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      ip,
    });

    // Return user-friendly error
    return NextResponse.json(
      {
        error: 'Checkout Error',
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Unable to create checkout session. Please try again.',
      },
      { status: 500 }
    );
  }
}

// Handle POST for API-style checkout
export async function POST(request: NextRequest) {
  const ip = request.ip ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';

  // Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { priceId, email, successUrl, cancelUrl } = body;

    // Validate required fields
    if (!priceId || !email) {
      return NextResponse.json(
        { error: 'priceId and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate price ID format
    if (!priceId.startsWith('price_') || priceId.length > 100) {
      return NextResponse.json(
        { error: 'Invalid price ID format' },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${appUrl}?cancelled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        trial_period_days: 14,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error.message);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
