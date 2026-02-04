'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/lib/notifications/context';
import type { ToastNotification } from '@/lib/notifications/types';
import { CheckIcon, XIcon, BellIcon, ZapIcon } from '@/components/ui/icons';

// Toast icon by type
function ToastIcon({ type }: { type: ToastNotification['type'] }) {
  switch (type) {
    case 'success':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckIcon className="w-5 h-5 text-green-400" />
        </div>
      );
    case 'error':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
          <XIcon className="w-5 h-5 text-red-400" />
        </div>
      );
    case 'warning':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <ZapIcon className="w-5 h-5 text-yellow-400" />
        </div>
      );
    case 'info':
    default:
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <BellIcon className="w-5 h-5 text-blue-400" />
        </div>
      );
  }
}

// Individual toast component
function Toast({ 
  toast, 
  onDismiss 
}: { 
  toast: ToastNotification; 
  onDismiss: () => void;
}) {
  const borderColors = {
    success: 'border-green-500/30',
    error: 'border-red-500/30',
    warning: 'border-yellow-500/30',
    info: 'border-blue-500/30',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`
        relative flex items-start gap-3 p-4 w-96 max-w-[calc(100vw-2rem)]
        bg-gray-900/95 backdrop-blur-xl border ${borderColors[toast.type]}
        rounded-xl shadow-2xl
      `}
    >
      <ToastIcon type={toast.type} />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-sm text-gray-400 mt-0.5">
            {toast.message}
          </p>
        )}
        {toast.action && (
          <button
            onClick={() => {
              if (toast.action?.onClick) toast.action.onClick();
              onDismiss();
            }}
            className="text-sm text-purple-400 hover:text-purple-300 mt-2 transition-colors"
          >
            {toast.action.label} →
          </button>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1 text-gray-500 hover:text-white transition-colors rounded"
        aria-label="Dismiss notification"
      >
        <XIcon className="w-4 h-4" />
      </button>
      
      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500/30 rounded-b-xl origin-left"
        />
      )}
    </motion.div>
  );
}

// Toast container
export function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  return (
    <div 
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default ToastContainer;
