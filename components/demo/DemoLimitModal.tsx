'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface DemoLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoLimitModal({ isOpen, onClose }: DemoLimitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700/50 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Animated gradient header */}
            <div className="relative h-32 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 animate-gradient-x" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-white mb-3"
              >
                You've Experienced Ally!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 mb-6"
              >
                That was just a taste. The full Ally remembers everything, connects to your tools, and works 24/7.
              </motion.p>

              {/* Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-3 mb-6"
              >
                {[
                  { icon: '🧠', text: 'Perfect memory' },
                  { icon: '📧', text: 'Email integration' },
                  { icon: '⚡', text: '45-sec setup' },
                  { icon: '💬', text: 'Multi-channel' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="text-sm text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* Pricing teaser */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 mb-6"
              >
                <p className="text-violet-400 text-sm mb-1">Start with Personal Plan</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-white">$9</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">14-day free trial • Cancel anytime</p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <a
                  href="/api/checkout?price=price_1Sx1rhBfSldKMuDj23HEtKwS"
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/30 transition-all text-center"
                >
                  Start Free Trial
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700 transition-all"
                >
                  Keep Exploring
                </button>
              </motion.div>

              {/* Social proof */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-gray-500 mt-4"
              >
                Join 2,000+ professionals who switched from ChatGPT
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
