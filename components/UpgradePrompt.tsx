'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZapIcon } from '@/components/ui/icons';
import { PRICING_TIERS, getTier, getNextTier, type PricingTier } from '@/lib/pricing';

// Types of upgrade prompts
type PromptType = 'message_limit' | 'skill_limit' | 'feature_locked' | 'gentle_nudge';

interface UpgradePromptProps {
  currentTierId: string;
  promptType: PromptType;
  usage?: {
    current: number;
    limit: number;
  };
  lockedFeature?: string;
  onDismiss?: () => void;
  onUpgrade?: (tierId: string) => void;
  variant?: 'inline' | 'modal' | 'banner' | 'toast';
}

// Inline upgrade prompt (shows within content)
export function UpgradePromptInline({
  currentTierId,
  promptType,
  usage,
  lockedFeature,
  onDismiss,
  onUpgrade,
}: UpgradePromptProps) {
  const currentTier = getTier(currentTierId);
  const nextTier = getNextTier(currentTierId);
  
  if (!nextTier) return null;

  const getMessage = () => {
    switch (promptType) {
      case 'message_limit':
        return {
          title: "You're running low on messages",
          description: `${usage?.current.toLocaleString()} of ${usage?.limit.toLocaleString()} messages used this month. Upgrade for more.`,
          cta: 'Get more messages',
        };
      case 'skill_limit':
        return {
          title: 'Unlock more skills',
          description: `You've used all ${usage?.limit} skills on your plan. Upgrade to access ${
            nextTier.skillsIncluded === 'unlimited' ? 'unlimited' : nextTier.skillsIncluded
          } skills.`,
          cta: 'Unlock skills',
        };
      case 'feature_locked':
        return {
          title: `${lockedFeature} requires an upgrade`,
          description: `This feature is available on ${nextTier.name} and above.`,
          cta: `Upgrade to ${nextTier.name}`,
        };
      case 'gentle_nudge':
        return {
          title: 'Get more from Clawdbot',
          description: `Upgrade to ${nextTier.name} for ${nextTier.skillsIncluded === 'unlimited' ? 'unlimited skills' : `${nextTier.skillsIncluded} skills`} and more features.`,
          cta: 'See plans',
        };
    }
  };

  const message = getMessage();
  const usagePercent = usage ? (usage.current / usage.limit) * 100 : 0;
  const isUrgent = usagePercent > 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-xl border ${
        isUrgent
          ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/50'
          : 'bg-gradient-to-r from-purple-900/30 to-purple-800/20 border-purple-500/30'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <ZapIcon className={`w-4 h-4 ${isUrgent ? 'text-orange-400' : 'text-purple-400'}`} />
            <h4 className="font-semibold text-white text-sm">{message.title}</h4>
          </div>
          <p className="text-gray-400 text-sm mb-3">{message.description}</p>
          
          {/* Usage bar */}
          {usage && (
            <div className="mb-3">
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-orange-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, usagePercent)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {usage.current.toLocaleString()} / {usage.limit.toLocaleString()}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <a
              href={`/checkout?plan=${nextTier.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {message.cta}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
        
        {/* Price badge */}
        <div className="text-right">
          <div className="text-lg font-bold text-white">{nextTier.priceDisplay}</div>
          <div className="text-xs text-gray-400">{nextTier.period}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Banner upgrade prompt (shows at top of page)
export function UpgradePromptBanner({
  currentTierId,
  promptType,
  usage,
  onDismiss,
}: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const nextTier = getNextTier(currentTierId);
  
  if (!nextTier || dismissed) return null;

  const usagePercent = usage ? (usage.current / usage.limit) * 100 : 0;
  const isUrgent = usagePercent > 90;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative px-4 py-3 ${
          isUrgent
            ? 'bg-gradient-to-r from-orange-600 to-red-600'
            : 'bg-gradient-to-r from-purple-600 to-purple-700'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ZapIcon className="w-5 h-5 text-white" />
            <p className="text-white text-sm">
              {isUrgent ? (
                <>
                  <strong>Running low!</strong> You've used {usage?.current.toLocaleString()} of{' '}
                  {usage?.limit.toLocaleString()} messages.
                </>
              ) : (
                <>
                  <strong>Upgrade to {nextTier.name}</strong> for{' '}
                  {nextTier.skillsIncluded === 'unlimited' ? 'unlimited' : 'more'} skills and features.
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`/checkout?plan=${nextTier.id}`}
              className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm"
            >
              Upgrade now
            </a>
            <button
              onClick={() => {
                setDismissed(true);
                onDismiss?.();
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Modal upgrade prompt (for more detailed comparison)
export function UpgradePromptModal({
  currentTierId,
  promptType,
  lockedFeature,
  isOpen,
  onClose,
}: UpgradePromptProps & { isOpen: boolean; onClose: () => void }) {
  const currentTier = getTier(currentTierId);
  const nextTier = getNextTier(currentTierId);
  
  if (!nextTier || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative max-w-lg w-full bg-gray-900 rounded-2xl border border-gray-700/50 overflow-hidden"
        >
          {/* Header gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
          
          <div className="p-6">
            {/* Lock icon or upgrade icon */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              {promptType === 'feature_locked' ? (
                <svg className="w-7 h-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <ZapIcon className="w-7 h-7 text-purple-400" />
              )}
            </div>
            
            <h2 className="text-xl font-bold text-white text-center mb-2">
              {promptType === 'feature_locked'
                ? `Unlock ${lockedFeature}`
                : `Upgrade to ${nextTier.name}`}
            </h2>
            
            <p className="text-gray-400 text-center mb-6">
              {promptType === 'feature_locked'
                ? `This feature is available on ${nextTier.name} and above.`
                : `Get access to more powerful features and higher limits.`}
            </p>
            
            {/* Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-2">Current: {currentTier?.name}</div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    {currentTier?.skillsIncluded} skills
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    {typeof currentTier?.messagesPerMonth === 'number'
                      ? `${currentTier.messagesPerMonth.toLocaleString()} msg/mo`
                      : 'Unlimited messages'}
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-900/30 rounded-xl border border-purple-500/30">
                <div className="text-sm text-purple-400 mb-2 font-medium">{nextTier.name}</div>
                <ul className="space-y-1.5 text-sm">
                  <li className="flex items-center gap-2 text-white">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {nextTier.skillsIncluded === 'unlimited' ? 'Unlimited' : nextTier.skillsIncluded} skills
                  </li>
                  <li className="flex items-center gap-2 text-white">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {nextTier.messagesPerMonth === 'unlimited'
                      ? 'Unlimited messages'
                      : `${nextTier.messagesPerMonth.toLocaleString()} msg/mo`}
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-center mb-6">
              <span className="text-4xl font-bold text-white">{nextTier.priceDisplay}</span>
              <span className="text-gray-400">{nextTier.period}</span>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
              >
                Maybe later
              </button>
              <a
                href={`/checkout?plan=${nextTier.id}`}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Upgrade now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Toast-style upgrade nudge
export function UpgradeToast({
  currentTierId,
  onDismiss,
}: {
  currentTierId: string;
  onDismiss: () => void;
}) {
  const nextTier = getNextTier(currentTierId);
  
  if (!nextTier) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 50 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 50, x: 50 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <div className="bg-gray-900 rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <ZapIcon className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm mb-1">
                Enjoying Clawdbot?
              </h4>
              <p className="text-gray-400 text-xs mb-3">
                Upgrade to {nextTier.name} for {nextTier.priceDisplay}{nextTier.period} and unlock more.
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`/checkout?plan=${nextTier.id}`}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Upgrade
                </a>
                <button
                  onClick={onDismiss}
                  className="px-3 py-1 text-gray-400 hover:text-gray-300 text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={onDismiss}
              className="text-gray-500 hover:text-gray-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
