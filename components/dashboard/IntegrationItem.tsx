'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface Integration {
  name: string;
  icon: string;
  connected: boolean;
  lastSync?: string;
}

interface IntegrationItemProps {
  integration: Integration;
  animationDelay?: number;
  onConnect?: (name: string) => Promise<void>;
  onDisconnect?: (name: string) => Promise<void>;
}

export function IntegrationItem({ 
  integration, 
  animationDelay = 0,
  onConnect,
  onDisconnect,
}: IntegrationItemProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localConnected, setLocalConnected] = useState(integration.connected);
  const { addToast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (onConnect) {
        await onConnect(integration.name);
      } else {
        // Simulated connection for demo
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      setLocalConnected(true);
      addToast({
        type: 'success',
        title: 'Connected!',
        message: `${integration.name} has been connected successfully.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: `Could not connect to ${integration.name}. Please try again.`,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    setError(null);
    
    try {
      if (onDisconnect) {
        await onDisconnect(integration.name);
      } else {
        // Simulated disconnection for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setLocalConnected(false);
      addToast({
        type: 'info',
        title: 'Disconnected',
        message: `${integration.name} has been disconnected.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
      addToast({
        type: 'error',
        title: 'Disconnect Failed',
        message: `Could not disconnect ${integration.name}. Please try again.`,
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
      className="group"
    >
      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{integration.icon}</span>
          <div>
            <div className="font-medium text-white flex items-center gap-2">
              {integration.name}
              {localConnected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
              )}
            </div>
            {localConnected && integration.lastSync && (
              <div className="text-xs text-gray-400">Last sync: {integration.lastSync}</div>
            )}
            {!localConnected && (
              <div className="text-xs text-gray-500">Not connected</div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-red-400">{error}</span>
          )}
          
          {localConnected ? (
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">Connected</Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleDisconnect}
                loading={isDisconnecting}
                disabled={isDisconnecting}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
              >
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleConnect}
              loading={isConnecting}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Empty state for when no integrations are available
 */
export function IntegrationsEmptyState() {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-3">🔌</div>
      <h3 className="text-lg font-semibold text-white mb-2">No Integrations</h3>
      <p className="text-gray-400 text-sm mb-4">
        Connect your tools and services to supercharge your AI assistant
      </p>
      <Button variant="outline" size="sm">
        Browse Integrations
      </Button>
    </div>
  );
}
