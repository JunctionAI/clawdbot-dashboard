import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const checkoutMetadata: Metadata = generateMetadata({
  title: 'Pricing & Plans - Clawdbot AI Assistant',
  description: 'Choose your Clawdbot plan. Start with a 14-day free trial. Plans from $0/month. Unlimited AI messages, persistent memory, and powerful integrations.',
  path: '/checkout',
});

export const familyCheckoutMetadata: Metadata = generateMetadata({
  title: 'Family Plan - Share Clawdbot with 5 Family Members',
  description: 'Get Clawdbot for your whole family. $19/month for up to 5 members. 20,000 shared messages, individual memories, and a family dashboard.',
  path: '/checkout/family',
});

export const successMetadata: Metadata = generateMetadata({
  title: 'Welcome to Clawdbot! - Setup Complete',
  description: 'Your Clawdbot subscription is active. Start using your AI assistant now.',
  path: '/success',
  noIndex: true,
});
