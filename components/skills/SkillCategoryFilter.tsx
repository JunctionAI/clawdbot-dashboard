'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Skill, CATEGORY_LABELS } from './types';

type Category = Skill['category'] | 'all';

interface SkillCategoryFilterProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  skillCounts: Record<string, number>;
}

const CATEGORY_ICONS: Record<Category, string> = {
  all: '🏪',
  productivity: '⚡',
  automation: '🤖',
  communication: '💬',
  ai: '🧠',
  data: '📊',
};

export function SkillCategoryFilter({ 
  selectedCategory, 
  onCategoryChange,
  skillCounts 
}: SkillCategoryFilterProps) {
  const categories: Category[] = ['all', 'productivity', 'automation', 'communication', 'ai', 'data'];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        const count = category === 'all' 
          ? Object.values(skillCounts).reduce((a, b) => a + b, 0)
          : skillCounts[category] || 0;
        
        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryChange(category)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-lg
              font-medium text-sm transition-all duration-200
              ${isSelected 
                ? 'bg-purple-600 text-white shadow-glow' 
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
              }
            `}
          >
            <span>{CATEGORY_ICONS[category]}</span>
            <span>{category === 'all' ? 'All Skills' : CATEGORY_LABELS[category]}</span>
            <span className={`
              px-1.5 py-0.5 rounded text-xs
              ${isSelected ? 'bg-white/20' : 'bg-gray-700/50'}
            `}>
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
