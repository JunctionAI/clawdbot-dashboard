'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ZapIcon, MessageSquareIcon } from '@/components/ui/icons';

export default function SuccessPage() {
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    // Disable confetti after 5 seconds
    const timer = setTimeout(() => setConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-gradient bg-300% flex items-center justify-center p-4">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
      
      {/* Confetti effect */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full animate-bounce-subtle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-2xl w-full">
        <Card className="bg-gradient-to-br from-green-900/30 to-purple-900/30 border-green-500/50 shadow-glow-lg animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 mb-6 text-green-400 animate-bounce-subtle">
              <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <Badge variant="success" size="lg" className="mb-4 animate-pulse-subtle">
              🎉 Payment Successful!
            </Badge>
            <CardTitle className="text-3xl sm:text-4xl mb-4">
              Welcome to Clawdbot!
            </CardTitle>
            <CardDescription className="text-lg">
              Your subscription is now active. Let's get you set up.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Next Steps */}
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700/50 animate-fade-in-up" style={{ animationDelay: '0.2s' } as React.CSSProperties}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ZapIcon className="w-5 h-5 text-purple-400" />
                What's Next?
              </h3>
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Check your email</p>
                    <p className="text-gray-400 text-sm">We've sent your workspace credentials and getting started guide.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Access your dashboard</p>
                    <p className="text-gray-400 text-sm">Manage your subscription, usage, and settings.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Connect your tools</p>
                    <p className="text-gray-400 text-sm">Link Gmail, Calendar, Slack and other integrations.</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' } as React.CSSProperties}>
              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30 text-center">
                <div className="text-2xl font-bold text-white mb-1">14 days</div>
                <div className="text-sm text-gray-400">Free trial</div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30 text-center">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">AI assistance</div>
              </div>
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30 text-center">
                <div className="text-2xl font-bold text-white mb-1">∞</div>
                <div className="text-sm text-gray-400">Memory</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' } as React.CSSProperties}>
              <Button className="flex-1 shadow-glow" size="lg">
                <ZapIcon className="w-5 h-5" />
                Go to Dashboard
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                <MessageSquareIcon className="w-5 h-5" />
                Read Quick Start
              </Button>
            </div>

            {/* Support */}
            <div className="text-center pt-4 border-t border-gray-700/50 animate-fade-in" style={{ animationDelay: '0.8s' } as React.CSSProperties}>
              <p className="text-gray-400 text-sm mb-2">
                Need help getting started?
              </p>
              <a 
                href="mailto:support@setupclaw.com" 
                className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors"
              >
                Contact Support →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Additional info */}
        <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '1s' } as React.CSSProperties}>
          <p className="text-gray-500 text-sm">
            You can manage your subscription anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
