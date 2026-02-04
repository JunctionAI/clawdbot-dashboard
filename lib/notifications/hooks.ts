'use client';

import { useCallback } from 'react';
import { useNotifications } from './context';
import type { NotificationType, NotificationPriority, NotificationAction } from './types';

interface CreateNotificationOptions {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  actions?: NotificationAction[];
  source?: {
    type: 'ally' | 'system' | 'integration';
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Hook for creating notifications with common patterns
 */
export function useNotify() {
  const { addNotification, showToast } = useNotifications();

  // Create a custom notification
  const notify = useCallback((options: CreateNotificationOptions) => {
    addNotification({
      ...options,
      priority: options.priority || 'normal',
    });
  }, [addNotification]);

  // Quick notification helpers
  const notifyAllyAction = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    addNotification({
      type: 'ally_action',
      title,
      message,
      priority: 'normal',
      source: { type: 'ally', name: 'Ally', avatar: '🤖' },
      actions,
    });
  }, [addNotification]);

  const notifyTaskComplete = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    addNotification({
      type: 'task_completed',
      title,
      message,
      priority: 'normal',
      source: { type: 'ally', name: 'Ally', avatar: '🤖' },
      actions,
    });
    showToast({
      type: 'success',
      title,
      message,
    });
  }, [addNotification, showToast]);

  const notifyReminder = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    addNotification({
      type: 'reminder',
      title,
      message,
      priority: 'high',
      source: { type: 'ally', name: 'Ally', avatar: '⏰' },
      actions,
    });
  }, [addNotification]);

  const notifyFeature = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    addNotification({
      type: 'feature',
      title,
      message,
      priority: 'low',
      actions,
    });
  }, [addNotification]);

  const notifyTip = useCallback((title: string, message: string) => {
    addNotification({
      type: 'tip',
      title,
      message,
      priority: 'low',
    });
  }, [addNotification]);

  const notifySecurity = useCallback((title: string, message: string, actions?: NotificationAction[]) => {
    addNotification({
      type: 'security',
      title,
      message,
      priority: 'urgent',
      actions,
    });
    showToast({
      type: 'warning',
      title,
      message,
      duration: 0, // Persistent
    });
  }, [addNotification, showToast]);

  const notifyIntegration = useCallback((
    integrationName: string, 
    title: string, 
    message: string,
    status: 'success' | 'error' = 'success'
  ) => {
    addNotification({
      type: 'integration',
      title,
      message,
      priority: 'normal',
      source: { type: 'integration', name: integrationName },
    });
    showToast({
      type: status,
      title,
      message,
    });
  }, [addNotification, showToast]);

  // Toast-only helpers (no persistent notification)
  const toast = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string
  ) => {
    showToast({ type, title, message });
  }, [showToast]);

  return {
    notify,
    notifyAllyAction,
    notifyTaskComplete,
    notifyReminder,
    notifyFeature,
    notifyTip,
    notifySecurity,
    notifyIntegration,
    toast,
  };
}

/**
 * Demo hook for testing notifications
 */
export function useDemoNotifications() {
  const { addNotification, showToast } = useNotifications();

  const triggerDemoNotification = useCallback(() => {
    const demos = [
      {
        type: 'ally_action' as NotificationType,
        title: 'Ally drafted your response',
        message: 'I prepared a reply to the email from John about the project update. Review it when ready.',
        priority: 'normal' as NotificationPriority,
        source: { type: 'ally' as const, name: 'Ally', avatar: '🤖' },
        actions: [
          { label: 'Review Draft', variant: 'primary' as const },
          { label: 'Dismiss' },
        ],
      },
      {
        type: 'task_completed' as NotificationType,
        title: 'Calendar synced',
        message: 'Your Google Calendar has been synced. 3 new events added.',
        priority: 'normal' as NotificationPriority,
        source: { type: 'ally' as const, name: 'Ally', avatar: '📅' },
      },
      {
        type: 'reminder' as NotificationType,
        title: 'Meeting in 15 minutes',
        message: 'Team standup with the product team is starting soon.',
        priority: 'high' as NotificationPriority,
        source: { type: 'ally' as const, name: 'Ally', avatar: '⏰' },
        actions: [
          { label: 'Join Meeting', variant: 'primary' as const },
          { label: 'Snooze 5 min' },
        ],
      },
      {
        type: 'tip' as NotificationType,
        title: 'Pro tip: Quick commands',
        message: 'You can ask Ally to "summarize my emails" to get a quick overview of your inbox.',
        priority: 'low' as NotificationPriority,
      },
      {
        type: 'feature' as NotificationType,
        title: 'New: Smart Scheduling',
        message: 'Ally can now automatically find the best time for meetings based on everyone\'s availability.',
        priority: 'low' as NotificationPriority,
        actions: [
          { label: 'Try it out', variant: 'primary' as const },
        ],
      },
    ];

    const demo = demos[Math.floor(Math.random() * demos.length)];
    addNotification(demo);
  }, [addNotification]);

  const triggerDemoToast = useCallback((type: 'success' | 'error' | 'warning' | 'info') => {
    const messages = {
      success: { title: 'Action completed', message: 'Your changes have been saved.' },
      error: { title: 'Something went wrong', message: 'Please try again or contact support.' },
      warning: { title: 'Attention needed', message: 'Some items require your review.' },
      info: { title: 'Did you know?', message: 'You can use keyboard shortcuts for faster navigation.' },
    };

    showToast({
      type,
      ...messages[type],
    });
  }, [showToast]);

  return {
    triggerDemoNotification,
    triggerDemoToast,
  };
}
