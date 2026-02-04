'use client';

import React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { CheckIcon, ClockIcon } from '@/components/ui/icons';

export type MessageRole = 'user' | 'ally';
export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ActionInfo {
  type: 'email' | 'calendar' | 'search' | 'file' | 'integration' | 'task';
  label: string;
  status: 'pending' | 'complete' | 'error';
}

export interface ChatMessageData {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
  action?: ActionInfo;
}

interface ChatMessageProps {
  message: ChatMessageData;
  userName?: string;
  userAvatar?: string;
  isLatest?: boolean;
}

// Action type icons and colors
const actionStyles: Record<ActionInfo['type'], { icon: string; color: string }> = {
  email: { icon: '✉️', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  calendar: { icon: '📅', color: 'from-green-500/20 to-green-600/10 border-green-500/30' },
  search: { icon: '🔍', color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' },
  file: { icon: '📄', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30' },
  integration: { icon: '🔗', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30' },
  task: { icon: '✓', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return formatTime(date);
}

export function ChatMessage({ message, userName = 'You', userAvatar, isLatest }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isAlly = message.role === 'ally';
  
  return (
    <div 
      className={`flex gap-3 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animationDuration: '0.3s' }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <Avatar 
            src={userAvatar} 
            name={userName} 
            size="sm" 
            showStatus={false}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-gray-700 shadow-glow">
            <span className="text-sm">✨</span>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Sender Label */}
        <span className="text-xs text-gray-500 mb-1 px-1">
          {isUser ? userName : 'Ally'}
        </span>

        {/* Action Indicator (if any) */}
        {message.action && (
          <ActionBadge action={message.action} />
        )}

        {/* Message Bubble */}
        <div 
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser 
              ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-sm' 
              : 'bg-gray-800/70 text-gray-100 rounded-tl-sm border border-gray-700/50 backdrop-blur-sm'
            }
            ${isLatest && isAlly ? 'shadow-glow' : ''}
          `}
        >
          {/* Content with line breaks */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Timestamp and Status */}
        <div className={`flex items-center gap-1.5 mt-1 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-gray-500">
            {isLatest ? formatRelativeTime(message.timestamp) : formatTime(message.timestamp)}
          </span>
          
          {isUser && message.status && (
            <MessageStatusIcon status={message.status} />
          )}
        </div>
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: ActionInfo }) {
  const style = actionStyles[action.type];
  
  return (
    <div 
      className={`
        flex items-center gap-2 px-3 py-1.5 mb-2 rounded-full text-xs font-medium
        bg-gradient-to-r ${style.color} border backdrop-blur-sm
        ${action.status === 'pending' ? 'animate-pulse' : ''}
      `}
    >
      <span>{style.icon}</span>
      <span className="text-gray-200">{action.label}</span>
      {action.status === 'complete' && (
        <CheckIcon className="w-3 h-3 text-green-400" />
      )}
      {action.status === 'pending' && (
        <div className="w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
      )}
    </div>
  );
}

function MessageStatusIcon({ status }: { status: MessageStatus }) {
  switch (status) {
    case 'sending':
      return <ClockIcon className="w-3 h-3 text-gray-500" />;
    case 'sent':
      return <CheckIcon className="w-3 h-3 text-green-500" />;
    case 'error':
      return <span className="text-xs text-red-400">!</span>;
    default:
      return null;
  }
}
