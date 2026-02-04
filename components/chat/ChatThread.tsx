'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatMessageData } from './ChatMessage';
import { TypingIndicator, ActionTypingIndicator } from './TypingIndicator';

interface ChatThreadProps {
  messages: ChatMessageData[];
  isTyping?: boolean;
  typingAction?: string;
  userName?: string;
  userAvatar?: string;
  className?: string;
  emptyStateContent?: React.ReactNode;
}

export function ChatThread({ 
  messages, 
  isTyping = false,
  typingAction,
  userName = 'You',
  userAvatar,
  className = '',
  emptyStateContent
}: ChatThreadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive or typing starts
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping, scrollToBottom]);

  // Check if user is near bottom (for auto-scroll logic)
  const isNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Empty state
  if (messages.length === 0 && !isTyping) {
    return (
      <div className={`flex-1 flex items-center justify-center ${className}`}>
        {emptyStateContent || <DefaultEmptyState />}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-y-auto px-4 py-6 space-y-6 scroll-smooth ${className}`}
    >
      {/* Date separator (optional - for multi-day conversations) */}
      {messages.length > 0 && (
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 bg-gray-800/50 rounded-full text-xs text-gray-400 backdrop-blur-sm">
            {formatMessageDate(messages[0].timestamp)}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          userName={userName}
          userAvatar={userAvatar}
          isLatest={index === messages.length - 1 && !isTyping}
        />
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        typingAction 
          ? <ActionTypingIndicator actionLabel={typingAction} />
          : <TypingIndicator />
      )}

      {/* Invisible element to scroll to */}
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}

function DefaultEmptyState() {
  return (
    <div className="text-center max-w-md mx-auto px-4 animate-fade-in">
      {/* Ally Avatar */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-4 ring-gray-800 shadow-glow animate-float">
        <span className="text-4xl">✨</span>
      </div>

      {/* Welcome Message */}
      <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
        Hey there! I'm Ally
      </h2>
      <p className="text-gray-400 mb-6 leading-relaxed">
        Your AI assistant, ready to help with emails, calendar, research, and more. 
        What would you like to tackle together?
      </p>

      {/* Conversation starters */}
      <div className="flex flex-wrap justify-center gap-2">
        {['📧 Check emails', '📅 Today\'s schedule', '💡 Brainstorm'].map((label) => (
          <span 
            key={label}
            className="px-3 py-1.5 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700/50"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatMessageDate(date: Date): string {
  const now = new Date();
  const messageDate = new Date(date);
  
  // Same day
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return 'Today';
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }
  
  // Same week
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (messageDate > weekAgo) {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }
  
  // Default format
  return messageDate.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
