'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill, UserSkill, SKILLS } from './types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { InlineError } from '@/components/ui/ActionFeedback';

interface SkillDetailModalProps {
  skill: Skill | null;
  userSkill?: UserSkill;
  isOpen: boolean;
  onClose: () => void;
  onToggle: (skillId: string, active: boolean) => void | Promise<void>;
}

export function SkillDetailModal({
  skill,
  userSkill,
  isOpen,
  onClose,
  onToggle,
}: SkillDetailModalProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  if (!skill) return null;

  const isActive = userSkill?.active || false;
  const isTrialing = userSkill?.isTrialing || false;

  const handleToggle = async (active: boolean) => {
    setIsToggling(true);
    setToggleError(null);
    try {
      await onToggle(skill.id, active);
      if (active) {
        // Close modal after successful enable
        onClose();
      }
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : 'Failed to update skill');
    } finally {
      setIsToggling(false);
    }
  };
  
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;

  // Find bundle opportunities
  const bundleSkill = skill.id === 'gmail' ? SKILLS.find(s => s.id === 'calendar') 
    : skill.id === 'calendar' ? SKILLS.find(s => s.id === 'gmail')
    : null;
  const bundlePrice = bundleSkill ? 800 : null; // $8/mo bundle price
  const individualTotal = bundleSkill ? skill.price + bundleSkill.price : null;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400 opacity-50">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-600">★</span>);
      }
    }
    return stars;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Header */}
              <div className="p-6 pb-0">
                <div className="flex items-start gap-4">
                  <div className="text-6xl">{skill.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{skill.name}</h2>
                      {isActive && (
                        <Badge variant={isTrialing ? 'warning' : 'success'} size="sm">
                          {isTrialing ? 'TRIAL' : 'ACTIVE'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-2xl font-bold text-white">
                        {formatPrice(skill.price)}<span className="text-gray-400 font-normal">/month</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {renderStars(skill.rating)}
                        <span className="text-gray-400 ml-1">
                          {skill.rating.toFixed(1)} ({skill.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main CTA */}
              <div className="px-6 py-4 space-y-3">
                {toggleError && (
                  <InlineError
                    message={toggleError}
                    onRetry={() => handleToggle(isActive ? false : true)}
                  />
                )}
                
                {isActive ? (
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleToggle(false)}
                      loading={isToggling}
                      disabled={isToggling}
                    >
                      {isToggling ? 'Disabling...' : 'Disable Skill'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1" 
                      onClick={onClose}
                      disabled={isToggling}
                    >
                      Close
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={() => handleToggle(true)}
                    loading={isToggling}
                    disabled={isToggling}
                  >
                    {isToggling ? 'Enabling...' : `Enable Skill — ${formatPrice(skill.price)}/mo`}
                  </Button>
                )}

                {/* Bundle suggestion */}
                {!isActive && bundleSkill && bundlePrice && individualTotal && (
                  <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-purple-300">
                      💡 <span className="font-semibold">Bundle with {bundleSkill.name}</span> for {formatPrice(bundlePrice)}/mo 
                      <span className="text-gray-400"> (save {formatPrice(individualTotal - bundlePrice)})</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Description */}
                <div>
                  <p className="text-gray-300 leading-relaxed">{skill.longDescription}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span>✨</span> What You Can Do
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {skill.features.map((feature, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg"
                      >
                        <span className="text-green-400">✓</span>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span>💬</span> Try Saying
                  </h3>
                  <div className="space-y-2">
                    {skill.examples.map((example, idx) => (
                      <div 
                        key={idx}
                        className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 text-gray-300 text-sm font-mono"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span>🔐</span> Required Permissions
                  </h3>
                  <div className="space-y-2">
                    {skill.permissions.map((permission) => (
                      <div 
                        key={permission.id}
                        className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          <span className="font-medium text-white">{permission.name}</span>
                        </div>
                        <p className="text-sm text-gray-400 pl-4">{permission.description}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    You can revoke these permissions at any time. We only access what's needed for the skill to function.
                  </p>
                </div>

                {/* Free trial notice */}
                {!isActive && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎁</span>
                      <div>
                        <h4 className="font-semibold text-green-400 mb-1">7-Day Free Trial</h4>
                        <p className="text-sm text-gray-300">
                          Try this skill free for 7 days. Cancel anytime — no questions asked. 
                          Billing starts only after your trial ends.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
