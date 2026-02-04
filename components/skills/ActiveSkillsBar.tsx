'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skill, UserSkill } from './types';
import { Badge } from '@/components/ui/Badge';

interface ActiveSkillsBarProps {
  skills: Skill[];
  userSkills: UserSkill[];
  onSkillClick: (skill: Skill) => void;
}

export function ActiveSkillsBar({ skills, userSkills, onSkillClick }: ActiveSkillsBarProps) {
  const activeUserSkills = userSkills.filter(us => us.active);
  const activeSkills = activeUserSkills
    .map(us => skills.find(s => s.id === us.skillId))
    .filter(Boolean) as Skill[];

  const totalMonthlyCost = activeSkills.reduce((sum, skill) => sum + skill.price, 0);

  if (activeSkills.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 border-dashed rounded-xl"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="text-4xl animate-bounce-subtle">✨</div>
            <div>
              <h3 className="text-white font-semibold text-lg">No Skills Enabled Yet</h3>
              <p className="text-sm text-gray-400 mt-1">
                Browse the skills below to unlock powerful AI capabilities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly cost</p>
              <p className="text-2xl font-bold text-green-400">$0</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-700" />
            <div className="hidden sm:flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-xs text-gray-500 mt-1">Browse</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30 rounded-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚡</span>
            <h3 className="text-white font-semibold">Your Active Skills</h3>
            <Badge variant="success" size="sm">{activeSkills.length}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeSkills.map((skill, idx) => {
              const userSkill = userSkills.find(us => us.skillId === skill.id);
              const isTrialing = userSkill?.isTrialing;
              
              return (
                <motion.button
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onSkillClick(skill)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-full
                    transition-all duration-200
                    ${isTrialing 
                      ? 'bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30'
                      : 'bg-green-500/20 border border-green-500/30 hover:bg-green-500/30'
                    }
                  `}
                >
                  <span className="text-lg">{skill.icon}</span>
                  <span className="text-sm text-white font-medium">{skill.name}</span>
                  {isTrialing && (
                    <span className="text-xs text-yellow-400">Trial</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-sm text-gray-400">Monthly total</p>
          <p className="text-2xl font-bold text-white">
            ${(totalMonthlyCost / 100).toFixed(0)}
            <span className="text-sm text-gray-400 font-normal">/mo</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
