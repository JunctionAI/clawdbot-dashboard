'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExampleConversation } from './types';
import { exampleConversations } from './conversationData';

interface ExampleConversationsProps {
  onSelectConversation?: (conversation: ExampleConversation) => void;
}

export function ExampleConversations({ onSelectConversation }: ExampleConversationsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedMessageIndex, setExpandedMessageIndex] = useState(0);

  const selectedConversation = selectedId 
    ? exampleConversations.find(c => c.id === selectedId)
    : null;

  const handleSelect = (conversation: ExampleConversation) => {
    setSelectedId(conversation.id);
    setExpandedMessageIndex(0);
    onSelectConversation?.(conversation);
  };

  const handleClose = () => {
    setSelectedId(null);
    setExpandedMessageIndex(0);
  };

  const handleNextMessage = () => {
    if (selectedConversation && expandedMessageIndex < selectedConversation.messages.length - 1) {
      setExpandedMessageIndex(prev => prev + 1);
    }
  };

  const handlePrevMessage = () => {
    if (expandedMessageIndex > 0) {
      setExpandedMessageIndex(prev => prev - 1);
    }
  };

  const categories = [
    { id: 'productivity', label: 'Productivity', icon: '⚡' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'coding', label: 'Coding', icon: '💻' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'creative', label: 'Creative', icon: '✍️' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              const conv = exampleConversations.find(c => c.category === cat.id);
              if (conv) handleSelect(conv);
            }}
            className="px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:border-violet-500/50 hover:text-white transition-all text-sm flex items-center gap-2"
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Conversation cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exampleConversations.map((conversation, index) => (
          <motion.button
            key={conversation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelect(conversation)}
            className="group text-left p-5 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-violet-500/50 hover:bg-gray-800/50 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                {conversation.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white mb-1 group-hover:text-violet-400 transition-colors">
                  {conversation.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {conversation.description}
                </p>
              </div>
            </div>
            
            {/* Preview of first message */}
            <div className="mt-4 p-3 rounded-lg bg-gray-900/50 text-sm text-gray-400 line-clamp-2">
              <span className="text-violet-400 font-medium">User:</span>{' '}
              {conversation.messages[0].content}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modal for viewing full conversation */}
      <AnimatePresence>
        {selectedConversation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-gray-900 border border-gray-700/50 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl">
                    {selectedConversation.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedConversation.title}</h3>
                    <p className="text-sm text-gray-400">{selectedConversation.description}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
                {selectedConversation.messages.slice(0, expandedMessageIndex + 1).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white'
                          : 'bg-gray-800/80 text-gray-100 border border-gray-700/50'
                      }`}
                    >
                      <MessageContent content={message.content} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-4 border-t border-gray-700/50 bg-gray-800/30">
                <button
                  onClick={handlePrevMessage}
                  disabled={expandedMessageIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {selectedConversation.messages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setExpandedMessageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= expandedMessageIndex 
                          ? 'bg-violet-500' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextMessage}
                  disabled={expandedMessageIndex >= selectedConversation.messages.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 hover:text-violet-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Reusable message content renderer
function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, i) => {
        // Empty lines
        if (!line.trim()) {
          return <div key={i} className="h-2" />;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return null; // Skip code block markers in simple rendering
        }
        
        // Tables (simple rendering)
        if (line.includes('|') && line.trim().startsWith('|')) {
          return (
            <div key={i} className="font-mono text-xs bg-gray-900/50 px-2 py-1 rounded overflow-x-auto">
              {line}
            </div>
          );
        }
        
        // Headers
        if (line.match(/^\*\*[^*]+\*\*$/)) {
          return (
            <p key={i} className="font-bold text-white mt-3 first:mt-0">
              {line.replace(/\*\*/g, '')}
            </p>
          );
        }
        
        // List items with various bullets
        if (line.match(/^[•\-✅❌✨🔗📧🚀🔴🟡📁🎯⚠️📊📈📋⏰💜💎🏢]\s/)) {
          return (
            <p key={i} className="pl-2">
              {processInlineStyles(line)}
            </p>
          );
        }
        
        // Numbered lists
        if (line.match(/^\d+\.\s/)) {
          return (
            <p key={i} className="pl-2">
              {processInlineStyles(line)}
            </p>
          );
        }
        
        // Horizontal rules
        if (line.match(/^-{3,}$/)) {
          return <hr key={i} className="border-gray-700 my-3" />;
        }
        
        // Regular text
        return <p key={i}>{processInlineStyles(line)}</p>;
      })}
    </div>
  );
}

function processInlineStyles(text: string): React.ReactNode {
  // Process **bold**, `code`, and other inline styles
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 bg-gray-900/50 rounded text-violet-400 text-xs">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}
