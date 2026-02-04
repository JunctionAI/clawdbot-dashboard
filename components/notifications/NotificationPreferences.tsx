'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Input, Select } from '@/components/ui/Input';
import { useNotifications } from '@/lib/notifications/context';
import {
  BellIcon,
  MailIcon,
  ZapIcon,
  ShieldIcon,
  ClockIcon,
  CheckIcon,
} from '@/components/ui/icons';

export function NotificationPreferences() {
  const {
    preferences,
    updatePreferences,
    requestPushPermission,
    subscribeToPush,
    unsubscribeFromPush,
    pushPermissionStatus,
    showToast,
  } = useNotifications();

  const [isLoading, setIsLoading] = useState(false);

  // Handle push notification setup
  const handleEnablePush = async () => {
    setIsLoading(true);
    try {
      if (pushPermissionStatus !== 'granted') {
        const granted = await requestPushPermission();
        if (!granted) {
          showToast({
            type: 'error',
            title: 'Permission Denied',
            message: 'Please enable notifications in your browser settings.',
          });
          setIsLoading(false);
          return;
        }
      }

      const success = await subscribeToPush();
      if (success) {
        updatePreferences({
          push: { ...preferences.push, enabled: true, subscribed: true },
        });
        showToast({
          type: 'success',
          title: 'Push Notifications Enabled',
          message: "You'll now receive notifications when Ally does something for you.",
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Setup Failed',
        message: 'Failed to enable push notifications. Please try again.',
      });
    }
    setIsLoading(false);
  };

  const handleDisablePush = async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromPush();
      updatePreferences({
        push: { ...preferences.push, enabled: false, subscribed: false },
      });
      showToast({
        type: 'info',
        title: 'Push Notifications Disabled',
        message: "You won't receive push notifications anymore.",
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to disable push notifications.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-purple-400" />
            Notification Settings
          </CardTitle>
          <CardDescription>Control how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Enable Notifications</div>
              <div className="text-sm text-gray-400">Receive notifications from Ally and the system</div>
            </div>
            <Toggle
              enabled={preferences.enabled}
              onChange={(v) => updatePreferences({ enabled: v })}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white flex items-center gap-2">
                Do Not Disturb
                {preferences.doNotDisturb && (
                  <Badge variant="warning" size="sm">Active</Badge>
                )}
              </div>
              <div className="text-sm text-gray-400">Silence all non-urgent notifications</div>
            </div>
            <Toggle
              enabled={preferences.doNotDisturb}
              onChange={(v) => updatePreferences({ doNotDisturb: v })}
            />
          </div>

          {preferences.doNotDisturb && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-3">
                <ClockIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Schedule (optional)</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={preferences.doNotDisturbStart || '22:00'}
                  onChange={(e) => updatePreferences({ doNotDisturbStart: e.target.value })}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={preferences.doNotDisturbEnd || '08:00'}
                  onChange={(e) => updatePreferences({ doNotDisturbEnd: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ZapIcon className="w-5 h-5 text-blue-400" />
            In-App Notifications
          </CardTitle>
          <CardDescription>Notifications shown while using the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Show Badge Count</div>
              <div className="text-sm text-gray-400">Display unread count on the bell icon</div>
            </div>
            <Toggle
              enabled={preferences.inApp.showBadge}
              onChange={(v) => updatePreferences({
                inApp: { ...preferences.inApp, showBadge: v },
              })}
              disabled={!preferences.enabled}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Sound</div>
              <div className="text-sm text-gray-400">Play a sound for new notifications</div>
            </div>
            <Toggle
              enabled={preferences.inApp.playSound}
              onChange={(v) => updatePreferences({
                inApp: { ...preferences.inApp, playSound: v },
              })}
              disabled={!preferences.enabled}
            />
          </div>

          {preferences.inApp.playSound && (
            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sound Volume
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.inApp.soundVolume}
                onChange={(e) => updatePreferences({
                  inApp: { ...preferences.inApp, soundVolume: parseInt(e.target.value) },
                })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Quiet</span>
                <span>{preferences.inApp.soundVolume}%</span>
                <span>Loud</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-green-400" />
            Push Notifications
            {preferences.push.subscribed && (
              <Badge variant="success" size="sm">Enabled</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Get notified even when you're not on the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!preferences.push.subscribed ? (
            <div className="p-6 text-center bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <BellIcon className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="font-medium text-white mb-2">Enable Push Notifications</h4>
              <p className="text-sm text-gray-400 mb-4 max-w-sm mx-auto">
                Never miss when Ally completes a task or needs your attention. 
                Get notified instantly on your device.
              </p>
              <Button onClick={handleEnablePush} disabled={isLoading}>
                {isLoading ? 'Setting up...' : 'Enable Push Notifications'}
              </Button>
              {pushPermissionStatus === 'denied' && (
                <p className="text-xs text-red-400 mt-2">
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckIcon className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-300">Push notifications are enabled</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white">Notify me about:</h4>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-300">Ally actions</span>
                  <Toggle
                    enabled={preferences.push.allyActions}
                    onChange={(v) => updatePreferences({
                      push: { ...preferences.push, allyActions: v },
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-300">Task completions</span>
                  <Toggle
                    enabled={preferences.push.taskCompletions}
                    onChange={(v) => updatePreferences({
                      push: { ...preferences.push, taskCompletions: v },
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-300">Reminders</span>
                  <Toggle
                    enabled={preferences.push.reminders}
                    onChange={(v) => updatePreferences({
                      push: { ...preferences.push, reminders: v },
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-300">Mentions</span>
                  <Toggle
                    enabled={preferences.push.mentions}
                    onChange={(v) => updatePreferences({
                      push: { ...preferences.push, mentions: v },
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-300">Security alerts</span>
                  <Toggle
                    enabled={preferences.push.security}
                    onChange={(v) => updatePreferences({
                      push: { ...preferences.push, security: v },
                    })}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-300">Billing updates</span>
                  <Toggle
                    enabled={preferences.push.billing}
                    onChange={(v) => updatePreferences({
                      push: { ...preferences.push, billing: v },
                    })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDisablePush}
                  disabled={isLoading}
                >
                  Disable Push Notifications
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="w-5 h-5 text-purple-400" />
            Email Notifications
          </CardTitle>
          <CardDescription>Receive notifications via email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Enable Email Notifications</div>
              <div className="text-sm text-gray-400">Receive notifications to your email</div>
            </div>
            <Toggle
              enabled={preferences.email.enabled}
              onChange={(v) => updatePreferences({
                email: { ...preferences.email, enabled: v },
              })}
              disabled={!preferences.enabled}
            />
          </div>

          {preferences.email.enabled && (
            <>
              <Input
                label="Email Address"
                type="email"
                value={preferences.email.address}
                onChange={(e) => updatePreferences({
                  email: { ...preferences.email, address: e.target.value },
                })}
                placeholder="your@email.com"
              />

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <div className="font-medium text-white">Daily Digest</div>
                  <div className="text-sm text-gray-400">Get a summary of daily activity</div>
                </div>
                <Toggle
                  enabled={preferences.email.dailyDigest}
                  onChange={(v) => updatePreferences({
                    email: { ...preferences.email, dailyDigest: v },
                  })}
                />
              </div>

              {preferences.email.dailyDigest && (
                <div className="pl-4">
                  <Input
                    label="Delivery Time"
                    type="time"
                    value={preferences.email.digestTime}
                    onChange={(e) => updatePreferences({
                      email: { ...preferences.email, digestTime: e.target.value },
                    })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <div className="font-medium text-white">Weekly Report</div>
                  <div className="text-sm text-gray-400">Get a weekly productivity summary</div>
                </div>
                <Toggle
                  enabled={preferences.email.weeklyReport}
                  onChange={(v) => updatePreferences({
                    email: { ...preferences.email, weeklyReport: v },
                  })}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
                <div>
                  <div className="font-medium text-white">Important Only</div>
                  <div className="text-sm text-gray-400">Only receive high-priority notifications</div>
                </div>
                <Toggle
                  enabled={preferences.email.importantOnly}
                  onChange={(v) => updatePreferences({
                    email: { ...preferences.email, importantOnly: v },
                  })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-white">Marketing & Updates</div>
                  <div className="text-sm text-gray-400">Receive news and feature announcements</div>
                </div>
                <Toggle
                  enabled={preferences.email.marketing}
                  onChange={(v) => updatePreferences({
                    email: { ...preferences.email, marketing: v },
                  })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationPreferences;
