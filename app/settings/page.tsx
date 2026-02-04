'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Input, Select } from '@/components/ui/Input';
import { Avatar, AvatarUpload } from '@/components/ui/Avatar';
import { SettingsNav } from '@/components/ui/Tabs';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import {
  UserIcon,
  LinkIcon,
  BellIcon,
  BrainIcon,
  ShieldIcon,
  CreditCardIcon,
  KeyIcon,
  MailIcon,
  CalendarIcon,
  DatabaseIcon,
  TrashIcon,
  DownloadIcon,
  RefreshIcon,
  CheckIcon,
  XIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ClockIcon,
} from '@/components/ui/icons';

// Types
interface ConnectedAccount {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  email?: string;
  lastSync?: string;
  scopes?: string[];
}

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
}

interface MemoryItem {
  id: string;
  type: 'preference' | 'fact' | 'conversation' | 'task';
  content: string;
  createdAt: string;
}

// Settings sections
const settingsSections = [
  { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
  { id: 'connections', label: 'Connected Accounts', icon: <LinkIcon className="w-5 h-5" /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
  { id: 'memory', label: 'Memory', icon: <BrainIcon className="w-5 h-5" /> },
  { id: 'privacy', label: 'Privacy & Security', icon: <ShieldIcon className="w-5 h-5" /> },
  { id: 'billing', label: 'Billing', icon: <CreditCardIcon className="w-5 h-5" />, badge: 'Pro' },
  { id: 'api', label: 'API Keys', icon: <KeyIcon className="w-5 h-5" /> },
];

// Mock data
const mockAccounts: ConnectedAccount[] = [
  { id: 'gmail', name: 'Gmail', icon: '📧', connected: true, email: 'user@gmail.com', lastSync: '2 min ago', scopes: ['Read', 'Send', 'Labels'] },
  { id: 'calendar', name: 'Google Calendar', icon: '📅', connected: true, email: 'user@gmail.com', lastSync: '5 min ago', scopes: ['Read', 'Write'] },
  { id: 'slack', name: 'Slack', icon: '💬', connected: false },
  { id: 'github', name: 'GitHub', icon: '🐙', connected: false },
  { id: 'notion', name: 'Notion', icon: '📝', connected: false },
  { id: 'drive', name: 'Google Drive', icon: '📁', connected: true, email: 'user@gmail.com', lastSync: '1 hour ago', scopes: ['Read'] },
];

const mockInvoices: Invoice[] = [
  { id: 'INV-001', date: '2024-02-01', amount: '$29.00', status: 'paid' },
  { id: 'INV-002', date: '2024-01-01', amount: '$29.00', status: 'paid' },
  { id: 'INV-003', date: '2023-12-01', amount: '$29.00', status: 'paid' },
];

const mockApiKeys: APIKey[] = [
  { id: '1', name: 'Production Key', key: 'claw_prod_xxxxxxxxxxxxxxxxxxxx', createdAt: '2024-01-15', lastUsed: '2 hours ago' },
  { id: '2', name: 'Development Key', key: 'claw_dev_xxxxxxxxxxxxxxxxxxxx', createdAt: '2024-01-20', lastUsed: '1 day ago' },
];

const mockMemoryItems: MemoryItem[] = [
  { id: '1', type: 'preference', content: 'Prefers concise responses', createdAt: '2024-01-15' },
  { id: '2', type: 'fact', content: 'Works at Acme Corp as a Software Engineer', createdAt: '2024-01-10' },
  { id: '3', type: 'preference', content: 'Morning person, most productive 9am-12pm', createdAt: '2024-01-08' },
  { id: '4', type: 'task', content: 'Follow up on project proposal next Monday', createdAt: '2024-02-01' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearMemoryModal, setShowClearMemoryModal] = useState(false);
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null as string | null,
    timezone: 'America/New_York',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    emailImportant: true,
    pushEnabled: true,
    pushMentions: true,
    pushReminders: true,
    weeklyReport: false,
  });

  // Memory settings
  const [memorySettings, setMemorySettings] = useState({
    learnPreferences: true,
    rememberFacts: true,
    trackTasks: true,
    conversationHistory: true,
    retentionDays: '90',
  });

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection profile={profile} setProfile={setProfile} />;
      case 'connections':
        return <ConnectionsSection accounts={mockAccounts} />;
      case 'notifications':
        return <NotificationsSection notifications={notifications} setNotifications={setNotifications} />;
      case 'memory':
        return (
          <MemorySection 
            settings={memorySettings} 
            setSettings={setMemorySettings}
            memoryItems={mockMemoryItems}
            onClearMemory={() => setShowClearMemoryModal(true)}
          />
        );
      case 'privacy':
        return <PrivacySection onDeleteAccount={() => setShowDeleteModal(true)} />;
      case 'billing':
        return <BillingSection invoices={mockInvoices} />;
      case 'api':
        return (
          <APIKeysSection 
            apiKeys={mockApiKeys}
            visibleKeys={visibleKeys}
            copiedKey={copiedKey}
            toggleKeyVisibility={toggleKeyVisibility}
            copyToClipboard={copyToClipboard}
            onCreateKey={() => setShowCreateKeyModal(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in-down">
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-400 ml-12">Manage your account, preferences, and connected services</p>
        </header>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar navigation */}
          <aside className="lg:w-64 flex-shrink-0 animate-fade-in-left">
            <Card className="sticky top-8">
              <SettingsNav
                items={settingsSections}
                activeItem={activeSection}
                onSelect={setActiveSection}
              />
            </Card>
          </aside>

          {/* Content area */}
          <main className="flex-1 min-w-0 animate-fade-in-right">
            {renderSection()}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          // Handle delete account
          setShowDeleteModal(false);
        }}
        title="Delete Account"
        message="This action is permanent. All your data, memories, and connected accounts will be deleted. This cannot be undone."
        confirmText="Delete Account"
        variant="danger"
      />

      <ConfirmModal
        isOpen={showClearMemoryModal}
        onClose={() => setShowClearMemoryModal(false)}
        onConfirm={() => {
          // Handle clear memory
          setShowClearMemoryModal(false);
        }}
        title="Clear All Memory"
        message="This will permanently delete everything Ally has learned about you. Your preferences, facts, and conversation history will be erased."
        confirmText="Clear Memory"
        variant="warning"
      />

      <Modal
        isOpen={showCreateKeyModal}
        onClose={() => setShowCreateKeyModal(false)}
        title="Create API Key"
        description="Generate a new API key for accessing the Clawdbot API"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreateKeyModal(false)}>Cancel</Button>
            <Button onClick={() => setShowCreateKeyModal(false)}>Create Key</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Key Name"
            placeholder="e.g., Production, Development, Testing"
          />
          <Select
            label="Permissions"
            options={[
              { value: 'full', label: 'Full Access' },
              { value: 'read', label: 'Read Only' },
              { value: 'write', label: 'Write Only' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

// Profile Section Component
function ProfileSection({ profile, setProfile }: { 
  profile: { name: string; email: string; avatar: string | null; timezone: string };
  setProfile: React.Dispatch<React.SetStateAction<typeof profile>>;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-purple-400" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <AvatarUpload
            currentSrc={profile.avatar}
            name={profile.name}
            onUpload={(file) => {
              const url = URL.createObjectURL(file);
              setProfile(p => ({ ...p, avatar: url }));
            }}
            onRemove={() => setProfile(p => ({ ...p, avatar: null }))}
          />

          {/* Form fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
            />
          </div>

          <Select
            label="Timezone"
            value={profile.timezone}
            onChange={(e) => setProfile(p => ({ ...p, timezone: e.target.value }))}
            options={[
              { value: 'America/New_York', label: 'Eastern Time (ET)' },
              { value: 'America/Chicago', label: 'Central Time (CT)' },
              { value: 'America/Denver', label: 'Mountain Time (MT)' },
              { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
              { value: 'Europe/London', label: 'London (GMT)' },
              { value: 'Europe/Paris', label: 'Paris (CET)' },
              { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
              { value: 'Pacific/Auckland', label: 'Auckland (NZDT)' },
            ]}
          />

          <div className="flex justify-end pt-4 border-t border-gray-700/50">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Connections Section Component
function ConnectionsSection({ accounts }: { accounts: ConnectedAccount[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-blue-400" />
            Connected Accounts
          </CardTitle>
          <CardDescription>Manage your connected services and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{account.icon}</span>
                  <div>
                    <div className="font-medium text-white flex items-center gap-2">
                      {account.name}
                      {account.connected && (
                        <Badge variant="success" size="sm">Connected</Badge>
                      )}
                    </div>
                    {account.connected && account.email && (
                      <div className="text-sm text-gray-400">{account.email}</div>
                    )}
                    {account.connected && account.lastSync && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <RefreshIcon className="w-3 h-3" />
                        Synced {account.lastSync}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.connected ? (
                    <>
                      <Button variant="ghost" size="sm">
                        <RefreshIcon className="w-4 h-4" />
                        Sync
                      </Button>
                      <Button variant="outline" size="sm">Disconnect</Button>
                    </>
                  ) : (
                    <Button size="sm">
                      <PlusIcon className="w-4 h-4" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions detail for connected accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-green-400" />
            Permissions
          </CardTitle>
          <CardDescription>What Ally can access from your connected accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.filter(a => a.connected).map((account) => (
              <div key={account.id} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{account.icon}</span>
                  <span className="font-medium text-white">{account.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {account.scopes?.map((scope) => (
                    <Badge key={scope} variant="default" size="sm">{scope}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Notifications Section Component
function NotificationsSection({ notifications, setNotifications }: {
  notifications: {
    emailDigest: boolean;
    emailImportant: boolean;
    pushEnabled: boolean;
    pushMentions: boolean;
    pushReminders: boolean;
    weeklyReport: boolean;
  };
  setNotifications: React.Dispatch<React.SetStateAction<typeof notifications>>;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailIcon className="w-5 h-5 text-purple-400" />
            Email Notifications
          </CardTitle>
          <CardDescription>Configure what emails you receive from Ally</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Daily Digest</div>
              <div className="text-sm text-gray-400">Get a summary of your daily activity</div>
            </div>
            <Toggle
              enabled={notifications.emailDigest}
              onChange={(v) => setNotifications(n => ({ ...n, emailDigest: v }))}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Important Alerts</div>
              <div className="text-sm text-gray-400">Immediate emails for urgent items</div>
            </div>
            <Toggle
              enabled={notifications.emailImportant}
              onChange={(v) => setNotifications(n => ({ ...n, emailImportant: v }))}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-white">Weekly Report</div>
              <div className="text-sm text-gray-400">Weekly productivity insights and summary</div>
            </div>
            <Toggle
              enabled={notifications.weeklyReport}
              onChange={(v) => setNotifications(n => ({ ...n, weeklyReport: v }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="w-5 h-5 text-blue-400" />
            Push Notifications
          </CardTitle>
          <CardDescription>Control push notifications on your devices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Enable Push Notifications</div>
              <div className="text-sm text-gray-400">Receive real-time notifications</div>
            </div>
            <Toggle
              enabled={notifications.pushEnabled}
              onChange={(v) => setNotifications(n => ({ ...n, pushEnabled: v }))}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Mentions & Replies</div>
              <div className="text-sm text-gray-400">When someone mentions you or replies</div>
            </div>
            <Toggle
              enabled={notifications.pushMentions}
              onChange={(v) => setNotifications(n => ({ ...n, pushMentions: v }))}
              disabled={!notifications.pushEnabled}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium text-white">Reminders</div>
              <div className="text-sm text-gray-400">Task and event reminders</div>
            </div>
            <Toggle
              enabled={notifications.pushReminders}
              onChange={(v) => setNotifications(n => ({ ...n, pushReminders: v }))}
              disabled={!notifications.pushEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Memory Section Component
function MemorySection({ settings, setSettings, memoryItems, onClearMemory }: {
  settings: {
    learnPreferences: boolean;
    rememberFacts: boolean;
    trackTasks: boolean;
    conversationHistory: boolean;
    retentionDays: string;
  };
  setSettings: React.Dispatch<React.SetStateAction<typeof settings>>;
  memoryItems: MemoryItem[];
  onClearMemory: () => void;
}) {
  const typeIcons = {
    preference: <SparklesIcon className="w-4 h-4 text-purple-400" />,
    fact: <DatabaseIcon className="w-4 h-4 text-blue-400" />,
    conversation: <MailIcon className="w-4 h-4 text-green-400" />,
    task: <ClockIcon className="w-4 h-4 text-yellow-400" />,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainIcon className="w-5 h-5 text-purple-400" />
            Memory Settings
          </CardTitle>
          <CardDescription>Control what Ally remembers about you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Learn Preferences</div>
              <div className="text-sm text-gray-400">Remember your communication style and preferences</div>
            </div>
            <Toggle
              enabled={settings.learnPreferences}
              onChange={(v) => setSettings(s => ({ ...s, learnPreferences: v }))}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Remember Facts</div>
              <div className="text-sm text-gray-400">Store important facts about you and your work</div>
            </div>
            <Toggle
              enabled={settings.rememberFacts}
              onChange={(v) => setSettings(s => ({ ...s, rememberFacts: v }))}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Track Tasks</div>
              <div className="text-sm text-gray-400">Remember tasks and follow-ups</div>
            </div>
            <Toggle
              enabled={settings.trackTasks}
              onChange={(v) => setSettings(s => ({ ...s, trackTasks: v }))}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-700/50">
            <div>
              <div className="font-medium text-white">Conversation History</div>
              <div className="text-sm text-gray-400">Remember context from past conversations</div>
            </div>
            <Toggle
              enabled={settings.conversationHistory}
              onChange={(v) => setSettings(s => ({ ...s, conversationHistory: v }))}
            />
          </div>
          <div className="pt-4">
            <Select
              label="Memory Retention"
              value={settings.retentionDays}
              onChange={(e) => setSettings(s => ({ ...s, retentionDays: e.target.value }))}
              options={[
                { value: '30', label: '30 days' },
                { value: '90', label: '90 days' },
                { value: '180', label: '6 months' },
                { value: '365', label: '1 year' },
                { value: 'forever', label: 'Forever' },
              ]}
              hint="How long to keep memories before auto-clearing"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="w-5 h-5 text-blue-400" />
            What Ally Knows
          </CardTitle>
          <CardDescription>Review and manage stored memories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {memoryItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 group hover:border-purple-500/30 transition-all"
              >
                <div className="mt-0.5">{typeIcons[item.type]}</div>
                <div className="flex-1">
                  <p className="text-white text-sm">{item.content}</p>
                  <p className="text-xs text-gray-500 mt-1">Added {item.createdAt}</p>
                </div>
                <button className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-700/50">
            <Button variant="outline" className="flex-1">
              <DownloadIcon className="w-4 h-4" />
              Export Memory
            </Button>
            <Button variant="danger" onClick={onClearMemory}>
              <TrashIcon className="w-4 h-4" />
              Clear All Memory
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Privacy Section Component
function PrivacySection({ onDeleteAccount }: { onDeleteAccount: () => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-green-400" />
            Privacy Controls
          </CardTitle>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Export Your Data</div>
                <div className="text-sm text-gray-400">Download a copy of all your data</div>
              </div>
              <Button variant="outline">
                <DownloadIcon className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Data Processing</div>
                <div className="text-sm text-gray-400">How we use your data</div>
              </div>
              <Button variant="ghost">
                <ExternalLinkIcon className="w-4 h-4" />
                Privacy Policy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="w-5 h-5 text-blue-400" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Two-Factor Authentication</div>
                <div className="text-sm text-gray-400">Add an extra layer of security</div>
              </div>
              <Badge variant="warning" size="sm">Not Enabled</Badge>
            </div>
            <Button variant="outline" size="sm" className="mt-3">Enable 2FA</Button>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Active Sessions</div>
                <div className="text-sm text-gray-400">Manage your logged-in devices</div>
              </div>
              <Badge variant="info" size="sm">2 devices</Badge>
            </div>
            <Button variant="ghost" size="sm" className="mt-3">View Sessions</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <TrashIcon className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">Delete Account</div>
                <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
              </div>
              <Button variant="danger" onClick={onDeleteAccount}>
                <TrashIcon className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Billing Section Component
function BillingSection({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-6">
            <div>
              <Badge variant="info" size="lg" className="mb-2">Pro Plan</Badge>
              <h3 className="text-2xl font-bold text-white mb-1">$29/month</h3>
              <p className="text-gray-400 text-sm">Billed monthly • Next billing: Feb 15, 2024</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Change Plan</Button>
              <Button>
                <SparklesIcon className="w-4 h-4" />
                Upgrade to Team
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="w-5 h-5 text-purple-400" />
            Payment Method
          </CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              <div>
                <div className="font-medium text-white">•••• •••• •••• 4242</div>
                <div className="text-sm text-gray-400">Expires 12/25</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DownloadIcon className="w-5 h-5 text-blue-400" />
            Billing History
          </CardTitle>
          <CardDescription>View and download your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-white">{invoice.id}</div>
                    <div className="text-sm text-gray-400">{invoice.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">{invoice.amount}</span>
                  <Badge
                    variant={invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'error'}
                    size="sm"
                  >
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <DownloadIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// API Keys Section Component
function APIKeysSection({ apiKeys, visibleKeys, copiedKey, toggleKeyVisibility, copyToClipboard, onCreateKey }: {
  apiKeys: APIKey[];
  visibleKeys: Set<string>;
  copiedKey: string | null;
  toggleKeyVisibility: (id: string) => void;
  copyToClipboard: (text: string, id: string) => void;
  onCreateKey: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-purple-400" />
                API Keys
              </CardTitle>
              <CardDescription>Manage API keys for programmatic access</CardDescription>
            </div>
            <Button onClick={onCreateKey}>
              <PlusIcon className="w-4 h-4" />
              Create Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-white">{apiKey.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Created {apiKey.createdAt} • Last used {apiKey.lastUsed}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-900/50 rounded-lg text-sm font-mono text-gray-300 truncate">
                    {visibleKeys.has(apiKey.id) 
                      ? apiKey.key.replace('xxxxxxxxxxxxxxxxxxxx', 'abc123xyz789demo456')
                      : apiKey.key
                    }
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  >
                    {copiedKey === apiKey.id ? (
                      <CheckIcon className="w-4 h-4 text-green-400" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <h4 className="font-medium text-white mb-2">API Documentation</h4>
            <p className="text-sm text-gray-400 mb-3">
              Learn how to integrate Clawdbot into your applications with our comprehensive API documentation.
            </p>
            <Button variant="outline" size="sm">
              <ExternalLinkIcon className="w-4 h-4" />
              View Docs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="w-5 h-5 text-blue-400" />
            API Usage
          </CardTitle>
          <CardDescription>Your API usage this billing period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-white">12,450</div>
              <div className="text-sm text-gray-400">API Requests</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-white">50,000</div>
              <div className="text-sm text-gray-400">Monthly Limit</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 text-center">
              <div className="text-2xl font-bold text-purple-400">24.9%</div>
              <div className="text-sm text-gray-400">Used</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
