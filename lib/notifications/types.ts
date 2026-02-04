// Notification Types for Clawdbot/Ally

export type NotificationType = 
  | 'ally_action'      // Ally did something for the user
  | 'task_completed'   // Automated task finished
  | 'reminder'         // Scheduled reminder
  | 'mention'          // User was mentioned
  | 'feature'          // New feature announcement
  | 'tip'              // Usage tip
  | 'security'         // Security alert
  | 'billing'          // Billing/subscription notification
  | 'integration'      // Integration status change
  | 'system';          // System notification

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface NotificationAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  status: NotificationStatus;
  priority: NotificationPriority;
  icon?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, unknown>;
  // For grouping related notifications
  groupId?: string;
  // Source of the notification
  source?: {
    type: 'ally' | 'system' | 'integration';
    name: string;
    avatar?: string;
  };
}

export interface NotificationPreferences {
  // Global settings
  enabled: boolean;
  doNotDisturb: boolean;
  doNotDisturbStart?: string; // HH:mm format
  doNotDisturbEnd?: string;
  
  // In-app notifications
  inApp: {
    enabled: boolean;
    showBadge: boolean;
    playSound: boolean;
    soundVolume: number; // 0-100
  };
  
  // Push notifications
  push: {
    enabled: boolean;
    subscribed: boolean;
    allyActions: boolean;
    taskCompletions: boolean;
    reminders: boolean;
    mentions: boolean;
    security: boolean;
    billing: boolean;
  };
  
  // Email notifications
  email: {
    enabled: boolean;
    address: string;
    dailyDigest: boolean;
    digestTime: string; // HH:mm format
    weeklyReport: boolean;
    importantOnly: boolean;
    marketing: boolean;
  };
}

export interface NotificationGroup {
  id: string;
  type: NotificationType;
  title: string;
  notifications: Notification[];
  latestTimestamp: Date;
  unreadCount: number;
}

// Toast notification for immediate feedback
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms, 0 = persistent
  action?: NotificationAction;
}

// Push notification payload
export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    notificationId: string;
    type: NotificationType;
    url?: string;
  };
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

// Default notification preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  enabled: true,
  doNotDisturb: false,
  inApp: {
    enabled: true,
    showBadge: true,
    playSound: true,
    soundVolume: 50,
  },
  push: {
    enabled: true,
    subscribed: false,
    allyActions: true,
    taskCompletions: true,
    reminders: true,
    mentions: true,
    security: true,
    billing: true,
  },
  email: {
    enabled: true,
    address: '',
    dailyDigest: true,
    digestTime: '09:00',
    weeklyReport: true,
    importantOnly: false,
    marketing: false,
  },
};

// Notification type metadata for UI
export const notificationTypeConfig: Record<NotificationType, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}> = {
  ally_action: {
    label: 'Ally Action',
    icon: '🤖',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  task_completed: {
    label: 'Task Completed',
    icon: '✅',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
  },
  reminder: {
    label: 'Reminder',
    icon: '⏰',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
  },
  mention: {
    label: 'Mention',
    icon: '@',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
  },
  feature: {
    label: 'New Feature',
    icon: '✨',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
  },
  tip: {
    label: 'Tip',
    icon: '💡',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
  },
  security: {
    label: 'Security',
    icon: '🔒',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
  billing: {
    label: 'Billing',
    icon: '💳',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
  },
  integration: {
    label: 'Integration',
    icon: '🔗',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
  },
  system: {
    label: 'System',
    icon: '⚙️',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
  },
};
