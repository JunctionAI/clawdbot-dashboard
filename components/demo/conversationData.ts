import { ExampleConversation } from './types';

export const exampleConversations: ExampleConversation[] = [
  {
    id: 'email-triage',
    title: 'Email Triage & Response',
    description: 'See how Ally handles your inbox chaos',
    icon: '📧',
    category: 'email',
    messages: [
      {
        role: 'user',
        content: "I have 47 unread emails. Can you help me prioritize them?",
      },
      {
        role: 'assistant',
        content: `I've scanned your inbox. Here's what needs attention:

**🔴 Urgent (3 emails)**
• **Client contract renewal** from Sarah @ TechCorp - expires tomorrow
• **Server alert** - Production DB showing high latency
• **Board meeting reschedule** - response needed by EOD

**🟡 Important (8 emails)**
• 3 interview candidate responses
• Q4 budget review from finance
• Partnership proposal from DataFlow Inc
• 2 team 1:1 follow-ups
• LinkedIn connection from VC you met last week

**📁 Can wait / Auto-handle (36 emails)**
• 12 newsletters (I'll summarize the good ones)
• 8 automated notifications
• 16 low-priority threads

Want me to draft responses for the urgent ones?`,
      },
      {
        role: 'user',
        content: "Yes, draft a response for the client contract renewal",
      },
      {
        role: 'assistant',
        content: `Here's a draft for Sarah @ TechCorp:

---

**Subject:** Re: TechCorp Contract Renewal

Hi Sarah,

Thank you for the reminder about our contract renewal. We've greatly valued our partnership over the past year.

I've reviewed the proposed terms and would like to discuss a few points:
1. The 15% rate increase - could we explore a 10% increase with a 2-year commitment?
2. Adding the new API integration tier
3. Clarifying the SLA terms in Section 4.2

Are you available for a quick call tomorrow morning? I'm free 9-11am PST.

Best regards,
[Your name]

---

**Tone:** Professional, constructive
**Length:** Concise but thorough

Shall I send this, or would you like to adjust anything?`,
      },
    ],
  },
  {
    id: 'meeting-prep',
    title: 'Meeting Preparation',
    description: 'Watch Ally prepare you for important meetings',
    icon: '📅',
    category: 'productivity',
    messages: [
      {
        role: 'user',
        content: "I have a board meeting in 2 hours. Can you help me prepare?",
      },
      {
        role: 'assistant',
        content: `I remember your last board meeting was on December 15th. Let me pull together what you need:

**📊 Your Meeting Brief**

**Attendees:** 5 board members + you
• David Chen (Chairman) - asked about hiring velocity last time
• Sarah Martinez - focused on burn rate
• Michael Thompson - wants product roadmap update
• Lisa Wong - customer acquisition metrics
• James Park - technical infrastructure questions

**🎯 Action Items from Last Meeting:**
✅ Hire 2 senior engineers (done - started Jan 3)
⏳ Reduce CAC by 15% (currently at 12% reduction)
✅ Launch mobile app beta (shipped Jan 10)
❌ Partnership with DataFlow (still negotiating)

**📈 Key Metrics to Highlight:**
• MRR: $127K → $156K (+23% since last meeting)
• Churn: 4.2% → 3.1% (improvement!)
• NPS: 42 → 51 (above industry average)

**⚠️ Potential Tough Questions:**
1. Why is CAC reduction behind target?
2. DataFlow partnership timeline?
3. Runway with current burn rate?

Want me to prepare talking points for any of these?`,
      },
      {
        role: 'user',
        content: "Yes, give me talking points for the CAC question",
      },
      {
        role: 'assistant',
        content: `**Talking Points: CAC Reduction (12% vs 15% target)**

**Open with the positive:**
"We've made meaningful progress on CAC, bringing it down 12% - just shy of our 15% target."

**Explain the context:**
• Seasonal Q4 ad costs were 20% higher than projected
• We deliberately maintained spend to capture holiday demand
• Result: 34% more conversions, offsetting higher per-unit cost

**Show the trajectory:**
"January data shows we're tracking to hit 18% reduction by end of Q1. The infrastructure we built in Q4 is now paying off."

**Specific wins:**
• New referral program: 23% of January signups (zero CAC)
• Content marketing: organic traffic up 45%
• Retargeting optimization: conversion rate +31%

**Redirect to LTV:**
"More importantly, LTV:CAC ratio improved from 3.1 to 3.8. We're not just acquiring cheaper - we're acquiring better."

**Confident close:**
"We expect to exceed the annual CAC target. Happy to walk through the Q1 projections in detail."

---

Would you like me to create a one-page summary doc you can reference during the meeting?`,
      },
    ],
  },
  {
    id: 'code-review',
    title: 'Code Review & Debugging',
    description: 'See Ally help with technical problems',
    icon: '💻',
    category: 'coding',
    messages: [
      {
        role: 'user',
        content: "Our API is returning 500 errors intermittently. Can you help debug?",
      },
      {
        role: 'assistant',
        content: `I'll help investigate. A few questions to narrow this down:

**Quick diagnostics:**
1. When did this start? (deploy, traffic spike, config change?)
2. Which endpoints are affected?
3. Any patterns in timing? (every N minutes, specific hours?)

**While you answer, I'll check what I can access:**

From your recent commits, I see:
• Jan 28: Database connection pool changes
• Jan 27: New authentication middleware
• Jan 26: Redis caching layer added

**Initial hypothesis:** The connection pool change on the 28th is the most likely culprit for intermittent 500s. This pattern usually indicates:
- Pool exhaustion under load
- Connection timeout misconfiguration
- Missing connection release on errors

Can you share:
1. Your current pool configuration?
2. A sample error log/stack trace?
3. Approximate request volume when errors occur?`,
      },
      {
        role: 'user',
        content: "It started after the connection pool changes. Here's the config: max: 10, min: 2, idle: 30000",
      },
      {
        role: 'assistant',
        content: `Found it. Your pool is undersized for your traffic.

**The Problem:**
\`\`\`
max: 10        ← Too low
min: 2         ← OK
idle: 30000    ← 30 seconds, reasonable
\`\`\`

With 10 max connections and your traffic (~200 req/min based on your metrics), you're hitting pool exhaustion during burst periods.

**The Fix:**

\`\`\`javascript
// Before (problematic)
const pool = new Pool({
  max: 10,
  min: 2,
  idleTimeoutMillis: 30000
});

// After (recommended)
const pool = new Pool({
  max: 50,                    // Handle bursts
  min: 10,                    // Keep warm connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,  // Fail fast vs hang
  allowExitOnIdle: false          // Keep pool alive
});
\`\`\`

**Why this works:**
• 50 max handles 5x your baseline with headroom
• 10 min keeps connections warm, faster response
• 5s connection timeout prevents request pile-up

**Also add connection error handling:**
\`\`\`javascript
pool.on('error', (err) => {
  console.error('Pool error:', err);
  // Alert/metric here
});
\`\`\`

Want me to create a PR with these changes?`,
      },
    ],
  },
  {
    id: 'research-summary',
    title: 'Research & Analysis',
    description: 'Watch Ally synthesize complex information',
    icon: '🔬',
    category: 'research',
    messages: [
      {
        role: 'user',
        content: "I need to understand the AI agent market for our investor pitch. Can you research this?",
      },
      {
        role: 'assistant',
        content: `I'll compile a comprehensive market analysis for your pitch. Here's what I found:

**🌍 AI Agent Market Overview**

**Market Size & Growth:**
• 2024: $5.1B
• 2028 (projected): $28.5B
• CAGR: 43.8%
• Fastest growing segment: Personal AI assistants (+67% YoY)

**Key Players & Positioning:**

| Company | Focus | Funding | Weakness |
|---------|-------|---------|----------|
| Anthropic | Enterprise AI | $7.3B | No persistent memory |
| OpenAI | General AI | $13B | Privacy concerns |
| Adept | Action agents | $415M | Enterprise only |
| Inflection | Personal AI | $1.5B | Pivoted away |

**Your Competitive Advantage:**
Unlike ChatGPT/Claude which reset each conversation, Clawdbot offers:
✅ Persistent memory across sessions
✅ Proactive monitoring (email, calendar)
✅ 45-second setup (vs hours for competitors)
✅ Multi-channel (Telegram, Discord, WhatsApp)

**Market Trends Working in Your Favor:**
1. "Memory" is the #1 requested AI feature (per recent surveys)
2. Enterprise → Consumer shift happening now
3. Privacy-first approaches gaining traction
4. Agent fatigue from complex setups

Would you like me to create pitch deck slides from this data?`,
      },
      {
        role: 'user',
        content: "Yes, create 3 key slides for the market opportunity section",
      },
      {
        role: 'assistant',
        content: `**Slide 1: The Memory Gap**

🧠 **AI Has an Amnesia Problem**

*Every ChatGPT conversation starts from zero.*

• 73% of users repeat context in every session (Pew Research, 2024)
• Average user wastes 12 minutes/day re-explaining to AI
• Enterprise loses $4,200/employee/year to "AI context switching"

**The Opportunity:**
First-mover in "AI with memory" captures the frustration of 100M+ ChatGPT users

---

**Slide 2: Market Explosion**

📈 **$28.5B by 2028**

\`\`\`
2024: $5.1B  ████
2025: $9.2B  ████████
2026: $15.1B ██████████████
2027: $21.8B ████████████████████
2028: $28.5B ██████████████████████████
\`\`\`

**Why now:**
• LLM costs dropped 90% in 18 months
• Consumer trust in AI at all-time high
• "Personal AI" search volume up 340% YoY

---

**Slide 3: Competitive Moat**

🏰 **Why We Win**

| Feature | ChatGPT | Claude | **Clawdbot** |
|---------|---------|--------|--------------|
| Memory | ❌ | ❌ | ✅ |
| Proactive | ❌ | ❌ | ✅ |
| Multi-channel | ❌ | ❌ | ✅ |
| Setup time | Hours | Hours | **45 sec** |
| Price | $20/mo | $20/mo | **$29/mo** |

**Moat:** 6-month head start on memory architecture
**Lock-in:** More context = more value = higher retention

---

Shall I format these for Google Slides or Pitch?`,
      },
    ],
  },
  {
    id: 'creative-writing',
    title: 'Creative & Content',
    description: 'See Ally help with writing and brainstorming',
    icon: '✍️',
    category: 'creative',
    messages: [
      {
        role: 'user',
        content: "I need to write a LinkedIn post announcing our Series A. Make it authentic, not cringe.",
      },
      {
        role: 'assistant',
        content: `Here are 3 options, from most professional to most personal:

---

**Option A: The Milestone (Safe, Professional)**

We raised our Series A.

But the real milestone? The 2,847 users who trusted us before any investor did.

To our early believers: this is your round too.

To our new partners at [VC]: thank you for seeing what we see.

Now, back to building.

---

**Option B: The Story (Personal, Memorable)**

342 rejections.

That's how many "no's" we got before our first "yes."

Today we announced our Series A, led by [VC].

But I'm not posting to celebrate the money.

I'm posting because of what those rejections taught us:
• Our pitch was wrong (the product wasn't)
• "Not now" isn't "never"
• The right partner waits for you to be ready

To everyone still in the rejection phase: keep going. The math only needs to work once.

---

**Option C: The Anti-Announcement (Bold, Contrarian)**

We raised a Series A.

That's not the interesting part.

The interesting part is what we're NOT going to do with it:
❌ Hire 50 people overnight
❌ Open offices in 3 cities
❌ Rebrand for no reason

What we ARE doing:
✅ Same team, better tools
✅ Same focus, deeper moat
✅ Same users, bigger promises kept

Boring? Maybe. But boring compounds.

---

**My recommendation:** Option B. It's vulnerable without being performative, and the "342 rejections" hook is memorable.

Which direction feels right? I can refine any of these.`,
      },
      {
        role: 'user',
        content: "I like B but make it shorter and add a call to action for hiring",
      },
      {
        role: 'assistant',
        content: `**Final Version:**

---

342 rejections before our first "yes."

Today: Series A, led by [VC].

What 342 no's taught me:
• The pitch was wrong. The product wasn't.
• "Not now" ≠ "never"
• The right partner waits.

To anyone still collecting rejections: the math only needs to work once.

Now we're hiring the team to prove them all right.

If you want to build AI that actually remembers (and work with people who don't give up), DM me or check the link in comments.

---

**Stats:**
• 147 words (optimal for engagement)
• Hook: Numbers + adversity
• CTA: Hiring (natural, not forced)
• Tone: Confident humility

**Hashtags (if you want them):**
#startup #seriesA #hiring #AI

**Pro tip:** Post Tuesday-Thursday, 8-10am your audience's timezone. Engage with first 10 comments within 30 minutes for algorithm boost.

Ready to post? I can also draft a follow-up comment with the job links.`,
      },
    ],
  },
];

export const getConversationsByCategory = (category: ExampleConversation['category']) => {
  return exampleConversations.filter(c => c.category === category);
};

export const getConversationById = (id: string) => {
  return exampleConversations.find(c => c.id === id);
};
