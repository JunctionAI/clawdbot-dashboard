'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PRICING_TIERS, getTier, type PricingTier } from '@/lib/pricing';

// Trust badges and security indicators
const TrustBadges = () => (
  <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <span>256-bit SSL</span>
    </div>
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
      </svg>
      <span>Powered by Stripe</span>
    </div>
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Cancel anytime</span>
    </div>
  </div>
);

// Pricing toggle (monthly/annual)
const BillingToggle = ({ annual, setAnnual }: { annual: boolean; setAnnual: (v: boolean) => void }) => (
  <div className="flex items-center justify-center gap-4 mb-8">
    <span className={`text-sm ${!annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
    <button
      onClick={() => setAnnual(!annual)}
      className={`relative w-14 h-7 rounded-full transition-colors ${
        annual ? 'bg-purple-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
          annual ? 'left-8' : 'left-1'
        }`}
      />
    </button>
    <span className={`text-sm ${annual ? 'text-white' : 'text-gray-400'}`}>
      Annual <span className="text-green-400 font-medium">Save 17%</span>
    </span>
  </div>
);

// Plan comparison card
const PlanCard = ({
  tier,
  selected,
  onSelect,
  annual,
}: {
  tier: PricingTier;
  selected: boolean;
  onSelect: () => void;
  annual: boolean;
}) => {
  const annualPrice = tier.price === 0 ? 0 : Math.round(tier.price * 10);
  const displayPrice = annual ? annualPrice : tier.price;
  const period = tier.price === 0 ? 'forever' : annual ? '/year' : tier.period;

  return (
    <motion.div
      layout
      onClick={onSelect}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
        selected
          ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-2 border-purple-500 shadow-lg shadow-purple-500/20'
          : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600'
      }`}
    >
      {tier.badge && (
        <span className={`absolute -top-3 left-4 px-3 py-1 text-xs font-semibold rounded-full ${
          tier.popular ? 'bg-purple-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {tier.badge}
        </span>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{tier.name}</h3>
          <p className="text-sm text-gray-400">{tier.description}</p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-purple-500 bg-purple-500' : 'border-gray-500'
        }`}>
          {selected && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-4xl font-bold text-white">
          ${displayPrice}
        </span>
        <span className="text-gray-400 ml-1">{period}</span>
        {annual && tier.price > 0 && (
          <div className="text-sm text-green-400 mt-1">
            Save ${tier.price * 12 - annualPrice}/year
          </div>
        )}
      </div>

      <ul className="space-y-2">
        {tier.features.slice(0, 4).map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
        {tier.features.length > 4 && (
          <li className="text-sm text-purple-400">+ {tier.features.length - 4} more features</li>
        )}
      </ul>
    </motion.div>
  );
};

// Order summary
const OrderSummary = ({
  tier,
  annual,
  loading,
  onCheckout,
}: {
  tier: PricingTier | null;
  annual: boolean;
  loading: boolean;
  onCheckout: () => void;
}) => {
  if (!tier) return null;
  
  const price = tier.price === 0 ? 0 : annual ? tier.price * 10 : tier.price;
  const period = tier.price === 0 ? '' : annual ? '/year' : '/month';

  return (
    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 sticky top-8">
      <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-300">
          <span>{tier.name} Plan</span>
          <span>${price}{period}</span>
        </div>
        {tier.price > 0 && (
          <div className="flex justify-between text-gray-400 text-sm">
            <span>14-day free trial</span>
            <span className="text-green-400">Included</span>
          </div>
        )}
        <div className="border-t border-gray-700 pt-3">
          <div className="flex justify-between text-white font-semibold">
            <span>Due today</span>
            <span>$0.00</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {tier.price > 0 ? `Then $${price}${period} after trial` : 'Free forever'}
          </p>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={loading || tier.price === 0}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          tier.price === 0
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </>
        ) : tier.price === 0 ? (
          'Already Free'
        ) : (
          <>
            Start Free Trial
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>

      {tier.price > 0 && (
        <p className="text-center text-xs text-gray-400 mt-4">
          Cancel anytime during trial. No charge until trial ends.
        </p>
      )}
    </div>
  );
};

// FAQs
const FAQs = () => {
  const faqs = [
    {
      q: "What happens after my trial ends?",
      a: "You'll be charged for your selected plan. We'll send a reminder 3 days before. Cancel anytime from your dashboard - no questions asked."
    },
    {
      q: "Can I change plans later?",
      a: "Absolutely! Upgrade or downgrade anytime. When upgrading, you'll get prorated credit. When downgrading, changes take effect at your next billing date."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, debit cards, and Apple Pay/Google Pay through Stripe's secure payment system."
    },
    {
      q: "Is there a money-back guarantee?",
      a: "Yes! If you're not satisfied within your first 30 days as a paying customer, we'll refund you in full."
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-16 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-white text-center mb-6">Frequently Asked Questions</h3>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-4 text-left flex items-center justify-between text-white hover:bg-gray-800/50 transition-colors"
            >
              <span className="font-medium">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-gray-400">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedPlan = searchParams.get('plan');
  
  const [selectedTier, setSelectedTier] = useState<string>(preselectedPlan || 'plus');
  const [annual, setAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the selected tier object
  const tier = getTier(selectedTier);

  // Handle checkout
  const handleCheckout = async () => {
    if (!tier || !tier.priceId || tier.price === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Redirect to Stripe checkout
      window.location.href = `/api/checkout?price=${tier.priceId}`;
    } catch (err: any) {
      setError(err.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  // Filter out team (separate flow) for main checkout
  const individualPlans = PRICING_TIERS.filter(t => !['team', 'family'].includes(t.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <a href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Clawdbot</span>
            </a>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Choose your plan
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-md mx-auto"
          >
            Start with a 14-day free trial. No credit card required to explore.
          </motion.p>
        </div>

        {/* Billing toggle */}
        <BillingToggle annual={annual} setAnnual={setAnnual} />

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Plan selection */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              {individualPlans.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <PlanCard
                    tier={t}
                    selected={selectedTier === t.id}
                    onSelect={() => setSelectedTier(t.id)}
                    annual={annual}
                  />
                </motion.div>
              ))}
            </div>

            {/* Family/Team link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-400 text-sm">
                Need a plan for your family or team?{' '}
                <a href="/checkout/family" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Family Plan
                </a>
                {' '}·{' '}
                <a href="/checkout/team" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Team Plan
                </a>
              </p>
            </motion.div>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <OrderSummary
              tier={tier || null}
              annual={annual}
              loading={loading}
              onCheckout={handleCheckout}
            />
          </motion.div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <TrustBadges />
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <FAQs />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-gray-500 text-sm"
        >
          <p>
            Questions? Email us at{' '}
            <a href="mailto:support@clawdbot.ai" className="text-purple-400 hover:text-purple-300">
              support@clawdbot.ai
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
