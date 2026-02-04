'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BrainIcon, ZapIcon, LinkIcon, MessageSquareIcon } from '@/components/ui/icons';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-gradient bg-300%">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
      
      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 sm:py-20 lg:py-24">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge variant="info" size="lg" className="mb-6 animate-bounce-subtle">
              ✨ Next-Gen AI Assistant
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your AI Assistant,
              <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-300%">
                Always On
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Clawdbot remembers everything, works 24/7, and gets smarter over time.
              Like ChatGPT, but it actually knows who you are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#pricing">
                <Button size="lg" className="text-lg px-8 py-4 shadow-glow-lg animate-scale-in">
                  Get Started →
                </Button>
              </a>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 animate-scale-in" style={{ animationDelay: '0.1s' } as React.CSSProperties}>
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto">
            <Card 
              hover 
              gradient 
              className="animate-fade-in-up border-purple-500/20"
              style={{ animationDelay: '0.2s' } as React.CSSProperties}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 mb-4 text-purple-400 animate-bounce-subtle">
                  <BrainIcon className="w-16 h-16" />
                </div>
                <CardTitle className="mb-3 text-xl">Perfect Memory</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Remembers every conversation, decision, and preference. Never repeat yourself.
                </CardDescription>
              </div>
            </Card>

            <Card 
              hover 
              gradient 
              className="animate-fade-in-up border-blue-500/20"
              style={{ animationDelay: '0.3s' } as React.CSSProperties}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 mb-4 text-blue-400 animate-bounce-subtle" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
                  <ZapIcon className="w-16 h-16" />
                </div>
                <CardTitle className="mb-3 text-xl">Proactive Agent</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Works in the background. Monitors your email, calendar, and tasks automatically.
                </CardDescription>
              </div>
            </Card>

            <Card 
              hover 
              gradient 
              className="animate-fade-in-up border-green-500/20"
              style={{ animationDelay: '0.4s' } as React.CSSProperties}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 mb-4 text-green-400 animate-bounce-subtle" style={{ animationDelay: '0.4s' } as React.CSSProperties}>
                  <LinkIcon className="w-16 h-16" />
                </div>
                <CardTitle className="mb-3 text-xl">Self-Service Setup</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Connect Gmail, Calendar, Slack in one click. No manual configuration needed.
                </CardDescription>
              </div>
            </Card>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-gray-400">
                All plans include a <span className="text-white font-semibold">14-day free trial</span>. No credit card required.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Starter */}
              <Card 
                className="animate-fade-in-up border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                style={{ animationDelay: '0.5s' } as React.CSSProperties}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <div className="text-4xl lg:text-5xl font-bold text-purple-400 my-4">
                    $29<span className="text-lg text-gray-400">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> 5,000 messages/month
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> 3 agents
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Chat + Memory + Web
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Email support
                    </li>
                  </ul>
                  <a href="/api/checkout?price=price_1SwtCbBfSldKMuDjM3p0kyG4" className="block w-full">
                    <Button variant="outline" className="w-full">
                      Start Free Trial
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Pro - Featured */}
              <Card 
                className="animate-fade-in-up bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-2 border-purple-500 shadow-glow-lg relative scale-105 hover:scale-110 transition-transform duration-300"
                style={{ animationDelay: '0.6s' } as React.CSSProperties}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="success" size="lg" className="shadow-glow animate-bounce-subtle">
                    ⭐ POPULAR
                  </Badge>
                </div>
                <CardHeader className="pt-6">
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <div className="text-4xl lg:text-5xl font-bold text-purple-400 my-4">
                    $79<span className="text-lg text-gray-400">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> 20,000 messages/month
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> 10 agents
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> All Starter features
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Gmail + Calendar
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Browser automation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Priority support
                    </li>
                  </ul>
                  <a href="/api/checkout?price=price_1SwtCbBfSldKMuDjDmRHqErh" className="block w-full">
                    <Button className="w-full shadow-glow">
                      Start Free Trial
                    </Button>
                  </a>
                </CardContent>
              </Card>

              {/* Team */}
              <Card 
                className="animate-fade-in-up border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                style={{ animationDelay: '0.7s' } as React.CSSProperties}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">Team</CardTitle>
                  <div className="text-4xl lg:text-5xl font-bold text-purple-400 my-4">
                    $199<span className="text-lg text-gray-400">/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> 100,000 messages/month
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Unlimited agents
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> All Pro features
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> 5 team seats
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Shared workspaces
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span> Dedicated support
                    </li>
                  </ul>
                  <a href="/api/checkout?price=price_1SwtCcBfSldKMuDjEKBqQ6lH" className="block w-full">
                    <Button variant="outline" className="w-full">
                      Start Free Trial
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12 animate-fade-in-up">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  q: 'What makes Clawdbot different from ChatGPT?',
                  a: 'ChatGPT forgets everything between sessions. Clawdbot remembers your conversations, preferences, projects, and context. It\'s also proactive—checking your email, calendar, and tasks in the background.'
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Yes! All plans include a 14-day free trial. No credit card required to start.'
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Absolutely. Cancel with one click from your dashboard. No questions asked.'
                },
                {
                  q: 'What integrations are supported?',
                  a: 'Gmail, Google Calendar, Slack, and browser automation are included. More integrations coming soon (GitHub, Notion, Linear, etc.).'
                }
              ].map((faq, i) => (
                <Card 
                  key={i}
                  hover
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.8 + i * 0.1}s` } as React.CSSProperties}
                >
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card 
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50 shadow-glow-lg animate-fade-in-up"
            style={{ animationDelay: '1.2s' } as React.CSSProperties}
          >
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl mb-4">
                Ready to get started?
              </CardTitle>
              <CardDescription className="text-lg mb-6">
                Join hundreds of professionals using Clawdbot to stay organized and productive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/api/checkout?price=price_1SwtCbBfSldKMuDjDmRHqErh">
                <Button size="lg" className="text-lg px-12 py-4 shadow-glow-lg">
                  Start Your Free Trial →
                </Button>
              </a>
              <p className="text-gray-400 text-sm mt-4">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-20 py-12 animate-fade-in">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MessageSquareIcon className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold text-white">Clawdbot</span>
            </div>
            <p className="text-gray-400 mb-6">Built for productivity. Designed for humans.</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-500">
              <a href="mailto:support@setupclaw.com" className="hover:text-purple-400 transition-colors">
                Support
              </a>
              <a href="https://docs.setupclaw.com" className="hover:text-purple-400 transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
            </div>
            <p className="text-gray-600 text-sm mt-8">
              © 2026 Clawdbot SaaS. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
