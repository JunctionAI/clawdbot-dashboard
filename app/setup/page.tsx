'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// ============================================================================
// ALLY BOT SETUP - Managed onboarding (we provide the bot!)
// ============================================================================

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://clawdbot-saas-backend-production.up.railway.app';

type SetupStep = 'signin' | 'creating' | 'connect' | 'done';

interface WorkspaceData {
  workspaceId: string;
  linkCode: string;
  telegramLinked: boolean;
}

export default function SetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [step, setStep] = useState<SetupStep>('signin');
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [error, setError] = useState('');
  const [isPolling, setIsPolling] = useState(false);

  // Create workspace when user signs in
  const createWorkspace = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setStep('creating');
    setError('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/ally/create-workspace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          googleId: (session.user as any).id,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create workspace');
      }
      
      setWorkspace({
        workspaceId: data.workspaceId,
        linkCode: data.linkCode,
        telegramLinked: data.telegramLinked,
      });
      
      if (data.telegramLinked) {
        setStep('done');
      } else {
        setStep('connect');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
      setStep('signin');
    }
  }, [session]);

  // Auto-create workspace when authenticated
  useEffect(() => {
    if (status === 'authenticated' && step === 'signin' && !workspace) {
      createWorkspace();
    }
  }, [status, step, workspace, createWorkspace]);

  // Poll for Telegram link status
  useEffect(() => {
    if (step !== 'connect' || !workspace || isPolling) return;
    
    setIsPolling(true);
    
    const checkLinkStatus = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/ally/link-status?workspaceId=${workspace.workspaceId}`
        );
        const data = await response.json();
        
        if (data.linked) {
          setStep('done');
          return true;
        }
      } catch (err) {
        console.error('Link status check failed:', err);
      }
      return false;
    };
    
    // Check immediately
    checkLinkStatus();
    
    // Then poll every 3 seconds
    const interval = setInterval(async () => {
      const linked = await checkLinkStatus();
      if (linked) {
        clearInterval(interval);
        setIsPolling(false);
      }
    }, 3000);
    
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [step, workspace, isPolling]);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/setup' });
  };

  const telegramLink = workspace?.linkCode 
    ? `https://t.me/AllyBot?start=${workspace.linkCode}`
    : '#';

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/50 via-gray-950 to-fuchsia-950/30 pointer-events-none" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-fuchsia-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 mb-12"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Meet Ally</h1>
            <p className="text-white/60 mt-1">Your personal AI assistant on Telegram</p>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['signin', 'creating', 'connect', 'done'].map((s, i) => (
            <div
              key={s}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${step === s ? 'w-8 bg-violet-500' : 
                  ['signin', 'creating', 'connect', 'done'].indexOf(step) > i 
                    ? 'bg-violet-500' : 'bg-white/20'}
              `}
            />
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Sign In */}
          {step === 'signin' && (
            <motion.div
              key="signin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <div className="text-center mb-8">
                <span className="text-4xl mb-4 block">👋</span>
                <h2 className="text-2xl font-bold mb-2">Let&apos;s get you started</h2>
                <p className="text-white/60">
                  Sign in to create your account and connect to Ally.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm mb-4">
                  {error}
                </div>
              )}

              {status === 'loading' ? (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-white/60">Checking authentication...</p>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full p-4 rounded-xl bg-white text-gray-900 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              )}

              <p className="text-center text-white/40 text-sm mt-6">
                Takes about 30 seconds to set up
              </p>
            </motion.div>
          )}

          {/* Step 2: Creating workspace */}
          {step === 'creating' && (
            <motion.div
              key="creating"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full" />
                  <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Setting up your account</h2>
                <p className="text-white/60">Just a moment...</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Connect Telegram */}
          {step === 'connect' && workspace && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <div className="text-center mb-6">
                <span className="text-4xl mb-4 block">📱</span>
                <h2 className="text-2xl font-bold mb-2">Connect your Telegram</h2>
                <p className="text-white/60">
                  Click the button below to message @AllyBot and link your account.
                </p>
              </div>

              {/* Link Code Display */}
              <div className="bg-violet-500/10 rounded-xl p-4 mb-6 text-center">
                <p className="text-sm text-violet-300 mb-2">Your unique code</p>
                <p className="text-3xl font-mono font-bold tracking-widest">{workspace.linkCode}</p>
              </div>

              {/* Connect Button */}
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-4 rounded-xl bg-[#0088cc] text-white font-semibold flex items-center justify-center gap-3 hover:bg-[#0077b5] transition-colors mb-4"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Open Telegram and Connect
              </a>

              {/* Manual instructions */}
              <div className="text-center text-white/50 text-sm space-y-1">
                <p>Or manually:</p>
                <p>1. Open Telegram and search for <span className="text-violet-400">@AllyBot</span></p>
                <p>2. Send: <code className="bg-white/10 px-2 py-0.5 rounded">/start {workspace.linkCode}</code></p>
              </div>

              {/* Waiting indicator */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-white/60">
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                <span className="text-sm">Waiting for you to connect...</span>
              </div>
            </motion.div>
          )}

          {/* Step 4: Done! */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                <h2 className="text-2xl font-bold mb-2">You&apos;re all set! 🎉</h2>
                <p className="text-white/60 mb-8">
                  Ally is ready to chat with you on Telegram.
                </p>

                <div className="space-y-3">
                  <a
                    href="https://t.me/AllyBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                  >
                    <span className="text-xl">💬</span>
                    Start chatting with Ally
                  </a>
                  
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full p-4 rounded-xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                  >
                    <span className="text-xl">📊</span>
                    Go to Dashboard
                  </button>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <p className="text-sm text-violet-300">
                    💡 <strong>Pro tip:</strong> Just start messaging Ally naturally. Ask questions, get help with tasks, or just have a conversation!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-white/30 text-sm mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
