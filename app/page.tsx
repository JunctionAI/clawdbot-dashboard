'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Your AI Assistant,
            <span className="text-purple-400"> Always On</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Clawdbot remembers everything, works 24/7, and gets smarter over time.
            Like ChatGPT, but it actually knows who you are.
          </p>
          <a 
            href="#pricing" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold inline-block transition"
          >
            Get Started →
          </a>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold text-white mb-2">Perfect Memory</h3>
            <p className="text-gray-400">
              Remembers every conversation, decision, and preference. Never repeat yourself.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Proactive Agent</h3>
            <p className="text-gray-400">
              Works in the background. Monitors your email, calendar, and tasks automatically.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-white mb-2">Self-Service Setup</h3>
            <p className="text-gray-400">
              Connect Gmail, Calendar, Slack in one click. No manual configuration needed.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="max-w-5xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Simple Pricing</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-4xl font-bold text-purple-400 mb-4">
                $29<span className="text-lg text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ 5,000 messages/month</li>
                <li>✓ 3 agents</li>
                <li>✓ Chat + Memory + Web</li>
                <li>✓ Email support</li>
              </ul>
              <a 
                href="/api/checkout?price=price_1SwtCbBfSldKMuDjM3p0kyG4"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center transition"
              >
                Start Free Trial
              </a>
            </div>

            {/* Pro */}
            <div className="bg-purple-900/30 backdrop-blur p-8 rounded-lg border-2 border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="text-4xl font-bold text-purple-400 mb-4">
                $79<span className="text-lg text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ 20,000 messages/month</li>
                <li>✓ 10 agents</li>
                <li>✓ All Starter features</li>
                <li>✓ Gmail + Calendar</li>
                <li>✓ Browser automation</li>
                <li>✓ Priority support</li>
              </ul>
              <a 
                href="/api/checkout?price=price_1SwtCbBfSldKMuDjDmRHqErh"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center transition"
              >
                Start Free Trial
              </a>
            </div>

            {/* Team */}
            <div className="bg-gray-800/50 backdrop-blur p-8 rounded-lg border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">Team</h3>
              <div className="text-4xl font-bold text-purple-400 mb-4">
                $199<span className="text-lg text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300">
                <li>✓ 100,000 messages/month</li>
                <li>✓ Unlimited agents</li>
                <li>✓ All Pro features</li>
                <li>✓ 5 team seats</li>
                <li>✓ Shared workspaces</li>
                <li>✓ Dedicated support</li>
              </ul>
              <a 
                href="/api/checkout?price=price_1SwtCcBfSldKMuDjEKBqQ6lH"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold text-center transition"
              >
                Start Free Trial
              </a>
            </div>
          </div>
          
          <p className="text-center text-gray-400 mt-6">
            All plans include a <strong className="text-white">14-day free trial</strong>. No credit card required.
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                What makes Clawdbot different from ChatGPT?
              </h3>
              <p className="text-gray-400">
                ChatGPT forgets everything between sessions. Clawdbot remembers your conversations, 
                preferences, projects, and context. It's also proactive—checking your email, calendar, 
                and tasks in the background.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-400">
                Yes! All plans include a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-400">
                Absolutely. Cancel with one click from your dashboard. No questions asked.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                What integrations are supported?
              </h3>
              <p className="text-gray-400">
                Gmail, Google Calendar, Slack, and browser automation are included. More integrations 
                coming soon (GitHub, Notion, Linear, etc.).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2026 Clawdbot SaaS. Built for productivity.</p>
          <div className="mt-4 space-x-6">
            <a href="mailto:support@setupclaw.com" className="hover:text-gray-300">Support</a>
            <a href="https://docs.setupclaw.com" className="hover:text-gray-300">Docs</a>
            <a href="#" className="hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-300">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
