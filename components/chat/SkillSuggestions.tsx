'use client';

import React from 'react';
import { SparklesIcon } from '@/components/ui/icons';

export interface SkillSuggestion {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  category?: 'productivity' | 'communication' | 'creative' | 'research';
}

interface SkillSuggestionsProps {
  suggestions: SkillSuggestion[];
  onSelect: (suggestion: SkillSuggestion) => void;
  className?: string;
  title?: string;
}

const categoryColors: Record<string, string> = {
  productivity: 'from-green-500/20 to-emerald-500/10 border-green-500/30 hover:border-green-400/50',
  communication: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 hover:border-blue-400/50',
  creative: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 hover:border-purple-400/50',
  research: 'from-yellow-500/20 to-orange-500/10 border-yellow-500/30 hover:border-yellow-400/50',
};

export function SkillSuggestions({ 
  suggestions, 
  onSelect, 
  className = '',
  title = 'Quick actions'
}: SkillSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <SparklesIcon className="w-4 h-4 text-purple-400" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {title}
        </span>
      </div>

      {/* Suggestions Grid/Flex */}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl text-sm
              bg-gradient-to-r ${categoryColors[suggestion.category || 'productivity']}
              border backdrop-blur-sm
              transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              animate-fade-in-up
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-base">{suggestion.icon}</span>
            <span className="text-gray-200 font-medium">{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Pre-defined skill suggestions for common scenarios
export const defaultSkillSuggestions: SkillSuggestion[] = [
  {
    id: 'check-email',
    label: 'Check my emails',
    icon: '📧',
    prompt: 'Check my recent emails and summarize anything important',
    category: 'communication',
  },
  {
    id: 'whats-today',
    label: "What's on today?",
    icon: '📅',
    prompt: "What's on my calendar today? Any upcoming meetings I should prepare for?",
    category: 'productivity',
  },
  {
    id: 'draft-email',
    label: 'Draft an email',
    icon: '✍️',
    prompt: 'Help me draft an email',
    category: 'communication',
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm ideas',
    icon: '💡',
    prompt: 'Help me brainstorm ideas for',
    category: 'creative',
  },
  {
    id: 'research',
    label: 'Research topic',
    icon: '🔍',
    prompt: 'Research and summarize information about',
    category: 'research',
  },
  {
    id: 'summarize',
    label: 'Summarize something',
    icon: '📝',
    prompt: 'Summarize this for me:',
    category: 'productivity',
  },
];

// Context-aware suggestion generator
export function getContextualSuggestions(
  conversationContext?: string,
  timeOfDay?: 'morning' | 'afternoon' | 'evening'
): SkillSuggestion[] {
  const suggestions: SkillSuggestion[] = [];

  // Time-based suggestions
  if (timeOfDay === 'morning') {
    suggestions.push({
      id: 'morning-briefing',
      label: 'Morning briefing',
      icon: '☀️',
      prompt: 'Give me a morning briefing - what do I have today and any important emails?',
      category: 'productivity',
    });
  } else if (timeOfDay === 'evening') {
    suggestions.push({
      id: 'day-recap',
      label: 'Recap my day',
      icon: '🌙',
      prompt: 'Give me a recap of what we accomplished today',
      category: 'productivity',
    });
  }

  // Add some default suggestions
  suggestions.push(
    defaultSkillSuggestions[0], // Check emails
    defaultSkillSuggestions[1], // What's today
    defaultSkillSuggestions[2], // Draft email
  );

  return suggestions.slice(0, 4); // Return max 4 suggestions
}
