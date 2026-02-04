'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingScreen } from '@/components/ui/LoadingSpinner';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { StatsSkeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { IntegrationItem, IntegrationsEmptyState } from '@/components/dashboard';
import { ActivityItem, ActivityEmptyState, ActivitySkeleton } from '@/components/dashboard';
import { 
  MessageSquareIcon, 
  UsersIcon, 
  TrendingUpIcon, 
  ZapIcon,
  SettingsIcon,
  LinkIcon,
  BookOpenIcon,
  LifeBuoyIcon,
  CreditCardIcon,
  BrainIcon,
  GiftIcon
} from '@/components/ui/icons';
import { NotificationBell } from '@/components/notifications/NotificationBell';

interface CustomerData {
  email: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due';
  workspaceId: string;
  messagesUsed: number;
  messagesLimit: number;
  agentsUsed: number;
  agentsLimit: number;
  integrations: Integration[];
  recentActivity: Activity[];
}

interface Integration {
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function Dashboard() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { addToast } = useToast();

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulated API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/customer');
      // if (!response.ok) throw new Error('Failed to load dashboard');
      // const data = await response.json();
      
      setCustomer({
        email: 'user@example.com',
        plan: 'Pro',
        status: 'active',
        workspaceId: 'claw_demo_workspace',
        messagesUsed: 3420,
        messagesLimit: 20000,
        agentsUsed: 4,
        agentsLimit: 10,
        integrations: [
          { name: 'Gmail', icon: '📧', connected: true, lastSync: '2 minutes ago' },
          { name: 'Calendar', icon: '📅', connected: true, lastSync: '5 minutes ago' },
          { name: 'Slack', icon: '💬', connected: false },
          { name: 'GitHub', icon: '🐙', connected: false },
        ],
        recentActivity: [
          { id: '1', type: 'message', description: 'Processed 23 emails', timestamp: '5 min ago' },
          { id: '2', type: 'agent', description: 'Agent scheduled meeting', timestamp: '1 hour ago' },
          { id: '3', type: 'integration', description: 'Gmail sync completed', timestamp: '2 hours ago' },
        ]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      addToast({
        type: 'error',
        title: 'Failed to load',
        message: 'Could not load dashboard data. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleConnectIntegration = async (name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In real implementation: call API and update state
    console.log(`Connecting ${name}...`);
  };

  const handleDisconnectIntegration = async (name: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real implementation: call API and update state
    console.log(`Disconnecting ${name}...`);
  };

  // Full page loading state
  if (loading && !customer) {
    return <LoadingScreen />;
  }

  // Full page error state
  if (error && !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorState 
            title="Dashboard Unavailable"
            message={error}
            onRetry={handleRetry}
          />
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              If this problem persists, please{' '}
              <a href="mailto:support@clawdbot.ai" className="text-purple-400 hover:text-purple-300">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) return null;

  const statusColors = {
    active: 'success' as const,
    cancelled: 'error' as const,
    past_due: 'warning' as const,
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-gradient bg-300%">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
      
      <div className="relative max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 safe-area-inset">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 animate-fade-in-down">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 flex flex-wrap items-center gap-2 text-sm sm:text-base">
              <span className="truncate max-w-[200px] sm:max-w-none">{customer.email}</span>
              <Badge variant={statusColors[customer.status]} size="sm" pulse={customer.status === 'active'}>
                {customer.status.toUpperCase()}
              </Badge>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <NotificationBell />
            <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
              <SettingsIcon className="w-5 h-5" />
              <span className="hidden xs:inline">Settings</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <CreditCardIcon className="w-5 h-5" />
              <span className="hidden xs:inline">Billing</span>
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            icon={<MessageSquareIcon className="w-8 h-8" />}
            label="Messages Used"
            value={`${((customer.messagesUsed / customer.messagesLimit) * 100).toFixed(0)}%`}
            change={{ value: 12, trend: 'up' }}
            description="This billing period"
            className="animate-fade-in-up"
            style={{ animationDelay: '0.1s' } as React.CSSProperties}
          />
          <StatCard
            icon={<UsersIcon className="w-8 h-8" />}
            label="Active Agents"
            value={customer.agentsUsed}
            description={`${customer.agentsLimit - customer.agentsUsed} slots available`}
            className="animate-fade-in-up"
            style={{ animationDelay: '0.2s' } as React.CSSProperties}
          />
          <StatCard
            icon={<TrendingUpIcon className="w-8 h-8" />}
            label="Plan"
            value={customer.plan}
            change={{ value: 35, trend: 'up' }}
            description="Productivity boost"
            className="animate-fade-in-up"
            style={{ animationDelay: '0.3s' } as React.CSSProperties}
          />
          <StatCard
            icon={<ZapIcon className="w-8 h-8" />}
            label="Integrations"
            value={customer.integrations.filter(i => i.connected).length}
            description="Connected services"
            className="animate-fade-in-up"
            style={{ animationDelay: '0.4s' } as React.CSSProperties}
          />
        </div>

        {/* Usage Details */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.5s' } as React.CSSProperties}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareIcon className="w-5 h-5 text-purple-400" />
                Message Usage
              </CardTitle>
              <CardDescription>
                Your message quota for the current billing period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBar 
                value={customer.messagesUsed} 
                max={customer.messagesLimit}
                color="purple"
                animated
              />
              <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">Pro tip:</span> Messages reset on your billing date. 
                  Upgrade for higher limits anytime.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' } as React.CSSProperties}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainIcon className="w-5 h-5 text-green-400" />
                Agent Capacity
              </CardTitle>
              <CardDescription>
                Active autonomous agents in your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressBar 
                value={customer.agentsUsed} 
                max={customer.agentsLimit}
                color="green"
                animated
              />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {customer.agentsLimit === 0 ? (
                  <EmptyState
                    title="No agent slots"
                    description="Upgrade your plan to add AI agents"
                    action={{
                      label: 'Upgrade',
                      onClick: () => window.location.href = '/checkout',
                    }}
                  />
                ) : (
                  [...Array(customer.agentsLimit)].map((_, i) => (
                    <div 
                      key={i}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        i < customer.agentsUsed 
                          ? 'bg-green-500/10 border-green-500/30 shadow-glow' 
                          : 'bg-gray-800/50 border-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          i < customer.agentsUsed ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          i < customer.agentsUsed ? 'text-white' : 'text-gray-500'
                        }`}>
                          Agent {i + 1}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workspace Access */}
        <Card className="mb-8 animate-fade-in-up bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30" style={{ animationDelay: '0.7s' } as React.CSSProperties}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ZapIcon className="w-5 h-5 text-purple-400" />
              Your Workspace
            </CardTitle>
            <CardDescription>
              Access your fully configured AI workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 bg-gray-900/50 p-4 rounded-lg backdrop-blur-sm border border-gray-700/50">
                <div className="text-sm text-gray-400 mb-1">Workspace ID</div>
                <div className="text-white font-mono text-sm sm:text-base break-all">{customer.workspaceId}</div>
              </div>
              <a href={`/workspace/${customer.workspaceId}`}>
                <Button size="lg" className="whitespace-nowrap w-full sm:w-auto">
                  <ZapIcon className="w-5 h-5" />
                  Open Workspace →
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Integrations & Activity Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Integrations */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.8s' } as React.CSSProperties}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-blue-400" />
                Integrations
              </CardTitle>
              <CardDescription>
                Connect your tools and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customer.integrations.length > 0 ? (
                <div className="space-y-3">
                  {customer.integrations.map((integration, i) => (
                    <IntegrationItem
                      key={integration.name}
                      integration={integration}
                      animationDelay={0.9 + i * 0.1}
                      onConnect={handleConnectIntegration}
                      onDisconnect={handleDisconnectIntegration}
                    />
                  ))}
                </div>
              ) : (
                <IntegrationsEmptyState />
              )}
              <Button variant="ghost" className="w-full mt-4">
                <LinkIcon className="w-4 h-4" />
                Browse All Integrations
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.9s' } as React.CSSProperties}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5 text-green-400" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates from your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customer.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {customer.recentActivity.map((activity, i) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      animationDelay={1.0 + i * 0.1}
                    />
                  ))}
                </div>
              ) : (
                <ActivityEmptyState />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          <Card hover className="animate-fade-in-up" style={{ animationDelay: '1.1s' } as React.CSSProperties}>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 mb-3 text-purple-400">
                <LinkIcon className="w-12 h-12" />
              </div>
              <CardTitle className="mb-2 text-base">Integrations</CardTitle>
              <CardDescription className="mb-4 text-sm">Connect your tools</CardDescription>
              <Button variant="ghost" size="sm" className="text-purple-400">
                Manage →
              </Button>
            </div>
          </Card>

          <a href="/dashboard/referrals" className="block">
            <Card hover className="animate-fade-in-up h-full bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20" style={{ animationDelay: '1.15s' } as React.CSSProperties}>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 mb-3 text-green-400">
                  <GiftIcon className="w-12 h-12" />
                </div>
                <CardTitle className="mb-2 text-base">Refer & Earn</CardTitle>
                <CardDescription className="mb-4 text-sm">Get $20 per friend</CardDescription>
                <Button variant="ghost" size="sm" className="text-green-400">
                  Start Earning →
                </Button>
              </div>
            </Card>
          </a>

          <Card hover className="animate-fade-in-up" style={{ animationDelay: '1.2s' } as React.CSSProperties}>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 mb-3 text-blue-400">
                <BookOpenIcon className="w-12 h-12" />
              </div>
              <CardTitle className="mb-2 text-base">Documentation</CardTitle>
              <CardDescription className="mb-4 text-sm">Learn how to use Clawdbot</CardDescription>
              <Button variant="ghost" size="sm" className="text-blue-400">
                Read Docs →
              </Button>
            </div>
          </Card>

          <Card hover className="animate-fade-in-up" style={{ animationDelay: '1.3s' } as React.CSSProperties}>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 mb-3 text-yellow-400">
                <LifeBuoyIcon className="w-12 h-12" />
              </div>
              <CardTitle className="mb-2 text-base">Support</CardTitle>
              <CardDescription className="mb-4 text-sm">Need help?</CardDescription>
              <Button variant="ghost" size="sm" className="text-yellow-400">
                Contact Us →
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
