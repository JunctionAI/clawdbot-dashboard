'use client';

import { use, useEffect, useState, useRef } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { MessageSquareIcon } from '@/components/ui/icons';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  isRetryable?: boolean;
}

interface WorkspaceInfo {
  id: string;
  name?: string;
  status?: 'active' | 'inactive' | 'error';
}

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.id;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInfo | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load workspace info
  useEffect(() => {
    const loadWorkspace = async () => {
      setWorkspaceLoading(true);
      setWorkspaceError(null);
      
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/workspace/${workspaceId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Workspace not found. Please check the workspace ID.');
          }
          throw new Error('Failed to load workspace. Please try again.');
        }
        const data = await res.json();
        setWorkspaceInfo(data);
      } catch (err) {
        setWorkspaceError(err instanceof Error ? err.message : 'Failed to load workspace');
      } finally {
        setWorkspaceLoading(false);
      }
    };
    
    loadWorkspace();
  }, [workspaceId]);

  async function sendMessage(messageText?: string) {
    const text = messageText || input;
    if (!text.trim()) return;

    const messageId = `msg_${Date.now()}`;
    const userMessage: Message = { 
      id: messageId,
      role: 'user', 
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    setLastFailedMessage(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/workspace/${workspaceId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const assistantMessage: Message = { 
        id: `msg_${Date.now()}`,
        role: 'assistant', 
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setLastFailedMessage(text);
      const errorMessage: Message = {
        id: `err_${Date.now()}`,
        role: 'error',
        content: 'Failed to send message. Please try again.',
        timestamp: new Date(),
        isRetryable: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  }

  const handleRetry = () => {
    if (lastFailedMessage) {
      // Remove the last error message
      setMessages(prev => prev.filter(m => !(m.role === 'error' && m.isRetryable)));
      sendMessage(lastFailedMessage);
    }
  };

  // Show loading state while workspace loads
  if (workspaceLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <p className="text-gray-400">Loading workspace...</p>
          <p className="text-gray-500 text-sm mt-2">ID: {workspaceId}</p>
        </div>
      </div>
    );
  }

  // Show error state if workspace failed to load
  if (workspaceError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorState
            title="Workspace Unavailable"
            message={workspaceError}
            onRetry={() => window.location.reload()}
          />
          <div className="mt-6 text-center">
            <a 
              href="/dashboard" 
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col">
      {/* Header - Fixed on mobile */}
      <div className="sticky top-0 z-20 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white truncate">Clawdbot</h1>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{workspaceId}</p>
          </div>
          
          {/* Desktop nav */}
          <div className="hidden sm:flex gap-4">
            <a href="/dashboard" className="text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center px-2">
              Dashboard
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center px-2">
              Settings
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-xl">
            <a 
              href="/dashboard" 
              className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors min-h-[48px] flex items-center"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </a>
            <a 
              href="#" 
              className="block px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors min-h-[48px] flex items-center"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </a>
          </div>
        )}
      </div>

      {/* Chat Interface - Fills remaining space */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        <div className="flex-1 flex flex-col bg-gray-800/30 sm:bg-gray-800/50 sm:backdrop-blur sm:m-4 sm:rounded-lg sm:border sm:border-gray-700 overflow-hidden">
          {/* Messages - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 touch-scroll">
            {/* Empty state - no messages yet */}
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8 sm:mt-20 px-4">
                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">👋</div>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Welcome to your Clawdbot!</h2>
                <p className="text-sm sm:text-base">I remember everything we discuss. Try asking me to:</p>
                <ul className="mt-3 sm:mt-4 space-y-2 text-sm sm:text-base">
                  <li>• Summarize your day</li>
                  <li>• Set a reminder</li>
                  <li>• Search the web</li>
                  <li>• Help with a task</li>
                </ul>
                
                {/* Quick action buttons */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['What can you help me with?', 'Show my calendar', 'Check my emails'].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="px-4 py-2 text-sm bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-full text-gray-300 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Message list */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'error' ? (
                  // Error message with retry
                  <div className="max-w-[85%] sm:max-w-[80%] p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-red-400 text-sm">{msg.content}</p>
                        {msg.isRetryable && lastFailedMessage && (
                          <button
                            onClick={handleRetry}
                            className="mt-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular message
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-md' 
                      : 'bg-gray-700 text-gray-100 rounded-bl-md'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm sm:text-base break-words">{msg.content}</div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading indicator */}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input - Fixed at bottom with safe area for mobile */}
          <div className="p-3 sm:p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-xl safe-area-inset">
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Message your assistant..."
                className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 min-h-[48px] text-base focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500 disabled:opacity-50"
                disabled={isSending}
                autoComplete="off"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isSending || !input.trim()}
                className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-3 min-h-[48px] min-w-[48px] rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                aria-label="Send message"
              >
                {isSending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Send</span>
                    <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
