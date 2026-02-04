'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { useNotifications } from '@/lib/notifications/context';
import { notificationTypeConfig } from '@/lib/notifications/types';
import type { Notification, NotificationType } from '@/lib/notifications/types';
import {
  BellIcon,
  TrashIcon,
  CheckIcon,
  ArrowLeftIcon,
  SettingsIcon,
  MailIcon,
  ZapIcon,
} from '@/components/ui/icons';
import Link from 'next/link';

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Group notifications by date
function groupByDate(notifications: Notification[]): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {};
  
  notifications.forEach(notification => {
    const date = notification.timestamp;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let key: string;
    if (date.toDateString() === today.toDateString()) {
      key = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      key = 'Yesterday';
    } else {
      key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
    
    if (!groups[key]) groups[key] = [];
    groups[key].push(notification);
  });
  
  return groups;
}

// Filter tabs
type FilterTab = 'all' | 'unread' | 'ally' | 'system';

const filterTabs: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <BellIcon className="w-4 h-4" /> },
  { id: 'unread', label: 'Unread', icon: <MailIcon className="w-4 h-4" /> },
  { id: 'ally', label: 'From Ally', icon: <ZapIcon className="w-4 h-4" /> },
  { id: 'system', label: 'System', icon: <SettingsIcon className="w-4 h-4" /> },
];

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    clearAll,
    preferences,
    updatePreferences,
    requestPushPermission,
    subscribeToPush,
    unsubscribeFromPush,
    pushPermissionStatus,
  } = useNotifications();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedTypes, setSelectedTypes] = useState<Set<NotificationType>>(new Set());

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(n => n.status !== 'archived');

    // Apply tab filter
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(n => n.status === 'unread');
        break;
      case 'ally':
        filtered = filtered.filter(n => n.source?.type === 'ally');
        break;
      case 'system':
        filtered = filtered.filter(n => 
          n.type === 'system' || n.type === 'feature' || n.type === 'tip' || n.type === 'security'
        );
        break;
    }

    // Apply type filter
    if (selectedTypes.size > 0) {
      filtered = filtered.filter(n => selectedTypes.has(n.type));
    }

    return filtered;
  }, [notifications, activeFilter, selectedTypes]);

  // Group filtered notifications
  const groupedNotifications = useMemo(() => 
    groupByDate(filteredNotifications),
    [filteredNotifications]
  );

  // Toggle type filter
  const toggleTypeFilter = (type: NotificationType) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    setSelectedTypes(newTypes);
  };

  // Handle push notification toggle
  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      if (pushPermissionStatus !== 'granted') {
        const granted = await requestPushPermission();
        if (!granted) return;
      }
      await subscribeToPush();
    } else {
      await unsubscribeFromPush();
    }
    updatePreferences({
      push: { ...preferences.push, enabled },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BellIcon className="w-8 h-8 text-purple-400" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="info" size="sm">{unreadCount} unread</Badge>
                )}
              </h1>
              <p className="text-gray-400 mt-1">Stay updated on what Ally is doing for you</p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckIcon className="w-4 h-4" />
                  Mark all read
                </Button>
              )}
              <Link href="/settings#notifications">
                <Button variant="ghost" size="sm">
                  <SettingsIcon className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6 animate-fade-in-left">
            {/* Quick Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Push Notifications</span>
                  <Toggle
                    enabled={preferences.push.enabled && preferences.push.subscribed}
                    onChange={handlePushToggle}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Sound</span>
                  <Toggle
                    enabled={preferences.inApp.playSound}
                    onChange={(v) => updatePreferences({
                      inApp: { ...preferences.inApp, playSound: v },
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Badge Count</span>
                  <Toggle
                    enabled={preferences.inApp.showBadge}
                    onChange={(v) => updatePreferences({
                      inApp: { ...preferences.inApp, showBadge: v },
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Type Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filter by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(notificationTypeConfig).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => toggleTypeFilter(type as NotificationType)}
                      className={`
                        flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all
                        ${selectedTypes.has(type as NotificationType)
                          ? `${config.bgColor} ${config.color} border border-current`
                          : 'bg-gray-800/50 text-gray-400 border border-transparent hover:bg-gray-800'
                        }
                      `}
                    >
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </button>
                  ))}
                </div>
                {selectedTypes.size > 0 && (
                  <button
                    onClick={() => setSelectedTypes(new Set())}
                    className="text-xs text-purple-400 hover:text-purple-300 mt-3"
                  >
                    Clear filters
                  </button>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{notifications.length}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{unreadCount}</div>
                    <div className="text-xs text-gray-400">Unread</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 animate-fade-in-right">
            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                    ${activeFilter === tab.id
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-gray-800/50 text-gray-400 border border-transparent hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'unread' && unreadCount > 0 && (
                    <Badge variant="info" size="sm">{unreadCount}</Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Notification List */}
            {Object.keys(groupedNotifications).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(groupedNotifications).map(([dateGroup, items]) => (
                  <div key={dateGroup}>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">{dateGroup}</h3>
                    <div className="space-y-2">
                      <AnimatePresence mode="popLayout">
                        {items.map((notification) => (
                          <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onRead={() => markAsRead(notification.id)}
                            onArchive={() => archiveNotification(notification.id)}
                            onDelete={() => deleteNotification(notification.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <BellIcon className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  {activeFilter === 'all'
                    ? "You're all caught up! We'll notify you when Ally does something for you."
                    : `No ${activeFilter} notifications to show.`
                  }
                </p>
              </Card>
            )}

            {/* Clear All */}
            {notifications.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-gray-500 hover:text-red-400"
                >
                  <TrashIcon className="w-4 h-4" />
                  Clear all notifications
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Full notification card
function NotificationCard({
  notification,
  onRead,
  onArchive,
  onDelete,
}: {
  notification: Notification;
  onRead: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const config = notificationTypeConfig[notification.type];
  const isUnread = notification.status === 'unread';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`
          relative overflow-hidden group cursor-pointer
          ${isUnread ? 'border-purple-500/30 bg-purple-500/5' : ''}
        `}
        hover
        onClick={onRead}
      >
        {/* Priority indicator */}
        {notification.priority === 'high' && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
        )}
        {notification.priority === 'urgent' && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 animate-pulse" />
        )}

        <div className="flex gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center text-xl`}>
            {notification.source?.avatar || config.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className={`font-medium ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                  {notification.title}
                </h4>
                <Badge variant="default" size="sm" className="mt-1">
                  {config.label}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm text-gray-500">
                  {formatRelativeTime(notification.timestamp)}
                </span>
                
                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUnread && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRead();
                      }}
                      className="p-1.5 text-gray-500 hover:text-green-400 transition-colors rounded"
                      title="Mark as read"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-400 mt-2">
              {notification.message}
            </p>

            {/* Source info */}
            {notification.source && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>from {notification.source.name}</span>
              </div>
            )}

            {/* Actions */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-4">
                {notification.actions.map((action, i) => (
                  <Button
                    key={i}
                    variant={action.variant === 'primary' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (action.onClick) action.onClick();
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unread dot */}
        {isUnread && (
          <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full" />
        )}
      </Card>
    </motion.div>
  );
}
