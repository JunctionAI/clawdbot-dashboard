'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ChatThread } from './ChatThread';
import { ChatInput } from './ChatInput';
import { SkillSuggestions, SkillSuggestion, getContextualSuggestions } from './SkillSuggestions';
import { ChatMessageData } from './ChatMessage';
import { SettingsIcon, SparklesIcon } from '@/components/ui/icons';

interface ChatInterfaceProps {
  // User info
  userName?: string;
  userAvatar?: string;
  
  // Initial state
  initialMessages?: ChatMessageData[];
  
  // Callbacks
  onSendMessage?: (message: string) => Promise<ChatMessageData | void>;
  onSkillSelect?: (skill: SkillSuggestion) => void;
  
  // Configuration
  showSkillSuggestions?: boolean;
  showHeader?: boolean;
  className?: string;
}

export function ChatInterface({
  userName = 'You',
  userAvatar,
  initialMessages = [],
  onSendMessage,
  onSkillSelect,
  showSkillSuggestions = true,
  showHeader = true,
  className = ''
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [typingAction, setTypingAction] = useState<string | undefined>();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');

  // Get time-of-day for contextual suggestions
  const timeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }, []);

  // Get contextual skill suggestions
  const suggestions = useMemo(() => {
    if (messages.length > 0) {
      // After some conversation, show fewer/different suggestions
      return getContextualSuggestions(undefined, timeOfDay).slice(0, 3);
    }
    return getContextualSuggestions(undefined, timeOfDay);
  }, [messages.length, timeOfDay]);

  // Handle sending a message
  const handleSendMessage = useCallback(async (content: string) => {
    // Create user message
    const userMessage: ChatMessageData = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'sending'
    };

    // Add to messages immediately
    setMessages(prev => [...prev, userMessage]);

    // Start typing indicator
    setIsTyping(true);

    try {
      // Call the external handler if provided
      if (onSendMessage) {
        const response = await onSendMessage(content);
        
        // Update user message status
        setMessages(prev => 
          prev.map(m => m.id === userMessage.id ? { ...m, status: 'sent' as const } : m)
        );

        // Add Ally's response if returned
        if (response) {
          setMessages(prev => [...prev, response]);
        }
      } else {
        // Demo mode - simulate a response
        await simulateDemoResponse(content, setMessages, setTypingAction);
        
        // Update user message status
        setMessages(prev => 
          prev.map(m => m.id === userMessage.id ? { ...m, status: 'sent' as const } : m)
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Update user message to show error
      setMessages(prev => 
        prev.map(m => m.id === userMessage.id ? { ...m, status: 'error' as const } : m)
      );
    } finally {
      setIsTyping(false);
      setTypingAction(undefined);
    }
  }, [onSendMessage]);

  // Handle skill suggestion selection
  const handleSkillSelect = useCallback((skill: SkillSuggestion) => {
    if (onSkillSelect) {
      onSkillSelect(skill);
    }
    // Send the skill's prompt as a message
    handleSendMessage(skill.prompt);
  }, [onSkillSelect, handleSendMessage]);

  return (
    <div className={`flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 ${className}`}>
      {/* Header */}
      {showHeader && (
        <ChatHeader 
          connectionStatus={connectionStatus}
          messageCount={messages.length}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Messages Thread */}
        <ChatThread
          messages={messages}
          isTyping={isTyping}
          typingAction={typingAction}
          userName={userName}
          userAvatar={userAvatar}
          className="flex-1"
        />

        {/* Skill Suggestions (show when conversation is empty or just started) */}
        {showSkillSuggestions && messages.length < 3 && !isTyping && (
          <div className="px-4 py-3 border-t border-gray-800/50">
            <SkillSuggestions
              suggestions={suggestions}
              onSelect={handleSkillSelect}
              title={messages.length === 0 ? 'Try asking about' : 'Quick actions'}
            />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-xl">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
          autoFocus={true}
          placeholder={isTyping ? 'Ally is typing...' : 'Message Ally...'}
        />
      </div>
    </div>
  );
}

// Header component
interface ChatHeaderProps {
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  messageCount: number;
}

function ChatHeader({ connectionStatus, messageCount }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50 bg-gray-900/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {/* Ally Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-gray-700 shadow-glow">
          <span className="text-lg">✨</span>
        </div>
        
        <div>
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            Ally
            <SparklesIcon className="w-4 h-4 text-purple-400" />
          </h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' :
              connectionStatus === 'reconnecting' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400'
            }`} />
            <span className="text-xs text-gray-400">
              {connectionStatus === 'connected' ? 'Online' :
               connectionStatus === 'reconnecting' ? 'Reconnecting...' :
               'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button 
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          title="Chat settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

// Demo response simulator for when no external handler is provided
async function simulateDemoResponse(
  userMessage: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageData[]>>,
  setTypingAction: React.Dispatch<React.SetStateAction<string | undefined>>
) {
  // Simulate thinking time
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 1500));

  // Determine if this should be an "action" response
  const isActionMessage = 
    userMessage.toLowerCase().includes('email') ||
    userMessage.toLowerCase().includes('calendar') ||
    userMessage.toLowerCase().includes('schedule');

  if (isActionMessage) {
    // Show action indicator
    setTypingAction(
      userMessage.toLowerCase().includes('email') ? 'Checking your emails...' :
      userMessage.toLowerCase().includes('calendar') || userMessage.toLowerCase().includes('schedule') 
        ? 'Looking at your calendar...' :
        'Processing...'
    );
    
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    setTypingAction(undefined);
  }

  // Generate demo response
  const demoResponses = [
    "I'd be happy to help with that! Let me take a look...",
    "Great question! Here's what I found...",
    "I've checked that for you. Here's the summary:",
    "Absolutely! I can help you with that.",
    "Let me break that down for you...",
  ];

  const response: ChatMessageData = {
    id: `msg-${Date.now()}`,
    role: 'ally',
    content: demoResponses[Math.floor(Math.random() * demoResponses.length)] + 
      "\n\nThis is a demo response. In the real implementation, I'll connect to your integrations and provide actual assistance!",
    timestamp: new Date(),
    action: isActionMessage ? {
      type: userMessage.toLowerCase().includes('email') ? 'email' : 'calendar',
      label: userMessage.toLowerCase().includes('email') ? 'Checked 3 emails' : 'Viewed calendar',
      status: 'complete'
    } : undefined
  };

  setMessages(prev => [...prev, response]);
}

// Export a simpler version for embedding
export function EmbeddedChat(props: Omit<ChatInterfaceProps, 'showHeader'>) {
  return <ChatInterface {...props} showHeader={false} />;
}
