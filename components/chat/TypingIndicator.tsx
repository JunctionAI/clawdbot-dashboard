'use client';

import React from 'react';

interface TypingIndicatorProps {
  className?: string;
}

export function TypingIndicator({ className = '' }: TypingIndicatorProps) {
  return (
    <div className={`flex gap-3 animate-fade-in ${className}`}>
      {/* Ally Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-gray-700 animate-pulse">
          <span className="text-sm">✨</span>
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col items-start">
        <span className="text-xs text-gray-500 mb-1 px-1">Ally</span>
        <div className="bg-gray-800/70 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            {/* Animated dots */}
            <div className="flex gap-1">
              <span 
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms', animationDuration: '0.6s' }}
              />
              <span 
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms', animationDuration: '0.6s' }}
              />
              <span 
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms', animationDuration: '0.6s' }}
              />
            </div>
            <span className="text-xs text-gray-400 ml-2">thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionTypingIndicatorProps {
  actionLabel: string;
  className?: string;
}

export function ActionTypingIndicator({ actionLabel, className = '' }: ActionTypingIndicatorProps) {
  return (
    <div className={`flex gap-3 animate-fade-in ${className}`}>
      {/* Ally Avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-gray-700">
          <span className="text-sm animate-pulse">⚡</span>
        </div>
      </div>

      {/* Action Bubble */}
      <div className="flex flex-col items-start">
        <span className="text-xs text-gray-500 mb-1 px-1">Ally</span>
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-4 py-3 rounded-2xl rounded-tl-sm border border-purple-500/30 backdrop-blur-sm shadow-glow">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
            <span className="text-sm text-purple-200">{actionLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
