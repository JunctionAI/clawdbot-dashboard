'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoChat, ExampleConversations, DemoLimitModal, DEMO_MESSAGE_LIMIT } from '@/components/demo';

type DemoTab = 'try' | 'examples';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<DemoTab>('try');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLimitReached = () => {
    setTimeout(() => setShowLimitModal(true), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg">Clawdbot</span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/#pricing"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
            >
              Pricing
            </a>
            <a
              href="/api/checkout?price=price_1Sx1rhBfSldKMuDj23HEtKwS"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-violet-400 text-sm font-medium">Demo Mode</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Try Ally{' '}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Before You Commit
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-2">
              No signup required. See how an AI with memory actually works.
            </p>
            <p className="text-gray-500 text-sm">
              {DEMO_MESSAGE_LIMIT} messages in demo • Unlimited with free trial
            </p>
          </motion.div>

          {/* Tab navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex p-1 rounded-xl bg-gray-800/50 border border-gray-700/50">
              <button
                onClick={() => setActiveTab('try')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'try'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🤖 Try It Now
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'examples'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                📚 Example Conversations
              </button>
            </div>
          </motion.div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'try' && (
              <motion.div
                key="try"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid lg:grid-cols-3 gap-6 items-start">
                  {/* Chat area */}
                  <div className="lg:col-span-2">
                    <DemoChat onLimitReached={handleLimitReached} />
                  </div>

                  {/* Side panel with tips and info */}
                  <div className="space-y-4">
                    {/* What to try */}
                    <div className="p-5 rounded-xl bg-gray-800/30 border border-gray-700/50">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <span>💡</span> Try asking about...
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-violet-400">→</span>
                          Managing your emails
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-violet-400">→</span>
                          Preparing for a meeting
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-violet-400">→</span>
                          Debugging code issues
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-violet-400">→</span>
                          Research and analysis
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-violet-400">→</span>
                          Writing content
                        </li>
                      </ul>
                    </div>

                    {/* Memory explanation */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <span>🧠</span> Why Memory Matters
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        ChatGPT forgets everything. Ally remembers:
                      </p>
                      <ul className="space-y-1.5 text-sm">
                        <li className="flex items-center gap-2 text-gray-300">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Your projects and context
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Your preferences and style
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Past decisions and outcomes
                        </li>
                        <li className="flex items-center gap-2 text-gray-300">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          People you work with
                        </li>
                      </ul>
                    </div>

                    {/* CTA card */}
                    <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700/50">
                      <h3 className="font-semibold text-white mb-2">Ready for the full experience?</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        14-day free trial. No credit card required.
                      </p>
                      <a
                        href="/api/checkout?price=price_1Sx1rhBfSldKMuDj23HEtKwS"
                        className="block w-full py-3 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-center hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                      >
                        Start Free Trial
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'examples' && (
              <motion.div
                key="examples"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8 text-center">
                  <p className="text-gray-400">
                    Click any conversation to see how Ally handles real scenarios
                  </p>
                </div>
                <ExampleConversations />
                
                {/* CTA after examples */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 text-center"
                >
                  <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
                    <h3 className="text-xl font-bold text-white mb-2">
                      Want this for your workflow?
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Start with a 14-day free trial. Setup takes 45 seconds.
                    </p>
                    <a
                      href="/api/checkout?price=price_1Sx1rhBfSldKMuDj23HEtKwS"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                    >
                      Start Free Trial
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating CTA on scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-30 hidden sm:block"
          >
            <a
              href="/api/checkout?price=price_1Sx1rhBfSldKMuDj23HEtKwS"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform"
            >
              <span>Start Free Trial</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo limit modal */}
      <DemoLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
}
