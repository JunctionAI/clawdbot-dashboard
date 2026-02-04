import { NextRequest, NextResponse } from 'next/server';

// TODO: Implement proper authentication
// For now, this returns mock data

export async function GET(request: NextRequest) {
  // TODO: Get customer ID from session/auth token
  // TODO: Query backend API for customer data
  
  // Mock response for now
  return NextResponse.json({
    email: 'user@example.com',
    plan: 'Pro',
    status: 'active',
    workspaceId: 'claw_demo_workspace',
    messagesUsed: 3420,
    messagesLimit: 20000,
    agentsUsed: 4,
    agentsLimit: 10,
    billingDate: '2026-03-01',
    trialEndsAt: null
  });
}
