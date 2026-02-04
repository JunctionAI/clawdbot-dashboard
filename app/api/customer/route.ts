import { NextRequest, NextResponse } from 'next/server';

/**
 * Customer Data API
 * 
 * ⚠️ SEC-001 CRITICAL: This endpoint needs proper authentication
 * 
 * TODO Implementation Steps:
 * 1. Add NextAuth.js or similar auth library
 * 2. Verify session cookie in request
 * 3. Extract customer ID from session
 * 4. Query backend API with proper auth
 * 5. Return only data belonging to authenticated user
 * 
 * Currently returns 401 to prevent data exposure
 */

export async function GET(request: NextRequest) {
  // SEC-001: Check for auth header or session
  const authHeader = request.headers.get('authorization');
  const sessionCookie = request.cookies.get('session');
  
  // Reject if no auth present
  if (!authHeader && !sessionCookie) {
    return NextResponse.json(
      { 
        error: 'Unauthorized',
        message: 'Authentication required. Please sign in.',
      },
      { status: 401 }
    );
  }
  
  // TODO: Validate session/token and get customer data
  // For now, this is a placeholder showing what the response should look like
  
  // In development, allow with mock data for UI testing
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Customer API: Returning mock data (dev mode only)');
    return NextResponse.json({
      email: 'dev@example.com',
      plan: 'Pro',
      status: 'active',
      workspaceId: 'claw_demo_workspace',
      messagesUsed: 3420,
      messagesLimit: 20000,
      agentsUsed: 4,
      agentsLimit: 10,
      billingDate: '2026-03-01',
      trialEndsAt: null,
      _warning: 'This is mock data. Implement proper auth before production.',
    });
  }
  
  // Production: Require real auth
  return NextResponse.json(
    { 
      error: 'Not Implemented',
      message: 'Authentication system not configured.',
    },
    { status: 501 }
  );
}
