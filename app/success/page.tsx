'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [credentials, setCredentials] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Poll backend for provisioning status
      checkProvisioningStatus(sessionId);
    }
  }, [sessionId]);

  async function checkProvisioningStatus(sessionId: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/status?session=${sessionId}`);
      const data = await response.json();

      if (data.status === 'provisioned') {
        setCredentials(data.credentials);
        setStatus('success');
      } else if (data.status === 'provisioning') {
        // Poll again in 2 seconds
        setTimeout(() => checkProvisioningStatus(sessionId), 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error checking status:', error);
      setTimeout(() => checkProvisioningStatus(sessionId), 2000);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur p-8 rounded-lg border border-gray-700 text-center">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-white mb-2">Setting up your workspace...</h1>
            <p className="text-gray-400">
              We're provisioning your Clawdbot instance. This takes about 30 seconds.
            </p>
          </>
        )}

        {status === 'success' && credentials && (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-2xl font-bold text-white mb-4">Welcome to Clawdbot!</h1>
            <p className="text-gray-400 mb-6">
              Your AI assistant is ready. Check your email for login credentials.
            </p>
            
            <div className="bg-gray-900/50 p-4 rounded-lg mb-6 text-left">
              <div className="text-sm text-gray-500 mb-2">Your Workspace</div>
              <div className="text-white font-mono text-sm break-all">{credentials.workspaceId}</div>
            </div>

            <a 
              href={credentials.accessUrl}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-block transition"
            >
              Go to Dashboard →
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              We couldn't set up your workspace. Please contact support.
            </p>
            <a 
              href="mailto:support@setupclaw.com"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold inline-block transition"
            >
              Contact Support
            </a>
          </>
        )}
      </div>
    </main>
  );
}
