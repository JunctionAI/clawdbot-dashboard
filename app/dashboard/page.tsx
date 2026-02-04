'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Get customer data from API
    // For now, mock data
    setTimeout(() => {
      setCustomer({
        email: 'user@example.com',
        plan: 'Pro',
        status: 'active',
        workspaceId: 'claw_demo_workspace',
        messagesUsed: 3420,
        messagesLimit: 20000,
        agentsUsed: 4,
        agentsLimit: 10
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">{customer.email}</p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white">Settings</a>
            <a href="#" className="text-gray-400 hover:text-white">Logout</a>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Subscription Status</h2>
              <div className="flex items-center gap-4">
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                  {customer.status.toUpperCase()}
                </span>
                <span className="text-gray-300">{customer.plan} Plan</span>
              </div>
            </div>
            <a 
              href="#" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Manage Billing
            </a>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Message Usage</h3>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">This month</span>
                <span className="text-white">{customer.messagesUsed.toLocaleString()} / {customer.messagesLimit.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(customer.messagesUsed / customer.messagesLimit) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {Math.round((customer.messagesUsed / customer.messagesLimit) * 100)}% used
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Active Agents</h3>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Agents running</span>
                <span className="text-white">{customer.agentsUsed} / {customer.agentsLimit}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(customer.agentsUsed / customer.agentsLimit) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {customer.agentsLimit - customer.agentsUsed} slots available
            </p>
          </div>
        </div>

        {/* Workspace Access */}
        <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Your Workspace</h3>
          <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-500 mb-1">Workspace ID</div>
            <div className="text-white font-mono">{customer.workspaceId}</div>
          </div>
          <a 
            href={`https://app.setupclaw.com/${customer.workspaceId}`}
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Open Workspace →
          </a>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Integrations</h3>
            <p className="text-gray-400 text-sm mb-4">Connect your tools</p>
            <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              Manage →
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Documentation</h3>
            <p className="text-gray-400 text-sm mb-4">Learn how to use Clawdbot</p>
            <a href="https://docs.setupclaw.com" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              Read Docs →
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
            <p className="text-gray-400 text-sm mb-4">Need help?</p>
            <a href="mailto:support@setupclaw.com" className="text-purple-400 hover:text-purple-300 text-sm font-semibold">
              Contact Us →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
