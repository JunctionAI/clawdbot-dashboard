'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { getTier } from '@/lib/pricing';

interface FamilyMember {
  id: string;
  email: string;
  name: string;
  relation: string;
}

// Family member input component
const FamilyMemberInput = ({
  member,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  member: FamilyMember;
  index: number;
  onChange: (id: string, field: keyof FamilyMember, value: string) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) => {
  const relations = ['Spouse', 'Partner', 'Child', 'Parent', 'Sibling', 'Other'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-gray-400">Family Member {index + 1}</span>
        {canRemove && (
          <button
            onClick={() => onRemove(member.id)}
            className="text-gray-500 hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Email Address</label>
          <input
            type="email"
            value={member.email}
            onChange={(e) => onChange(member.id, 'email', e.target.value)}
            placeholder="family@example.com"
            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={member.name}
              onChange={(e) => onChange(member.id, 'name', e.target.value)}
              placeholder="First name"
              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Relation</label>
            <select
              value={member.relation}
              onChange={(e) => onChange(member.id, 'relation', e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              <option value="">Select...</option>
              {relations.map((r) => (
                <option key={r} value={r.toLowerCase()}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Family plan benefits
const FamilyBenefits = () => (
  <div className="space-y-4 mb-8">
    <h3 className="text-lg font-semibold text-white">Family Plan Benefits</h3>
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        {
          icon: '👨‍👩‍👧‍👦',
          title: 'Up to 5 members',
          description: 'Invite your whole family to use Clawdbot',
        },
        {
          icon: '🔒',
          title: 'Individual privacy',
          description: 'Each member has their own private workspace',
        },
        {
          icon: '📅',
          title: 'Shared calendar',
          description: 'Coordinate family schedules together',
        },
        {
          icon: '💰',
          title: 'Save 50%+',
          description: 'vs. individual Plus plans for everyone',
        },
      ].map((benefit, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
        >
          <span className="text-2xl">{benefit.icon}</span>
          <div>
            <h4 className="text-white font-medium">{benefit.title}</h4>
            <p className="text-sm text-gray-400">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function FamilyCheckoutPage() {
  const familyTier = getTier('family');
  const [step, setStep] = useState<'members' | 'checkout'>('members');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', email: '', name: '', relation: '' },
  ]);

  const addMember = () => {
    if (members.length < 4) {
      setMembers([
        ...members,
        { id: Date.now().toString(), email: '', name: '', relation: '' },
      ]);
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: keyof FamilyMember, value: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const isValid = members.every(
    (m) => m.email && m.email.includes('@') && m.name && m.relation
  );

  const handleCheckout = async () => {
    if (!familyTier?.priceId) return;
    setLoading(true);
    
    // Store member data in session/localStorage for after checkout
    localStorage.setItem('family_members', JSON.stringify(members));
    
    // Redirect to Stripe checkout
    window.location.href = `/api/checkout?price=${familyTier.priceId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.a
            href="/checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to plans
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-400 text-sm font-medium">
              👨‍👩‍👧‍👦 Family Plan
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Clawdbot for your family
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-md mx-auto"
          >
            Share the power of AI with up to 5 family members. Each person gets their own private workspace.
          </motion.p>
        </div>

        {/* Price display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-gray-400">/month total</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                That's just $3.80/person with 5 members
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-400 font-medium">Save 60%</span>
                <span className="text-gray-500">vs. 5 individual plans</span>
              </div>
              <div className="flex -space-x-2 mt-2">
                {['👨', '👩', '👧', '👦', '👴'].map((emoji, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-sm"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FamilyBenefits />
        </motion.div>

        {/* Member inputs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Invite Family Members
            </h3>
            <span className="text-sm text-gray-400">
              {members.length}/4 additional members
            </span>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            You'll be the Family Manager. Add up to 4 additional family members below.
            You can also invite them later from your dashboard.
          </p>

          <div className="space-y-4">
            <AnimatePresence>
              {members.map((member, i) => (
                <FamilyMemberInput
                  key={member.id}
                  member={member}
                  index={i}
                  onChange={updateMember}
                  onRemove={removeMember}
                  canRemove={members.length > 1}
                />
              ))}
            </AnimatePresence>
          </div>

          {members.length < 4 && (
            <button
              onClick={addMember}
              className="mt-4 w-full p-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add another family member
            </button>
          )}
        </motion.div>

        {/* Checkout button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Button
            onClick={handleCheckout}
            disabled={!isValid || loading}
            loading={loading}
            size="lg"
            className="w-full"
          >
            Continue to Payment
          </Button>

          <p className="text-center text-sm text-gray-500">
            14-day free trial · Cancel anytime · Invite members later
          </p>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
            <span>Powered by Stripe</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
