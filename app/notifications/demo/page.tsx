'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotifications, useDemoNotifications, useNotify } from '@/lib/notifications';
import { 
  BellIcon, 
  ZapIcon, 
  CheckIcon,
  ArrowLeftIcon,
} from '@/components/ui/icons';
import Link from 'next/link';

export default function NotificationDemoPage() {
  const { 
    unreadCount, 
    markAllAsRead, 
    clearAll,
    preferences,
    updatePreferences,
  } = useNotifications();
  
  const { triggerDemoNotification, triggerDemoToast } = useDemoNotifications();
  const notify = useNotify();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/notifications">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Notification Demo</h1>
              <p className="text-gray-400 mt-1">Test the notification system</p>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Trigger Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BellIcon className="w-5 h-5 text-purple-400" />
                Trigger Notifications
              </CardTitle>
              <CardDescription>
                Add new notifications to the notification center
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={triggerDemoNotification} className="w-full">
                <ZapIcon className="w-4 h-4" />
                Random Notification
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => notify.notifyAllyAction(
                  'Ally organized your inbox',
                  'I sorted 15 emails into categories and flagged 3 as important.',
                  [{ label: 'View Inbox', variant: 'primary' }]
                )}
              >
                Ally Action
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => notify.notifyTaskComplete(
                  'Report generated',
                  'Your weekly productivity report is ready to view.'
                )}
              >
                Task Complete
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => notify.notifyReminder(
                  'Reminder: Team meeting',
                  'Your team meeting starts in 15 minutes.'
                )}
              >
                Reminder (High Priority)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => notify.notifyFeature(
                  '✨ New Feature: Voice Mode',
                  'You can now talk to Ally using voice commands!'
                )}
              >
                Feature Announcement
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => notify.notifyTip(
                  'Pro tip',
                  'Press Cmd+K to open quick actions from anywhere.'
                )}
              >
                Pro Tip
              </Button>
            </CardContent>
          </Card>

          {/* Toast Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ZapIcon className="w-5 h-5 text-blue-400" />
                Toast Notifications
              </CardTitle>
              <CardDescription>
                Temporary notifications that auto-dismiss
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => triggerDemoToast('success')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <CheckIcon className="w-4 h-4" />
                Success Toast
              </Button>
              
              <Button 
                onClick={() => triggerDemoToast('error')} 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Error Toast
              </Button>
              
              <Button 
                onClick={() => triggerDemoToast('warning')} 
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Warning Toast
              </Button>
              
              <Button 
                onClick={() => triggerDemoToast('info')} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Info Toast
              </Button>

              <div className="pt-4 border-t border-gray-700/50">
                <h4 className="text-sm font-medium text-white mb-2">Custom Toast</h4>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => notify.toast(
                    'success',
                    'Custom notification',
                    'This is a custom toast with your message.'
                  )}
                >
                  Custom Toast
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Manage notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Unread Count</span>
                <span className="text-2xl font-bold text-purple-400">{unreadCount}</span>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark All as Read
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10"
                onClick={clearAll}
              >
                Clear All Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Quick Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Settings</CardTitle>
              <CardDescription>Toggle notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Sound</span>
                <button
                  onClick={() => updatePreferences({
                    inApp: { ...preferences.inApp, playSound: !preferences.inApp.playSound }
                  })}
                  className={`
                    px-3 py-1 rounded-lg text-sm transition-colors
                    ${preferences.inApp.playSound 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-800 text-gray-400'
                    }
                  `}
                >
                  {preferences.inApp.playSound ? 'On' : 'Off'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Badge</span>
                <button
                  onClick={() => updatePreferences({
                    inApp: { ...preferences.inApp, showBadge: !preferences.inApp.showBadge }
                  })}
                  className={`
                    px-3 py-1 rounded-lg text-sm transition-colors
                    ${preferences.inApp.showBadge 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-800 text-gray-400'
                    }
                  `}
                >
                  {preferences.inApp.showBadge ? 'On' : 'Off'}
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Do Not Disturb</span>
                <button
                  onClick={() => updatePreferences({
                    doNotDisturb: !preferences.doNotDisturb
                  })}
                  className={`
                    px-3 py-1 rounded-lg text-sm transition-colors
                    ${preferences.doNotDisturb 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-gray-800 text-gray-400'
                    }
                  `}
                >
                  {preferences.doNotDisturb ? 'On' : 'Off'}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-white mb-3">How to use</h3>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>• Click the notification buttons to trigger different types of notifications</li>
              <li>• Check the bell icon in the header to see the notification dropdown</li>
              <li>• Navigate to <Link href="/notifications" className="text-purple-400">/notifications</Link> to see the full notification center</li>
              <li>• Toast notifications appear in the bottom-right corner</li>
              <li>• Use the useNotifications() hook in your components to trigger notifications</li>
            </ul>
            
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white text-sm font-medium mb-2">Code Example:</h4>
              <pre className="text-xs text-gray-300 overflow-x-auto">
{`import { useNotify } from '@/lib/notifications';

function MyComponent() {
  const notify = useNotify();
  
  const handleAction = () => {
    notify.notifyAllyAction(
      'Task completed',
      'Ally finished processing your request.',
      [{ label: 'View', variant: 'primary' }]
    );
  };
  
  return <button onClick={handleAction}>Do Something</button>;
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
