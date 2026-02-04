'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoMessage, DEMO_MESSAGE_LIMIT } from './types';
import { demoBotResponses } from './demoBotResponses';

interface DemoChatProps {
  onLimitReached: () => void;
}

export function DemoChat({ onLimitReached }: DemoChatProps) {
  const [messages, setMessages] = useState<DemoMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm Ally, your AI assistant with memory. 🧠

Unlike ChatGPT, I remember everything about you across sessions. Try asking me something!

**A few things to try:**
• "Help me with my emails"
• "Prepare me for a meeting"
• "Debug this code issue"
• "Research market trends"

*This is a demo with ${DEMO_MESSAGE_LIMIT} messages. Sign up to get the full experience!*`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Match against demo responses
    for (const [keywords, response] of Object.entries(demoBotResponses)) {
      const keywordList = keywords.split('|');
      if (keywordList.some(kw => lowerMessage.includes(kw))) {
        return response;
      }
    }
    
    // Default intelligent response
    return `That's an interesting question about "${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}".

In the full version, I would:
• Remember this conversation for next time
• Connect it to your other projects and context
• Proactively follow up if needed
• Access your email, calendar, and files

**This is just a taste.** The real Ally learns your preferences, remembers your projects, and gets smarter every day.

What else would you like to explore?`;
  };

  const simulateTyping = async (response: string) => {
    setIsTyping(true);
    
    // Simulate typing delay based on response length
    const typingDelay = Math.min(response.length * 10, 2000) + 500;
    await new Promise(resolve => setTimeout(resolve, typingDelay));
    
    const botMessage: DemoMessage = {
      id: `bot-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: DemoMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const newCount = messageCount + 1;
    setMessageCount(newCount);

    if (newCount >= DEMO_MESSAGE_LIMIT) {
      // Show limit modal after a brief delay to let the message appear
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const limitMessage: DemoMessage = {
        id: `limit-${Date.now()}`,
        role: 'assistant',
        content: `You've reached the demo limit! 🎉

I hope you got a taste of what I can do. In the full version:

✨ **Unlimited conversations** with persistent memory
📧 **Email & calendar integration** - I manage your inbox
🚀 **Proactive assistance** - I work while you sleep
🔗 **Multi-channel** - Chat via Telegram, Discord, or WhatsApp

**Ready to get started?**`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, limitMessage]);
      setIsTyping(false);
      onLimitReached();
      return;
    }

    // Generate and show bot response
    const response = generateBotResponse(userMessage.content);
    await simulateTyping(response);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const remainingMessages = DEMO_MESSAGE_LIMIT - messageCount;

  return (
    <div className="flex flex-col h-[600px] max-h-[70vh] bg-gray-900/80 rounded-2xl border border-gray-700/50 overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50 bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Ally</h3>
            <p className="text-xs text-emerald-400">Online • Demo Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30">
          <span className="text-violet-400 text-sm font-medium">
            {remainingMessages > 0 ? `${remainingMessages} messages left` : 'Demo complete'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                    : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <MessageContent content={message.content} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800/80 rounded-2xl px-4 py-3 border border-gray-700/50">
                <div className="flex gap-1.5">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-violet-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-violet-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-violet-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50 bg-gray-800/30">
        <div className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={remainingMessages > 0 ? "Type a message..." : "Demo complete - sign up for unlimited access"}
            disabled={remainingMessages <= 0 || isTyping}
            rows={1}
            className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || remainingMessages <= 0 || isTyping}
            className="px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

// Simple markdown-ish renderer for demo messages
function MessageContent({ content }: { content: string }) {
  // Process the content into React elements
  const lines = content.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-bold text-white">{line.replace(/\*\*/g, '')}</p>;
        }
        
        // Headers (bold with newlines)
        if (line.match(/^\*\*.*\*\*$/)) {
          return <p key={i} className="font-bold text-white">{line.replace(/\*\*/g, '')}</p>;
        }
        
        // List items
        if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('✅ ') || line.startsWith('❌ ') || line.startsWith('✨ ') || line.startsWith('🔗 ') || line.startsWith('📧 ') || line.startsWith('🚀 ')) {
          return <p key={i} className="pl-2">{processInlineStyles(line)}</p>;
        }
        
        // Italic text (entire line)
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          return <p key={i} className="text-gray-400 italic text-sm">{line.replace(/^\*|\*$/g, '')}</p>;
        }
        
        // Empty lines
        if (!line.trim()) {
          return <div key={i} className="h-2" />;
        }
        
        // Regular text with inline processing
        return <p key={i}>{processInlineStyles(line)}</p>;
      })}
    </div>
  );
}

function processInlineStyles(text: string): React.ReactNode {
  // Process **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
