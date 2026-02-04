'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ZapIcon, MessageSquareIcon, LinkIcon } from '@/components/ui/icons';

// Quick action cards for immediate value
const QuickAction = ({
  icon,
  title,
  description,
  href,
  primary,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  primary?: boolean;
  delay: number;
}) => (
  <motion.a
    href={href}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className={`block p-4 sm:p-5 rounded-xl border transition-all duration-300 min-h-[100px] active:scale-[0.98] ${
      primary
        ? 'bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/50 hover:border-purple-400'
        : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
    }`}
  >
    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg mb-2 sm:mb-3 flex items-center justify-center ${
      primary ? 'bg-purple-500/30' : 'bg-gray-700/50'
    }`}>
      {icon}
    </div>
    <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">{title}</h4>
    <p className="text-gray-400 text-xs sm:text-sm">{description}</p>
  </motion.a>
);

// Confetti canvas component
const ConfettiEffect = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      rotation: number;
      rotationSpeed: number;
    }> = [];
    
    const colors = ['#a855f7', '#22c55e', '#3b82f6', '#eab308', '#ec4899'];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    
    let frame = 0;
    const maxFrames = 180; // 3 seconds at 60fps
    
    const animate = () => {
      if (frame >= maxFrames) {
        canvas.remove();
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.rotation += p.rotationSpeed;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      
      frame++;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      const existing = document.getElementById('confetti-canvas');
      if (existing) existing.remove();
    };
  }, []);
  
  return null;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [planName, setPlanName] = useState('Pro');
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // TODO: Fetch session details from Stripe to get plan info
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Copy workspace ID
  const copyWorkspaceId = () => {
    navigator.clipboard.writeText('claw_demo_workspace');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {showConfetti && <ConfettiEffect />}
      
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-green-500/5 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 safe-area-inset">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Badge variant="success" size="lg" className="mb-4">
              🎉 Welcome to Clawdbot {planName}!
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3"
          >
            Your AI assistant is ready
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg max-w-lg mx-auto"
          >
            Your 14-day free trial has started. Let's get you set up in under 2 minutes.
          </motion.p>
        </motion.div>

        {/* Quick Start Actions - Immediate Value */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <QuickAction
            icon={<MessageSquareIcon className="w-5 h-5 text-purple-400" />}
            title="Start chatting now"
            description="Jump right in and say hello to your AI assistant"
            href="/chat"
            primary
            delay={0.6}
          />
          <QuickAction
            icon={<LinkIcon className="w-5 h-5 text-blue-400" />}
            title="Connect Gmail & Calendar"
            description="Let Clawdbot manage your inbox and schedule"
            href="/dashboard?setup=integrations"
            delay={0.7}
          />
          <QuickAction
            icon={
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            title="Add to Telegram or Discord"
            description="Chat with Clawdbot from your favorite app"
            href="/dashboard?setup=channels"
            delay={0.8}
          />
          <QuickAction
            icon={<ZapIcon className="w-5 h-5 text-yellow-400" />}
            title="Explore skills"
            description="Discover what Clawdbot can do for you"
            href="/skills"
            delay={0.9}
          />
        </div>

        {/* Workspace Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-semibold mb-1">Your Workspace</h3>
              <p className="text-gray-400 text-sm">Use this ID to connect additional apps and services</p>
            </div>
            <div className="flex items-center gap-3">
              <code className="px-4 py-2 bg-gray-900 rounded-lg text-purple-400 font-mono text-sm">
                claw_demo_workspace
              </code>
              <button
                onClick={copyWorkspaceId}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* What's included */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/30 mb-10"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ZapIcon className="w-5 h-5 text-purple-400" />
            Your {planName} plan includes
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'Unlimited', label: 'Messages' },
              { value: 'Unlimited', label: 'Skills' },
              { value: '∞', label: 'Memory' },
              { value: '24/7', label: 'Availability' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-gray-900/30 rounded-xl">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center px-2"
        >
          <a href="/dashboard" className="block sm:inline-block">
            <Button size="lg" className="w-full sm:w-auto px-8 min-h-[52px]">
              <ZapIcon className="w-5 h-5" />
              Go to Dashboard
            </Button>
          </a>
          <p className="mt-4 text-gray-500 text-xs sm:text-sm">
            Check your email for a copy of your receipt and getting started guide.
          </p>
        </motion.div>

        {/* Help footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800 text-center"
        >
          <p className="text-gray-400 text-xs sm:text-sm mb-2">Questions? We're here to help.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <a href="mailto:support@clawdbot.ai" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm transition-colors py-1 min-h-[44px] flex items-center">
              Email Support
            </a>
            <span className="text-gray-600 hidden sm:inline">·</span>
            <a href="/docs/quickstart" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm transition-colors py-1 min-h-[44px] flex items-center">
              Quick Start Guide
            </a>
            <span className="text-gray-600 hidden sm:inline">·</span>
            <a href="/dashboard/billing" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm transition-colors py-1 min-h-[44px] flex items-center">
              Manage Subscription
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
