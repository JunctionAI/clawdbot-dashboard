import { NextRequest, NextResponse } from 'next/server';

// Email list subscription (for waitlist/marketing)
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    // TODO: Add to email marketing list (Resend, ConvertKit, etc.)
    console.log('New email subscriber:', email);

    // For now, store in database or send to webhook
    // await fetch('https://hooks.zapier.com/...', {
    //   method: 'POST',
    //   body: JSON.stringify({ email })
    // });

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully!'
    });
  } catch (error: any) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}
