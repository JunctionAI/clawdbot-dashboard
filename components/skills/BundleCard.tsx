'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SkillBundle, SKILLS } from './types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface BundleCardProps {
  bundle: SkillBundle;
  userSkillIds: string[];
  onActivate: (bundle: SkillBundle) => void;
  animationDelay?: number;
}

export function BundleCard({ 
  bundle, 
  userSkillIds,
  onActivate,
  animationDelay = 0 
}: BundleCardProps) {
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;
  
  // Get skill details
  const bundleSkills = bundle.skills
    .map(id => SKILLS.find(s => s.id === id))
    .filter(Boolean);
  
  // Check if user already has all skills in bundle
  const hasAllSkills = bundle.skills.every(id => userSkillIds.includes(id));
  const hasPartialSkills = bundle.skills.some(id => userSkillIds.includes(id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-purple-900/30 via-gray-800/50 to-blue-900/30
        backdrop-blur-xl rounded-xl
        border border-purple-500/30
        hover:border-purple-500/50 hover:shadow-glow
        transition-all duration-300
      `}
    >
      {/* Savings badge */}
      <div className="absolute top-4 right-4">
        <Badge variant="success" size="sm">
          SAVE {bundle.savings}%
        </Badge>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <h3 className="text-xl font-bold text-white">{bundle.name}</h3>
          </div>
          <p className="text-gray-400 text-sm">{bundle.description}</p>
        </div>

        {/* Included skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {bundleSkills.map((skill) => (
            <div 
              key={skill!.id}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full
                ${userSkillIds.includes(skill!.id)
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-gray-800/50 border border-gray-700/50'
                }
              `}
            >
              <span className="text-lg">{skill!.icon}</span>
              <span className="text-sm text-gray-300">{skill!.name}</span>
              {userSkillIds.includes(skill!.id) && (
                <span className="text-green-400 text-xs">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Claimed progress (if applicable) */}
        {bundle.claimedPercent && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Popularity</span>
              <span>{bundle.claimedPercent}% of users chose this</span>
            </div>
            <ProgressBar 
              value={bundle.claimedPercent} 
              max={100}
              color="purple"
              showPercentage={false}
              size="sm"
              animated={false}
            />
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {formatPrice(bundle.bundlePrice)}
            </span>
            <span className="text-gray-400">/mo</span>
            <span className="text-sm text-gray-500 line-through ml-2">
              {formatPrice(bundle.originalPrice)}
            </span>
          </div>
          
          {hasAllSkills ? (
            <Badge variant="success" size="md">All Active</Badge>
          ) : (
            <Button 
              variant="primary"
              onClick={() => onActivate(bundle)}
            >
              {hasPartialSkills ? 'Complete Bundle' : 'Get Bundle'}
            </Button>
          )}
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
    </motion.div>
  );
}
