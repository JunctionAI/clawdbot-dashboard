import { NextRequest, NextResponse } from 'next/server';

// Direct Anthropic API call - no Clawdbot CLI needed
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: 'AI service not configured',
        reply: "I'm not fully set up yet. Please contact support." 
      }, { status: 503 });
    }

    // Build messages array
    const messages = [
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are Ally, a helpful AI assistant. You're friendly, concise, and actually useful.

You help users with:
- Answering questions
- Writing and editing
- Planning and organization
- Research and analysis
- Creative tasks

Be conversational but efficient. Don't be overly formal or robotic.`,
        messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return NextResponse.json({ 
        error: 'AI request failed',
        reply: "Sorry, I couldn't process that. Please try again."
      }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "I couldn't generate a response.";

    return NextResponse.json({ 
      reply,
      messageId: `msg_${Date.now()}`
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      reply: "Something went wrong. Please try again."
    }, { status: 500 });
  }
}
