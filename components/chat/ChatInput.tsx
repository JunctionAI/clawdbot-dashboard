'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VoiceInputButton } from './VoiceInputButton';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export function ChatInput({ 
  onSend, 
  placeholder = 'Message Ally...',
  disabled = false,
  className = '',
  autoFocus = false
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [message, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const handleVoiceTranscript = useCallback((transcript: string) => {
    setMessage(prev => prev + (prev ? ' ' : '') + transcript);
    textareaRef.current?.focus();
  }, []);

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <div className={`
        flex items-end gap-2 p-2 
        bg-gray-800/70 backdrop-blur-xl 
        border border-gray-700/50 rounded-2xl
        transition-all duration-200
        ${disabled ? 'opacity-60' : 'hover:border-gray-600/50'}
        ${isVoiceListening ? 'ring-2 ring-red-500/30 border-red-500/30' : ''}
        focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20
      `}>
        {/* Voice Input Button */}
        <VoiceInputButton
          onTranscript={handleVoiceTranscript}
          onListeningChange={setIsVoiceListening}
          disabled={disabled}
        />

        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isVoiceListening ? 'Listening...' : placeholder}
            disabled={disabled}
            rows={1}
            className={`
              w-full px-2 py-2 
              bg-transparent text-white placeholder-gray-400
              resize-none outline-none
              text-base leading-relaxed
              disabled:cursor-not-allowed
              max-h-[200px]
            `}
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!canSend}
          className={`
            p-2.5 rounded-xl transition-all duration-200
            flex-shrink-0
            ${canSend 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-glow hover:from-purple-500 hover:to-purple-600 active:scale-95' 
              : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
            />
          </svg>
        </button>
      </div>

      {/* Character count (optional - shows when approaching limit) */}
      {message.length > 2000 && (
        <div className="absolute -top-6 right-2 text-xs text-red-400">
          {message.length}/4000
        </div>
      )}

      {/* Hint text */}
      <div className="mt-2 px-2 flex items-center justify-between text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        {isVoiceListening && (
          <span className="text-red-400 animate-pulse">🎤 Listening...</span>
        )}
      </div>
    </form>
  );
}
