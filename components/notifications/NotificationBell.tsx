'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/lib/notifications/context';
import { notificationTypeConfig } from '@/lib/notifications/types';
import type { Notification } from '@/lib/notifications/types';
import { BellIcon, CheckIcon, XIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    isNotificationCenterOpen,
    setNotificationCenterOpen,
  } = useNotifications();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get visible notifications (not archived)
  const visibleNotifications = notifications
    .filter(n => n.status !== 'archived')
    .slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <BellIcon className="w-6 h-6" />
        
        {/* Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-purple-500 rounded-full"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Pulse animation for new notifications */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50 bg-gray-800/30">
              <h3 className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <CheckIcon className="w-4 h-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {visibleNotifications.length > 0 ? (
                <div className="divide-y divide-gray-800/50">
                  {visibleNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={() => markAsRead(notification.id)}
                      onDelete={() => deleteNotification(notification.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <BellIcon className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400">No notifications yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    We'll notify you when Ally does something for you
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {visibleNotifications.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-700/50 bg-gray-800/30">
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View all notifications →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Individual notification item
function NotificationItem({ 
  notification, 
  onRead, 
  onDelete 
}: { 
  notification: Notification;
  onRead: () => void;
  onDelete: () => void;
}) {
  const config = notificationTypeConfig[notification.type];
  const isUnread = notification.status === 'unread';

  return (
    <div
      className={`
        relative p-4 hover:bg-gray-800/30 transition-colors cursor-pointer group
        ${isUnread ? 'bg-purple-500/5' : ''}
      `}
      onClick={onRead}
    >
      {/* Unread indicator */}
      {isUnread && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full" />
      )}
      
      <div className={`flex gap-3 ${isUnread ? 'ml-4' : ''}`}>
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center text-lg`}>
          {notification.source?.avatar || config.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-medium truncate ${isUnread ? 'text-white' : 'text-gray-300'}`}>
              {notification.title}
            </p>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-shrink-0 p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
              aria-label="Delete notification"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm text-gray-400 line-clamp-2 mt-0.5">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">
              {formatRelativeTime(notification.timestamp)}
            </span>
            {notification.source && (
              <>
                <span className="text-gray-600">•</span>
                <span className="text-xs text-gray-500">
                  {notification.source.name}
                </span>
              </>
            )}
          </div>
          
          {/* Quick actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {notification.actions.slice(0, 2).map((action, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (action.onClick) action.onClick();
                  }}
                  className={`
                    text-xs px-2.5 py-1 rounded-md transition-colors
                    ${action.variant === 'primary' 
                      ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationBell;
