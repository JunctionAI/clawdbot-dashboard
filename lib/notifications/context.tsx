'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { 
  Notification, 
  NotificationPreferences, 
  ToastNotification,
  NotificationType,
  NotificationStatus,
} from './types';
import { defaultNotificationPreferences } from './types';

interface NotificationContextValue {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Toast notifications
  toasts: ToastNotification[];
  
  // Preferences
  preferences: NotificationPreferences;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  
  // Toast actions
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;
  
  // Preference actions
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  
  // Push notification actions
  requestPushPermission: () => Promise<boolean>;
  subscribeToPush: () => Promise<boolean>;
  unsubscribeFromPush: () => Promise<void>;
  pushPermissionStatus: NotificationPermission | 'unsupported';
  
  // UI state
  isNotificationCenterOpen: boolean;
  setNotificationCenterOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Generate unique ID
const generateId = () => `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: 'notif_1',
    type: 'ally_action',
    title: 'Ally processed your emails',
    message: 'I sorted 23 emails, flagged 3 as important, and drafted 2 replies for your review.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'unread',
    priority: 'normal',
    source: { type: 'ally', name: 'Ally', avatar: '🤖' },
    actions: [
      { label: 'View Details', href: '/dashboard/activity' },
      { label: 'Review Drafts', href: '/dashboard/drafts', variant: 'primary' },
    ],
  },
  {
    id: 'notif_2',
    type: 'feature',
    title: 'New: Voice Commands',
    message: 'You can now talk to Ally using voice commands! Try saying "Hey Ally" followed by your request.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'unread',
    priority: 'low',
    actions: [
      { label: 'Try It Now', href: '/settings/voice', variant: 'primary' },
      { label: 'Learn More', href: '/docs/voice' },
    ],
  },
  {
    id: 'notif_3',
    type: 'task_completed',
    title: 'Meeting scheduled',
    message: 'I scheduled your meeting with Sarah for tomorrow at 2 PM. Calendar invite sent.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'unread',
    priority: 'normal',
    source: { type: 'ally', name: 'Ally', avatar: '🤖' },
    actions: [
      { label: 'View Calendar', href: '/dashboard/calendar' },
    ],
  },
  {
    id: 'notif_4',
    type: 'tip',
    title: 'Pro Tip: Quick Actions',
    message: 'Press Cmd+K (or Ctrl+K) anywhere to access quick actions and search.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'read',
    priority: 'low',
  },
  {
    id: 'notif_5',
    type: 'integration',
    title: 'Gmail connected successfully',
    message: 'Your Gmail account is now connected. Ally can help manage your emails.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: 'read',
    priority: 'normal',
    source: { type: 'integration', name: 'Gmail', avatar: '📧' },
  },
  {
    id: 'notif_6',
    type: 'reminder',
    title: 'Reminder: Weekly review',
    message: 'Time for your weekly productivity review. Want me to generate a summary?',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: 'unread',
    priority: 'high',
    source: { type: 'ally', name: 'Ally', avatar: '🤖' },
    actions: [
      { label: 'Generate Summary', variant: 'primary' },
      { label: 'Snooze 1 Hour' },
    ],
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check push notification support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission);
    } else {
      setPushPermissionStatus('unsupported');
    }
  }, []);

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (preferences.inApp.playSound && preferences.inApp.enabled) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/notification.mp3');
      }
      audioRef.current.volume = preferences.inApp.soundVolume / 100;
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [preferences.inApp]);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'status'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      status: 'unread',
    };

    setNotifications(prev => [newNotification, ...prev]);
    playNotificationSound();

    // Show in-app toast for high priority
    if (notification.priority === 'high' || notification.priority === 'urgent') {
      setToasts(prev => [...prev, {
        id: generateId(),
        type: 'info',
        title: notification.title,
        message: notification.message,
        duration: 5000,
      }]);
    }
  }, [playNotificationSound]);

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: 'read' as NotificationStatus } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, status: 'read' as NotificationStatus }))
    );
  }, []);

  // Archive notification
  const archiveNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: 'archived' as NotificationStatus } : n)
    );
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Show toast
  const showToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = generateId();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto-dismiss after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, toast.duration || 5000);
    }
  }, []);

  // Dismiss toast
  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Update preferences
  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
    // TODO: Persist to backend
  }, []);

  // Request push permission
  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    setPushPermissionStatus(permission);
    return permission === 'granted';
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID public key from environment
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key not configured');
        return false;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      // Send subscription to backend
      // TODO: await fetch('/api/notifications/subscribe', {
      //   method: 'POST',
      //   body: JSON.stringify(subscription),
      // });

      setPreferences(prev => ({
        ...prev,
        push: { ...prev.push, subscribed: true },
      }));

      return true;
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      return false;
    }
  }, []);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async (): Promise<void> => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        // TODO: Notify backend
      }

      setPreferences(prev => ({
        ...prev,
        push: { ...prev.push, subscribed: false },
      }));
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
    }
  }, []);

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    toasts,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    clearAll,
    showToast,
    dismissToast,
    updatePreferences,
    requestPushPermission,
    subscribeToPush,
    unsubscribeFromPush,
    pushPermissionStatus,
    isNotificationCenterOpen,
    setNotificationCenterOpen,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  if (typeof window === 'undefined') {
    return new Uint8Array(0);
  }
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
