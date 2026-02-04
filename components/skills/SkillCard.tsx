'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Skill, UserSkill } from './types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SkillCardProps {
  skill: Skill;
  userSkill?: UserSkill;
  onToggle: (skillId: string, active: boolean) => void | Promise<void>;
  onViewDetails: (skill: Skill) => void;
  animationDelay?: number;
}

export function SkillCard({ 
  skill, 
  userSkill,
  onToggle, 
  onViewDetails,
  animationDelay = 0 
}: SkillCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);
  
  const isActive = userSkill?.active || false;
  const isTrialing = userSkill?.isTrialing || false;
  const isComingSoon = skill.comingSoon || false;

  const handleToggle = async (active: boolean) => {
    setIsToggling(true);
    setToggleError(null);
    try {
      await onToggle(skill.id, active);
    } catch (err) {
      setToggleError(err instanceof Error ? err.message : 'Failed to update skill');
    } finally {
      setIsToggling(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(0)}`;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 opacity-50">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-600">★</span>
        );
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      className={`
        relative group
        bg-gray-800/50 backdrop-blur-xl rounded-xl
        border transition-all duration-300
        ${isActive 
          ? 'border-green-500/50 shadow-glow-green' 
          : 'border-gray-700/50 hover:border-purple-500/50 hover:shadow-glow'
        }
        ${isComingSoon ? 'opacity-60' : ''}
      `}
    >
      {/* Active/Trial indicator */}
      {isActive && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge 
            variant={isTrialing ? 'warning' : 'success'} 
            size="sm"
            pulse={isTrialing}
          >
            {isTrialing ? 'TRIAL' : 'ACTIVE'}
          </Badge>
        </div>
      )}

      {/* Popular/New badges */}
      {skill.isPopular && !isActive && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge variant="info" size="sm">POPULAR</Badge>
        </div>
      )}
      {skill.isNew && !isActive && !skill.isPopular && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge variant="warning" size="sm">NEW</Badge>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{skill.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">
              {skill.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {skill.description}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-sm">
            {renderStars(skill.rating)}
          </div>
          <span className="text-sm text-gray-400">
            {skill.rating.toFixed(1)} ({skill.reviewCount})
          </span>
        </div>

        {/* Features preview */}
        <div className="mb-4 space-y-1.5">
          {skill.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400 text-xs">✓</span>
              <span className="truncate">{feature}</span>
            </div>
          ))}
          {skill.features.length > 3 && (
            <div className="text-xs text-gray-500">
              +{skill.features.length - 3} more features
            </div>
          )}
        </div>

        {/* Error message */}
        {toggleError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-2 bg-red-900/20 border border-red-500/30 rounded-lg"
          >
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{toggleError}</span>
              <button
                onClick={() => setToggleError(null)}
                className="ml-auto text-xs underline hover:text-red-300"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Price and actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div>
            <span className="text-xl font-bold text-white">
              {formatPrice(skill.price)}
            </span>
            <span className="text-gray-400">/mo</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isComingSoon ? (
              <Button variant="ghost" size="sm" disabled>
                Coming Soon
              </Button>
            ) : isActive ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewDetails(skill)}
                  disabled={isToggling}
                >
                  Manage
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggle(false)}
                  loading={isToggling}
                  disabled={isToggling}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  {isToggling ? 'Disabling...' : 'Disable'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewDetails(skill)}
                  disabled={isToggling}
                >
                  Details
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleToggle(true)}
                  loading={isToggling}
                  disabled={isToggling}
                >
                  {isToggling ? 'Enabling...' : 'Enable'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
