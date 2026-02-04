'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreditCardIcon, ZapIcon } from '@/components/ui/icons';
import { PRICING_TIERS, getTier, type PricingTier } from '@/lib/pricing';

// Mock subscription data
const mockSubscription = {
  planId: 'pro',
  status: 'active' as const,
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  trialEnd: null,
  cancelAtPeriodEnd: false,
  paymentMethod: {
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2027,
  },
  invoices: [
    { id: 'inv_1', date: '2024-01-15', amount: 39, status: 'paid' },
    { id: 'inv_2', date: '2023-12-15', amount: 39, status: 'paid' },
    { id: 'inv_3', date: '2023-11-15', amount: 39, status: 'paid' },
  ],
};

// Cancel flow step components
const CancelReasonStep = ({
  reason,
  setReason,
  onNext,
  onBack,
}: {
  reason: string;
  setReason: (r: string) => void;
  onNext: () => void;
  onBack: () => void;
}) => {
  const reasons = [
    { id: 'too_expensive', label: "It's too expensive", offer: 'discount' },
    { id: 'not_using', label: "I'm not using it enough", offer: 'pause' },
    { id: 'missing_features', label: "Missing features I need", offer: 'feedback' },
    { id: 'found_alternative', label: 'Found a better alternative', offer: 'none' },
    { id: 'temporary', label: 'Just need a break', offer: 'pause' },
    { id: 'other', label: 'Other reason', offer: 'none' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">We're sorry to see you go</h3>
        <p className="text-gray-400">Help us improve by telling us why you're canceling.</p>
      </div>

      <div className="space-y-2">
        {reasons.map((r) => (
          <button
            key={r.id}
            onClick={() => setReason(r.id)}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              reason === r.id
                ? 'bg-purple-900/30 border-purple-500/50'
                : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white">{r.label}</span>
              {reason === r.id && (
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Never mind
        </Button>
        <Button onClick={onNext} disabled={!reason} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
};

const RetentionOfferStep = ({
  reason,
  onAcceptOffer,
  onDecline,
  onBack,
}: {
  reason: string;
  onAcceptOffer: (offer: string) => void;
  onDecline: () => void;
  onBack: () => void;
}) => {
  const offers: Record<string, { title: string; description: string; cta: string; offer: string }> = {
    too_expensive: {
      title: 'How about 50% off for 3 months?',
      description: "We'd love to keep you around. Here's a special discount just for you.",
      cta: 'Apply 50% discount',
      offer: 'discount_50',
    },
    not_using: {
      title: 'Pause your subscription instead?',
      description: 'Take a break for up to 3 months without losing your data or settings.',
      cta: 'Pause subscription',
      offer: 'pause',
    },
    temporary: {
      title: 'Need a break? We get it.',
      description: 'Pause your subscription for up to 3 months. Your workspace will be waiting.',
      cta: 'Pause for 1 month',
      offer: 'pause',
    },
    missing_features: {
      title: 'We want to build what you need',
      description: 'Tell us what features would make Clawdbot perfect for you.',
      cta: 'Share feedback',
      offer: 'feedback',
    },
  };

  const offer = offers[reason];
  
  if (!offer) {
    // No offer available, go straight to confirmation
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Confirm cancellation</h3>
          <p className="text-gray-400">
            Your subscription will end at the current billing period. You won't be charged again.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <h4 className="font-medium text-white mb-2">What you'll lose:</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Unlimited messages
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              All premium skills
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Priority support
            </li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="ghost" onClick={onBack} className="flex-1">
            Go back
          </Button>
          <Button variant="danger" onClick={onDecline} className="flex-1">
            Cancel subscription
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
          <ZapIcon className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{offer.title}</h3>
        <p className="text-gray-400">{offer.description}</p>
      </div>

      {offer.offer === 'discount_50' && (
        <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-500/30 text-center">
          <div className="text-4xl font-bold text-white mb-2">
            $19.50<span className="text-lg text-gray-400">/month</span>
          </div>
          <div className="text-sm text-gray-400">
            <span className="line-through">$39</span> for the next 3 months
          </div>
        </div>
      )}

      {offer.offer === 'pause' && (
        <div className="grid grid-cols-3 gap-3">
          {['1 month', '2 months', '3 months'].map((duration) => (
            <button
              key={duration}
              className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors text-center"
            >
              <div className="text-white font-medium">{duration}</div>
            </button>
          ))}
        </div>
      )}

      {offer.offer === 'feedback' && (
        <textarea
          placeholder="What features would you like to see?"
          className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500/50"
          rows={4}
        />
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="ghost" onClick={onDecline} className="flex-1">
          No thanks, cancel
        </Button>
        <Button onClick={() => onAcceptOffer(offer.offer)} className="flex-1">
          {offer.cta}
        </Button>
      </div>
    </div>
  );
};

// Downgrade modal
const DowngradeModal = ({
  isOpen,
  onClose,
  currentTier,
  targetTier,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentTier: PricingTier;
  targetTier: PricingTier;
  onConfirm: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // TODO: API call to downgrade
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Downgrade plan" size="md">
      <div className="space-y-6">
        <p className="text-gray-400">
          You're downgrading from <strong className="text-white">{currentTier.name}</strong> to{' '}
          <strong className="text-white">{targetTier.name}</strong>.
        </p>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
          <h4 className="font-medium text-yellow-400 mb-2">You'll lose access to:</h4>
          <ul className="space-y-1.5 text-sm text-gray-300">
            {currentTier.features
              .filter((f) => !targetTier.features.includes(f))
              .map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {feature}
                </li>
              ))}
          </ul>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">New price</span>
            <span className="text-2xl font-bold text-white">
              {targetTier.priceDisplay}
              <span className="text-sm text-gray-400">{targetTier.period}</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Change takes effect at the end of your current billing period.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1" disabled={loading}>
            Keep current plan
          </Button>
          <Button variant="outline" onClick={handleConfirm} className="flex-1" loading={loading}>
            Confirm downgrade
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Cancel subscription modal
const CancelModal = ({
  isOpen,
  onClose,
  onCancelled,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCancelled: () => void;
}) => {
  const [step, setStep] = useState<'reason' | 'offer' | 'confirmed'>('reason');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    // TODO: API call to cancel
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep('confirmed');
  };

  const handleAcceptOffer = async (offer: string) => {
    setLoading(true);
    // TODO: API call to apply offer
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    onClose();
    // Show success message
  };

  const handleClose = () => {
    setStep('reason');
    setReason('');
    onClose();
  };

  if (step === 'confirmed') {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="md" showCloseButton={false}>
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Subscription cancelled</h3>
          <p className="text-gray-400 mb-6">
            You'll continue to have access until the end of your billing period.
          </p>
          <Button onClick={handleClose}>Got it</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" title="">
      <AnimatePresence mode="wait">
        {step === 'reason' && (
          <motion.div
            key="reason"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <CancelReasonStep
              reason={reason}
              setReason={setReason}
              onNext={() => setStep('offer')}
              onBack={handleClose}
            />
          </motion.div>
        )}
        {step === 'offer' && (
          <motion.div
            key="offer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <RetentionOfferStep
              reason={reason}
              onAcceptOffer={handleAcceptOffer}
              onDecline={handleCancel}
              onBack={() => setStep('reason')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

// Main billing page
export default function BillingPage() {
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [downgradeModalOpen, setDowngradeModalOpen] = useState(false);
  const [selectedDowngradeTier, setSelectedDowngradeTier] = useState<PricingTier | null>(null);

  const currentTier = getTier(mockSubscription.planId);
  if (!currentTier) return null;

  const handleDowngrade = (tierId: string) => {
    const tier = getTier(tierId);
    if (tier) {
      setSelectedDowngradeTier(tier);
      setDowngradeModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-4 inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-gray-400 mt-1">Manage your plan, payment methods, and invoices.</p>
        </div>

        {/* Current Plan */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <span>Current Plan</span>
                  <Badge variant="success" pulse>Active</Badge>
                </CardTitle>
                <CardDescription>
                  {mockSubscription.cancelAtPeriodEnd
                    ? `Cancels on ${mockSubscription.currentPeriodEnd.toLocaleDateString()}`
                    : `Renews on ${mockSubscription.currentPeriodEnd.toLocaleDateString()}`}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{currentTier.priceDisplay}</div>
                <div className="text-sm text-gray-400">{currentTier.period}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Plan</div>
                <div className="text-lg font-semibold text-white">{currentTier.name}</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Skills Included</div>
                <div className="text-lg font-semibold text-white">
                  {currentTier.skillsIncluded === 'unlimited' ? 'Unlimited' : currentTier.skillsIncluded}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="/checkout">
                <Button>
                  <ZapIcon className="w-4 h-4" />
                  Upgrade Plan
                </Button>
              </a>
              {currentTier.id !== 'free' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleDowngrade('plus')}
                  >
                    Downgrade
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setCancelModalOpen(true)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Cancel Subscription
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCardIcon className="w-5 h-5 text-purple-400" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                  VISA
                </div>
                <div>
                  <div className="text-white font-medium">
                    •••• •••• •••• {mockSubscription.paymentMethod.last4}
                  </div>
                  <div className="text-sm text-gray-400">
                    Expires {mockSubscription.paymentMethod.expMonth}/{mockSubscription.paymentMethod.expYear}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your past invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockSubscription.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">${invoice.amount}.00</div>
                      <div className="text-sm text-gray-400">{invoice.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm">Paid</Badge>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            Questions about billing?{' '}
            <a href="mailto:billing@clawdbot.ai" className="text-purple-400 hover:text-purple-300 transition-colors">
              Contact our billing team
            </a>
          </p>
        </div>
      </div>

      {/* Modals */}
      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onCancelled={() => {
          setCancelModalOpen(false);
          // Refresh subscription data
        }}
      />

      {selectedDowngradeTier && (
        <DowngradeModal
          isOpen={downgradeModalOpen}
          onClose={() => setDowngradeModalOpen(false)}
          currentTier={currentTier}
          targetTier={selectedDowngradeTier}
          onConfirm={() => {
            setDowngradeModalOpen(false);
            // Refresh subscription data
          }}
        />
      )}
    </div>
  );
}
