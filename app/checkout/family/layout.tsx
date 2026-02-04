import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';
import { PricingJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = generateMetadata({
  title: 'Family Plan - Share Clawdbot with Your Family',
  description: 'Get Clawdbot for your whole family. $19/month for up to 5 members. 20,000 shared messages, individual memories per member, and a family dashboard.',
  path: '/checkout/family',
});

export default function FamilyCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PricingJsonLd />
      {children}
    </>
  );
}
