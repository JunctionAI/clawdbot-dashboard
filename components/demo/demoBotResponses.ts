// Demo bot responses keyed by keywords (separated by |)
// The first matching keyword wins

export const demoBotResponses: Record<string, string> = {
  // Email-related
  'email|inbox|mail|unread': `I'd love to help manage your emails! In the full version, I can:

📧 **Triage your inbox** - Sort by urgency, flag important senders
📝 **Draft responses** - Match your tone and style
🔔 **Proactive alerts** - Notify you when VIPs write
📊 **Daily digest** - Morning summary of what matters

*Right now this is a demo, but sign up and I'll connect to your Gmail in 45 seconds.*

What type of emails give you the most trouble?`,

  // Meeting/calendar
  'meeting|calendar|schedule|appointment|prep': `Meetings are my specialty! In the full version:

📅 **Prep briefs** - I summarize past interactions with attendees
📋 **Action items** - I track and follow up automatically
🎯 **Talking points** - Based on the agenda and your goals
⏰ **Smart reminders** - Not just "meeting in 10 min" but "here's what you need"

I'd also remember what happened in your LAST meeting with these people.

What's your biggest meeting pain point?`,

  // Code/debugging
  'code|debug|error|bug|programming|api|function': `I can definitely help with code! Here's what I do:

💻 **Debug with context** - I remember your codebase structure
🔍 **Root cause analysis** - Not just fixes, but why it broke
📚 **Your patterns** - I learn your coding style and preferences
🔗 **Integration aware** - I know your tech stack

In the full version, I'd also remember:
• Your recent commits and changes
• Past bugs and how you solved them
• Your team's coding conventions

What's the issue you're seeing?`,

  // Research/analysis
  'research|market|analysis|data|trends|study': `Research is where I really shine! I can:

🔬 **Deep dives** - Synthesize multiple sources quickly
📊 **Data analysis** - Pull trends and insights
📈 **Competitive intel** - Track your market landscape
📑 **Executive summaries** - TL;DR for busy people

The magic? I remember your past research so I build on it instead of starting fresh.

What topic would you like to explore?`,

  // Writing/content
  'write|content|blog|post|linkedin|twitter|copy': `Content creation is fun! I help with:

✍️ **Your voice** - I learn your writing style over time
🎯 **Audience fit** - Different tones for different platforms
📝 **Drafts → polish** - Iterate until it's right
🚀 **Performance tips** - Timing, hashtags, hooks that work

The full version remembers your past posts, what performed well, and your brand guidelines.

What kind of content do you need?`,

  // Task/productivity
  'task|todo|productivity|organize|busy|overwhelm': `I'm built for productivity! Here's how I help:

✅ **Task triage** - What's actually urgent vs feels urgent
📋 **Smart lists** - Auto-organized by project and priority
🔄 **Follow-ups** - I won't let things fall through cracks
⚡ **Shortcuts** - Learn your workflows, automate the boring stuff

The key difference: I remember your commitments and proactively remind you.

What's overwhelming you right now?`,

  // Memory/remember
  'remember|memory|context|forget': `Memory is my superpower! 🧠

Unlike ChatGPT, I remember:
• Every conversation we've had
• Your projects and deadlines
• Your preferences and style
• People you work with
• Decisions you've made

**Why it matters:** You never repeat yourself. I build on what we've discussed. I get smarter about YOU over time.

This is exactly why Clawdbot exists - AI that actually knows you.`,

  // Hello/greeting
  'hello|hi|hey|sup|yo|good morning|good evening': `Hey there! 👋 Great to meet you in demo mode.

I'm Ally - an AI assistant that actually remembers you. Unlike ChatGPT where every conversation starts from scratch, I build context over time.

**Try asking me about:**
• Managing emails
• Preparing for meetings  
• Debugging code
• Writing content
• Research & analysis

What can I help you explore?`,

  // How are you / chatty
  'how are you|what\'s up|how\'s it going': `I'm great! Ready to show you what an AI with memory can do. 🚀

Fun fact: In the full version, I'd remember our last conversation and pick up right where we left off. No more "let me explain my project again..."

What would you like to try?`,

  // Capabilities/what can you do
  'what can you do|capabilities|features|help me': `Great question! Here's what makes me different:

**🧠 Memory**
I remember everything - past conversations, your projects, your preferences.

**📧 Integrations**
Email, calendar, Slack, GitHub - I work where you work.

**🤖 Proactive**
I don't wait for commands. I monitor, alert, and suggest.

**⚡ Fast setup**
45 seconds. No coding, no servers, no BS.

**💬 Multi-channel**
Web, Telegram, Discord, WhatsApp - wherever you are.

What sounds most useful to you?`,

  // Pricing/cost
  'price|pricing|cost|how much|subscription': `Great timing to ask! Here's the deal:

💜 **Starter:** $29/month
• 5,000 messages
• 3 AI agents
• Core features

💎 **Pro:** $79/month (most popular)
• 20,000 messages
• 10 AI agents
• Email, calendar, Slack integration

🏢 **Enterprise:** Custom
• Unlimited everything
• Dedicated support
• Custom integrations

All plans include a **14-day free trial**. No credit card for the trial.

Shall I tell you more about any plan?`,

  // Compare/vs chatgpt
  'chatgpt|gpt|claude|compare|versus|vs|difference': `Good question! Here's the key difference:

**ChatGPT/Claude:**
❌ Forgets everything each session
❌ You re-explain context every time
❌ Passive - waits for you to ask
❌ No integrations
❌ Generic responses

**Clawdbot (me):**
✅ Remembers everything forever
✅ Builds on past conversations
✅ Proactive - monitors & suggests
✅ Email, calendar, Slack, GitHub
✅ Personalized to YOU

Think of it this way: ChatGPT is a stranger you meet daily. I'm an assistant who's been with you for years.`,

  // Why/how does memory work
  'how does|how do you|how memory|explain': `The memory system is pretty cool! Here's the gist:

**What I store:**
• Conversations (summarized, not verbatim)
• Your preferences and style
• Project context and history
• People you mention
• Decisions and outcomes

**How I use it:**
• Every new conversation has your full context
• I connect dots you might miss
• I learn what works for YOU specifically
• I proactively surface relevant past info

**Privacy:**
Your data is encrypted and yours alone. We never train on it.

Want me to demonstrate with a specific scenario?`,
};
